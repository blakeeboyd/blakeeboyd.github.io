#!/usr/bin/env node
// Build YouTube University pages from Obsidian video-breakdown Markdown files.
// Reads ../source/*.md, writes ../videos.json and ../videos/<citekey>.html

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'source');
const COURSES_DIR = path.join(ROOT, 'courses-source');
const OUT_VIDEOS_DIR = path.join(ROOT, 'videos');
const OUT_COURSES_DIR = path.join(ROOT, 'courses');
const OUT_JSON = path.join(ROOT, 'videos.json');
const TEMPLATE_PATH = path.join(__dirname, 'video-template.html');
const COURSE_TEMPLATE_PATH = path.join(__dirname, 'course-template.html');

const DEPTH_LABELS = {
  foundational: 'Foundational',
  applied: 'Applied',
  reflective: 'Reflective',
};

// Authoritative domain→subdomain taxonomy, mirroring source/0-readme.md.
// Used by the client to prune subdomain selections when a domain is deselected.
// Each subdomain belongs to exactly ONE domain; cross-domain videos may list
// the subdomain in their frontmatter but it remains owned by its source domain.
const DOMAIN_SUBDOMAINS = {
  'Live Sound': [
    'FOH Mixing',
    'Monitor Engineering',
    'System Tuning',
    'System Design',
    'Sound Reinforcement',
    'Festival Production',
    'Soundcheck',
  ],
  'Studio Production': ['Recording', 'Mixing', 'Mastering'],
  Broadcast: ['Sports Broadcast', 'News Broadcast', 'Live Broadcast'],
  'Theater Sound': ['Musical Theater', 'Immersive Theater'],
  'Sound Design': ['Game Audio', 'Film Audio', 'Immersive Audio'],
  'Audio Theory': [
    'Acoustics',
    'Psychoacoustics',
    'Signal Processing',
    'Electroacoustics',
    'Fundamentals',
    'Filter Theory',
  ],
  'Professional Practice': ['Career Development', 'Communication', 'Pedagogy', 'Workflow'],
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Missing frontmatter');
  const fmLines = match[1].split('\n');
  const body = match[2];
  const fm = {};

  // State machine handles three shapes:
  //   key: value                          → scalar (string/bool/inline list)
  //   key:                                → followed by indented block list
  //     - item                            → list of strings
  //   key:                                → followed by list-of-objects
  //     - field: value                    → first item; same indent starts a new item
  //       field: value                    → continuation of current item
  let pendingListKey = null;        // current "block list" key
  let currentObject = null;          // current list-of-objects item (object reference)
  let objectMode = false;            // true if pendingListKey holds list-of-objects

  const unquote = (s) => s.replace(/^["']|["']$/g, '');
  const coerce = (v) => {
    if (v === 'true') return true;
    if (v === 'false') return false;
    return unquote(v);
  };

  for (const line of fmLines) {
    if (line.trim() === '') continue;

    // List item under a pending list key
    const listItem = line.match(/^(\s+)-\s+(.*)$/);
    if (listItem && pendingListKey) {
      const rest = listItem[2];
      const kv = rest.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
      if (kv) {
        // First field of a new object item
        objectMode = true;
        currentObject = { [kv[1]]: coerce(kv[2].trim()) };
        fm[pendingListKey].push(currentObject);
      } else {
        // Plain string item
        objectMode = false;
        currentObject = null;
        const item = unquote(rest.trim());
        if (item) fm[pendingListKey].push(item);
      }
      continue;
    }

    // Continuation field of the current object (indented, no leading dash)
    if (objectMode && currentObject) {
      const kv = line.match(/^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
      if (kv) {
        currentObject[kv[1]] = coerce(kv[2].trim());
        continue;
      }
    }

    // Top-level key
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) continue;
    pendingListKey = null;
    currentObject = null;
    objectMode = false;
    const key = m[1];
    let value = m[2].trim();
    if (value === '') {
      fm[key] = [];
      pendingListKey = key;
      continue;
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => unquote(s.trim()))
        .filter(Boolean);
    } else {
      value = coerce(value);
    }
    fm[key] = value;
  }
  return { fm, body };
}

function extractYouTubeId(url) {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  if (!m) throw new Error(`Cannot parse YouTube ID from URL: ${url}`);
  return m[1];
}

// Body sections we know how to handle. Anything else is silently dropped
// (with a build warning, so you can decide to remove from source or wire up).
const KNOWN_BODY_SECTIONS = new Set(['takeaway', 'questions', 'answers']);

function splitBody(body, citekey) {
  const lines = body.split('\n');

  // Collect every "## Heading" with its line index, in document order.
  const headings = [];
  lines.forEach((line, idx) => {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) headings.push({ name: m[1].toLowerCase(), idx });
  });

  const findIdx = (name) => headings.find((h) => h.name === name)?.idx;
  const takeawayIdx = findIdx('takeaway');
  const questionsIdx = findIdx('questions');
  const answersIdx = findIdx('answers');

  if (takeawayIdx == null) throw new Error('Missing ## Takeaway section');
  if (questionsIdx == null) throw new Error('Missing ## Questions section');

  // Warn about any unknown body sections — they won't be rendered.
  for (const h of headings) {
    if (!KNOWN_BODY_SECTIONS.has(h.name)) {
      console.warn(
        `! ${citekey || '(unknown)'}: unrecognized body section "## ${h.name}" — content ignored. Move data to frontmatter (prerequisites/learning_outcomes/watch_for) or delete the section.`,
      );
    }
  }

  // Takeaway runs from "## Takeaway" until the *next* heading of any kind,
  // not just until "## Questions". This way intervening sections like
  // "## Before you watch" don't get mashed into the takeaway prose.
  const headingsAfterTakeaway = headings.filter((h) => h.idx > takeawayIdx);
  const takeawayEnd = headingsAfterTakeaway.length ? headingsAfterTakeaway[0].idx : lines.length;
  const takeawayLines = lines.slice(takeawayIdx + 1, takeawayEnd);

  // Questions runs from "## Questions" to "## Answers" (or end of body).
  const questionsEnd = answersIdx != null ? answersIdx : lines.length;
  const questionsLines = lines.slice(questionsIdx + 1, questionsEnd);

  // Answers: parse the same way as questions. The Answers section runs from
  // its heading to the next "##" heading (or end of body).
  const headingsAfterAnswers = answersIdx != null
    ? headings.filter((h) => h.idx > answersIdx)
    : [];
  const answersEnd = headingsAfterAnswers.length
    ? headingsAfterAnswers[0].idx
    : lines.length;
  const answersLines = answersIdx != null
    ? lines.slice(answersIdx + 1, answersEnd)
    : [];

  const takeaway = takeawayLines.join('\n').trim();

  // Questions: each starts with "1. " possibly preceded by "*(Bloom)* " prefix
  const questions = [];
  let current = null;
  for (const line of questionsLines) {
    const m = line.match(/^(\d+)\.\s+(.*)$/);
    if (m) {
      if (current) questions.push(current);
      const rest = m[2];
      const bloomMatch = rest.match(/^\*\(([^)]+)\)\*\s*(.*)$/);
      if (bloomMatch) {
        current = { num: parseInt(m[1], 10), bloom: bloomMatch[1].trim(), text: bloomMatch[2].trim() };
      } else {
        current = { num: parseInt(m[1], 10), bloom: null, text: rest.trim() };
      }
    } else if (current && line.trim() !== '') {
      current.text += ' ' + line.trim();
    }
  }
  if (current) questions.push(current);

  // Answers: same shape, plain numbered prose.
  const answersByNum = new Map();
  let curAnsNum = null;
  let curAnsBuf = [];
  const flushAnswer = () => {
    if (curAnsNum != null) {
      answersByNum.set(curAnsNum, curAnsBuf.join('\n').trim());
    }
  };
  for (const line of answersLines) {
    const m = line.match(/^(\d+)\.\s+(.*)$/);
    if (m) {
      flushAnswer();
      curAnsNum = parseInt(m[1], 10);
      curAnsBuf = [m[2]];
    } else if (curAnsNum != null) {
      curAnsBuf.push(line);
    }
  }
  flushAnswer();

  // Attach each answer to its question by number.
  for (const q of questions) {
    if (answersByNum.has(q.num)) q.answer = answersByNum.get(q.num);
  }

  return { takeaway, questions };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(text, citekeyMap) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold first (consumes the ** delimiters so they can't confuse italic)
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  // Italic: single * pair, no remaining ** in the string
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  // Linkify any exact-match Better-BibTeX citekey to that video's page.
  // The citekey shape is camelCase ending in a 4-digit year, e.g. "danworrallEQDoesntCause2024".
  // We only swap exact matches against the known library so prose like "since2001" can't trigger.
  if (citekeyMap && citekeyMap.size > 0) {
    html = html.replace(/\b[a-z][a-zA-Z]*\d{4}\b/g, (match) => {
      const v = citekeyMap.get(match);
      if (!v) return match;
      return `<a class="yt-citekey-link" href="${match}.html">${escapeHtml(v.title)}</a>`;
    });
  }
  return html;
}

