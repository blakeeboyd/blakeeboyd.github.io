// YouTube University index: load videos.json, render list, wire filters.

const DEPTH_ORDER = ['foundational', 'applied', 'reflective'];
const DEPTH_LABELS = {
    foundational: 'Foundational',
    applied: 'Applied',
    reflective: 'Reflective',
};

const MAX_SUGGESTIONS = 8;
const CHANNEL_VIEW_LIMIT = 4; // top N videos shown per channel in "By channel" view
                              // when 2+ channels are visible. A single visible
                              // channel (e.g. after "See all" or via channel
                              // filter) shows all of its videos uncapped.

const state = {
    videos: [],
    subdomainOwner: {}, // subdomain → owning domain (from taxonomy)
    tagOrder: [],       // stable display order for tag chips (by global count)
    search: '',
    view: 'list',
    activeTags: [], // ordered array (click order); front of row in render
    activeDepths: new Set(),
    activeDomains: new Set(),
    activeSubdomains: new Set(),
    activeChannels: new Set(),
    sort: 'title',
    suggestionsOpen: false,
    suggestionFocus: -1,
    suggestions: [],
};

const els = {
    list: document.getElementById('yt-list'),
    search: document.getElementById('yt-search'),
    suggestions: document.getElementById('yt-suggestions'),
    viewToggle: document.querySelector('.yt-segmented'),
    tagFilter: document.getElementById('yt-tag-filter'),
    advanced: document.getElementById('yt-advanced'),
    advancedActive: document.getElementById('yt-advanced-active'),
    clearAll: document.getElementById('yt-clear-all'),
    depthChips: document.getElementById('yt-depth-chips'),
    domainChips: document.getElementById('yt-domain-chips'),
    subdomainGroup: document.getElementById('yt-subdomain-group'),
    subdomainChips: document.getElementById('yt-subdomain-chips'),
    channelChips: document.getElementById('yt-channel-chips'),
    sort: document.getElementById('yt-sort'),
    count: document.getElementById('yt-count'),
    coursesSection: document.getElementById('yt-courses-section'),
    coursesGrid: document.getElementById('yt-courses-grid'),
};

