/* King's Cribbage core: pixels -> board -> remaining tiles.
   Pure functions. No DOM. `img` = {data:RGBA bytes, width, height}.
   Used both by the Node test harness and the browser app. */
(function (root) {
  'use strict';
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const COPIES = 4;          // per colour, per rank
  const G = 44;              // glyph normalisation size

  const greenAt = (d, i) => d[i+1] - (d[i] + d[i+2]) / 2;

  // ---- renderer-agnostic 13×13 grid finder ------------------------------
  // The board is the only place on screen with 14 evenly-spaced horizontal
  // edges AND 14 evenly-spaced vertical edges. We search both 1D gradient
  // profiles for the (pitch, origin) that maximises the sum of gradient
  // intensity at the predicted 14 line positions. Theme-independent: works
  // regardless of felt color, tile color, or whether the board is cropped or
  // surrounded by UI chrome.
  function gradientProfiles(img) {
    const { data, width: W, height: H } = img;
    // Use luminance for the gradient. Take a coarse stride to keep this O(n)
    // even on huge screenshots — gridline structure survives subsampling.
    const stride = Math.max(1, Math.min(W, H) >> 9);  // ≥1 px, ≈1 per 512 px
    const colGrad = new Float64Array(W);
    const rowGrad = new Float64Array(H);
    const lumAt = (i) => 0.30 * data[i] + 0.59 * data[i+1] + 0.11 * data[i+2];
    // Vertical edges → energy per column. dI/dx integrated over y.
    for (let y = 0; y < H; y += stride) {
      let prev = lumAt(y * W * 4);
      for (let x = 1; x < W; x++) {
        const cur = lumAt((y * W + x) * 4);
        colGrad[x] += Math.abs(cur - prev);
        prev = cur;
      }
    }
    // Horizontal edges → energy per row. dI/dy integrated over x.
    for (let x = 0; x < W; x += stride) {
      let prev = lumAt(x * 4);
      for (let y = 1; y < H; y++) {
        const cur = lumAt((y * W + x) * 4);
        rowGrad[y] += Math.abs(cur - prev);
        prev = cur;
      }
    }
    return { colGrad, rowGrad };
  }
  // Score a (pitch, origin) hypothesis on a 1D gradient profile: sum the
  // gradient intensity in a small window around each of the 14 predicted
  // gridlines. Higher = more grid-like. Window is ±3 px to forgive rounding.
  function scoreGridHypothesis(prof, origin, pitch, n) {
    let s = 0;
    for (let k = 0; k <= n; k++) {
      const c = origin + k * pitch;
      const lo = Math.max(0, Math.round(c - 3));
      const hi = Math.min(prof.length - 1, Math.round(c + 3));
      let best = 0;
      for (let i = lo; i <= hi; i++) if (prof[i] > best) best = prof[i];
      s += best;
    }
    return s;
  }
  // Search for the best (pitch, origin) on a single 1D profile, given a pitch
  // range. Returns {origin, pitch, score, lines}.
  function bestGrid1D(prof, pitchMin, pitchMax, n) {
    const L = prof.length;
    let best = { origin: 0, pitch: pitchMin, score: -1, lines: [] };
    // Pitch step ≈ 1 px is fine; profile is short. Origin only needs to cover
    // one full pitch (the rest is periodic).
    for (let pitch = pitchMin; pitch <= pitchMax; pitch += 1) {
      const need = 13 * pitch;
      if (need >= L) break;
      const oMax = L - 1 - need;
      for (let origin = 0; origin <= oMax; origin += 1) {
        const s = scoreGridHypothesis(prof, origin, pitch, n);
        if (s > best.score) best = { origin, pitch, score: s, lines: null };
      }
    }
    if (best.score > 0) {
      // Each true cell boundary in the source image is rendered as a *cluster*
      // of strong gradient peaks (outer felt edge, white tile border edge,
      // inner tile body edge — sometimes 3-4 peaks within ~15 px). Picking
      // the single strongest peak in the cluster gives a position offset
      // toward the tile interior, biasing the whole grid. Instead, take the
      // gradient-weighted centroid across a wider window: that averages over
      // the peak cluster and lands on the actual mid-boundary.
      const winR = Math.max(6, Math.round(best.pitch * 0.12));
      best.lines = [];
      for (let k = 0; k <= n; k++) {
        const c = best.origin + k * best.pitch;
        const lo = Math.max(0, Math.round(c - winR));
        const hi = Math.min(prof.length - 1, Math.round(c + winR));
        let wSum = 0, vSum = 0;
        for (let i = lo; i <= hi; i++) {
          // Only contribute pixels that are local maxima (peaks), not flat
          // gradient regions. Use prof[i]^2 to weight strong peaks more.
          const isPeak = (i === 0 || prof[i] >= prof[i - 1]) && (i === prof.length - 1 || prof[i] >= prof[i + 1]);
          if (!isPeak) continue;
          const w = prof[i] * prof[i];
          wSum += w * i;
          vSum += w;
        }
        const snapped = vSum > 0 ? wSum / vSum : c;
        best.lines.push(Math.round(snapped));
      }
    }
    return best;
  }
  // Find the playable 13×13 grid in an arbitrary image (cropped board, full
  // app screenshot, dark theme, light theme). Returns the bounding rectangle
  // plus row/col line positions in image coordinates. Cells are assumed
  // roughly square: we search 2D by tying pitchY to pitchX within a tolerance.
  function findBoardGrid(img, n = 13) {
    const { colGrad, rowGrad } = gradientProfiles(img);
    const W = img.width, H = img.height;
    // Pitch range: cells can be as small as ~min/30 (board is a small region
    // of the image) or as large as ~min/13 (board fills the image exactly).
    const minDim = Math.min(W, H);
    const pitchMin = Math.max(8, Math.floor(minDim / 30));
    const pitchMax = Math.floor(minDim / 13);
    const bx = bestGrid1D(colGrad, pitchMin, pitchMax, n);
    const by = bestGrid1D(rowGrad, pitchMin, pitchMax, n);
    // The two pitches should agree (square cells). If they disagree by more
    // than 10%, re-search the weaker axis constrained to ±5% of the stronger
    // pitch — this rescues axes whose dominant signal isn't from the board.
    const pitchAvg = (bx.pitch + by.pitch) / 2;
    const disagreement = Math.abs(bx.pitch - by.pitch) / pitchAvg;
    let fx = bx, fy = by;
    if (disagreement > 0.10) {
      const anchor = (bx.score >= by.score) ? bx : by;
      const lo = Math.max(pitchMin, Math.round(anchor.pitch * 0.95));
      const hi = Math.min(pitchMax, Math.round(anchor.pitch * 1.05));
      if (bx.score >= by.score) fy = bestGrid1D(rowGrad, lo, hi, n);
      else fx = bestGrid1D(colGrad, lo, hi, n);
    }
    if (!fx.lines || !fy.lines) return null;
    const x0 = fx.lines[0], x1 = fx.lines[fx.lines.length - 1];
    const y0 = fy.lines[0], y1 = fy.lines[fy.lines.length - 1];
    return {
      x0, y0, x1, y1,
      cb: fx.lines.map(v => v - x0),  // column boundaries, cropped-board coords
      rb: fy.lines.map(v => v - y0),  // row boundaries
      pitchX: fx.pitch, pitchY: fy.pitch,
      scoreX: fx.score, scoreY: fy.score,
    };
  }

  // ---- renderer-agnostic cell classification ----------------------------
  // For each cell on the detected grid, sample interior pixels and produce a
  // mean RGB. Empty cells cluster around the felt color; occupied cells split
  // into light and dark tile classes. We do this in two passes so the
  // thresholds are calibrated from the image itself, not hard-coded.
  function sampleCellMeans(img, rb, cb) {
    const { data, width: W } = img;
    const nrows = rb.length - 1, ncols = cb.length - 1;
    const means = [];   // [{r, c, R, G, B, lumVar}], one per cell
    for (let r = 0; r < nrows; r++) for (let c = 0; c < ncols; c++) {
      const y0 = rb[r], y1 = rb[r+1], x0 = cb[c], x1 = cb[c+1];
      const h = y1 - y0, w = x1 - x0;
      // Sample the central 60% to avoid the cell-border/grid line ring.
      const iy0 = y0 + (h*0.2|0), iy1 = y1 - (h*0.2|0);
      const ix0 = x0 + (w*0.2|0), ix1 = x1 - (w*0.2|0);
      let sR = 0, sG = 0, sB = 0, sLum = 0, sLumSq = 0, n = 0;
      for (let y = iy0; y < iy1; y++) for (let x = ix0; x < ix1; x++) {
        const i = (y * W + x) * 4;
        const R = data[i], G = data[i+1], B = data[i+2];
        const lum = 0.30 * R + 0.59 * G + 0.11 * B;
        sR += R; sG += G; sB += B;
        sLum += lum; sLumSq += lum * lum;
        n++;
      }
      if (n === 0) continue;
      const lumMean = sLum / n;
      // Intra-cell luminance variance. Empty (felt-only) cells have very low
      // variance (uniform colour). Occupied cells have a glyph and so high
      // variance.
      const lumVar = Math.max(0, sLumSq / n - lumMean * lumMean);
      means.push({ r, c, R: sR / n, G: sG / n, B: sB / n, lumVar });
    }
    return means;
  }
  function median(arr) {
    if (!arr.length) return 0;
    const s = arr.slice().sort((a, b) => a - b);
    return s[s.length >> 1];
  }
  function rgbDist(a, b) {
    const dR = a.R - b.R, dG = a.G - b.G, dB = a.B - b.B;
    return Math.sqrt(dR*dR + dG*dG + dB*dB);
  }
  // Classify each grid cell into {felt, lightTile, darkTile}. The renderer is
  // unknown — there's no fixed colour to test against. So:
  //   1. Felt colour = median RGB across all cells. (Most cells are usually
  //      empty; the median is robust to up-to-50% occupancy.)
  //   2. Occupancy = distance from felt > Otsu-style cutoff on the distance
  //      histogram.
  //   3. Light vs dark = split occupied cells by luminance at the midpoint of
  //      the two cluster centres (1-D k-means with k=2).
  function classifyCells(img, rb, cb) {
    const means = sampleCellMeans(img, rb, cb);
    if (!means.length) return { cells: [], palette: null };
    // Step 1: felt colour from low-intra-cell-variance cells. Empty cells
    // contain only felt and so have very small intra-cell luminance variance;
    // occupied cells contain a glyph and so high variance. We sort cells by
    // variance and take the median RGB of the bottom 25% as the felt colour.
    // This is robust even when most cells are occupied (a full-board game) —
    // some cells will still be empty, and they're the ones with lowest
    // variance. Using the bottom 25% (not the absolute minimum) keeps the
    // estimate noise-tolerant.
    const sortedByVar = means.slice().sort((a, b) => a.lumVar - b.lumVar);
    const feltSample = sortedByVar.slice(0, Math.max(4, Math.ceil(sortedByVar.length * 0.25)));
    const felt = {
      R: median(feltSample.map(m => m.R)),
      G: median(feltSample.map(m => m.G)),
      B: median(feltSample.map(m => m.B)),
    };
    // Step 2: occupancy threshold via Otsu on the distance distribution.
    const dists = means.map(m => rgbDist(m, felt));
    // Build a 256-bin histogram (clip distance to 0..255).
    const hist = new Uint32Array(256);
    for (const d of dists) hist[Math.min(255, d | 0)]++;
    let total = dists.length, sum = 0;
    for (let i = 0; i < 256; i++) sum += i * hist[i];
    let wB = 0, sumB = 0, bestVar = -1, bestT = 24;
    for (let t = 0; t < 256; t++) {
      wB += hist[t]; if (wB === 0) continue;
      const wF = total - wB; if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB, mF = (sum - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > bestVar) { bestVar = v; bestT = t; }
    }
    // Guard rail: if Otsu picks a tiny threshold the felt itself is noisy.
    // Require at least a moderate distance to call a cell occupied.
    const occThresh = Math.max(24, bestT);
    const occupied = [], empty = [];
    for (let i = 0; i < means.length; i++) {
      (dists[i] >= occThresh ? occupied : empty).push(means[i]);
    }
    // Step 3: split occupied cells into two colour classes. We don't know
    // ahead of time which channel separates them — black/cream tiles split on
    // luminance, red/black tiles split on red-channel saturation, brown/cream
    // tiles split on both. So k-means in 3-D RGB on the occupied cells: pick
    // the two cells whose mutual distance is largest as the initial seeds,
    // then iterate. Renderer-agnostic.
    let cells;
    let palette = { felt, light: null, dark: null };
    if (occupied.length === 0) {
      cells = means.map(m => ({ r: m.r, c: m.c, occupied: false, color: 'B' }));
    } else if (occupied.length === 1) {
      // Single occupied cell — no meaningful split. Call it 'R' arbitrarily.
      const occSet = new Set(occupied.map(m => m.r + '_' + m.c));
      cells = means.map(m => occSet.has(m.r + '_' + m.c)
        ? { r: m.r, c: m.c, occupied: true, color: 'R' }
        : { r: m.r, c: m.c, occupied: false, color: 'B' });
      palette.dark = { R: occupied[0].R, G: occupied[0].G, B: occupied[0].B };
    } else {
      // Seed: pick the two cells with the largest pairwise distance.
      let seedA = occupied[0], seedB = occupied[1], maxD = -1;
      for (let i = 0; i < occupied.length; i++) {
        for (let j = i + 1; j < occupied.length; j++) {
          const d = rgbDist(occupied[i], occupied[j]);
          if (d > maxD) { maxD = d; seedA = occupied[i]; seedB = occupied[j]; }
        }
      }
      let cA = { R: seedA.R, G: seedA.G, B: seedA.B };
      let cB = { R: seedB.R, G: seedB.G, B: seedB.B };
      let labels = new Array(occupied.length);
      for (let iter = 0; iter < 6; iter++) {
        for (let i = 0; i < occupied.length; i++) {
          labels[i] = rgbDist(occupied[i], cA) < rgbDist(occupied[i], cB) ? 0 : 1;
        }
        let sA = {R:0,G:0,B:0,n:0}, sB = {R:0,G:0,B:0,n:0};
        for (let i = 0; i < occupied.length; i++) {
          const t = labels[i] === 0 ? sA : sB;
          t.R += occupied[i].R; t.G += occupied[i].G; t.B += occupied[i].B; t.n++;
        }
        if (sA.n) cA = { R: sA.R/sA.n, G: sA.G/sA.n, B: sA.B/sA.n };
        if (sB.n) cB = { R: sB.R/sB.n, G: sB.G/sB.n, B: sB.B/sB.n };
      }
      // Schema mapping: 'B' (black) = the lighter / less-saturated cluster
      // (bone/cream tiles with dark glyphs); 'R' (red) = the more saturated
      // or darker cluster. Use luminance as the tiebreaker — the cluster
      // with higher luminance is "B", the other is "R".
      const lumA = 0.30*cA.R + 0.59*cA.G + 0.11*cA.B;
      const lumB = 0.30*cB.R + 0.59*cB.G + 0.11*cB.B;
      // But: when one cluster is strongly saturated (e.g. red tiles), the
      // saturation should win over luminance. Saturated red tiles can be
      // brighter than neutral gray tiles. Compute chroma = max - min channel.
      const chrA = Math.max(cA.R, cA.G, cA.B) - Math.min(cA.R, cA.G, cA.B);
      const chrB = Math.max(cB.R, cB.G, cB.B) - Math.min(cB.R, cB.G, cB.B);
      // The 'R' class is whichever cluster has higher chroma; if chroma is
      // close (both neutral, just different luminance), fall back to "darker
      // = R, lighter = B".
      const chrDiff = Math.abs(chrA - chrB);
      let aIsR;
      if (chrDiff > 30) aIsR = chrA > chrB;
      else aIsR = lumA < lumB;
      const lightCells = [], darkCells = [];
      for (let i = 0; i < occupied.length; i++) {
        const isR = (labels[i] === 0) ? aIsR : !aIsR;
        (isR ? darkCells : lightCells).push(occupied[i]);
      }
      const medianRGB = (arr) => arr.length ? {
        R: median(arr.map(m => m.R)),
        G: median(arr.map(m => m.G)),
        B: median(arr.map(m => m.B)),
      } : null;
      palette.light = medianRGB(lightCells);
      palette.dark  = medianRGB(darkCells);
      const darkSet = new Set(darkCells.map(m => m.r + '_' + m.c));
      const occSet  = new Set(occupied.map(m  => m.r + '_' + m.c));
      cells = means.map(m => {
        const key = m.r + '_' + m.c;
        if (!occSet.has(key)) return { r: m.r, c: m.c, occupied: false, color: 'B' };
        return { r: m.r, c: m.c, occupied: true, color: darkSet.has(key) ? 'R' : 'B' };
      });
    }
    return { cells, palette };
  }

  // ---- grid -------------------------------------------------------------
  function profiles(img) {
    const { data, width: W, height: H } = img;
    const row = new Float64Array(H), col = new Float64Array(W);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (greenAt(data, i) <= 20) { row[y]++; col[x]++; }
      }
    }
    for (let y = 0; y < H; y++) row[y] /= W;
    for (let x = 0; x < W; x++) col[x] /= H;
    return { row, col };
  }
  function lines(prof, n, length) {
    const pitch = length / n, out = [];
    for (let k = 0; k <= n; k++) {
      const g = Math.round(k * pitch), lo = Math.max(0, g - 14),
            hi = Math.min(prof.length, g + 15);
      let bi = lo, bv = Infinity;
      for (let i = lo; i < hi; i++) if (prof[i] < bv) { bv = prof[i]; bi = i; }
      out.push(bi);
    }
    return out;
  }
  // Find the playable grid's bounding box. Inside the grid: tiles (bright, bone)
  // and gridlines/empty cells (felt-dark). Outside the grid: solid darker felt
  // with no structure. We detect "inside" rows/cols as those containing at least
  // a small fraction of bright pixels (i.e. tile content).
  function feltBBox(img) {
    const { data, width: W, height: H } = img;
    const rowBright = new Float64Array(H), colBright = new Float64Array(W);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        // Bone tiles are bright on all channels and not strongly green.
        const r = data[i], g = data[i+1], b = data[i+2];
        const lum = (r + g + b) / 3;
        const greenness = g - (r + b) / 2;
        if (lum > 150 && greenness < 25) { rowBright[y]++; colBright[x]++; }
      }
    }
    // A "tile row" / "tile column" has at least ~10% of its pixels bright.
    // Use a robust threshold so a few stray bright pixels outside the grid
    // (toolbars, watermarks, thumbnails) don't expand the bbox.
    const rowThresh = W * 0.10, colThresh = H * 0.10;
    let y0 = 0, y1 = H - 1, x0 = 0, x1 = W - 1;
    while (y0 < H && rowBright[y0] < rowThresh) y0++;
    while (y1 > y0 && rowBright[y1] < rowThresh) y1--;
    while (x0 < W && colBright[x0] < colThresh) x0++;
    while (x1 > x0 && colBright[x1] < colThresh) x1--;
    if (y1 - y0 < 50 || x1 - x0 < 50) return { x0: 0, y0: 0, x1: W - 1, y1: H - 1, full: true };
    return { x0, y0, x1, y1, full: false };
  }
  function detectGrid(img, ncols = 13, nrows = 13) {
    // Cropped to the felt bbox upstream, so the grid is just an even division
    // of the cropped image. No local-minimum snap, no uneven cells.
    const rb = new Array(nrows + 1), cb = new Array(ncols + 1);
    for (let k = 0; k <= nrows; k++) rb[k] = Math.round(k * img.height / nrows);
    for (let k = 0; k <= ncols; k++) cb[k] = Math.round(k * img.width  / ncols);
    return { rb, cb };
  }

  // Color of a tile pixel by hue. Returns 'R' if it sits in the red half of the
  // hue wheel (roughly -45°..+45° in HSV), otherwise null. Robust to whatever
  // shade of red the renderer uses (pink, orange-red, brown-red, etc.) and to
  // brightness changes that broke the old fixed-RGB test.
  function pixelIsRedish(r, g, b) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const chroma = max - min;
    if (chroma < 25) return false;          // too gray to commit to a hue
    if (max !== r) return false;            // red can only dominate if it's the max
    // hue in [-60, +60] when r is max:
    //   h = 60 * (g - b) / chroma   (negative toward magenta, positive toward yellow)
    // accept the central red wedge.
    const h = 60 * (g - b) / chroma;
    return h >= -45 && h <= 45;
  }
  // ---- per-cell sampling ------------------------------------------------
  function cellStats(img, rb, cb, r, c) {
    const { data, width: W } = img;
    const y0 = rb[r], y1 = rb[r+1], x0 = cb[c], x1 = cb[c+1];
    const h = y1 - y0, w = x1 - x0;
    // occupancy over central 60%
    let occN = 0, occT = 0, redN = 0, tileN = 0;
    const iy0 = y0 + (h*0.2|0), iy1 = y1 - (h*0.2|0);
    const ix0 = x0 + (w*0.2|0), ix1 = x1 - (w*0.2|0);
    for (let y = iy0; y < iy1; y++) for (let x = ix0; x < ix1; x++) {
      const i = (y*W + x)*4; occT++;
      if (greenAt(data, i) <= 20) occN++;
    }
    const occupied = occT && occN/occT > 0.5;
    // colour over interior 18-82%, looking only at *non-bone* pixels because
    // the glyph itself carries the colour signal; pure white bone gives a
    // chroma of zero and just dilutes the vote.
    const cy0 = y0 + (h*0.18|0), cy1 = y1 - (h*0.18|0);
    const cx0 = x0 + (w*0.18|0), cx1 = x1 - (w*0.18|0);
    for (let y = cy0; y < cy1; y++) for (let x = cx0; x < cx1; x++) {
      const i = (y*W + x)*4;
      if (greenAt(data, i) <= 20) {
        tileN++;
        if (pixelIsRedish(data[i], data[i+1], data[i+2])) redN++;
      }
    }
    const color = (tileN && redN/tileN > 0.10) ? 'R' : 'B';
    return { occupied, color };
  }


  function readBoard(img) {
    const { rb, cb } = detectGrid(img);
    const nrows = rb.length-1, ncols = cb.length-1;
    const cells = [];
    for (let r = 0; r < nrows; r++) for (let c = 0; c < ncols; c++) {
      const st = cellStats(img, rb, cb, r, c);
      if (!st.occupied) continue;
      // Rank is filled in by OCR downstream. We seed it as unknown so the UI
      // still flags the cell until it's recognised.
      cells.push({ r, c, rank: '?', color: st.color, score: 0, margin: 0 });
    }
    return { rb, cb, nrows, ncols, cells };
  }

  // Top-level: take an arbitrary image, find the 13×13 grid, crop to it, and
  // classify cells. Returns {bbox, croppedImg, rb, cb, cells, palette} or
  // null if no grid was detected. Renderer-agnostic — replaces the
  // feltBBox + detectGrid + cellStats chain.
  function detectBoard(img) {
    const grid = findBoardGrid(img);
    if (!grid) return null;
    // Crop the source image to the grid bbox so downstream code (OCR cell
    // glyphs, overlay positioning) all share one coordinate space.
    const cw = grid.x1 - grid.x0 + 1, ch = grid.y1 - grid.y0 + 1;
    const cropped = { data: new Uint8ClampedArray(cw * ch * 4), width: cw, height: ch };
    const { data: srcData, width: srcW } = img;
    for (let y = 0; y < ch; y++) {
      const srcOff = ((grid.y0 + y) * srcW + grid.x0) * 4;
      const dstOff = y * cw * 4;
      for (let k = 0; k < cw * 4; k++) cropped.data[dstOff + k] = srcData[srcOff + k];
    }
    const { cells: classified, palette } = classifyCells(cropped, grid.rb, grid.cb);
    const cells = [];
    for (const c of classified) {
      if (c.occupied) cells.push({ r: c.r, c: c.c, rank: '?', color: c.color, score: 0, margin: 0 });
    }
    return {
      bbox: { x0: grid.x0, y0: grid.y0, x1: grid.x1, y1: grid.y1 },
      croppedImg: cropped,
      rb: grid.rb, cb: grid.cb,
      nrows: 13, ncols: 13,
      cells, palette,
    };
  }

  // Otsu's method: choose the grayscale cutoff that maximises between-class
  // variance. Used to binarize cell crops before sending to OCR.
  function otsuThreshold(gray) {
    const hist = new Uint32Array(256);
    for (let i = 0; i < gray.length; i++) hist[Math.min(255, Math.max(0, gray[i]|0))]++;
    let total = 0, sum = 0;
    for (let i = 0; i < 256; i++) { total += hist[i]; sum += i*hist[i]; }
    let wB = 0, sumB = 0, bestVar = -1, bestT = 128;
    for (let t = 0; t < 256; t++) {
      wB += hist[t]; if (wB === 0) continue;
      const wF = total - wB; if (wF === 0) break;
      sumB += t*hist[t];
      const mB = sumB / wB, mF = (sum - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > bestVar) { bestVar = v; bestT = t; }
    }
    return bestT;
  }
  // Binary morphology: 3x3 structuring element. `dilate` grows ink; `erode`
  // shrinks it. Combining (dilate then erode = closing) fills tiny JPEG
  // noise holes inside strokes without expanding the overall glyph.
  // Operates in-place is awkward in JS, so each step produces a new buffer.
  function morphDilate(src, w, h) {
    const out = new Uint8Array(src.length);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let any = 0;
      for (let dy = -1; dy <= 1 && !any; dy++) {
        const ny = y + dy; if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx; if (nx < 0 || nx >= w) continue;
          if (src[ny*w + nx]) { any = 1; break; }
        }
      }
      out[y*w + x] = any;
    }
    return out;
  }
  function morphErode(src, w, h) {
    const out = new Uint8Array(src.length);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let all = 1;
      for (let dy = -1; dy <= 1 && all; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) { all = 0; break; }
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w || !src[ny*w + nx]) { all = 0; break; }
        }
      }
      out[y*w + x] = all;
    }
    return out;
  }
  // 4-connected component labeller + small-blob filter. Returns the cleaned
  // ink mask with any component smaller than `minFrac` of the largest blob
  // erased. Kills stray notches/specks left behind by binarization without
  // touching the main glyph.
  function dropSmallComponents(ink, w, h, minFrac = 0.05) {
    const lbl = new Int32Array(w*h);
    const stack = [];
    const sizes = [0];      // sizes[k] = pixel count of component k
    let nlbl = 0;
    for (let p = 0; p < ink.length; p++) {
      if (!ink[p] || lbl[p]) continue;
      nlbl++; lbl[p] = nlbl; stack.push(p);
      let sz = 0;
      while (stack.length) {
        const q = stack.pop(); sz++;
        const qy = (q / w) | 0, qx = q - qy*w;
        if (qy > 0)   { const np = q - w; if (ink[np] && !lbl[np]) { lbl[np] = nlbl; stack.push(np); } }
        if (qy < h-1) { const np = q + w; if (ink[np] && !lbl[np]) { lbl[np] = nlbl; stack.push(np); } }
        if (qx > 0)   { const np = q - 1; if (ink[np] && !lbl[np]) { lbl[np] = nlbl; stack.push(np); } }
        if (qx < w-1) { const np = q + 1; if (ink[np] && !lbl[np]) { lbl[np] = nlbl; stack.push(np); } }
      }
      sizes.push(sz);
    }
    if (nlbl === 0) return ink;
    let maxSize = 0;
    for (let k = 1; k <= nlbl; k++) if (sizes[k] > maxSize) maxSize = sizes[k];
    const minSize = Math.max(4, maxSize * minFrac);
    const out = new Uint8Array(ink.length);
    for (let p = 0; p < ink.length; p++) {
      const k = lbl[p];
      out[p] = (k && sizes[k] >= minSize) ? 1 : 0;
    }
    return out;
  }
  // Estimate the average stroke width of an ink mask by counting horizontal
  // run lengths through each row and taking the median. Used downstream to
  // decide whether to dilate (thicken) or erode (thin) for normalization.
  function estimateStrokeWidth(ink, w, h) {
    const runs = [];
    for (let y = 0; y < h; y++) {
      let run = 0;
      for (let x = 0; x < w; x++) {
        if (ink[y*w + x]) run++;
        else if (run) { runs.push(run); run = 0; }
      }
      if (run) runs.push(run);
    }
    if (!runs.length) return 0;
    runs.sort((a, b) => a - b);
    // Use the 30th-percentile run length: the bottom of the distribution
    // approximates the true stroke width (horizontal slabs at corners etc.
    // dominate the upper half).
    return runs[Math.max(0, Math.floor(runs.length * 0.30))];
  }
  // Crop, upscale, binarize, clean, normalize stroke width, recenter — and
  // hand Tesseract a high-DPI, high-contrast, well-padded glyph that mimics
  // its scanned-print training distribution.
  //
  // `mode` selects the polarity + binarisation path:
  //   'bright'      — for tiles with a bright background (bone, red). Use the
  //                   simple "absolute luminance dominance" polarity check
  //                   (most pixels > 135 = dark-on-bright, else invert) and
  //                   skip contrast stretching. This is the path the original
  //                   pipeline was tuned for and which works ≥95% on bone/red
  //                   tiles. Default.
  //   'lowContrast' — for tiles with a dark background (brown, wood). Use the
  //                   relative centre-vs-ring polarity check (sign of the
  //                   glyph mean offset from the background mean) and stretch
  //                   the histogram before Otsu so binarisation is stable
  //                   despite the narrow inter-class luminance gap.
  function cellGlyphCanvas(img, rb, cb, r, c, outSize = 256, mode = 'bright') {
    const { data, width: W } = img;
    const y0 = rb[r], y1 = rb[r+1], x0 = cb[c], x1 = cb[c+1];
    const h = y1 - y0, w = x1 - x0;
    // Crop the central ~80% of the cell to drop the tile frame/border.
    const iy0 = y0 + (h*0.10|0), iy1 = y1 - (h*0.10|0);
    const ix0 = x0 + (w*0.10|0), ix1 = x1 - (w*0.10|0);
    const ih = iy1 - iy0, iw = ix1 - ix0;
    if (ih <= 4 || iw <= 4) return null;
    // ---- Step 1: grayscale + polarity detection ----
    const grayLo = new Uint8Array(ih * iw);
    let bright = 0;
    for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) {
      const i = ((iy0+y)*W + (ix0+x))*4;
      const v = ((data[i] + data[i+1] + data[i+2]) / 3) | 0;
      grayLo[y*iw + x] = v;
      if (v > 135) bright++;
    }
    let needsInvert;
    if (mode === 'lowContrast') {
      // Centre-vs-ring sign test: works when absolute luminance is low across
      // the whole cell (dark theme tiles).
      let centreSum = 0, centreN = 0, ringSum = 0, ringN = 0;
      const cy0 = (ih * 0.25) | 0, cy1 = ih - cy0;
      const cx0 = (iw * 0.25) | 0, cx1 = iw - cx0;
      for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) {
        const v = grayLo[y*iw + x];
        if (y >= cy0 && y < cy1 && x >= cx0 && x < cx1) { centreSum += v; centreN++; }
        else { ringSum += v; ringN++; }
      }
      const centreMean = centreN ? centreSum / centreN : 128;
      const ringMean   = ringN   ? ringSum   / ringN   : 128;
      needsInvert = centreMean > ringMean;
    } else {
      // Absolute luminance dominance: tuned for bone-background tiles.
      // If bright pixels dominate, glyph is dark on bone → keep. Else invert.
      needsInvert = bright < (ih * iw) * 0.5;
    }
    if (needsInvert) {
      for (let i = 0; i < grayLo.length; i++) grayLo[i] = 255 - grayLo[i];
    }
    // ---- Step 1.5: contrast stretch (lowContrast mode only) ----
    // Dark-theme tiles have only ~30 lum between glyph and background;
    // stretching to [0,255] gives Otsu a clean bimodal distribution. Skipped
    // in bright mode because the histogram already spans most of the range
    // and stretching pushes felt-only crops into all-black binarisation.
    if (mode === 'lowContrast') {
      const hist = new Uint32Array(256);
      for (let i = 0; i < grayLo.length; i++) hist[grayLo[i]]++;
      const total = grayLo.length;
      const loCut = total * 0.02, hiCut = total * 0.98;
      let acc = 0, lo = 0, hi = 255;
      for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= loCut) { lo = v; break; } }
      acc = 0;
      for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= hiCut) { hi = v; break; } }
      if (hi - lo >= 8) {
        const scale = 255 / (hi - lo);
        for (let i = 0; i < grayLo.length; i++) {
          const v = grayLo[i];
          grayLo[i] = v <= lo ? 0 : v >= hi ? 255 : Math.round((v - lo) * scale);
        }
      }
    }
    // ---- Step 2: upscale grayscale 4× via bilinear ----
    // Doing this BEFORE binarize is the key change: anti-aliased edges that
    // would otherwise harshly threshold get smoothed into a clean gradient
    // first, and Otsu finds a much better cutoff on the upscaled histogram.
    const scaleUp = 4;
    const gw = iw * scaleUp, gh = ih * scaleUp;
    const grayHi = new Uint8Array(gw * gh);
    for (let y = 0; y < gh; y++) {
      const fy = (y + 0.5) / scaleUp - 0.5;
      const y1i = Math.floor(fy), y2i = Math.min(ih - 1, y1i + 1);
      const wy = fy - y1i; const y1c = Math.max(0, y1i);
      for (let x = 0; x < gw; x++) {
        const fx = (x + 0.5) / scaleUp - 0.5;
        const x1i = Math.floor(fx), x2i = Math.min(iw - 1, x1i + 1);
        const wx = fx - x1i; const x1c = Math.max(0, x1i);
        const a = grayLo[y1c*iw + x1c], b = grayLo[y1c*iw + x2i];
        const c2 = grayLo[y2i*iw + x1c], d = grayLo[y2i*iw + x2i];
        const top = a*(1-wx) + b*wx;
        const bot = c2*(1-wx) + d*wx;
        grayHi[y*gw + x] = (top*(1-wy) + bot*wy) | 0;
      }
    }
    // ---- Step 3: Otsu threshold + binarize at high resolution ----
    const T = Math.max(80, Math.min(210, otsuThreshold(grayHi)));
    let ink = new Uint8Array(gw * gh);
    for (let i = 0; i < grayHi.length; i++) ink[i] = (grayHi[i] < T) ? 1 : 0;
    // ---- Step 4: morphological closing to fill JPEG noise inside strokes ----
    ink = morphErode(morphDilate(ink, gw, gh), gw, gh);
    // ---- Step 4.5: drop small disconnected components ----
    // Keep components ≥10% of the largest. Strips selection-halo ticks, edge
    // notches, anti-alias specks left behind by binarisation. Threshold is
    // safe for the '10' rank: the '1' is ~30-40% of the '0' (same height,
    // narrower), well above the 10% cutoff.
    ink = dropSmallComponents(ink, gw, gh, 0.10);
    // ---- Step 5: stroke-width normalization ----
    // Target ~6-8 pixels at the upscaled resolution. Too thin and Tesseract
    // confuses curves; too thick and adjacent strokes merge into blobs.
    const sw = estimateStrokeWidth(ink, gw, gh);
    if (sw > 0 && sw < 5) {
      ink = morphDilate(ink, gw, gh);                 // thicken once
    } else if (sw > 10) {
      ink = morphErode(ink, gw, gh);                  // thin once
    }
    // ---- Step 6: find the glyph's true bounding box ----
    let minX = gw, maxX = -1, minY = gh, maxY = -1, area = 0;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      if (ink[y*gw + x]) {
        area++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    if (area < 16 || maxX < 0) { minX = 0; minY = 0; maxX = gw - 1; maxY = gh - 1; }
    const bw = maxX - minX + 1, bh = maxY - minY + 1;
    // ---- Step 7: render to final canvas with quiet zone ----
    const cv = document.createElement('canvas');
    cv.width = outSize; cv.height = outSize;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outSize, outSize);
    const maskScratch = document.createElement('canvas');
    maskScratch.width = bw; maskScratch.height = bh;
    const mctx = maskScratch.getContext('2d');
    const mImg = mctx.createImageData(bw, bh);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const v = ink[(minY+y)*gw + (minX+x)] ? 0 : 255;
      const di = (y*bw + x) * 4;
      mImg.data[di+0] = v;
      mImg.data[di+1] = v;
      mImg.data[di+2] = v;
      mImg.data[di+3] = 255;
    }
    mctx.putImageData(mImg, 0, 0);
    const targetSide = outSize * 0.65;
    const scale = targetSide / Math.max(bw, bh);
    const drawW = bw * scale, drawH = bh * scale;
    const dx = (outSize - drawW) / 2, dy = (outSize - drawH) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(maskScratch, dx, dy, drawW, drawH);
    return cv;
  }

  // ---- remaining-tile accounting ---------------------------------------
  function remaining(cells, sixNineShared = true) {
    const placed = {};
    const key = (rk, col) => rk + col;
    for (const t of cells) if (t.rank !== '?') placed[key(t.rank, t.color)] = (placed[key(t.rank, t.color)]||0) + 1;
    const get = (rk, col) => placed[key(rk, col)] || 0;
    const rem = {}, over = [];
    for (const rk of RANKS) for (const col of ['R','B']) {
      const left = COPIES - get(rk, col);
      rem[key(rk, col)] = left;
      if (left < 0) over.push({ rank: rk, color: col, n: -left });
    }
    let total = 0;
    for (const rk of RANKS) total += Math.max(rem[key(rk,'R')],0) + Math.max(rem[key(rk,'B')],0);
    let pool = null;
    if (sixNineShared) {
      const red69 = get('6','R') + get('9','R'), blk69 = get('6','B') + get('9','B');
      const indepSum = Math.max(rem['6R'],0)+Math.max(rem['6B'],0)+Math.max(rem['9R'],0)+Math.max(rem['9B'],0);
      pool = { redLeft: Math.max(8-red69,0), blackLeft: Math.max(8-blk69,0),
               redOver: Math.max(red69-8,0), blackOver: Math.max(blk69-8,0) };
      total = total - indepSum + pool.redLeft + pool.blackLeft;
      if (pool.redOver)  over.push({ rank: '6/9', color: 'R', n: pool.redOver });
      if (pool.blackOver) over.push({ rank: '6/9', color: 'B', n: pool.blackOver });
    }
    const placedCount = cells.filter(t => t.rank !== '?').length;
    return { rem, pool, over, total, placedCount };
  }

  const api = { RANKS, COPIES, greenAt: greenAt, feltBBox, detectGrid, cellStats,
                cellGlyphCanvas, readBoard, remaining,
                findBoardGrid, gradientProfiles, bestGrid1D, classifyCells,
                detectBoard };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KC = api;
})(typeof window !== 'undefined' ? window : globalThis);