function arr(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

// Accept any of:
//   "danworrallEQDoesntCause2024"         (bare)
//   "[[danworrallEQDoesntCause2024]]"     (Obsidian wiki-link)
//   "[[danworrallEQDoesntCause2024|EQ]]"  (Obsidian alias form)
//   "[Title](danworrallEQDoesntCause2024.md)"   (markdown link)
// Returns the bare citekey, or '' if nothing recognizable found.
function normalizeCitekeyRef(s) {
  if (typeof s !== 'string') return '';
  const wiki = s.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  if (wiki) return wiki[1].trim().replace(/\.md$/, '');
  const md = s.match(/\]\(([^)]+)\)/);
  if (md) return md[1].trim().replace(/\.md$/, '').replace(/#.*$/, '');
  return s.trim();
}

function parseFile(filename) {
  const raw = fs.readFileSync(path.join(SRC_DIR, filename), 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const required = ['citekey', 'channel', 'title', 'duration', 'url', 'tags', 'depth'];
  for (const key of required) {
    if (!(key in fm)) throw new Error(`${filename}: missing frontmatter field "${key}"`);
  }
  const { takeaway, questions } = splitBody(body, fm.citekey);
  const ytId = extractYouTubeId(fm.url);

  return {
    citekey: fm.citekey,
    channel: fm.channel,
    title: fm.title,
    duration: fm.duration,
    url: fm.url,
    ytId,
    domains: arr(fm.domains),
    subdomains: arr(fm.subdomains),
    tags: arr(fm.tags),
    concepts: arr(fm.concepts),
    depth: fm.depth,
    courses: arr(fm.courses),
    pipelineCandidate: fm.pipeline_candidate === true,
    prerequisites: arr(fm.prerequisites),
    learningOutcomes: arr(fm.learning_outcomes),
    watchFor: arr(fm.watch_for),
    related: arr(fm.related).map(normalizeCitekeyRef).filter(Boolean),
    takeaway,
    questions,
  };
}

function relatedFor(video, all) {
  // Manual override: if the video lists `related:` in frontmatter, honor it
  // verbatim. Warn (but don't fail) on unknown citekeys.
  if (video.related && video.related.length > 0) {
    const byKey = new Map(all.map((v) => [v.citekey, v]));
    const out = [];
    for (const key of video.related) {
      const found = byKey.get(key);
      if (found) out.push(found);
      else console.warn(`! ${video.citekey}: related video "${key}" not found in library`);
    }
    if (out.length > 0) return out.slice(0, 3);
  }

  // Otherwise: score by similarity.
  // Shared tags (×10), subdomains (×5), domains (×3), concepts (×1), same depth (×1)
  const others = all.filter((v) => v.citekey !== video.citekey);
  const tagSet = new Set(video.tags);
  const subdomainSet = new Set(video.subdomains);
  const domainSet = new Set(video.domains);
  const conceptSet = new Set(video.concepts.map((c) => c.toLowerCase()));

  const scored = others.map((v) => {
    const tagOverlap = v.tags.filter((t) => tagSet.has(t)).length;
    const subOverlap = v.subdomains.filter((s) => subdomainSet.has(s)).length;
    const domOverlap = v.domains.filter((d) => domainSet.has(d)).length;
    const conceptOverlap = v.concepts.filter((c) => conceptSet.has(c.toLowerCase())).length;
    const depthMatch = v.depth === video.depth ? 1 : 0;
    const score =
      tagOverlap * 10 + subOverlap * 5 + domOverlap * 3 + conceptOverlap + depthMatch;
    return { v, score };
  });
  scored.sort((a, b) => b.score - a.score || a.v.title.localeCompare(b.v.title));
  return scored
    .filter((s) => s.score > 0)
    .slice(0, 3)
    .map((s) => s.v);
}

function renderVideoPage(video, related, citekeyMap) {
  const tpl = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const tagsHtml = video.tags
    .map(
      (t) =>
        `<a class="yt-tag yt-tag-link" href="../#tag=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`,
    )
    .join('');

  const domainTrail = video.domains.length
    ? video.domains
        .map((d) => {
          const sub = video.subdomains.length ? ` / ${escapeHtml(video.subdomains.join(', '))}` : '';
          return `<a class="yt-domain-link" href="../#domain=${encodeURIComponent(d)}">${escapeHtml(d)}</a>${sub}`;
        })
        .join(' · ')
    : '';

  const questionsHtml = video.questions
    .map((q, i) => {
      const bloom = q.bloom
        ? `<span class="yt-bloom">${escapeHtml(q.bloom)}</span>`
        : '';
      // Per-question answer reveal. The answer text is in the HTML — anyone
      // viewing source can read it — but the toggle keeps it out of the
      // student's eye until they choose to look.
      const answer = q.answer
        ? `<details class="yt-course-answer yt-question-answer"><summary aria-label="Show answer"></summary><div class="yt-prose">${renderProse(q.answer, citekeyMap)}</div></details>`
        : '';
      return `<li><div class="yt-q-row"><span class="yt-q-num">${i + 1}.</span><span class="yt-q-text">${renderInline(q.text, citekeyMap)}</span>${bloom}</div>${answer}</li>`;
    })
    .join('\n            ');

  const relatedHtml = related.length
    ? related
        .map(
          (r) => `
                <a href="${r.citekey}.html" class="yt-related-card">
                    <div class="yt-related-thumb">
                        <img src="https://i.ytimg.com/vi/${r.ytId}/mqdefault.jpg" alt="" loading="lazy">
                    </div>
                    <div class="yt-related-info">
                        <div class="yt-related-title">${escapeHtml(r.title)}</div>
                        <div class="yt-related-meta">${escapeHtml(r.channel)} · ${escapeHtml(
                          DEPTH_LABELS[r.depth] || r.depth,
                        )}</div>
                    </div>
                </a>`,
        )
        .join('')
    : '<p class="yt-empty">No related videos yet.</p>';

  const takeawayHtml = video.takeaway
    .split(/\n\n+/)
    .map((para) => `<p>${renderInline(para, citekeyMap)}</p>`)
    .join('\n            ');

  // "Before you watch" block — Prerequisites + Learning outcomes (frontmatter)
  const beforeBlocks = [];
  if (video.prerequisites.length > 0) {
    beforeBlocks.push(`
                <div class="yt-before-group">
                    <h3 class="yt-before-heading">Prerequisites</h3>
                    <ul class="yt-before-list">
                        ${video.prerequisites.map((p) => `<li>${renderInline(p, citekeyMap)}</li>`).join('\n                        ')}
                    </ul>
                </div>`);
  }
  if (video.learningOutcomes.length > 0) {
    beforeBlocks.push(`
                <div class="yt-before-group">
                    <h3 class="yt-before-heading">By the end you'll be able to</h3>
                    <ul class="yt-before-list">
                        ${video.learningOutcomes.map((o) => `<li>${renderInline(o, citekeyMap)}</li>`).join('\n                        ')}
                    </ul>
                </div>`);
  }
  const beforeHtml = beforeBlocks.length
    ? `
            <section class="yt-section">
                <h2>Before you watch</h2>
                <div class="yt-before-grid">${beforeBlocks.join('')}
                </div>
            </section>`
    : '';

  // "Watch for" block — clickable timestamp links into YouTube
  const watchForHtml = video.watchFor.length
    ? `
            <section class="yt-section">
                <h2>Watch for</h2>
                <ul class="yt-watch-for-list">
                    ${video.watchFor
                      .map((w) => {
                        const seconds = timestampToSeconds(w.timestamp);
                        const href =
                          seconds != null
                            ? `${video.url}${video.url.includes('?') ? '&' : '?'}t=${seconds}`
                            : video.url;
                        const dataSec = seconds != null ? ` data-seconds="${seconds}"` : '';
                        return `<li><a class="yt-watch-for-time" href="${escapeHtml(href)}"${dataSec} target="_blank" rel="noopener">${escapeHtml(w.timestamp || '')}</a> <span class="yt-watch-for-text">${renderInline(w.text || '', citekeyMap)}</span></li>`;
                      })
                      .join('\n                    ')}
                </ul>
            </section>`
    : '';

  return tpl
    .replace(/\{\{TITLE\}\}/g, escapeHtml(video.title))
    .replace(/\{\{CHANNEL\}\}/g, escapeHtml(video.channel))
    .replace(/\{\{CHANNEL_HREF\}\}/g, encodeURIComponent(video.channel))
    .replace(/\{\{DURATION\}\}/g, escapeHtml(video.duration))
    .replace(/\{\{DEPTH\}\}/g, escapeHtml(DEPTH_LABELS[video.depth] || video.depth))
    .replace(/\{\{DEPTH_SLUG\}\}/g, escapeHtml(video.depth))
    .replace(/\{\{YT_ID\}\}/g, encodeURIComponent(video.ytId))
    .replace(/\{\{YT_URL\}\}/g, escapeHtml(video.url))
    .replace(/\{\{TAGS_HTML\}\}/g, tagsHtml)
    .replace(/\{\{DOMAIN_TRAIL\}\}/g, domainTrail)
    .replace(/\{\{TAKEAWAY_HTML\}\}/g, takeawayHtml)
    .replace(/\{\{BEFORE_HTML\}\}/g, beforeHtml)
    .replace(/\{\{WATCH_FOR_HTML\}\}/g, watchForHtml)
    .replace(/\{\{QUESTIONS_HTML\}\}/g, questionsHtml)
    .replace(/\{\{RELATED_HTML\}\}/g, relatedHtml);
}

function timestampToSeconds(ts) {
  if (!ts) return null;
  const parts = String(ts).split(':').map((s) => parseInt(s, 10));
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return null;
}

// ===========================================================================
// Course pipeline
// ===========================================================================

// Render a paragraph block: prose with our existing inline rules (citekey
// linkification, backtick code). Multiple newlines split into <p> tags.
function renderProse(text, citekeyMap) {
  const trimmed = (text || '').trim();
  if (!trimmed) return '';
  return trimmed
    .split(/\n\n+/)
    .map((para) => `<p>${renderInline(para.replace(/\n/g, ' '), citekeyMap)}</p>`)
    .join('\n');
}

// Parse a "> [!success]- Answer\n> body line\n> body line" Obsidian callout
// starting at lineIdx. Returns { lines: [...answerLines], nextIdx } or null.
function parseCallout(lines, lineIdx) {
  const head = lines[lineIdx];
  if (!head || !/^>\s*\[!\w+\][-+]?\s*/.test(head)) return null;
  const body = [];
  let i = lineIdx + 1;
  while (i < lines.length && /^>\s?/.test(lines[i])) {
    body.push(lines[i].replace(/^>\s?/, ''));
    i++;
  }
  return { lines: body, nextIdx: i };
}

// Parse an answer body into either a single prose blob or a per-choice list.
// Per-choice form recognized by lines like:
//   - a. (correct) explanation prose...
//   - b. (incorrect) explanation prose...
// Returns { kind: 'prose', prose } or { kind: 'choices', choices: [{letter, correct, prose}], correctLetter }.
function parseAnswerBody(rawText) {
  const text = (rawText || '').trim();
  if (!text) return { kind: 'prose', prose: '' };

  const lines = text.split('\n');
  // A per-choice answer starts with a bullet matching - <letter>. (correct|incorrect) ...
  const choiceLineRe = /^\s*-\s+([a-f])\.\s*\((correct|incorrect)\)\s*(.*)$/i;
  if (!choiceLineRe.test(lines[0])) {
    return { kind: 'prose', prose: text };
  }

  const choices = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(choiceLineRe);
    if (m) {
      if (current) choices.push(current);
      current = {
        letter: m[1].toLowerCase(),
        correct: m[2].toLowerCase() === 'correct',
        prose: m[3].trim(),
      };
    } else if (current && line.trim()) {
      // continuation of the previous choice's prose
      current.prose += ' ' + line.trim();
    }
  }
  if (current) choices.push(current);

  const correctChoice = choices.find((c) => c.correct);
  return {
    kind: 'choices',
    choices,
    correctLetter: correctChoice ? correctChoice.letter : '',
  };
}