async function init() {
    try {
        const res = await fetch('videos.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        state.videos = payload.videos;
        state.subdomainOwner = payload.subdomainOwner || {};
        // Compute the canonical tag display order once: by total video count
        // across the full library, descending, then alphabetical. Frozen for
        // the session so chips don't reorder as the user toggles filters.
        const globalTagCounts = {};
        for (const v of state.videos) for (const t of v.tags) globalTagCounts[t] = (globalTagCounts[t] || 0) + 1;
        state.tagOrder = Object.keys(globalTagCounts).sort(
            (a, b) => globalTagCounts[b] - globalTagCounts[a] || a.localeCompare(b),
        );
    } catch (err) {
        els.list.innerHTML = `<p class="yt-empty">Couldn't load video index: ${err.message}</p>`;
        return;
    }

    applyHashToState();
    wireEvents();
    syncControlsToState();
    render();
    // Courses are temporarily hidden. Uncomment to re-enable.
    // loadCourses();
    // If the user landed here with filter state in the URL hash (e.g. clicked
    // a tag or domain on a video page, or followed a shared link), jump to the
    // search controls so the active filters are immediately visible. A fresh
    // visit with no hash starts at the hero.
    if (window.location.hash) {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        requestAnimationFrame(() => {
            const target = document.querySelector('.yt-controls');
            if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
    }
    window.addEventListener('hashchange', () => {
        applyHashToState();
        syncControlsToState();
        render();
    });
}

async function loadCourses() {
    try {
        const res = await fetch('courses.json');
        if (!res.ok) return; // No courses file: silently skip
        const courses = await res.json();
        if (!Array.isArray(courses) || courses.length === 0) return;
        renderCoursesGrid(courses);
        els.coursesSection.hidden = false;
    } catch {
        // No courses; leave the section hidden
    }
}

function renderCoursesGrid(courses) {
    els.coursesGrid.innerHTML = courses
        .map((c) => {
            const status = c.status && c.status !== 'active'
                ? `<span class="yt-course-card-status">${escapeHtml(c.status)}</span>`
                : '';
            const meta = [
                c.durationMinutes ? `${c.durationMinutes} min` : null,
                c.videoCount ? `${c.videoCount} video${c.videoCount === 1 ? '' : 's'}` : null,
                c.track || null,
            ]
                .filter(Boolean)
                .map((m) => `<span>${escapeHtml(m)}</span>`)
                .join('<span class="yt-sep" aria-hidden="true">·</span>');
            return `
                <a class="yt-course-card" href="courses/${c.slug}.html">
                    <div class="yt-course-card-head">
                        ${c.courseNumber ? `<span class="yt-course-card-num">${escapeHtml(c.courseNumber)}</span>` : ''}
                        <h3 class="yt-course-card-title">${escapeHtml(c.title)}</h3>
                        ${status}
                    </div>
                    <p class="yt-course-card-desc">${escapeHtml(c.description || '')}</p>
                    <p class="yt-course-card-meta">${meta}</p>
                </a>`;
        })
        .join('');
}

function applyHashToState() {
    const hash = window.location.hash.replace(/^#/, '');
    state.activeTags = [];
    state.activeDepths = new Set();
    state.activeDomains = new Set();
    state.activeSubdomains = new Set();
    state.activeChannels = new Set();
    state.search = '';
    state.view = 'list';
    state.sort = 'title';
    if (!hash) return;
    const params = new URLSearchParams(hash);
    // Keep click order: URL preserves the order, params.getAll() honors it
    state.activeTags = params.getAll('tag');
    state.activeDepths = new Set(params.getAll('depth'));
    state.activeDomains = new Set(params.getAll('domain'));
    state.activeSubdomains = new Set(params.getAll('sub'));
    state.activeChannels = new Set(params.getAll('channel'));
    state.search = params.get('q') || '';
    const view = params.get('view');
    state.view = view === 'channel' ? 'channel' : 'list';
    const sort = params.get('sort');
    if (['title', 'depth', 'channel', 'year'].includes(sort)) state.sort = sort;
}

function writeStateToHash() {
    const params = new URLSearchParams();
    for (const tag of state.activeTags) params.append('tag', tag);
    for (const d of state.activeDepths) params.append('depth', d);
    for (const d of state.activeDomains) params.append('domain', d);
    for (const s of state.activeSubdomains) params.append('sub', s);
    for (const c of state.activeChannels) params.append('channel', c);
    if (state.search) params.set('q', state.search);
    if (state.view !== 'list') params.set('view', state.view);
    if (state.sort && state.sort !== 'title') params.set('sort', state.sort);
    const hash = params.toString();
    const next = hash ? `#${hash}` : '';
    if (next !== window.location.hash) {
        history.replaceState(null, '', next || window.location.pathname);
    }
}

function syncControlsToState() {
    if (els.search.value !== state.search) els.search.value = state.search;
    if (els.sort && els.sort.value !== state.sort) els.sort.value = state.sort;
    for (const btn of els.viewToggle.querySelectorAll('.yt-seg-btn')) {
        btn.setAttribute('aria-pressed', btn.dataset.view === state.view ? 'true' : 'false');
    }
    // Open the Advanced panel if any advanced filters are active
    const advActive =
        state.activeDepths.size +
        state.activeDomains.size +
        state.activeSubdomains.size +
        state.activeChannels.size;
    if (advActive > 0 && !els.advanced.open) els.advanced.open = true;
    // "Clear all" appears when *anything* is active (tags + search count too,
    // not just advanced) — otherwise there's nothing to clear.
    const anyActive = advActive + state.activeTags.length + (state.search ? 1 : 0);
    els.clearAll.hidden = anyActive === 0;
}

function clearAllFilters() {
    state.activeTags = [];
    state.activeDepths = new Set();
    state.activeDomains = new Set();
    state.activeSubdomains = new Set();
    state.activeChannels = new Set();
    state.search = '';
    els.search.value = '';
    closeSuggestions();
    writeStateToHash();
    syncControlsToState();
    render();
}

function renderAdvancedChips() {
    // Each chip row counts videos that match every filter EXCEPT the row's own.
    // That way each count answers: "how many videos would match if I selected
    // this value (and only this value) along this dimension?"

    // Depth: apply all filters except depth
    const baseDepth = state.videos.filter((v) => matchesAllExcept(v, 'depth'));
    const depthCounts = {};
    for (const v of baseDepth) depthCounts[v.depth] = (depthCounts[v.depth] || 0) + 1;
    for (const d of state.activeDepths) if (!(d in depthCounts)) depthCounts[d] = 0;
    els.depthChips.innerHTML = DEPTH_ORDER
        .filter((d) => d in depthCounts || state.activeDepths.has(d))
        .map((d) => chipHtml('depth', d, DEPTH_LABELS[d], depthCounts[d] || 0, state.activeDepths.has(d)))
        .join('');

    // Domain: apply all filters except domain (and subdomain, since sub depends on domain)
    const baseDomain = state.videos.filter((v) => matchesAllExcept(v, 'domain', 'sub'));
    const domainCounts = {};
    for (const v of baseDomain) for (const d of v.domains) domainCounts[d] = (domainCounts[d] || 0) + 1;
    for (const d of state.activeDomains) if (!(d in domainCounts)) domainCounts[d] = 0;
    const domains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    els.domainChips.innerHTML = domains
        .map(([d, c]) => chipHtml('domain', d, d, c, state.activeDomains.has(d)))
        .join('');

    // Subdomain: apply all filters except subdomain. Only show subdomains
    // owned by an active domain (per taxonomy).
    if (state.activeDomains.size === 0) {
        els.subdomainGroup.hidden = true;
        state.activeSubdomains = new Set();
    } else {
        els.subdomainGroup.hidden = false;
        const baseSub = state.videos.filter((v) => matchesAllExcept(v, 'sub'));
        const subCounts = {};
        for (const v of baseSub) {
            for (const s of v.subdomains) {
                const owner = state.subdomainOwner[s];
                if (!owner || !state.activeDomains.has(owner)) continue;
                subCounts[s] = (subCounts[s] || 0) + 1;
            }
        }
        for (const s of state.activeSubdomains) if (!(s in subCounts)) subCounts[s] = 0;
        const subs = Object.entries(subCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        if (subs.length === 0) {
            els.subdomainChips.innerHTML = '<p class="yt-empty-inline">No subdomains for the selected domain(s).</p>';
        } else {
            els.subdomainChips.innerHTML = subs
                .map(([s, c]) => chipHtml('sub', s, s, c, state.activeSubdomains.has(s)))
                .join('');
        }
    }

    // Channel: apply all filters except channel
    const baseChannel = state.videos.filter((v) => matchesAllExcept(v, 'channel'));
    const channelCounts = {};
    for (const v of baseChannel) channelCounts[v.channel] = (channelCounts[v.channel] || 0) + 1;
    for (const c of state.activeChannels) if (!(c in channelCounts)) channelCounts[c] = 0;
    const channels = Object.entries(channelCounts).sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
    els.channelChips.innerHTML = channels
        .map(([c, n]) => chipHtml('channel', c, c, n, state.activeChannels.has(c)))
        .join('');

    const total =
        state.activeDepths.size +
        state.activeDomains.size +
        state.activeSubdomains.size +
        state.activeChannels.size;
    els.advancedActive.textContent = total > 0 ? `${total} active` : '';
}

function chipHtml(kind, value, label, count, pressed) {
    return `<button type="button" class="yt-tag-chip" data-kind="${kind}" data-value="${escapeAttr(value)}" aria-pressed="${pressed ? 'true' : 'false'}">${escapeHtml(label)} <span class="yt-tag-count">${count}</span></button>`;
}

function renderTagFilter() {
    // Tag chips show only tags that co-occur with the current selection.
    // Layout: selected tags first, in the order the user clicked them.
    // Then unselected tags in the frozen global-count order. Each chip's
    // count = how many videos remain if you add this tag to the selection.
    const base = state.videos.filter((v) => matchesAllExcept(v));
    const counts = {};
    for (const v of base) for (const t of v.tags) counts[t] = (counts[t] || 0) + 1;
    const activeSet = new Set(state.activeTags);
    const display = [
        ...state.activeTags, // click order, always rendered (can be deselected)
        ...state.tagOrder.filter((tag) => !activeSet.has(tag) && tag in counts),
    ];
    els.tagFilter.innerHTML = display
        .map((tag) => {
            const count = counts[tag] || 0;
            const pressed = activeSet.has(tag);
            return `<button type="button" class="yt-tag-chip" data-kind="tag" data-value="${escapeAttr(tag)}" aria-pressed="${pressed ? 'true' : 'false'}">${escapeHtml(tag)} <span class="yt-tag-count">${count}</span></button>`;
        })
        .join('');
}

function toggle(set, value) {
    if (set.has(value)) set.delete(value);
    else set.add(value);
}

// Tag toggle preserves click order: newly added tags go to the end of the array.
function toggleTag(value) {
    const idx = state.activeTags.indexOf(value);
    if (idx === -1) state.activeTags.push(value);
    else state.activeTags.splice(idx, 1);
}

function wireEvents() {
    els.search.addEventListener('input', (e) => {
        state.search = e.target.value.trim();
        writeStateToHash();
        updateSuggestions(e.target.value);
        render();
    });
    els.search.addEventListener('focus', () => {
        if (state.search) updateSuggestions(state.search);
    });
    els.search.addEventListener('keydown', onSearchKeydown);
    document.addEventListener('click', (e) => {
        if (!els.search.contains(e.target) && !els.suggestions.contains(e.target)) {
            closeSuggestions();
        }
    });

    els.suggestions.addEventListener('click', (e) => {
        const item = e.target.closest('.yt-suggestion');
        if (!item) return;
        applySuggestion(state.suggestions[Number(item.dataset.index)]);
    });

    els.viewToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.yt-seg-btn');
        if (!btn || state.view === btn.dataset.view) return;
        state.view = btn.dataset.view;
        writeStateToHash();
        syncControlsToState();
        render();
    });

    if (els.sort) {
        els.sort.addEventListener('change', (e) => {
            state.sort = e.target.value;
            writeStateToHash();
            render();
        });
    }

    // "Clear all" sits inside the <summary> of the advanced disclosure.
    // We have to stop the click from bubbling so it doesn't toggle the disclosure.
    els.clearAll.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearAllFilters();
    });

    // All chip rows delegate clicks here
    const chipContainers = [
        els.tagFilter,
        els.depthChips,
        els.domainChips,
        els.subdomainChips,
        els.channelChips,
    ];
    for (const container of chipContainers) {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.yt-tag-chip');
            if (!btn) return;
            const kind = btn.dataset.kind;
            const value = btn.dataset.value;
            if (kind === 'tag') {
                toggleTag(value);
            } else {
                const set = {
                    depth: state.activeDepths,
                    domain: state.activeDomains,
                    sub: state.activeSubdomains,
                    channel: state.activeChannels,
                }[kind];
                if (!set) return;
                toggle(set, value);
                if (kind === 'domain' && !set.has(value)) pruneOrphanedSubdomains();
            }
            writeStateToHash();
            render();
        });
    }

    els.list.addEventListener('click', (e) => {
        const tagEl = e.target.closest('.yt-card-tag');
        if (tagEl) {
            e.preventDefault();
            e.stopPropagation();
            toggleTag(tagEl.dataset.tag);
            writeStateToHash();
            render();
            els.tagFilter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }
        const channelLink = e.target.closest('.yt-channel-filter-link');
        if (channelLink) {
            e.preventDefault();
            const channel = channelLink.dataset.channel;
            state.activeChannels = new Set([channel]);
            // Stay in by-channel view; with one channel active and the
            // single-channel rule in renderGroupedByChannel, the section expands.
            state.view = 'channel';
            writeStateToHash();
            syncControlsToState();
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

function pruneOrphanedSubdomains() {
    // Keep only subdomains whose owning domain (per taxonomy) is still active.
    // Use taxonomy ownership, not video-level co-occurrence, so deselecting a
    // domain always removes its subdomains — even when those subdomains
    // happen to appear on cross-domain videos that share another active domain.
    if (state.activeDomains.size === 0) {
        state.activeSubdomains = new Set();
        return;
    }
    state.activeSubdomains = new Set(
        [...state.activeSubdomains].filter((s) => {
            const owner = state.subdomainOwner[s];
            return owner && state.activeDomains.has(owner);
        }),
    );
}

// --- Search suggestions -----------------------------------------------------

function updateSuggestions(raw) {
    const q = raw.trim().toLowerCase();
    if (!q || q.length < 2) {
        state.suggestions = [];
        closeSuggestions();
        return;
    }

    const seen = new Set();
    const out = [];
    const push = (type, label, action) => {
        const key = type + '|' + label.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ type, label, action });
    };

    // Match titles
    for (const v of state.videos) {
        if (out.length >= MAX_SUGGESTIONS) break;
        if (v.title.toLowerCase().includes(q)) push('Video', v.title, { kind: 'open', citekey: v.citekey });
    }
    // Match concepts
    for (const v of state.videos) {
        for (const c of v.concepts) {
            if (out.length >= MAX_SUGGESTIONS) break;
            if (c.toLowerCase().includes(q)) push('Concept', c, { kind: 'search', value: c });
        }
        if (out.length >= MAX_SUGGESTIONS) break;
    }
    // Match channels
    const channels = new Set(state.videos.map((v) => v.channel));
    for (const c of channels) {
        if (out.length >= MAX_SUGGESTIONS) break;
        if (c.toLowerCase().includes(q)) push('Channel', c, { kind: 'search', value: c });
    }
    // Match tags
    const tags = new Set();
    for (const v of state.videos) for (const t of v.tags) tags.add(t);
    for (const t of tags) {
        if (out.length >= MAX_SUGGESTIONS) break;
        if (t.toLowerCase().includes(q)) push('Tag', t, { kind: 'tag', value: t });
    }

    state.suggestions = out;
    state.suggestionFocus = -1;
    if (out.length === 0) {
        closeSuggestions();
        return;
    }
    state.suggestionsOpen = true;
    els.suggestions.hidden = false;
    els.search.setAttribute('aria-expanded', 'true');
    els.suggestions.innerHTML = out
        .map(
            (s, i) =>
                `<li class="yt-suggestion" data-index="${i}" role="option" id="yt-sg-${i}"><span class="yt-suggestion-type">${escapeHtml(s.type)}</span><span class="yt-suggestion-label">${highlight(s.label, q)}</span></li>`,
        )
        .join('');
}

function closeSuggestions() {
    state.suggestionsOpen = false;
    state.suggestionFocus = -1;
    els.suggestions.hidden = true;
    els.search.setAttribute('aria-expanded', 'false');
}

function applySuggestion(s) {
    if (!s) return;
    closeSuggestions();
    if (s.action.kind === 'open') {
        window.location.href = `videos/${s.action.citekey}.html`;
        return;
    }
    if (s.action.kind === 'tag') {
        if (!state.activeTags.includes(s.action.value)) state.activeTags.push(s.action.value);
        state.search = '';
        els.search.value = '';
    } else if (s.action.kind === 'search') {
        state.search = s.action.value;
        els.search.value = s.action.value;
    }
    writeStateToHash();
    render();
}

function onSearchKeydown(e) {
    if (!state.suggestionsOpen) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.suggestionFocus = (state.suggestionFocus + 1) % state.suggestions.length;
        highlightSuggestion();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.suggestionFocus =
            state.suggestionFocus <= 0 ? state.suggestions.length - 1 : state.suggestionFocus - 1;
        highlightSuggestion();
    } else if (e.key === 'Enter' && state.suggestionFocus >= 0) {
        e.preventDefault();
        applySuggestion(state.suggestions[state.suggestionFocus]);
    } else if (e.key === 'Escape') {
        closeSuggestions();
    }
}

