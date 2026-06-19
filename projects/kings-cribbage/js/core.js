/* King's Cribbage core: pixels -> board -> remaining tiles.
   Pure functions. No DOM. `img` = {data:RGBA bytes, width, height}.
   Used both by the Node test harness and the browser app. */
(function (root) {
  'use strict';
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const COPIES = 4;          // per colour, per rank
  const G = 44;              // glyph normalisation size

  const greenAt = (d, i) => d[i+1] - (d[i] + d[i+2]) / 2;

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
  function cellGlyphCanvas(img, rb, cb, r, c, outSize = 256) {
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
    // If bright dominates, glyph is dark on bone → keep as-is. Otherwise the
    // glyph is bright on dark → invert so subsequent steps see consistent
    // "dark ink on white" polarity.
    const needsInvert = bright < (ih * iw) * 0.5;
    if (needsInvert) {
      for (let i = 0; i < grayLo.length; i++) grayLo[i] = 255 - grayLo[i];
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
                cellGlyphCanvas, readBoard, remaining };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KC = api;
})(typeof window !== 'undefined' ? window : globalThis);