// Parse a single quiz/assessment question starting at `**Q1.** *(type)* text…`
// followed by optional choice lines and an Obsidian Answer callout.
function parseQuestion(lines, startIdx, labelPrefix) {
  const headRe = new RegExp(`^\\*\\*${labelPrefix}(\\d+)\\.\\*\\*\\s*(?:\\*\\(([^)]+)\\)\\*)?\\s*(.*)$`);
  const head = lines[startIdx].match(headRe);
  if (!head) return null;
  const num = parseInt(head[1], 10);
  const type = (head[2] || '').trim();
  let text = head[3].trim();
  let i = startIdx + 1;

  // Continuation prose lines until choices, callout, blank-then-new-block, or EOF
  const choices = [];
  let answerLines = null;

  while (i < lines.length) {
    const line = lines[i];
    // Stop on next question / heading / final-assessment marker
    if (/^\*\*[A-Z]+\d+\.\*\*/.test(line) || /^##\s+/.test(line) || /^###\s+/.test(line)) break;
    // Choice line: "a. ...", "b. ...", up to ~6
    const choiceMatch = line.match(/^([a-f])\.\s+(.+)$/);
    if (choiceMatch) {
      choices.push({ letter: choiceMatch[1], text: choiceMatch[2].trim() });
      i++;
      continue;
    }
    // Answer callout
    if (/^>\s*\[!\w+\][-+]?/.test(line)) {
      const callout = parseCallout(lines, i);
      if (callout) {
        answerLines = callout.lines;
        i = callout.nextIdx;
        continue;
      }
    }
    // Continuation prose for the question
    if (line.trim() && choices.length === 0 && answerLines === null) {
      text += ' ' + line.trim();
    }
    i++;
  }

  return {
    question: {
      num,
      type,
      text,
      choices,
      // Legacy: inline callout answer (still supported, but new format uses
      // separate "### Answer key:" sections paired in parseAnswerKey below).
      answerBody: answerLines
        ? parseAnswerBody(answerLines.join('\n').trim())
        : { kind: 'prose', prose: '' },
    },
    nextIdx: i,
  };
}

// Read a block of lines that are the body of a "### Answer key: ..." section
// (or "## Answer key: Final assessment"). Find each "**A1.**" / "**FA1.**"
// entry and parse its body via parseAnswerBody.
// Returns Map<num, answerBody>.
function parseAnswerKey(lines, labelPrefix) {
  const headRe = new RegExp(`^\\*\\*${labelPrefix}(\\d+)\\.\\*\\*\\s*(.*)$`);
  const stopRe = /^##\s|^###\s/;
  const byNum = new Map();
  let i = 0;
  while (i < lines.length) {
    const head = lines[i].match(headRe);
    if (!head) {
      i++;
      continue;
    }
    const num = parseInt(head[1], 10);
    const startProse = head[2] || '';
    const bodyLines = startProse ? [startProse] : [];
    let j = i + 1;
    while (j < lines.length) {
      const line = lines[j];
      if (headRe.test(line) || stopRe.test(line)) break;
      bodyLines.push(line);
      j++;
    }
    byNum.set(num, parseAnswerBody(bodyLines.join('\n').trim()));
    i = j;
  }
  return byNum;
}

function parseCourse(filename) {
  const raw = fs.readFileSync(path.join(COURSES_DIR, filename), 'utf8');
  const { fm, body } = parseFrontmatter(raw);

  const required = ['title', 'slug', 'status'];
  for (const k of required) {
    if (!(k in fm)) throw new Error(`${filename}: missing frontmatter "${k}"`);
  }

  // Strip wiki-link wrappers from the video list (same shape as related: lists)
  const videos = arr(fm.videos).map(normalizeCitekeyRef).filter(Boolean);

  const lines = body.split('\n');

  // Find headings with line indexes
  const headings = [];
  lines.forEach((line, idx) => {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) headings.push({ level: 2, name: h2[1].trim(), idx });
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) headings.push({ level: 3, name: h3[1].trim(), idx });
  });

  // Locate top-level (##) section spans
  const h2s = headings.filter((h) => h.level === 2);
  const spans = h2s.map((h, i) => ({
    name: h.name,
    start: h.idx + 1,
    end: i + 1 < h2s.length ? h2s[i + 1].idx : lines.length,
  }));

  let overview = '';
  const modules = [];
  let finalAssessment = null;

  for (const span of spans) {
    const name = span.name;
    const sectionLines = lines.slice(span.start, span.end);

    if (/^course overview$/i.test(name)) {
      overview = sectionLines.join('\n').trim();
      continue;
    }

    if (/^final assessment$/i.test(name)) {
      // Parse intro prose until first **FA1.**, then questions
      let i = 0;
      const introLines = [];
      while (i < sectionLines.length && !/^\*\*FA\d+\.\*\*/.test(sectionLines[i])) {
        introLines.push(sectionLines[i]);
        i++;
      }
      const questions = [];
      while (i < sectionLines.length) {
        const q = parseQuestion(sectionLines, i, 'FA');
        if (!q) {
          i++;
          continue;
        }
        questions.push(q.question);
        i = q.nextIdx;
      }
      finalAssessment = { intro: introLines.join('\n').trim(), questions };
      continue;
    }

    if (/^module\b/i.test(name)) {
      modules.push(parseModule(name, sectionLines));
      continue;
    }

    if (/^answer key:?\s*final assessment$/i.test(name)) {
      // Pair into the previously-parsed final assessment.
      if (!finalAssessment) {
        console.warn(`! ${filename}: answer key for final assessment appears before the assessment itself — ignored`);
        continue;
      }
      const byNum = parseAnswerKey(sectionLines, 'FA');
      for (const q of finalAssessment.questions) {
        if (byNum.has(q.num)) q.answerBody = byNum.get(q.num);
      }
      continue;
    }

    console.warn(`! ${filename}: unrecognized course section "## ${name}" — ignored`);
  }

  return {
    sourceFile: filename,
    title: fm.title,
    slug: fm.slug,
    courseNumber: fm.course_number || '',
    description: fm.description || '',
    status: fm.status,
    durationMinutes: Number(fm.duration_minutes) || null,
    videoCount: Number(fm.video_count) || videos.length,
    track: fm.track || '',
    prerequisites: arr(fm.prerequisites),
    learningOutcomes: arr(fm.learning_outcomes),
    videos,
    courses: arr(fm.courses),
    overview,
    modules,
    finalAssessment,
  };
}