function highlightSuggestion() {
    for (const item of els.suggestions.querySelectorAll('.yt-suggestion')) {
        item.classList.toggle('is-focus', Number(item.dataset.index) === state.suggestionFocus);
    }
}

// --- Matching ---------------------------------------------------------------

// Single source of truth: check a video against the filter dimensions,
// optionally skipping one or more (used to build per-row chip counts).
function matchesAllExcept(video, ...skip) {
    const skipSet = new Set(skip);
    if (!skipSet.has('depth') && state.activeDepths.size > 0 && !state.activeDepths.has(video.depth))
        return false;
    if (
        !skipSet.has('domain') &&
        state.activeDomains.size > 0 &&
        !video.domains.some((d) => state.activeDomains.has(d))
    )
        return false;
    if (
        !skipSet.has('sub') &&
        state.activeSubdomains.size > 0 &&
        !video.subdomains.some((s) => state.activeSubdomains.has(s))
    )
        return false;
    if (
        !skipSet.has('channel') &&
        state.activeChannels.size > 0 &&
        !state.activeChannels.has(video.channel)
    )
        return false;
    if (!skipSet.has('tag') && state.activeTags.length > 0) {
        // AND semantics: video must carry every active tag. Combined with the
        // tag-row pruning in renderTagFilter (only co-occurring tags shown),
        // this gives natural narrowing — every visible chip is guaranteed to
        // narrow further, never widen.
        if (!state.activeTags.every((t) => video.tags.includes(t))) return false;
    }
    if (!skipSet.has('search') && state.search) {
        const hay = (
            video.title +
            ' ' +
            video.channel +
            ' ' +
            video.tags.join(' ') +
            ' ' +
            video.concepts.join(' ') +
            ' ' +
            video.domains.join(' ') +
            ' ' +
            video.subdomains.join(' ')
        ).toLowerCase();
        if (!hay.includes(state.search.toLowerCase())) return false;
    }
    return true;
}

