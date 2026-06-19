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
    // colour over interior 18-82%
    const cy0 = y0 + (h*0.18|0), cy1 = y1 - (h*0.18|0);
    const cx0 = x0 + (w*0.18|0), cx1 = x1 - (w*0.18|0);
    for (let y = cy0; y < cy1; y++) for (let x = cx0; x < cx1; x++) {
      const i = (y*W + x)*4;
      if (greenAt(data, i) <= 20) {
        tileN++;
        if (data[i] > data[i+1]+30 && data[i] > data[i+2]+30) redN++;
      }
    }
    const color = (tileN && redN/tileN > 0.25) ? 'R' : 'B';
    return { occupied, color };
  }

  // ---- glyph isolation + template matching ------------------------------
  // The bright tile pixels are the numeral PLUS a thin rounded-rect frame.
  // The frame is the only component spanning ~the whole cell, so we drop any
  // component whose bounding box exceeds 80% of the crop and keep the centred
  // numeral. Returns the grayscale numeral, normalised to GxG, + its aspect.
  function glyphVector(img, rb, cb, r, c) {
    const { data, width: W } = img;
    const y0 = rb[r], y1 = rb[r+1], x0 = cb[c], x1 = cb[c+1];
    const h = y1 - y0, w = x1 - x0;
    const iy0 = y0 + (h*0.12|0), iy1 = y1 - (h*0.12|0);
    const ix0 = x0 + (w*0.12|0), ix1 = x1 - (w*0.12|0);
    const ih = iy1 - iy0, iw = ix1 - ix0;
    if (ih <= 2 || iw <= 2) return null;
    const gray = new Float64Array(ih*iw), mask = new Uint8Array(ih*iw);
    for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) {
      const i = ((iy0+y)*W + (ix0+x))*4;
      const v = (data[i]+data[i+1]+data[i+2])/3;
      gray[y*iw+x] = v;
      if (v > 135) mask[y*iw+x] = 1;
    }
    // connected components (8-conn) with per-component bounding box + size
    const lbl = new Int32Array(ih*iw).fill(0);
    const comp = [null]; let nlbl = 0;          // comp[k] = {minx,maxx,miny,maxy,size}
    const stack = [];
    for (let p = 0; p < mask.length; p++) {
      if (mask[p] && !lbl[p]) {
        nlbl++; lbl[p] = nlbl; stack.push(p);
        let sz = 0, mnx = iw, mxx = -1, mny = ih, mxy = -1;
        while (stack.length) {
          const q = stack.pop(); sz++;
          const qy = (q/iw)|0, qx = q - qy*iw;
          if (qx<mnx)mnx=qx; if (qx>mxx)mxx=qx; if (qy<mny)mny=qy; if (qy>mxy)mxy=qy;
          // 4-connectivity (matches the reference isolation; keeps the frame
          // ring from merging with the numeral at rounded corners)
          const nb = [[qy-1,qx],[qy+1,qx],[qy,qx-1],[qy,qx+1]];
          for (let t = 0; t < 4; t++) {
            const ny = nb[t][0], nx = nb[t][1];
            if (ny<0||nx<0||ny>=ih||nx>=iw) continue;
            const np = ny*iw+nx;
            if (mask[np] && !lbl[np]) { lbl[np] = nlbl; stack.push(np); }
          }
        }
        comp.push({ mnx, mxx, mny, mxy, size: sz });
      }
    }
    if (nlbl === 0) return null;
    // keep components that aren't the frame (span < 80% of crop) and aren't specks
    const keep = new Uint8Array(nlbl+1);
    for (let k = 1; k <= nlbl; k++) {
      const cc = comp[k];
      const bw = cc.mxx-cc.mnx+1, bh = cc.mxy-cc.mny+1;
      keep[k] = (bw <= 0.80*iw && bh <= 0.80*ih && cc.size >= 6) ? 1 : 0;
    }
    let minx=iw, miny=ih, maxx=-1, maxy=-1, kept=0;
    for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) {
      if (keep[lbl[y*iw+x]]) {
        kept++;
        if (x<minx)minx=x; if (x>maxx)maxx=x; if (y<miny)miny=y; if (y>maxy)maxy=y;
      }
    }
    if (kept < 8 || maxx < 0) return null;
    const gw = maxx-minx+1, gh = maxy-miny+1, side = Math.max(gw, gh);
    const oy = (side-gh)>>1, ox = (side-gw)>>1;
    const canv = new Float64Array(side*side); // 0 background
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++)
      canv[(oy+y)*side + (ox+x)] = gray[(miny+y)*iw + (minx+x)];
    // bilinear resize to GxG (smoother + more discriminative than nearest)
    const vec = new Float64Array(G*G), gray8 = new Uint8Array(G*G);
    for (let y = 0; y < G; y++) {
      let fy = (y+0.5)*side/G - 0.5; if (fy<0) fy=0; if (fy>side-1) fy=side-1;
      const y0 = fy|0, y1 = Math.min(y0+1, side-1), wy = fy-y0;
      for (let x = 0; x < G; x++) {
        let fx = (x+0.5)*side/G - 0.5; if (fx<0) fx=0; if (fx>side-1) fx=side-1;
        const x0 = fx|0, x1 = Math.min(x0+1, side-1), wx = fx-x0;
        const v = canv[y0*side+x0]*(1-wx)*(1-wy) + canv[y0*side+x1]*wx*(1-wy)
                + canv[y1*side+x0]*(1-wx)*wy   + canv[y1*side+x1]*wx*wy;
        vec[y*G+x] = v; gray8[y*G+x] = v|0;
      }
    }
    let mean = 0; for (let i = 0; i < vec.length; i++) mean += vec[i]; mean /= vec.length;
    let sd = 0; for (let i = 0; i < vec.length; i++) sd += (vec[i]-mean)**2;
    sd = Math.sqrt(sd/vec.length) + 1e-6;
    for (let i = 0; i < vec.length; i++) vec[i] = (vec[i]-mean)/sd;
    return { vec, aspect: gw/gh, gray: gray8 };
  }

  // bank = {S, labels:[...], aspects:[...], data:base64 of N*S*S grayscale bytes}
  // -> array of {rank, vec (z-scored), aspect}
  function b64ToBytes(b64) {
    const bin = (typeof atob === 'function') ? atob(b64)
              : Buffer.from(b64, 'base64').toString('binary');
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function buildTemplates(bank) {
    const S = bank.S, n = S*S, bytes = b64ToBytes(bank.data), out = [];
    for (let e = 0; e < bank.labels.length; e++) {
      const off = e*n; let mean = 0;
      for (let i = 0; i < n; i++) mean += bytes[off+i]; mean /= n;
      let sd = 0; for (let i = 0; i < n; i++) sd += (bytes[off+i]-mean)**2;
      sd = Math.sqrt(sd/n) + 1e-6;
      const vec = new Float64Array(n);
      for (let i = 0; i < n; i++) vec[i] = (bytes[off+i]-mean)/sd;
      out.push({ rank: bank.labels[e], vec, aspect: bank.aspects[e] });
    }
    return out;
  }
  // 1-nearest-neighbour over the exemplar bank (normalised cross-correlation
  // plus a light aspect term). Also returns the margin to the runner-up rank,
  // which flags genuinely ambiguous reads better than the raw score does.
  function classifyRank(gl, bank) {
    if (!gl) return { rank: '?', score: 0, margin: 0 };
    const perRank = {};
    for (let e = 0; e < bank.length; e++) {
      const t = bank[e]; let ncc = 0;
      for (let i = 0; i < gl.vec.length; i++) ncc += gl.vec[i]*t.vec[i];
      ncc /= gl.vec.length;
      const ap = 1 - Math.min(Math.abs(gl.aspect-t.aspect)/Math.max(gl.aspect,t.aspect), 1);
      const s = ncc + 0.10*ap;
      if (!(t.rank in perRank) || s > perRank[t.rank]) perRank[t.rank] = s;
    }
    let best = '?', bs = -9, sec = -9;
    for (const r in perRank) {
      if (perRank[r] > bs) { sec = bs; bs = perRank[r]; best = r; }
      else if (perRank[r] > sec) sec = perRank[r];
    }
    return { rank: best, score: +bs.toFixed(3), margin: +(bs-sec).toFixed(3) };
  }

  function readBoard(img, T) {
    const { rb, cb } = detectGrid(img);
    const nrows = rb.length-1, ncols = cb.length-1;
    const cells = [];
    for (let r = 0; r < nrows; r++) for (let c = 0; c < ncols; c++) {
      const st = cellStats(img, rb, cb, r, c);
      if (!st.occupied) continue;
      const cl = classifyRank(glyphVector(img, rb, cb, r, c), T);
      cells.push({ r, c, rank: cl.rank, color: st.color, score: cl.score, margin: cl.margin });
    }
    return { rb, cb, nrows, ncols, cells };
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

  const api = { RANKS, COPIES, greenAt: greenAt, feltBBox, detectGrid, cellStats, glyphVector,
                buildTemplates, classifyRank, readBoard, remaining };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KC = api;
})(typeof window !== 'undefined' ? window : globalThis);