function parseModule(title, sectionLines) {
  // Find ### sub-headings within the module
  const subHeadings = [];
  sectionLines.forEach((line, idx) => {
    const m = line.match(/^###\s+(.+?)\s*$/);
    if (m) subHeadings.push({ name: m[1].trim(), idx });
  });

  // Module intro: everything before the first ### sub-heading
  const introEnd = subHeadings.length ? subHeadings[0].idx : sectionLines.length;
  const intro = sectionLines.slice(0, introEnd).join('\n').trim();

  // Each ### subsection becomes an item; we classify it by name
  const items = [];
  for (let i = 0; i < subHeadings.length; i++) {
    const sub = subHeadings[i];
    const subEnd = i + 1 < subHeadings.length ? subHeadings[i + 1].idx : sectionLines.length;
    const subLines = sectionLines.slice(sub.idx + 1, subEnd);
    const subProse = subLines.join('\n').trim();

    // Video: "Video N: [[citekey]]" or "Video N: [[citekey|alias]]"
    const videoMatch = sub.name.match(/^Video\s+\d+:\s*(.+)$/i);
    if (videoMatch) {
      const citekey = normalizeCitekeyRef(videoMatch[1].trim());
      items.push({ kind: 'video', citekey, prose: subProse });
      continue;
    }

    // Connecting prose
    if (/^connecting prose$/i.test(sub.name)) {
      items.push({ kind: 'connecting', prose: subProse });
      continue;
    }

    // Checkpoint Quiz
    if (/^checkpoint quiz/i.test(sub.name)) {
      const questions = [];
      let j = 0;
      while (j < subLines.length) {
        const q = parseQuestion(subLines, j, 'Q');
        if (!q) {
          j++;
          continue;
        }
        questions.push(q.question);
        j = q.nextIdx;
      }
      items.push({ kind: 'quiz', title: sub.name, questions });
      continue;
    }

    // Answer key: pair its entries with the most recent quiz item
    if (/^answer key\b/i.test(sub.name)) {
      const byNum = parseAnswerKey(subLines, 'A');
      // Find the most recent quiz item and merge in the parsed answers.
      const lastQuiz = [...items].reverse().find((it) => it.kind === 'quiz');
      if (lastQuiz) {
        for (const q of lastQuiz.questions) {
          if (byNum.has(q.num)) q.answerBody = byNum.get(q.num);
        }
      } else {
        console.warn(`! "${sub.name}" appears with no preceding quiz — answer key ignored`);
      }
      continue;
    }

    // Fallback: treat as a generic prose block
    items.push({ kind: 'prose', heading: sub.name, prose: subProse });
  }

  return { title, intro, items };
}

function renderCoursePage(course, videosByKey, citekeyMap) {
  const tpl = fs.readFileSync(COURSE_TEMPLATE_PATH, 'utf8');

  // Header meta strip
  const metaBits = [];
  if (course.durationMinutes) metaBits.push(`${course.durationMinutes} min`);
  metaBits.push(`${course.videoCount} video${course.videoCount === 1 ? '' : 's'}`);
  if (course.track) metaBits.push(escapeHtml(course.track));
  if (course.status && course.status !== 'active') metaBits.push(escapeHtml(course.status));
  const metaHtml = metaBits.map((m) => `<span class="yt-course-meta-item">${m}</span>`).join('<span class="yt-sep" aria-hidden="true">·</span>');

  // Prerequisites + Learning outcomes
  const beforeBlocks = [];
  if (course.prerequisites.length) {
    beforeBlocks.push(`
        <div class="yt-before-group">
            <h3 class="yt-before-heading">Prerequisites</h3>
            <ul class="yt-before-list">
                ${course.prerequisites.map((p) => `<li>${renderInline(p, citekeyMap)}</li>`).join('\n                ')}
            </ul>
        </div>`);
  }
  if (course.learningOutcomes.length) {
    beforeBlocks.push(`
        <div class="yt-before-group">
            <h3 class="yt-before-heading">By the end you'll be able to</h3>
            <ul class="yt-before-list">
                ${course.learningOutcomes.map((o) => `<li>${renderInline(o, citekeyMap)}</li>`).join('\n                ')}
            </ul>
        </div>`);
  }
  const beforeHtml = beforeBlocks.length
    ? `<section class="yt-section"><h2>Before you start</h2><div class="yt-before-grid">${beforeBlocks.join('')}</div></section>`
    : '';

  // Overview
  const overviewHtml = course.overview
    ? `<section class="yt-section"><h2>Course overview</h2><div class="yt-prose">${renderProse(course.overview, citekeyMap)}</div></section>`
    : '';

  // Modules
  const modulesHtml = course.modules
    .map((mod, modIdx) => renderModule(mod, modIdx, videosByKey, citekeyMap))
    .join('\n');

  // Final assessment
  const finalHtml = course.finalAssessment
    ? renderFinalAssessment(course.finalAssessment, citekeyMap)
    : '';

  return tpl
    .replace(/\{\{TITLE\}\}/g, escapeHtml(course.title))
    .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(course.description))
    .replace(/\{\{META_HTML\}\}/g, metaHtml)
    .replace(/\{\{BEFORE_HTML\}\}/g, beforeHtml)
    .replace(/\{\{OVERVIEW_HTML\}\}/g, overviewHtml)
    .replace(/\{\{MODULES_HTML\}\}/g, modulesHtml)
    .replace(/\{\{FINAL_HTML\}\}/g, finalHtml);
}