function render() {
    renderTagFilter();
    renderAdvancedChips();

    const visible = sortVideos(state.videos.filter((v) => matchesAllExcept(v)));
    els.count.textContent = `${visible.length} of ${state.videos.length} video${state.videos.length === 1 ? '' : 's'}`;

    if (visible.length === 0) {
        els.list.classList.remove('yt-list-grouped');
        els.list.innerHTML = '<p class="yt-empty">No videos match your filters.</p>';
        return;
    }

    if (state.view === 'channel') {
        els.list.classList.add('yt-list-grouped');
        els.list.innerHTML = renderGroupedByChannel(visible);
    } else {
        els.list.classList.remove('yt-list-grouped');
        els.list.innerHTML = visible.map(cardHtml).join('');
    }
}

// Sort the (already filtered) video list by the current state.sort key.
// Channel view does its own grouping; within each channel the videos are
// sorted by the same key so the choice is consistent across views.
function sortVideos(videos) {
    const list = [...videos];
    const byTitle = (a, b) => a.title.localeCompare(b.title);
    switch (state.sort) {
        case 'depth':
            return list.sort(
                (a, b) =>
                    (DEPTH_RANK[a.depth] ?? 99) - (DEPTH_RANK[b.depth] ?? 99) || byTitle(a, b),
            );
        case 'channel':
            return list.sort(
                (a, b) => a.channel.localeCompare(b.channel) || byTitle(a, b),
            );
        case 'year': {
            const yearOf = (v) => {
                const m = String(v.citekey).match(/(\d{4})[a-z]?$/);
                return m ? parseInt(m[1], 10) : 0;
            };
            return list.sort((a, b) => yearOf(b) - yearOf(a) || byTitle(a, b));
        }
        case 'title':
        default:
            return list.sort(byTitle);
    }
}

