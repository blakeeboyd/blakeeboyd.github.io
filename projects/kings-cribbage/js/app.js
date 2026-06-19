(function(){
  const $ = s => document.querySelector(s);
  const RANKS = KC.RANKS;
  let geom=null;
  let imgCanvas=null;               // cropped board canvas (for re-OCR if needed)
  let imgData=null;                 // cropped board ImageData (for cell extraction)
  const tiles = new Map();          // "r_c" -> {rank,color,score}
  let displayRows=[], displayCols=[];
  let imgW=0, imgH=0;               // cropped image dimensions (for overlay positioning)
  let viewMode = 'overlay';         // 'overlay' | 'board'

  // ---- OCR (Tesseract.js) ----
  let ocrWorker = null;
  let ocrReady = null;              // Promise that resolves when worker is initialised
  function initOCR(){
    if (ocrReady) return ocrReady;
    ocrReady = (async () => {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: () => {}
      });
      await worker.setParameters({
        tessedit_char_whitelist: 'A234567890JQK',
        tessedit_pageseg_mode: '10',                // single character
      });
      ocrWorker = worker;
      return worker;
    })();
    return ocrReady;
  }
  // Map a raw OCR token to a canonical rank string. Returns '?' if it can't
  // be mapped. The whitelist excludes everything but the 13 ranks, so any
  // digit 0 or 1 must come from "10" — there's no other rank with those glyphs.
  function mapToken(t, confidence) {
    if (!t) return '?';
    t = t.trim().toUpperCase().replace(/[^A234567890JQK]/g, '');
    if (!t) return '?';
    if (t === '10' || t === '01' || t.includes('10')) return '10';
    const c = t[0];
    if ('A23456789JQK'.includes(c)) return c;
    if ((c === '0' || c === '1') && confidence >= 60) return '10';
    return '?';
  }
  // Same job as mapToken, but accepts the broader Latin alphabet/digits that
  // Tesseract can return when run without a whitelist. Maps obvious letter
  // confusions back to the rank they almost certainly came from. Used only
  // for the third OCR pass on cells the strict mapper rejected.
  const LENIENT_RANK_FROM = {
    // ranks pass through
    'A':'A','J':'J','Q':'Q','K':'K',
    '2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '0':'10','1':'10',
    // letter confusions
    'O':'Q',          // capital O is Tesseract's favourite mis-read for Q
    'D':'Q',          // sometimes the Q tail gets lost → D
    'C':'Q',          // Q without the closed bottom → C
    '\\':'Q',         // Q where Tesseract latched onto the tail as a slash
    '/':'Q',          // same, other slash direction
    '(':'Q',          // open curve only → opening paren
    ')':'Q',          // closing paren variant
    'I':'10','L':'10','l':'10',   // lowercase L / capital I → "1" of 10
    'B':'8',          // 8 with broken top loop reads as B
    'G':'6',          // 6 with extended tail reads as G
    'S':'5',          // 5 with smoothed corners reads as S
    'Z':'2',          // 2 with sharp angles reads as Z
    'T':'7',          // 7 with horizontal serif reads as T
    'R':'A',          // rare: a serif A reads as R
    'H':'K',          // K with reduced diagonals reads as H
  };
  function mapTokenLenient(t) {
    if (!t) return '?';
    t = t.trim();
    if (!t) return '?';
    // Explicit two-character "10" or "IO" / "lO" variants.
    const upper = t.toUpperCase().replace(/\s+/g, '');
    if (upper === '10' || upper === '1O' || upper === 'IO' || upper === 'LO') return '10';
    if (upper.includes('10') || upper.includes('1O') || upper.includes('IO')) return '10';
    // Take the first character. Don't pre-uppercase — lowercase l/i carry
    // different info than uppercase L/I in some confusion tables.
    const c0 = t[0];
    if (c0 in LENIENT_RANK_FROM) return LENIENT_RANK_FROM[c0];
    const c1 = c0.toUpperCase();
    if (c1 in LENIENT_RANK_FROM) return LENIENT_RANK_FROM[c1];
    return '?';
  }
  // Extract the top-N candidate ranks from a Tesseract result with their
  // confidences. Uses data.symbols[].choices when available, falling back to
  // just the top read. Returns [{rank, confidence}, ...] sorted desc.
  function extractCandidates(data, topN = 3) {
    const cands = [];
    const seen = new Set();
    const add = (rank, conf) => {
      if (rank === '?' || seen.has(rank)) return;
      seen.add(rank);
      cands.push({ rank, confidence: conf });
    };
    // Primary text always wins as candidate 0.
    const primary = mapToken(data.text || '', data.confidence || 0);
    add(primary, data.confidence || 0);
    // Pull alternatives from symbol choices when available.
    const sym = data.symbols && data.symbols[0];
    if (sym && Array.isArray(sym.choices)) {
      for (const ch of sym.choices) {
        const r = mapToken(ch.text || '', ch.confidence || 0);
        add(r, ch.confidence || 0);
      }
    }
    return cands.slice(0, topN);
  }
  // Hand-coded geometric tests for the two known systematic confusions:
  //  3 vs 5 — 5 has a flat horizontal top stroke that extends to the left edge;
  //            3 starts with a curve that doesn't.
  //  K vs 4 — K is symmetric vertical bar + diagonals on right; 4 has a strong
  //            horizontal bar in the middle and an empty top-right.
  // Both run on the same 96x96 canvas we sent to Tesseract. Returns a hint
  // object {bias: 'rank', against: 'rank'} or null if no signal.
  function shapeDisambiguate(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const img = ctx.getImageData(0, 0, W, H).data;
    // Binarize using the same heuristic as the crop: anything noticeably darker
    // than mid-gray counts as ink.
    const ink = new Uint8Array(W * H);
    for (let i = 0; i < W*H; i++) {
      const r = img[i*4], g = img[i*4+1], b = img[i*4+2];
      const lum = (r + g + b) / 3;
      if (lum < 160) ink[i] = 1;
    }
    // Find the glyph's bounding box.
    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (ink[y*W + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0 || maxX - minX < 8 || maxY - minY < 8) return null;
    const bw = maxX - minX + 1, bh = maxY - minY + 1;
    // ---- 3 vs 5: top strip left-side fill ratio.
    // 5: flat bar at top → left third of top is mostly inked.
    // 3: curve at top   → left third of top is mostly empty.
    const topStrip = Math.max(2, (bh * 0.18) | 0);
    let topLeftInk = 0, topLeftTotal = 0;
    const leftCutoff = minX + (bw * 0.35);
    for (let y = minY; y < minY + topStrip; y++) {
      for (let x = minX; x < leftCutoff; x++) {
        topLeftTotal++;
        if (ink[y*W + x]) topLeftInk++;
      }
    }
    const topLeftRatio = topLeftTotal ? topLeftInk / topLeftTotal : 0;
    // ---- K vs 4: middle horizontal bar at right side.
    // 4: strong horizontal bar through the middle, plus closed top-left box.
    // K: no horizontal bar; right side is diagonal strokes only.
    const midY = ((minY + maxY) / 2) | 0;
    const midBand = Math.max(2, (bh * 0.12) | 0);
    let midRightInk = 0, midRightTotal = 0;
    const rightStart = minX + (bw * 0.55);
    for (let y = midY - midBand; y <= midY + midBand; y++) {
      if (y < minY || y > maxY) continue;
      for (let x = rightStart; x <= maxX; x++) {
        midRightTotal++;
        if (ink[y*W + x]) midRightInk++;
      }
    }
    const midRightRatio = midRightTotal ? midRightInk / midRightTotal : 0;
    // Decide which (if any) confusion this glyph might belong to and give a hint.
    // Thresholds are coarse; we use these only as tiebreakers, not as hard rules.
    if (topLeftRatio > 0.55) return { bias: '5', against: '3' };
    if (topLeftRatio < 0.15) return { bias: '3', against: '5' };
    if (midRightRatio > 0.55) return { bias: '4', against: 'K' };
    if (midRightRatio < 0.15) return { bias: 'K', against: '4' };
    return null;
  }
  // If the shape hint suggests `bias` over `against`, swap their order in the
  // candidates list if `against` currently outranks `bias`.
  function reorderForShapeHint(cands, hint) {
    const iBias = cands.findIndex(c => c.rank === hint.bias);
    const iAgainst = cands.findIndex(c => c.rank === hint.against);
    if (iBias < 0 || iAgainst < 0) return;
    if (iAgainst < iBias) {
      const tmp = cands[iBias]; cands[iBias] = cands[iAgainst]; cands[iAgainst] = tmp;
    }
  }
  // Constraint-solver post-pass. Two rules:
  //   1. Any low-confidence read with a 2nd candidate gets demoted IF demoting
  //      doesn't push another rank over the 4-per-color cap.
  //   2. Any rank+color over the cap gets its lowest-confidence cells demoted
  //      to their next candidate (repeat until under).
  // Both rules run iteratively until convergence.
  function runConstraintSolver(){
    const CONF_THRESHOLD = 80;   // %
    const MAX_PER_RANK_COLOR = 4;
    const countRanks = () => {
      const counts = {};
      for (const [key, t] of tiles) {
        if (t.rank === '?') continue;
        const k = t.rank + t.color;
        counts[k] = (counts[k] || 0) + 1;
      }
      return counts;
    };
    // Compute which (rank, color) combos are UNDER the per-color cap. These
    // are the "not in play" ranks. When demoting an over-limit cell, we
    // prefer to demote toward one of these — it explains both anomalies at
    // once (extra X + missing Y → one of the Xs is actually a Y).
    const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    function getMissingSet() {
      const counts = countRanks();
      const missing = new Set();
      for (const rk of RANKS) for (const col of ['R','B']) {
        if ((counts[rk + col] || 0) < MAX_PER_RANK_COLOR) {
          missing.add(rk + col);
        }
      }
      return missing;
    }
    // Up to a few passes to let demotions cascade.
    for (let pass = 0; pass < 5; pass++) {
      let changed = false;
      const counts = countRanks();
      const missing = getMissingSet();
      // Rule 2: handle over-limit ranks. For each over-limit (rank, color),
      // collect cells of that rank, score each by how plausibly it could be
      // a *missing* same-color rank instead, and demote the most plausible
      // mis-reads first.
      for (const k of Object.keys(counts)) {
        if (counts[k] <= MAX_PER_RANK_COLOR) continue;
        const overby = counts[k] - MAX_PER_RANK_COLOR;
        const matching = [];
        for (const [key, t] of tiles) {
          if (t.rank + t.color !== k) continue;
          // Find this cell's best candidate that points to a *missing* same-
          // color rank. Score is the candidate's confidence; if no candidate
          // matches a missing rank, score the cell as 0 here so it's picked
          // last (but might still need demoting if we run out of better
          // candidates).
          let bagMatch = null;
          if (t.candidates) {
            for (const c of t.candidates) {
              if (c.rank === t.rank) continue;
              if (missing.has(c.rank + t.color)) {
                if (!bagMatch || c.confidence > bagMatch.confidence) bagMatch = c;
              }
            }
          }
          // Fallback: any second candidate, even if it doesn't help the bag.
          const anyNext = t.candidates && t.candidates.find(c => c.rank !== t.rank);
          matching.push({
            key, t,
            score: t.score || 0,
            bagMatch,        // null when no candidate points to a missing rank
            anyNext
          });
        }
        // Sort: bag-aware matches first (descending bagMatch confidence),
        // then non-bag matches by ascending original score (weakest first).
        matching.sort((a, b) => {
          if (a.bagMatch && !b.bagMatch) return -1;
          if (!a.bagMatch && b.bagMatch) return 1;
          if (a.bagMatch && b.bagMatch) return b.bagMatch.confidence - a.bagMatch.confidence;
          return a.score - b.score;
        });
        for (let i = 0; i < Math.min(overby, matching.length); i++) {
          const { key, t, bagMatch, anyNext } = matching[i];
          const next = bagMatch || anyNext;
          if (!next) continue;
          tiles.set(key, {
            rank: next.rank,
            color: t.color,
            score: next.confidence/100,
            margin: Math.max(0, (next.confidence/100 - 0.6) * 2.5),
            candidates: (t.candidates || []).filter(c => c.rank !== next.rank)
          });
          changed = true;
        }
      }
      // Rule 1: low-confidence reads — try the next candidate if it doesn't
      // create a new over-limit problem.
      const cur = countRanks();
      for (const [key, t] of tiles) {
        if (t.rank === '?' || !t.candidates || t.candidates.length < 2) continue;
        if ((t.score || 0) * 100 >= CONF_THRESHOLD) continue;
        const next = t.candidates.find(c => c.rank !== t.rank);
        if (!next) continue;
        const nextK = next.rank + t.color;
        if ((cur[nextK] || 0) >= MAX_PER_RANK_COLOR) continue;
        // Only demote if next candidate's confidence is competitive (within 15%).
        const drop = (t.score || 0)*100 - next.confidence;
        if (drop > 15) continue;
        tiles.set(key, {
          rank: next.rank,
          color: t.color,
          score: next.confidence/100,
          margin: Math.max(0, (next.confidence/100 - 0.6) * 2.5),
          candidates: t.candidates.slice(1)
        });
        cur[nextK] = (cur[nextK] || 0) + 1;
        cur[t.rank + t.color] = (cur[t.rank + t.color] || 1) - 1;
        changed = true;
      }
      if (!changed) break;
    }
    // Last-resort accounting rule. If a (rank, color) is over by N AND another
    // same-color (rank, color) is under by N, the simplest explanation is that
    // N of the over-limit cells are actually the missing rank. The candidates
    // list from OCR might never have surfaced the right answer, but the rank
    // tally forces it. Pick the N lowest-confidence over-limit cells and
    // force-swap them to the missing rank.
    const finalCounts = countRanks();
    const overByColor = { R: [], B: [] };
    const underByColor = { R: [], B: [] };
    for (const rk of RANKS) for (const col of ['R','B']) {
      const c = finalCounts[rk + col] || 0;
      const delta = c - MAX_PER_RANK_COLOR;
      if (delta > 0) overByColor[col].push({ rank: rk, n: delta });
      else if (delta < 0) underByColor[col].push({ rank: rk, n: -delta });
    }
    for (const col of ['R','B']) {
      const over = overByColor[col], under = underByColor[col];
      if (!over.length || !under.length) continue;
      const overTotal = over.reduce((s, x) => s + x.n, 0);
      const underTotal = under.reduce((s, x) => s + x.n, 0);
      // Only act when the over/under balance is exact, so we're not guessing.
      if (overTotal !== underTotal) continue;
      // For each over-limit rank, find the N weakest cells and reassign them
      // to under-limit ranks in priority order.
      const underQueue = under.flatMap(u => Array(u.n).fill(u.rank));
      for (const o of over) {
        const matching = [];
        for (const [key, t] of tiles) {
          if (t.color === col && t.rank === o.rank) {
            matching.push({ key, t, score: t.score || 0 });
          }
        }
        matching.sort((a, b) => a.score - b.score);
        for (let i = 0; i < o.n && underQueue.length; i++) {
          const { key, t } = matching[i];
          const newRank = underQueue.shift();
          tiles.set(key, {
            rank: newRank,
            color: t.color,
            score: t.score || 0,
            // Flag forced swaps so the user can verify them.
            margin: 0,
            candidates: t.candidates || []
          });
        }
      }
    }
  }
  // Combine candidate lists from multiple PSM passes into a single ranked list.
  // For each rank, we sum its confidence across all passes (one entry per pass
  // if present), plus a small agreement bonus for showing up in multiple passes.
  // Returns [{rank, confidence}, ...] sorted by aggregate score descending.
  function voteCandidates(candidateLists) {
    const best = {};           // rank -> highest confidence seen
    const appearances = {};    // rank -> count of passes that produced it
    for (const list of candidateLists) {
      if (!list || !list.length) continue;
      const seen = new Set();
      for (const cand of list) {
        if (cand.rank === '?' || seen.has(cand.rank)) continue;
        seen.add(cand.rank);
        const c = cand.confidence || 0;
        if (!(cand.rank in best) || c > best[cand.rank]) best[cand.rank] = c;
        appearances[cand.rank] = (appearances[cand.rank] || 0) + 1;
      }
    }
    const ranks = Object.keys(best);
    if (!ranks.length) return [];
    // Confidence = the BEST score seen across passes (not the mean). One
    // strong read is real signal; averaging it with weaker reads from other
    // PSMs hides that. The agreement bonus still rewards consensus when
    // multiple passes return the same rank.
    const aggregate = ranks.map(rank => {
      const peak = best[rank];
      const appears = appearances[rank];
      const bonus = peak * 0.08 * (appears - 1);
      return { rank, confidence: Math.min(100, peak + bonus), appears };
    });
    aggregate.sort((a, b) => b.confidence - a.confidence);
    return aggregate;
  }
  // Run OCR over every occupied cell. Each result updates the map and re-renders.
  async function recogniseAll(){
    const worker = await initOCR();
    const queue = geom.cells.slice();
    const total = queue.length;
    let done = 0;
    setOcrProgress(0, total);
    // Voting pass: for every cell, run Tesseract with multiple PSMs (10 single
    // char, 7 single line, 8 single word, 13 raw line). Each is essentially a
    // different recognition strategy. Aggregate candidates by confidence-
    // weighted vote — this catches cells where one PSM was wrong but high-
    // confidence, by giving the consensus read more weight.
    const PSM_PASSES = ['10', '7', '8', '13'];
    const cellCandidates = new Map();        // "r_c" -> [{rank, confidence}, ...]
    for (const cell of queue) {
      const canv = KC.cellGlyphCanvas(imgData, geom.rb, geom.cb, cell.r, cell.c);
      if (!canv) { done++; setOcrProgress(done, total); continue; }
      const lists = [];
      const shapeHint = shapeDisambiguate(canv);
      for (const psm of PSM_PASSES) {
        try {
          await worker.setParameters({ tessedit_pageseg_mode: psm });
          const { data } = await worker.recognize(canv);
          const cands = extractCandidates(data, 4);
          if (shapeHint) reorderForShapeHint(cands, shapeHint);
          lists.push(cands);
        } catch (e) {
          // Per-cell OCR failures are rare and recoverable (other PSM passes
          // and the lenient retry usually cover them); suppress logs in
          // production. Re-enable if debugging recognition.

        }
      }
      const voted = voteCandidates(lists);
      cellCandidates.set(cell.r+'_'+cell.c, voted);
      const top = voted[0] || { rank: '?', confidence: 0 };
      const conf = top.confidence/100;
      const margin = (top.rank === '?') ? 0 : Math.max(0, (conf - 0.6) * 2.5);
      const cur = tiles.get(cell.r+'_'+cell.c) || {color: cell.color};
      tiles.set(cell.r+'_'+cell.c, {rank: top.rank, color: cur.color, score: conf, margin, candidates: voted});
      done++;
      setOcrProgress(done, total);
      if (done % 4 === 0 || done === total) {
        renderBoard(); renderOverlay(); recompute();
      }
    }
    // Restore PSM 10 for any subsequent passes.
    await worker.setParameters({ tessedit_pageseg_mode: '10' });
    // Second OCR pass: PSM 10 is a single character; PSM 7 is a single text
    // line. PSM 7 sometimes recovers reads that PSM 10 gave up on. Only retry
    // cells that came back as '?'.
    const stragglers = queue.filter(cell => {
      const t = tiles.get(cell.r+'_'+cell.c);
      return t && t.rank === '?';
    });
    if (stragglers.length) {
      setOcrProgress(0, stragglers.length, 'Retrying');
      await worker.setParameters({ tessedit_pageseg_mode: '7' });
      let s = 0;
      for (const cell of stragglers) {
        const canv = KC.cellGlyphCanvas(imgData, geom.rb, geom.cb, cell.r, cell.c);
        if (canv) {
          try {
            const { data } = await worker.recognize(canv);
            const shapeHint = shapeDisambiguate(canv);
            const cands = extractCandidates(data, 4);
            if (shapeHint) reorderForShapeHint(cands, shapeHint);
            const top = cands[0] || { rank: '?', confidence: 0 };
            if (top.rank !== '?') {
              const conf = top.confidence/100;
              const margin = Math.max(0, (conf - 0.6) * 2.5);
              const cur = tiles.get(cell.r+'_'+cell.c) || {color: cell.color};
              tiles.set(cell.r+'_'+cell.c, {rank: top.rank, color: cur.color, score: conf, margin, candidates: cands});
            }
          } catch (e) {
            // ignore — lenient retry will get another shot
          }
        }
        s++;
        setOcrProgress(s, stragglers.length, 'Retrying');
        if (s % 4 === 0 || s === stragglers.length) {
          renderBoard(); renderOverlay(); recompute();
        }
      }
      // Restore PSM 10 for any future runs in this session.
      await worker.setParameters({ tessedit_pageseg_mode: '10' });
    }
    // Third OCR pass: relax the whitelist on cells still marked ?. Tesseract
    // sometimes rejects a glyph because its top hypothesis is a letter that
    // the whitelist filters out (e.g. "O" for Q, "S" for 5). By letting any
    // alphanumeric through and then mapping common confusions back to ranks,
    // we recover those cells.
    const lenientStragglers = queue.filter(cell => {
      const t = tiles.get(cell.r+'_'+cell.c);
      return t && t.rank === '?';
    });
    if (lenientStragglers.length) {
      window.__kcMisses = [];
      setOcrProgress(0, lenientStragglers.length, 'Lenient retry');
      await worker.setParameters({
        tessedit_char_whitelist: '',                    // empty → no filter
        tessedit_pageseg_mode: '7'
      });
      let s = 0;
      for (const cell of lenientStragglers) {
        const canv = KC.cellGlyphCanvas(imgData, geom.rb, geom.cb, cell.r, cell.c);
        if (canv) {
          try {
            const { data } = await worker.recognize(canv);
            const raw = (data.text || '').trim();
            const rank = mapTokenLenient(raw);
            // Log what Tesseract returned so we can see what mappings are
            // still missing for cells that won't recognize. Visible only
            // in DevTools; not user-facing.
            if (rank === '?') {
              window.__kcMisses = window.__kcMisses || [];
              window.__kcMisses.push({
                cell: cell.r+'_'+cell.c,
                color: cell.color,
                raw: raw,
                conf: data.confidence
              });
            }
            if (rank !== '?') {
              const conf = (data.confidence || 0) / 100;
              // Trust the lenient mapping: if we got here via a letter→rank
              // confusion table we have high reason to believe it's right.
              // Use Tesseract's own confidence directly and only flag if
              // it's actually low.
              const margin = Math.max(0, (conf - 0.6) * 2.5);
              const cur = tiles.get(cell.r+'_'+cell.c) || {color: cell.color};
              tiles.set(cell.r+'_'+cell.c, {
                rank, color: cur.color, score: conf, margin,
                candidates: [{rank, confidence: data.confidence || 0}]
              });
            }
          } catch (e) {
            // ignore — cell stays unrecognised, user can fix manually
          }
        }
        s++;
        setOcrProgress(s, lenientStragglers.length, 'Lenient retry');
        if (s % 4 === 0 || s === lenientStragglers.length) {
          renderBoard(); renderOverlay(); recompute();
        }
      }
      // Restore the whitelist and PSM mode for next time.
      await worker.setParameters({
        tessedit_char_whitelist: 'A234567890JQK',
        tessedit_pageseg_mode: '10'
      });
      // Lenient-pass misses are stashed on window.__kcMisses for debugging
      // via the browser console — no user-facing UI.
    }
    // Final pass: constraint-solver. Demote over-limit / low-confidence reads
    // to their next candidate when one's available.
    runConstraintSolver();
    renderBoard(); renderOverlay(); recompute();
    setOcrProgress(null);
  }
  function setOcrProgress(done, total, label){
    const el = $('#kc-ocr-progress');
    if (!el) return;
    if (done == null) { el.hidden = true; return; }
    el.hidden = false;
    const prefix = label || 'Reading tiles';
    el.textContent = total ? `${prefix}… ${done}/${total}` : `${prefix}…`;
  }

  // ---- image -> board ----
  function handleImage(srcImg){
    const maxSide=1600, nw=srcImg.naturalWidth||srcImg.width, nh=srcImg.naturalHeight||srcImg.height;
    const s=Math.min(1,maxSide/Math.max(nw,nh)), w0=Math.round(nw*s), h0=Math.round(nh*s);
    // First pass: resample to working size.
    const cv0=document.createElement('canvas'); cv0.width=w0; cv0.height=h0;
    cv0.getContext('2d').drawImage(srcImg,0,0,w0,h0);
    const id0=cv0.getContext('2d').getImageData(0,0,w0,h0);
    // Find the felt bounding box and crop to it. From here on, the cropped
    // canvas IS the board: detection, display, and overlay positioning all
    // share the same coordinate space, so alignment is automatic.
    const bb = KC.feltBBox({data:id0.data,width:w0,height:h0});
    const cw = bb.x1-bb.x0+1, ch = bb.y1-bb.y0+1;
    const cv=document.createElement('canvas'); cv.width=cw; cv.height=ch;
    cv.getContext('2d').drawImage(cv0, bb.x0, bb.y0, cw, ch, 0, 0, cw, ch);
    const id=cv.getContext('2d').getImageData(0,0,cw,ch);
    imgCanvas = cv; imgData = {data:id.data,width:cw,height:ch};
    const res = KC.readBoard(imgData);
    geom=res; imgW=cw; imgH=ch;
    tiles.clear();
    res.cells.forEach(t=>tiles.set(t.r+'_'+t.c,{rank:t.rank,color:t.color,score:t.score,margin:t.margin}));
    // play area: drop fully-empty border rows/cols, keep interior
    const rs=res.cells.map(t=>t.r), cs=res.cells.map(t=>t.c);
    const r0=Math.min(...rs), r1=Math.max(...rs), c0=Math.min(...cs), c1=Math.max(...cs);
    displayRows=[]; for(let r=r0;r<=r1;r++) displayRows.push(r);
    displayCols=[]; for(let c=c0;c<=c1;c++) displayCols.push(c);
    $('#kc-overlay-img').src = cv.toDataURL('image/png');
    $('#kc-drop').hidden=true; $('#kc-boardbox').hidden=false; $('#kc-panel').hidden=false;
    applyViewMode();
    renderBoard(); renderOverlay(); renderGrid(); recompute();
    // Kick off OCR in the background.
    recogniseAll().catch(e => { console.error('OCR pass failed', e); setOcrProgress(null); });
  }

  function tileEl(rank,color){
    const t=document.createElement('div');
    t.className='kc-tile'+(color==='R'?' kc-red':'')+(rank==='10'?' kc-ten':'');
    t.textContent=rank; return t;
  }
  // Build the set of (rank+color) keys that are currently OVER the 4-per-color
  // cap. Used to drive flag rendering: confidence percentages don't trigger
  // flags on their own — only consistency problems do.
  function overflowedRankColorSet(){
    const counts = {};
    for (const [, t] of tiles) {
      if (!t || t.rank === '?') continue;
      const k = t.rank + t.color;
      counts[k] = (counts[k] || 0) + 1;
    }
    const over = new Set();
    for (const k in counts) if (counts[k] > 4) over.add(k);
    return over;
  }
  function renderBoard(){
    const b=$('#kc-board'); b.innerHTML='';
    b.style.gridTemplateColumns='repeat('+displayCols.length+',minmax(0,1fr))';
    const overSet = overflowedRankColorSet();
    for(const r of displayRows) for(const c of displayCols){
      const key=r+'_'+c, t=tiles.get(key);
      const cell=document.createElement('button');
      const shouldFlag = t && (t.rank==='?' || overSet.has(t.rank + t.color));
      cell.className='kc-cell'+(t?'':' kc-empty')+(shouldFlag?' kc-flag':'');
      cell.dataset.key=key;
      if(t) cell.appendChild(tileEl(t.rank,t.color));
      cell.addEventListener('click',e=>{e.stopPropagation(); openEditor(cell,key);});
      b.appendChild(cell);
    }
  }

  function renderOverlay(){
    const layer=$('#kc-overlay-tiles'); if(!layer) return;
    layer.innerHTML='';
    if(!geom||!geom.rb||!geom.cb||!imgW||!imgH) return;
    const rb=geom.rb, cb=geom.cb;
    const overSet = overflowedRankColorSet();
    for(const r of displayRows) for(const c of displayCols){
      const key=r+'_'+c, t=tiles.get(key);
      const y0=rb[r], y1=rb[r+1], x0=cb[c], x1=cb[c+1];
      if(y0==null||y1==null||x0==null||x1==null) continue;
      // Skip degenerate cells (would render as huge boxes when indices are off).
      const cellW=x1-x0, cellH=y1-y0;
      if(cellW<=0||cellH<=0||cellW>imgW*0.5||cellH>imgH*0.5) continue;
      const cell=document.createElement('button');
      let cls='kc-ocell';
      if(!t) cls+=' kc-empty';
      if(t && t.color==='R') cls+=' kc-red';
      // Unrecognised tile → its own class so we can tint it differently from
      // over-limit flags (yellow wash vs orange ring).
      if(t && t.rank==='?') cls+=' kc-unknown';
      else if(t && overSet.has(t.rank + t.color)) cls+=' kc-flag';
      cell.className=cls;
      cell.dataset.key=key;
      cell.style.left   = (x0/imgW*100)+'%';
      cell.style.top    = (y0/imgH*100)+'%';
      cell.style.width  = ((x1-x0)/imgW*100)+'%';
      cell.style.height = ((y1-y0)/imgH*100)+'%';
      if(t){
        // Render the rank as a small corner badge instead of a full-cell
        // overlay so the source tile underneath stays legible. Sizing
        // (clamp + cqw) is handled in CSS so the badge scales with the
        // rendered overlay width, not the source-image pixels.
        const badge=document.createElement('span');
        badge.className='kc-ocell-badge'+(t.rank==='10'?' kc-ten':'');
        badge.textContent=t.rank;
        cell.appendChild(badge);
      }
      cell.addEventListener('click',e=>{e.stopPropagation(); openEditor(cell,key);});
      layer.appendChild(cell);
    }
  }

  function applyViewMode(){
    const isOverlay = viewMode==='overlay';
    $('#kc-overlay').hidden = !isOverlay;
    $('#kc-board').hidden   = isOverlay;
    $('#kc-viewopts').hidden = !isOverlay;
    document.querySelectorAll('.kc-mode').forEach(b=>{
      const on = b.dataset.mode===viewMode;
      b.classList.toggle('kc-mode-on', on);
      b.setAttribute('aria-selected', on?'true':'false');
    });
  }

  function renderGrid(){
    const svg=$('#kc-overlay-grid'); if(!svg) return;
    svg.innerHTML='';
    if(!geom||!geom.rb||!geom.cb||!imgW||!imgH) return;
    svg.setAttribute('viewBox', '0 0 '+imgW+' '+imgH);
    const ns='http://www.w3.org/2000/svg';
    // Cell gridlines (cyan) across the cropped board image.
    for(const y of geom.rb){
      const ln=document.createElementNS(ns,'line');
      ln.setAttribute('x1', 0); ln.setAttribute('x2', imgW);
      ln.setAttribute('y1', y); ln.setAttribute('y2', y);
      svg.appendChild(ln);
    }
    for(const x of geom.cb){
      const ln=document.createElementNS(ns,'line');
      ln.setAttribute('y1', 0); ln.setAttribute('y2', imgH);
      ln.setAttribute('x1', x); ln.setAttribute('x2', x);
      svg.appendChild(ln);
    }
  }

  // ---- editor popover ----
  let pop=null, popKeyHandler=null;
  function closeEditor(){
    if(pop){ pop.remove(); pop=null; document.removeEventListener('click',closeEditor); }
    if(popKeyHandler){ document.removeEventListener('keydown',popKeyHandler); popKeyHandler=null; }
  }
  // Keyboard shortcut → rank. a/1=A, 2-9 digits, 0/t=10, j=J, q=Q, k=K.
  const RANK_KEYS = {
    'a':'A','A':'A','1':'A',
    '2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '0':'10','t':'10','T':'10',
    'j':'J','J':'J',
    'q':'Q','Q':'Q',
    'k':'K','K':'K'
  };
  function openEditor(cell,key){
    closeEditor();
    const cur=tiles.get(key)||{rank:null,color:'B'};
    let color=cur.color||'B';
    pop=document.createElement('div'); pop.className='kc-pop';
    const seg=document.createElement('div'); seg.className='kc-seg';
    ['R','B'].forEach(c=>{ const bn=document.createElement('button'); bn.dataset.c=c;
      bn.textContent=c==='R'?'Red':'Black'; if(c===color)bn.classList.add('kc-on');
      bn.onclick=ev=>{ev.stopPropagation(); color=c;
        seg.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-on',x.dataset.c===c));
        repaintRanks();};
      seg.appendChild(bn); });
    pop.appendChild(seg);
    const ranks=document.createElement('div'); ranks.className='kc-ranks';
    function repaintRanks(){ ranks.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-red',color==='R')); }
    RANKS.forEach(rk=>{ const bn=document.createElement('button'); bn.textContent=rk;
      bn.onclick=ev=>{ev.stopPropagation(); tiles.set(key,{rank:rk,color,score:1}); refresh();};
      ranks.appendChild(bn); });
    pop.appendChild(ranks); repaintRanks();
    const hint=document.createElement('div'); hint.className='kc-pop-hint';
    hint.textContent='1/A · 2–9 · 0/T=10 · J/Q/K · R/B color · Del clear';
    pop.appendChild(hint);
    const clr=document.createElement('button'); clr.className='kc-clear'; clr.textContent='Clear square';
    clr.onclick=ev=>{ev.stopPropagation(); tiles.delete(key); refresh();};
    pop.appendChild(clr);
    document.body.appendChild(pop);
    const r=cell.getBoundingClientRect(); const pw=218, ph=pop.offsetHeight;
    let x=r.left+window.scrollX+r.width/2-pw/2;
    x=Math.max(10+window.scrollX, Math.min(x, window.scrollX+document.documentElement.clientWidth-pw-10));
    let y=r.bottom+window.scrollY+8;
    if(r.bottom+ph+12>window.innerHeight) y=r.top+window.scrollY-ph-8;
    pop.style.left=x+'px'; pop.style.top=y+'px';
    popKeyHandler = (e)=>{
      if(e.key==='Escape'){ e.preventDefault(); closeEditor(); return; }
      if(e.key==='Backspace'||e.key==='Delete'){
        e.preventDefault(); tiles.delete(key); refresh(); return;
      }
      if(e.key==='r'||e.key==='R'){
        e.preventDefault(); color='R';
        seg.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-on',x.dataset.c==='R'));
        repaintRanks(); return;
      }
      if(e.key==='b'||e.key==='B'){
        e.preventDefault(); color='B';
        seg.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-on',x.dataset.c==='B'));
        repaintRanks(); return;
      }
      const rk = RANK_KEYS[e.key];
      if(rk){
        e.preventDefault();
        tiles.set(key,{rank:rk,color,score:1});
        refresh();
      }
    };
    setTimeout(()=>{
      document.addEventListener('click',closeEditor);
      document.addEventListener('keydown',popKeyHandler);
    },0);
  }
  function refresh(){ closeEditor(); renderBoard(); renderOverlay(); recompute(); }

  // ---- remaining ----
  function recompute(){
    const shared=$('#kc-pool69').checked;
    const cells=[...tiles.values()];
    const out=KC.remaining(cells, shared);
    $('#kc-placed').textContent=out.placedCount;
    $('#kc-fill').style.width=(out.placedCount/104*100).toFixed(1)+'%';

    const wrap=$('#kc-remtiles'); wrap.innerHTML='';
    const note=$('#kc-emptynote');
    const items=[];
    for(const rk of RANKS){
      if(shared && (rk==='6'||rk==='9')) continue;
      for(const col of ['R','B']){ const n=out.rem[rk+col]; if(n>0) items.push({rk,col,n}); }
    }
    if(shared && out.pool){
      if(out.pool.redLeft>0)   items.push({rk:'6',col:'R',n:out.pool.redLeft, pool:true});
      if(out.pool.blackLeft>0) items.push({rk:'6',col:'B',n:out.pool.blackLeft, pool:true});
    }
    if(items.length===0){
      note.hidden=false;
      note.textContent = out.placedCount>=104 ? 'Every tile is on the board.' : 'No tiles left to draw.';
    } else {
      note.hidden=true;
      for(const it of items){
        const m=document.createElement('div'); m.className='kc-mini'+(it.pool?' kc-pool':'');
        m.appendChild(tileEl(it.rk,it.col));
        if(it.pool){ m.title='Reversible 6-or-9 tile'; }
        if(it.n>1){ const n=document.createElement('span'); n.className='kc-n'; n.textContent='×'+it.n; m.appendChild(n); }
        wrap.appendChild(m);
      }
    }

    const warn=$('#kc-warn'); warn.innerHTML='';
    if(out.over.length){
      const d=document.createElement('div'); d.className='kc-warn';
      const parts=out.over.map(o=>o.n+' extra '+(o.color==='R'?'red':'black')+' '+o.rank);
      d.innerHTML='<b>Check the board —</b> more tiles placed than exist ('+parts.join(', ')+
                  '). A rank was probably mis-read; tap those squares to fix.';
      warn.appendChild(d);
    }
  }

  // ---- input wiring ----
  function fileToImage(file){
    if(!file||!file.type.startsWith('image/')) return;
    const url=URL.createObjectURL(file), im=new Image();
    im.onload=()=>{handleImage(im); URL.revokeObjectURL(url);};
    im.src=url;
  }
  const drop=$('#kc-drop');
  drop.onclick=()=>$('#kc-file').click();
  drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); $('#kc-file').click();}};
  $('#kc-file').onchange=e=>fileToImage(e.target.files[0]);
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault(); drop.classList.add('kc-over');}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault(); drop.classList.remove('kc-over');}));
  drop.addEventListener('drop',e=>fileToImage(e.dataTransfer.files[0]));
  window.addEventListener('paste',e=>{ for(const it of e.clipboardData.items) if(it.type.startsWith('image/')) fileToImage(it.getAsFile()); });
  $('#kc-pool69').onchange=recompute;
  $('#kc-another').onclick=()=>{ $('#kc-boardbox').hidden=true; $('#kc-panel').hidden=true; $('#kc-drop').hidden=false; $('#kc-file').value=''; };
  // Debug: open a new window showing every preprocessed cell crop so we can
  // compare what Tesseract is actually seeing for each cell. Cells are sorted
  // by detected rank/color so visually-identical glyphs end up adjacent.
  // Hidden in production but kept around for future debug surfacing.
  const exportBtn = $('#kc-export-crops');
  if (exportBtn) exportBtn.onclick = () => {
    if (!geom || !imgData) return;
    const rows = [];
    for (const cell of geom.cells) {
      const key = cell.r + '_' + cell.c;
      const t = tiles.get(key);
      const canv = KC.cellGlyphCanvas(imgData, geom.rb, geom.cb, cell.r, cell.c);
      if (!canv) continue;
      rows.push({
        key,
        rank: t ? t.rank : '?',
        color: t ? t.color : cell.color,
        score: t && t.score ? Math.round(t.score*100) : 0,
        dataUrl: canv.toDataURL('image/png')
      });
    }
    rows.sort((a, b) => {
      const ra = a.rank, rb = b.rank;
      if (ra === rb) return a.color.localeCompare(b.color) || a.key.localeCompare(b.key);
      if (ra === '?') return 1;
      if (rb === '?') return -1;
      return ra.localeCompare(rb);
    });
    const html = `<!DOCTYPE html><html><head><title>KC glyph crops</title>
<style>
  body { font-family: system-ui, sans-serif; background: #222; color: #eee; padding: 16px; }
  h1 { font-weight: 600; font-size: 18px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
  .cell { background: #333; border-radius: 6px; padding: 8px; text-align: center; font-size: 12px; }
  .cell img { width: 120px; height: 120px; image-rendering: pixelated; background: #fff; border-radius: 4px; }
  .cell .lbl { margin-top: 6px; font-family: monospace; }
  .red { color: #ff6b6b; }
  .unk { color: #ffd23f; }
</style></head><body>
<h1>${rows.length} cells — sorted by detected rank. Click a tile to see filename.</h1>
<div class="grid">
${rows.map(r => {
  const cls = r.rank === '?' ? 'unk' : (r.color === 'R' ? 'red' : '');
  return `<div class="cell"><img src="${r.dataUrl}" title="${r.key}"><div class="lbl ${cls}">${r.rank}${r.color} · ${r.key} · ${r.score}%</div></div>`;
}).join('')}
</div></body></html>`;
    const w = window.open('', '_blank');
    if (!w) { alert('Popup blocked — allow popups for this page'); return; }
    w.document.write(html);
    w.document.close();
  };

  // ---- view mode + opacity ----
  document.querySelectorAll('.kc-mode').forEach(b=>{
    b.addEventListener('click', ()=>{ viewMode = b.dataset.mode; applyViewMode(); });
  });
  const opacityEl = $('#kc-opacity'), tilesLayer = $('#kc-overlay-tiles');
  function applyOpacity(){ tilesLayer.style.opacity = (opacityEl.value/100).toFixed(2); }
  opacityEl.addEventListener('input', applyOpacity);
  applyOpacity();
  const gridChk = $('#kc-show-grid');
  if (gridChk) gridChk.addEventListener('change', e=>{
    $('#kc-overlay').classList.toggle('kc-show-grid', e.target.checked);
  });

  // Tesseract initialises on first image drop.
})();