function renderModule(mod, modIdx, videosByKey, citekeyMap) {
  const introHtml = mod.intro
    ? `<div class="yt-prose">${renderProse(mod.intro, citekeyMap)}</div>`
    : '';

  const itemsHtml = mod.items
    .map((item) => {
      if (item.kind === 'video') {
        return renderVideoCard(item, videosByKey, citekeyMap);
      }
      if (item.kind === 'connecting') {
        return `<div class="yt-course-connecting"><span class="yt-course-connecting-label">Then</span><div class="yt-prose">${renderProse(item.prose, citekeyMap)}</div></div>`;
      }
      if (item.kind === 'quiz') {
        return renderQuiz(item, citekeyMap);
      }
      // generic prose fallback
      return `<div class="yt-prose"><h4>${escapeHtml(item.heading)}</h4>${renderProse(item.prose, citekeyMap)}</div>`;
    })
    .join('\n');

  return `
        <section class="yt-section yt-course-module">
            <h2>${escapeHtml(mod.title)}</h2>
            ${introHtml}
            ${itemsHtml}
        </section>`;
}

function renderVideoCard(item, videosByKey, citekeyMap) {
  const video = videosByKey.get(item.citekey);
  const proseHtml = item.prose
    ? `<div class="yt-prose">${renderProse(item.prose, citekeyMap)}</div>`
    : '';

  if (!video) {
    console.warn(`! course references unknown video citekey "${item.citekey}"`);
    return `
            <div class="yt-course-video">
                <div class="yt-course-video-card yt-course-video-card-missing">
                    <span class="yt-course-video-missing">Missing video: ${escapeHtml(item.citekey)}</span>
                </div>
                ${proseHtml}
            </div>`;
  }

  const depthLabel = DEPTH_LABELS[video.depth] || video.depth;
  return `
            <div class="yt-course-video">
                <a class="yt-course-video-card" href="../videos/${video.citekey}.html">
                    <div class="yt-course-video-thumb">
                        <img src="https://i.ytimg.com/vi/${video.ytId}/mqdefault.jpg" alt="" loading="lazy">
                        <span class="yt-card-duration">${escapeHtml(video.duration)}</span>
                    </div>
                    <div class="yt-course-video-body">
                        <h3 class="yt-course-video-title">${escapeHtml(video.title)}</h3>
                        <p class="yt-course-video-channel">${escapeHtml(video.channel)}</p>
                        <div class="yt-course-video-meta">
                            <span class="yt-depth yt-depth-${video.depth}">${escapeHtml(depthLabel)}</span>
                        </div>
                    </div>
                </a>
                ${proseHtml}
            </div>`;
}