const DEPTH_RANK = { foundational: 0, applied: 1, reflective: 2 };

function renderGroupedByChannel(videos) {
    const groups = new Map();
    for (const v of videos) {
        if (!groups.has(v.channel)) groups.set(v.channel, []);
        groups.get(v.channel).push(v);
    }
    const channels = [...groups.keys()].sort((a, b) => a.localeCompare(b));
    // When only one channel is visible (e.g. after "See all" or a channel filter),
    // show all of its videos uncapped. The per-channel cap is for browsing multiple
    // channels in parallel, not for drilling into one.
    const isSingleChannelView = channels.length === 1;
    return channels
        .map((channel) => {
            const all = groups.get(channel);
            // Pedagogical pick order: Foundational → Applied → Reflective, then title.
            const sorted = [...all].sort((a, b) => {
                const dr = (DEPTH_RANK[a.depth] ?? 99) - (DEPTH_RANK[b.depth] ?? 99);
                if (dr !== 0) return dr;
                return a.title.localeCompare(b.title);
            });
            const shown = isSingleChannelView ? sorted : sorted.slice(0, CHANNEL_VIEW_LIMIT);
            const remaining = all.length - shown.length;
            const cards = shown.map(cardHtml).join('');
            // "See all" sets the channel filter (which prunes the result to this
            // channel); we keep view='channel' so the user stays in the by-channel
            // layout but now sees the section expanded.
            const seeAll =
                remaining > 0
                    ? `<a href="#channel=${encodeURIComponent(channel)}&view=channel" class="yt-channel-filter-link yt-channel-see-all" data-channel="${escapeAttr(channel)}">See all ${all.length} videos →</a>`
                    : '';
            return `
                <section class="yt-channel-group">
                    <header class="yt-channel-header">
                        <a href="#channel=${encodeURIComponent(channel)}&view=channel" class="yt-channel-filter-link yt-channel-name-link" data-channel="${escapeAttr(channel)}">
                            <span class="yt-channel-name">${escapeHtml(channel)}</span>
                        </a>
                        <span class="yt-channel-count">${all.length} video${all.length === 1 ? '' : 's'}</span>
                    </header>
                    <div class="yt-channel-cards">${cards}</div>
                    ${seeAll}
                </section>
            `;
        })
        .join('');
}