function renderQuiz(item, citekeyMap) {
  const questionsHtml = item.questions
    .map((q) => renderQuizQuestion(q, citekeyMap))
    .join('\n');
  return `
            <div class="yt-course-quiz">
                <h3 class="yt-course-quiz-title">${escapeHtml(item.title)}</h3>
                <ol class="yt-course-quiz-list">
                    ${questionsHtml}
                </ol>
            </div>`;
}

function renderFinalAssessment(fa, citekeyMap) {
  const introHtml = fa.intro
    ? `<div class="yt-prose">${renderProse(fa.intro, citekeyMap)}</div>`
    : '';
  const questionsHtml = fa.questions
    .map((q) => renderQuizQuestion(q, citekeyMap, 'FA'))
    .join('\n');
  return `
        <section class="yt-section yt-course-final">
            <h2>Final assessment</h2>
            ${introHtml}
            <ol class="yt-course-quiz-list">
                ${questionsHtml}
            </ol>
        </section>`;
}

function renderQuizQuestion(q, citekeyMap, prefix = '') {
  const typeBadge = q.type
    ? `<span class="yt-bloom yt-course-qtype">${escapeHtml(q.type)}</span>`
    : '';
  const labelText = prefix ? `${prefix}${q.num}` : `Q${q.num}`;
  const answerBody = q.answerBody || { kind: 'prose', prose: '' };
  const isInteractive =
    q.choices.length > 0 &&
    answerBody.kind === 'choices' &&
    answerBody.choices.some((c) => c.correct);

  // ---- Interactive multiple-choice ----
  if (isInteractive) {
    // Build a map of letter → choice-data so we can attach explanations.
    const explByLetter = new Map(
      answerBody.choices.map((c) => [c.letter, { correct: c.correct, prose: c.prose }]),
    );
    const choicesHtml = q.choices
      .map((c) => {
        const meta = explByLetter.get(c.letter);
        const isCorrect = meta ? meta.correct : false;
        // Store the per-choice explanation HTML in a data-attribute so the
        // inline JS can swap it into the explanation panel on click.
        const explHtml = meta ? `<p>${renderInline(meta.prose, citekeyMap)}</p>` : '';
        return `
                            <li>
                                <button type="button"
                                    class="yt-course-choice-btn"
                                    data-letter="${c.letter}"
                                    data-correct="${isCorrect ? 'true' : 'false'}"
                                    data-explanation="${escapeAttr(explHtml)}">
                                    <span class="yt-course-choice-letter">${c.letter}.</span>
                                    <span class="yt-course-choice-text">${renderInline(c.text, citekeyMap)}</span>
                                </button>
                            </li>`;
      })
      .join('');
    return `
                    <li class="yt-course-quiz-item" data-interactive="true">
                        <div class="yt-course-quiz-head">
                            <span class="yt-course-quiz-num">${labelText}.</span>
                            <span class="yt-course-quiz-text">${renderInline(q.text, citekeyMap)}</span>
                            ${typeBadge}
                        </div>
                        <ul class="yt-course-choices yt-course-choices-interactive">${choicesHtml}
                        </ul>
                        <div class="yt-course-explanation" aria-live="polite" hidden>
                            <p class="yt-course-explanation-verdict"></p>
                            <div class="yt-course-explanation-body"></div>
                            <button type="button" class="yt-course-reset" aria-label="Reset question">Try another</button>
                        </div>
                    </li>`;
  }

  // ---- Non-interactive (short answer, synthesis, or MC without per-choice data) ----
  const choicesHtml = q.choices.length
    ? `<ul class="yt-course-choices">${q.choices
        .map(
          (c) => `<li><span class="yt-course-choice-letter">${c.letter}.</span> ${renderInline(c.text, citekeyMap)}</li>`,
        )
        .join('')}</ul>`
    : '';
  const proseAnswer = answerBody.kind === 'prose' ? answerBody.prose : '';
  const answerHtml = proseAnswer
    ? `<details class="yt-course-answer"><summary aria-label="Show answer"></summary><div class="yt-prose">${renderProse(proseAnswer, citekeyMap)}</div></details>`
    : '';
  return `
                    <li class="yt-course-quiz-item">
                        <div class="yt-course-quiz-head">
                            <span class="yt-course-quiz-num">${labelText}.</span>
                            <span class="yt-course-quiz-text">${renderInline(q.text, citekeyMap)}</span>
                            ${typeBadge}
                        </div>
                        ${choicesHtml}
                        ${answerHtml}
                    </li>`;
}

function escapeAttr(s) {
  // Encode an HTML string so it can survive a `data-*="..."` attribute.
  // Same as escapeHtml but with a different quoting target — escapeHtml already
  // covers quotes (&quot; / &#39;) so it's safe to reuse here.
  return escapeHtml(s);
}

function build() {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('0-'));

  const videos = files.map((f) => {
    try {
      return parseFile(f);
    } catch (err) {
      console.error(`✗ ${f}: ${err.message}`);
      process.exit(1);
    }
  });

  videos.sort((a, b) => a.title.localeCompare(b.title));

  if (!fs.existsSync(OUT_VIDEOS_DIR)) fs.mkdirSync(OUT_VIDEOS_DIR, { recursive: true });

  // Build once: citekey → video. Used to linkify citekey references in prose.
  const citekeyMap = new Map(videos.map((v) => [v.citekey, v]));

  for (const video of videos) {
    const related = relatedFor(video, videos);
    const html = renderVideoPage(video, related, citekeyMap);
    fs.writeFileSync(path.join(OUT_VIDEOS_DIR, `${video.citekey}.html`), html);
  }
  // Remove pages whose source breakdown no longer exists (deleted from the vault).
  pruneOrphans(OUT_VIDEOS_DIR, videos.map((v) => `${v.citekey}.html`), 'video page');

  // Index JSON: keep concepts so client-side search can match against them.
  // Drop questions, takeaway, answers, courses — those are page-only.
  // Per-video domain→subdomain mapping is preserved so the client can prune
  // subdomains correctly when a domain is deselected, even if the subdomain
  // also appears on cross-domain videos that share another active domain.
  const index = videos.map((v) => ({
    citekey: v.citekey,
    title: v.title,
    channel: v.channel,
    duration: v.duration,
    ytId: v.ytId,
    domains: v.domains,
    subdomains: v.subdomains,
    tags: v.tags,
    concepts: v.concepts,
    depth: v.depth,
  }));
  // Authoritative subdomain → owning domain map (single owner per subdomain).
  // Warn if any video lists a subdomain that doesn't belong to one of its domains.
  const subdomainOwner = {};
  for (const [domain, subs] of Object.entries(DOMAIN_SUBDOMAINS)) {
    for (const s of subs) {
      if (subdomainOwner[s]) {
        console.warn(`! Subdomain "${s}" appears under multiple domains in taxonomy — keeping first`);
      } else {
        subdomainOwner[s] = domain;
      }
    }
  }
  for (const v of videos) {
    for (const s of v.subdomains) {
      const owner = subdomainOwner[s];
      if (!owner) {
        console.warn(`! ${v.citekey}: unknown subdomain "${s}" (not in taxonomy)`);
      } else if (!v.domains.includes(owner)) {
        console.warn(
          `! ${v.citekey}: subdomain "${s}" belongs to "${owner}" but video doesn't list that domain (lists: ${v.domains.join(', ')})`,
        );
      }
    }
  }
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify({ videos: index, subdomainOwner }, null, 2),
  );

  // ---- Courses ----
  const courses = [];
  if (fs.existsSync(COURSES_DIR)) {
    const courseFiles = fs
      .readdirSync(COURSES_DIR)
      .filter((f) => f.endsWith('.md') && !f.startsWith('0-'));
    const videosByKey = new Map(videos.map((v) => [v.citekey, v]));

    if (!fs.existsSync(OUT_COURSES_DIR)) fs.mkdirSync(OUT_COURSES_DIR, { recursive: true });

    for (const f of courseFiles) {
      let course;
      try {
        course = parseCourse(f);
      } catch (err) {
        console.error(`✗ course ${f}: ${err.message}`);
        process.exit(1);
      }
      const html = renderCoursePage(course, videosByKey, citekeyMap);
      fs.writeFileSync(path.join(OUT_COURSES_DIR, `${course.slug}.html`), html);
      courses.push(course);
    }
    // Remove course pages whose source file no longer exists.
    pruneOrphans(OUT_COURSES_DIR, courses.map((c) => `${c.slug}.html`), 'course page');
    courses.sort((a, b) => (a.courseNumber || a.slug).localeCompare(b.courseNumber || b.slug));

    // Emit a small courses.json for the index page to list them
    const courseIndex = courses.map((c) => ({
      slug: c.slug,
      courseNumber: c.courseNumber,
      title: c.title,
      description: c.description,
      status: c.status,
      durationMinutes: c.durationMinutes,
      videoCount: c.videoCount,
      track: c.track,
    }));
    fs.writeFileSync(path.join(ROOT, 'courses.json'), JSON.stringify(courseIndex, null, 2));
  }

  const tagCounts = {};
  for (const v of videos) for (const t of v.tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
  const domainCounts = {};
  for (const v of videos) for (const d of v.domains) domainCounts[d] = (domainCounts[d] || 0) + 1;

  console.log(`✓ Built ${videos.length} videos`);
  console.log(
    `  Tags: ${Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([t, n]) => `${t}(${n})`)
      .join(', ')}`,
  );
  console.log(
    `  Domains: ${Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([d, n]) => `${d}(${n})`)
      .join(', ')}`,
  );
  console.log(`  Output: videos.json + videos/*.html`);
  if (courses.length) {
    console.log(`✓ Built ${courses.length} course${courses.length === 1 ? '' : 's'}`);
    for (const c of courses) {
      console.log(`  · ${c.courseNumber ? c.courseNumber + ' ' : ''}${c.title} → courses/${c.slug}.html`);
    }
  }

  // Audit the generated HTML for raw citekey occurrences. A citekey should
  // never appear as plain text on a page — it should always be rendered as
  // a link via renderInline's linkifier. This catches regressions where a
  // new renderer forgets to pass citekeyMap.
  auditCitekeyLeaks(videos);
}