function cardHtml(v) {
    const activeSet = new Set(state.activeTags);
    const tagsHtml = v.tags
        .map(
            (t) =>
                `<button type="button" class="yt-tag yt-card-tag${activeSet.has(t) ? ' is-active' : ''}" data-tag="${escapeAttr(t)}" aria-pressed="${activeSet.has(t) ? 'true' : 'false'}">${escapeHtml(t)}</button>`,
        )
        .join('');
    const depthLabel = DEPTH_LABELS[v.depth] || v.depth;
    return `
        <a class="yt-card" href="videos/${v.citekey}.html">
            <div class="yt-card-thumb">
                <img src="https://i.ytimg.com/vi/${v.ytId}/mqdefault.jpg" alt="" loading="lazy">
                <span class="yt-card-duration">${escapeHtml(v.duration)}</span>
            </div>
            <div class="yt-card-body">
                <h3 class="yt-card-title">${escapeHtml(v.title)}</h3>
                <p class="yt-card-channel">${escapeHtml(v.channel)}</p>
                <div class="yt-card-meta">
                    <span class="yt-depth yt-depth-${v.depth}">${escapeHtml(depthLabel)}</span>
                    <span class="yt-card-tags">${tagsHtml}</span>
                </div>
            </div>
        </a>
    `;
}

function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return escaped.replace(re, '<mark>$1</mark>');
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(s) {
    return escapeHtml(s);
}

init();