// Delete .html files in `dir` that aren't in `expectedNames` — i.e. pages
// whose source was removed from the vault since the last build. Without this,
// stale pages linger on disk (and in git, and on the live site) forever.
function pruneOrphans(dir, expectedNames, label) {
  if (!fs.existsSync(dir)) return;
  const keep = new Set(expectedNames);
  let removed = 0;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.html')) continue;
    if (keep.has(name)) continue;
    fs.unlinkSync(path.join(dir, name));
    console.log(`  − removed orphaned ${label}: ${name}`);
    removed++;
  }
  if (removed > 0) {
    console.log(`✓ Pruned ${removed} orphaned ${label}${removed === 1 ? '' : 's'}`);
  }
}

function auditCitekeyLeaks(videos) {
  const knownCitekeys = videos.map((v) => v.citekey);
  if (knownCitekeys.length === 0) return;

  const outputDirs = [OUT_VIDEOS_DIR, OUT_COURSES_DIR].filter((d) => fs.existsSync(d));
  const files = [];
  for (const dir of outputDirs) {
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.html')) files.push(path.join(dir, name));
    }
  }

  let leakCount = 0;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const key of knownCitekeys) {
      // Match the citekey on word boundaries so that "nathanlively110QuestionsSound2017"
      // doesn't trigger inside "nathanlively110QuestionsSound2017c".
      const wordBoundary = new RegExp(`\\b${key}\\b`);
      if (!wordBoundary.test(html)) continue;
      const lines = html.split('\n');
      for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        if (!wordBoundary.test(line)) continue;
        // Legitimate uses:
        //   - any href ending in "<key>.html" (handles "../videos/<key>.html" too)
        //   - tag/depth/channel hashes
        //   - the page's own <title> / meta / og:url
        const legit =
          new RegExp(`href="[^"]*${key}\\.html"`).test(line) ||
          line.includes('href="../#') ||
          line.includes('href="../"') ||
          /<title>/.test(line) ||
          /name="description"/.test(line) ||
          /property="og:url"/.test(line);
        if (legit) continue;
        leakCount++;
        const rel = path.relative(ROOT, file);
        console.warn(`! leaked citekey "${key}" in ${rel} (line ${idx + 1})`);
      }
    }
  }
  if (leakCount > 0) {
    console.warn(`! ${leakCount} raw citekey occurrence${leakCount === 1 ? '' : 's'} not linkified. Pass citekeyMap to the relevant renderInline() call.`);
  }
}

build();
