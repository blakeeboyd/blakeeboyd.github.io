/* =====================================================================
   Potential Acoustic Gain — explorable explanation
   Slide 0: reference (will be removed). Slides 1–4: static prose/diagrams.
   Slides 5–9: interactive room demos.
   ===================================================================== */

// Shared constants and helpers used across all slide IIFEs.
const PAG = (() => {
  'use strict';

  const PX_PER_FT = 13;
  const SVG_W     = 900;
  const FLOOR_Y   = 386;
  // Y-offsets from the floor: each figure's anchor point sits this many
  // pixels above the floor line.
  const T_Y = FLOOR_Y - 68;
  const M_Y = FLOOR_Y - 64;
  const L_Y = FLOOR_Y - 52;

  // Capsule head points at SVG angle -119.2° at rotation=0 (see MATH.md);
  // rotate by (talker_angle − this) to aim the capsule at the talker.
  const MIC_CAPSULE_REST_DEG = -119.2;

  const clamp  = (v, a, b) => Math.max(a, Math.min(b, v));
  const distPx = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const feet   = (px) => px / PX_PER_FT;

  function fmtFeetInches(ft) {
    if (!isFinite(ft)) return '-';
    const totalIn = Math.round(ft * 12);
    const f = Math.floor(totalIn / 12);
    const i = totalIn - f * 12;
    return f + "' " + i + '"';
  }

  function setLineEndpoints(line, a, b) {
    line.setAttribute('x1', a.x.toFixed(1));
    line.setAttribute('y1', a.y.toFixed(1));
    line.setAttribute('x2', b.x.toFixed(1));
    line.setAttribute('y2', b.y.toFixed(1));
  }

  // Cache .dlabel-bg / .dlabel-val per label element so repeated calls in
  // hot paths (drag, animation) don't re-query the SVG subtree.
  function getLabelParts(label) {
    if (!label.__parts) {
      label.__parts = {
        bg: label.querySelector('.dlabel-bg'),
        val: label.querySelector('.dlabel-val'),
      };
    }
    return label.__parts;
  }

  function setLabelText(label, valueStr) {
    const { val, bg } = getLabelParts(label);
    // Optimization: skip re-measurement if the text hasn't changed AND the
    // bg has been successfully sized at least once. The "sized" check
    // matters because the first render often happens while the slide is
    // display:none — getBBox returns zero in that state, so we keep
    // re-trying until we get a real measurement.
    if (val.textContent === valueStr && label.__sized) return;
    val.textContent = valueStr;
    requestAnimationFrame(() => {
      try {
        const bbox = val.getBBox();
        if (bbox.width > 0) {
          bg.setAttribute('width', (36 + bbox.width + 9).toFixed(1));
          label.__sized = true;
        }
        // bbox.width === 0 means the label is still hidden; leave __sized
        // false so the next setLabelText call retries.
      } catch (e) { /* getBBox throws on hidden elements */ }
    });
  }

  function positionLabel(label, a, b, side, gap, maxY) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    const { bg } = getLabelParts(label);
    const w = parseFloat(bg.getAttribute('width')) || 86;
    const h = parseFloat(bg.getAttribute('height')) || 28;
    let cx = mx + px * gap * side;
    let cy = my + py * gap * side;
    cx = clamp(cx, w / 2 + 4, SVG_W - w / 2 - 4);
    cy = clamp(cy, h / 2 + 4, maxY);
    label.setAttribute('transform',
      'translate(' + (cx - w / 2).toFixed(1) + ', ' + (cy - h / 2).toFixed(1) + ')');
  }

  // Position a label directly above a target figure, with given vertical
  // offset above its anchor. When the target is too high to leave room for
  // the label above, the label slides smoothly to the side along an
  // elliptical path around the figure — staying close while never letting
  // the label box intersect the figure box.
  //
  // figureRadius approximates the figure's bounding circle so the helper
  // knows how far sideways "clear" actually is.
  function positionLabelAbove(label, point, verticalOffset, maxY, figureRadius) {
    const { bg } = getLabelParts(label);
    const w = parseFloat(bg.getAttribute('width')) || 86;
    const h = parseFloat(bg.getAttribute('height')) || 28;
    const r = figureRadius != null ? figureRadius : 22;
    const minCx = w / 2 + 4;
    const maxCx = SVG_W - w / 2 - 4;
    const minCy = h / 2 + 4;
    const idealCy = point.y - verticalOffset;

    // No overshoot — label sits directly above.
    if (idealCy >= minCy) {
      const cx = clamp(point.x, minCx, maxCx);
      const cy = clamp(idealCy, minCy, maxY);
      label.setAttribute('transform',
        'translate(' + (cx - w / 2).toFixed(1) + ', ' + (cy - h / 2).toFixed(1) + ')');
      return;
    }

    // Overshoot: interpolate from "directly above" to "fully beside" based
    // on how far we'd be clipped. t=0 means just barely clipped (label center
    // at minCy), t=1 means the figure is right at the top of the canvas.
    const overshoot = minCy - idealCy;
    const overshootMax = verticalOffset;  // beyond this, we're fully beside
    const t = clamp(overshoot / overshootMax, 0, 1);

    // Final sideways clearance — enough to keep label and figure from touching.
    const sideClearance = r + w / 2 + 6;
    // Pick the side with more canvas room.
    const goLeft = (point.x - minCx) >= (maxCx - point.x);
    const sideDir = goLeft ? -1 : 1;

    // Interpolate the offset from (0, -verticalOffset) toward (sideDir·clearance, 0).
    const xOffset = t * sideDir * sideClearance;
    const yOffset = (1 - t) * verticalOffset;

    let cx = point.x + xOffset;
    let cy = point.y - yOffset;
    cx = clamp(cx, minCx, maxCx);
    cy = clamp(cy, minCy, maxY);

    label.setAttribute('transform',
      'translate(' + (cx - w / 2).toFixed(1) + ', ' + (cy - h / 2).toFixed(1) + ')');
  }

  // Standard polar response D(θ), θ in radians. Returns linear gain (0..1+).
  function polarResponse(pattern, theta) {
    if (pattern === 'cardioid')      return 0.5  * (1 + Math.cos(theta));
    if (pattern === 'supercardioid') return 0.37 + 0.63 * Math.cos(theta);
    if (pattern === 'hypercardioid') return 0.25 + 0.75 * Math.cos(theta);
    return 1;  // omni
  }

  // Build an SVG path for the mic polar lobe in mic-local coords (on-axis = +x).
  // Caller passes the scale (radius at unity response) and the pattern name.
  function buildMicLobePath(pattern, scale) {
    if (pattern === 'omni') {
      const r = scale * 0.85;
      return `M ${r},0 A ${r},${r} 0 1,1 ${-r},0 A ${r},${r} 0 1,1 ${r},0 Z`;
    }
    const N = 96;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = Math.abs(polarResponse(pattern, a)) * scale;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ',' + y.toFixed(2);
    }
    return d + ' Z';
  }

  // Apply the capsule rotation so it visually aims at the talker.
  // Caches the .mic-capsule lookup on the figure element so repeated
  // calls in the render hot path don't re-query the subtree.
  function tiltMicCapsule(micFigure, talker, mic) {
    let capsule = micFigure.__capsule;
    if (capsule === undefined) {
      capsule = micFigure.querySelector('.mic-capsule') || null;
      micFigure.__capsule = capsule;
    }
    if (!capsule) return;
    const onAxisDeg = Math.atan2(talker.y - mic.y, talker.x - mic.x) * 180 / Math.PI;
    capsule.setAttribute('transform',
      'rotate(' + (onAxisDeg - MIC_CAPSULE_REST_DEG).toFixed(1) + ')');
  }

  // Figure bounding boxes in figure-local coordinates (anchor at origin).
  // {dx, dy} is the offset of the box top-left from the anchor;
  // {w, h} is the box size. Numbers match the corresponding viewBoxes.
  const FIGURE_BBOX = {
    talker:   { dx: -18, dy: -22, w: 36, h: 92 },
    mic:      { dx: -12, dy: -12, w: 24, h: 80 },
    speaker:  { dx: -36, dy: -22, w: 40, h: 44 },
    listener: { dx: -28, dy: -10, w: 44, h: 64 },
  };

  // Pad applied around figure boxes when resolving figure-vs-figure
  // collisions. A few pixels keep the silhouettes from kissing.
  const FIGURE_PAD = 3;

  // Build a world-space axis-aligned bounding rectangle for a figure at
  // position p. If rotationDeg is given, computes the AABB of the rotated
  // local bounding box (used for the speaker, which rotates to face the
  // listener). Rotation pivots around the figure's anchor (0, 0).
  function figureRect(figureId, p, rotationDeg) {
    const b = FIGURE_BBOX[figureId];
    if (!rotationDeg) {
      return {
        x: p.x + b.dx - FIGURE_PAD,
        y: p.y + b.dy - FIGURE_PAD,
        w: b.w + 2 * FIGURE_PAD,
        h: b.h + 2 * FIGURE_PAD,
      };
    }
    // Rotate the four corners of the local box around the anchor (0,0),
    // then take min/max to form the world-space AABB.
    const cos = Math.cos(rotationDeg * Math.PI / 180);
    const sin = Math.sin(rotationDeg * Math.PI / 180);
    const corners = [
      { x: b.dx,        y: b.dy        },
      { x: b.dx + b.w,  y: b.dy        },
      { x: b.dx + b.w,  y: b.dy + b.h  },
      { x: b.dx,        y: b.dy + b.h  },
    ];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const c of corners) {
      const rx = c.x * cos - c.y * sin;
      const ry = c.x * sin + c.y * cos;
      if (rx < minX) minX = rx;
      if (rx > maxX) maxX = rx;
      if (ry < minY) minY = ry;
      if (ry > maxY) maxY = ry;
    }
    return {
      x: p.x + minX - FIGURE_PAD,
      y: p.y + minY - FIGURE_PAD,
      w: (maxX - minX) + 2 * FIGURE_PAD,
      h: (maxY - minY) + 2 * FIGURE_PAD,
    };
  }

  // Helper: compute the speaker's rotation given the listener position.
  function speakerRotationDeg(speaker, listener) {
    return Math.atan2(listener.y - speaker.y, listener.x - speaker.x) * 180 / Math.PI;
  }

  // Standard AABB overlap test.
  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // Returns the rotation (deg) a figure renders at given current state, or
  // 0 for figures that don't rotate. Currently only the speaker rotates.
  function figureRotation(figureId, p, state) {
    if (figureId !== 'speaker' || !state || !state.listener) return 0;
    return speakerRotationDeg(p, state.listener);
  }

  function figureWorldRect(figureId, p, state) {
    return figureRect(figureId, p, figureRotation(figureId, p, state));
  }

  // Push the active figure out of overlap with any other figure using AABB
  // resolution. Picks the minimum-translation axis (least-displacement push)
  // so dragging feels like sliding along edges, not jumping past them.
  function applyCollisions(activeId, nx, ny, figs, state) {
    const others = Object.keys(figs).filter(id => id !== activeId);
    for (let iter = 0; iter < 4; iter++) {
      let moved = false;
      let activeRect = figureWorldRect(activeId, { x: nx, y: ny }, state);
      for (const other of others) {
        const o = state[other];
        const otherRect = figureWorldRect(other, o, state);
        if (!rectsOverlap(activeRect, otherRect)) continue;
        const overlapX = Math.min(activeRect.x + activeRect.w - otherRect.x,
                                  otherRect.x + otherRect.w - activeRect.x);
        const overlapY = Math.min(activeRect.y + activeRect.h - otherRect.y,
                                  otherRect.y + otherRect.h - activeRect.y);
        if (overlapX < overlapY) {
          const pushLeft = (activeRect.x + activeRect.w / 2) < (otherRect.x + otherRect.w / 2);
          nx += pushLeft ? -overlapX : overlapX;
        } else {
          const pushUp = (activeRect.y + activeRect.h / 2) < (otherRect.y + otherRect.h / 2);
          ny += pushUp ? -overlapY : overlapY;
        }
        moved = true;
        // Recompute the active world rect (with rotation if applicable).
        activeRect = figureWorldRect(activeId, { x: nx, y: ny }, state);
      }
      if (!moved) break;
    }
    return { x: nx, y: ny };
  }

  // Inflate a rectangle by `pad` pixels on each side. Used to give labels
  // a little breathing room around figures and other labels.
  function inflateRect(r, pad) {
    return { x: r.x - pad, y: r.y - pad, w: r.w + 2 * pad, h: r.h + 2 * pad };
  }

  // Place a label so its bounding box doesn't overlap any of the given
  // obstacle rectangles, using continuous (minimum-translation) displacement.
  // Start at the preferred position; for each overlapping obstacle, push the
  // label out along the axis of least penetration. Iterate until clean or
  // we hit the iteration cap. This produces smooth, gradual motion as a
  // figure approaches/passes the label.
  // opts: { labelPad, preferHorizontal }. preferHorizontal=true biases the
  // collision resolver to always push labels left/right rather than up/down.
  // Useful for labels that conceptually belong "along a line" (e.g. D_0
  // along the talker-listener axis).
  function placeLabelAvoidingRects(label, anchor, verticalOffset, maxY, figureRadius, obstacles, opts) {
    opts = opts || {};
    const { bg } = getLabelParts(label);
    const w = parseFloat(bg.getAttribute('width')) || 86;
    const h = parseFloat(bg.getAttribute('height')) || 28;
    const pad = opts.labelPad != null ? opts.labelPad : 6;
    const preferHorizontalAlways = !!opts.preferHorizontal;
    const minCx = w / 2 + 4;
    const maxCx = SVG_W - w / 2 - 4;
    const minCy = h / 2 + 4;

    // Preferred position: directly at anchor offset by verticalOffset.
    // We do NOT clamp Y up-front — we let the label fly off the top if its
    // preferred position is there, and only fall back if a collision push
    // requires displacement. This way the label only moves when its own
    // bounding box would actually conflict with something (an obstacle or
    // the canvas edge), not just because its anchor went high.
    let cx = clamp(anchor.x, minCx, maxCx);
    let cy = anchor.y - verticalOffset;

    // Track whether we've already clamped the label to minCy. If so, any
    // future "push up" by the iterative resolver would be a no-op, so we
    // bias the resolver toward horizontal pushes when we're stuck at the top.
    let stuckAtTop = false;

    // First: if the preferred Y is off the top of the canvas, clamp to minCy
    // immediately so the label is visible. We'll deal with figure overlaps
    // via the iterative pusher.
    if (cy < minCy) {
      cy = minCy;
      stuckAtTop = true;
    }
    if (cy > maxY) cy = maxY;

    // Iteratively push the label out of each obstacle.
    for (let iter = 0; iter < 8; iter++) {
      let moved = false;
      const myRect = { x: cx - w / 2, y: cy - h / 2, w, h };
      const padded = inflateRect(myRect, pad);
      for (const obs of obstacles) {
        if (!rectsOverlap(padded, obs)) continue;
        const overlapX = Math.min(padded.x + padded.w - obs.x,
                                  obs.x + obs.w - padded.x);
        const overlapY = Math.min(padded.y + padded.h - obs.y,
                                  obs.y + obs.h - padded.y);
        // Prefer horizontal pushes when (a) caller asked for it explicitly,
        // or (b) we're stuck at the canvas top (pushing up is impossible
        // and pushing down would drop the label below the figure).
        const preferHorizontal = preferHorizontalAlways || stuckAtTop;
        if (preferHorizontal || overlapX < overlapY) {
          const pushLeft = (padded.x + padded.w / 2) < (obs.x + obs.w / 2);
          cx += pushLeft ? -overlapX : overlapX;
        } else {
          const pushUp = (padded.y + padded.h / 2) < (obs.y + obs.h / 2);
          cy += pushUp ? -overlapY : overlapY;
        }
        cx = clamp(cx, minCx, maxCx);
        // Clamp downward too: if we were pushed below maxY, that's fine.
        // But if we're stuck at top, don't push DOWN past where we'd have
        // a clear sideways path — actually let it happen, that's the
        // fallback when there's no horizontal room.
        if (cy < minCy) { cy = minCy; stuckAtTop = true; }
        if (cy > maxY) cy = maxY;
        moved = true;
        myRect.x = cx - w / 2; myRect.y = cy - h / 2;
        padded.x = myRect.x - pad; padded.y = myRect.y - pad;
      }
      if (!moved) break;
    }

    label.setAttribute('transform',
      'translate(' + (cx - w / 2).toFixed(1) + ', ' + (cy - h / 2).toFixed(1) + ')');
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }

  // Convenience helper to build an obstacle list of figures + already-placed
  // labels. labelRects accumulates as the caller places each label.
  function buildObstacles(figs, state, excludeFigureId, labelRects) {
    const obstacles = [];
    for (const id of Object.keys(figs)) {
      if (id === excludeFigureId) continue;  // typically the anchor figure
      obstacles.push(figureWorldRect(id, state[id], state));
    }
    if (labelRects) {
      for (const r of labelRects) obstacles.push(r);
    }
    return obstacles;
  }

  // Place all four distance labels avoiding figures and each other.
  // labels: { DS, D1, D2, D0 } - label DOM elements.
  // figs:   { talker, mic, speaker, listener } - figure DOM elements.
  // state:  { talker, mic, speaker, listener } - figure positions.
  // maxY:   the bottom-clamp y for labels.
  function placeAllLabels(labels, figs, state, maxY) {
    // D_S anchored above talker, D_1 above speaker.
    // D_2 anchored at midpoint of speaker-listener line, D_0 at midpoint of
    // talker-listener line. Each label avoids ALL figures and already-placed
    // labels.
    const placedRects = [];
    const allFigureRects = Object.keys(figs)
      .filter(id => FIGURE_BBOX[id] && state[id])
      .map(id => figureWorldRect(id, state[id], state));

    // Helper that uses ALL figure rects (not excluding the anchor figure),
    // since labels should clear every figure including their own anchor.
    function placeLabel(label, anchor, verticalOffset, figureRadius, opts) {
      const obstacles = allFigureRects.concat(placedRects);
      const rect = placeLabelAvoidingRects(label, anchor, verticalOffset, maxY, figureRadius, obstacles, opts);
      placedRects.push(rect);
    }

    placeLabel(labels.DS, state.talker, 40, 22);
    placeLabel(labels.D1, state.speaker, 50, 22);
    // D_2 anchors at midpoint of speaker-listener line, placed above.
    // preferHorizontal: D_2 conceptually sits along that line; if the
    // speaker pushes into it, slide sideways rather than dropping below.
    const midD2 = { x: (state.speaker.x + state.listener.x) / 2, y: (state.speaker.y + state.listener.y) / 2 };
    placeLabel(labels.D2, midD2, 35, 12, { preferHorizontal: true });
    // D_0 anchors at midpoint of talker-listener line, placed BELOW (so we
    // shift the anchor downward by the desired offset and pass offset=0
    // to bias toward "near the anchor" with sideways fallbacks).
    // preferHorizontal: keep D_0 near the talker-listener line.
    const midD0 = { x: (state.talker.x + state.listener.x) / 2, y: (state.talker.y + state.listener.y) / 2 + 22 };
    placeLabel(labels.D0, midD0, 0, 12, { preferHorizontal: true });
  }

  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
    MIC_CAPSULE_REST_DEG,
    clamp, distPx, feet, fmtFeetInches,
    setLineEndpoints, setLabelText, positionLabel, positionLabelAbove,
    polarResponse, buildMicLobePath, tiltMicCapsule,
    applyCollisions, FIGURE_BBOX, figureRect, rectsOverlap,
    placeLabelAvoidingRects, buildObstacles, placeAllLabels,
    easeInOutCubic, prefersReduced,
  };
})();

(() => {
  'use strict';
  const { PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, positionLabel, positionLabelAbove, placeAllLabels,
          tiltMicCapsule, easeInOutCubic, prefersReduced } = PAG;

  const state = {
    talker:   { x: 80,                       y: T_Y,  fixedY: true  },
    mic:      { x: 80 + 7.08 * PX_PER_FT,    y: M_Y,  fixedY: true  },
    speaker:  { x: 390,                      y: 126,  fixedY: false },
    listener: { x: 80 + 49.42 * PX_PER_FT,   y: L_Y,  fixedY: true  },
  };

  const constraints = {
    talker:   { minX: 26, maxX: 870 },
    mic:      { minX: 26, maxX: 870 },
    speaker:  { minX: 32, maxX: 866, minY: 26, maxY: FLOOR_Y - 22 },
    listener: { minX: 26, maxX: 870 },
  };

  const svg = document.getElementById('stage');
  if (!svg) return;

  const figs = {
    talker:   document.getElementById('fig-talker'),
    mic:      document.getElementById('fig-mic'),
    speaker:  document.getElementById('fig-speaker'),
    listener: document.getElementById('fig-listener'),
  };
  const lineDS = document.getElementById('lineDS');
  const lineD1 = document.getElementById('lineD1');
  const lineD2 = document.getElementById('lineD2');
  const lineD0 = document.getElementById('lineD0');
  const labelDS = document.getElementById('labelDS');
  const labelD1 = document.getElementById('labelD1');
  const labelD2 = document.getElementById('labelD2');
  const labelD0 = document.getElementById('labelD0');
  const readDS = document.getElementById('readDS');
  const readD1 = document.getElementById('readD1');
  const readD2 = document.getElementById('readD2');
  const readD0 = document.getElementById('readD0');
  const pagValue   = document.getElementById('pagValue');
  const pagMeaning = document.getElementById('pagMeaning');

  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function buildGrid() {
    const g = document.getElementById('gridTicks');
    const startX = 26;
    const maxFt = Math.floor((874 - startX) / PX_PER_FT);
    const NS = 'http://www.w3.org/2000/svg';
    for (let ft = 0; ft <= maxFt; ft += 5) {
      const x = startX + ft * PX_PER_FT;
      const t = document.createElementNS(NS, 'line');
      t.setAttribute('class', 'grid-tick');
      t.setAttribute('x1', x); t.setAttribute('x2', x);
      t.setAttribute('y1', FLOOR_Y + 2);
      t.setAttribute('y2', FLOOR_Y + (ft % 10 === 0 ? 9 : 5));
      g.appendChild(t);
      if (ft % 10 === 0 && ft <= maxFt - 2) {
        const lab = document.createElementNS(NS, 'text');
        lab.setAttribute('class', 'grid-label');
        lab.setAttribute('x', x);
        lab.setAttribute('y', FLOOR_Y + 22);
        lab.setAttribute('text-anchor', 'middle');
        lab.textContent = ft + ' ft';
        g.appendChild(lab);
      }
    }
  }

  function compute() {
    const t = state.talker, m = state.mic, s = state.speaker, l = state.listener;
    const Ds = feet(distPx(t, m));
    const D1 = feet(distPx(m, s));
    const D2 = feet(distPx(s, l));
    const D0 = feet(distPx(t, l));

    let pag;
    if (Ds <= 0.001 || D2 <= 0.001) pag = Infinity;
    else if (D1 <= 0.001) pag = -Infinity;
    else pag = 20 * Math.log10((D1 / Ds) * (D0 / D2));

    return { Ds, D1, D2, D0, pag };
  }

  function pagGloss(pag) {
    if (!isFinite(pag) && pag < 0)
      return { cls: 'bad', title: 'Worse than nothing', body: 'The loudspeaker has reached the microphone before the talker can.' };
    if (!isFinite(pag))
      return { cls: 'good', title: 'Infinite headroom', body: 'A geometric degenerate case. The math has run off the rails.' };
    if (pag <= -1)
      return { cls: 'bad', title: 'Worse than nothing', body: 'The system makes things worse, not louder. Feedback hits before any benefit.' };
    if (pag < 3)
      return { cls: 'bad', title: 'Hopeless night', body: 'The fader will hit feedback almost the moment you can hear a difference.' };
    if (pag < 10)
      return { cls: '',    title: 'Tight margin', body: 'A few dB before feedback. Possible, but uncomfortable to mix.' };
    if (pag < 18)
      return { cls: '',    title: 'Modest headroom', body: 'About ' + Math.round(pag) + ' dB above the acoustic level before feedback bites.' };
    if (pag < 30)
      return { cls: 'good', title: 'Good headroom', body: 'Plenty of room to mix. The kind of night where the work feels easy.' };
    return { cls: 'good', title: 'Plenty of room', body: 'You almost have to bury the fader before you find feedback.' };
  }

  function render() {
    for (const id of Object.keys(state)) {
      const p = state[id];
      let xform = 'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ')';
      if (id === 'speaker') {
        const dx = state.listener.x - p.x;
        const dy = state.listener.y - p.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        xform += ' rotate(' + angle.toFixed(1) + ')';
      }
      figs[id].setAttribute('transform', xform);
    }

    tiltMicCapsule(figs.mic, state.talker, state.mic);

    const { Ds, D1, D2, D0, pag } = compute();

    setLineEndpoints(lineDS, state.talker,  state.mic);
    setLineEndpoints(lineD1, state.mic,     state.speaker);
    setLineEndpoints(lineD2, state.speaker, state.listener);
    setLineEndpoints(lineD0, state.talker,  state.listener);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs, state, 380
    );

    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    const dec = (v) => '<span class="decimal">' + v.toFixed(1) + ' ft</span>';
    readDS.innerHTML = fmtFeetInches(Ds) + ' ' + dec(Ds);
    readD1.innerHTML = fmtFeetInches(D1) + ' ' + dec(D1);
    readD2.innerHTML = fmtFeetInches(D2) + ' ' + dec(D2);
    readD0.innerHTML = fmtFeetInches(D0) + ' ' + dec(D0);

    let pagDisplay;
    if (!isFinite(pag)) pagDisplay = pag < 0 ? '−∞' : '+∞';
    else pagDisplay = (pag >= 0 ? '' : '−') + Math.abs(pag).toFixed(1);
    const newPagHtml = pagDisplay + '<span class="unit">dB</span>';
    if (pagValue.__lastHtml !== newPagHtml) {
      pagValue.innerHTML = newPagHtml;
      pagValue.__lastHtml = newPagHtml;
    }

    // Only churn the meaning box when the gloss bucket actually changes.
    const gloss = pagGloss(pag);
    if (pagMeaning.__lastTitle !== gloss.title) {
      pagValue.classList.remove('bad', 'good');
      if (gloss.cls) pagValue.classList.add(gloss.cls);
      pagMeaning.innerHTML = '<strong>' + gloss.title + '</strong>' + gloss.body;
      pagMeaning.__lastTitle = gloss.title;
    }
  }

  // --- Drag ---
  let active = null;
  let dragOffset = { x: 0, y: 0 };

  function startDrag(evt, id) {
    active = id;
    figs[id].classList.add('dragging');
    const p = svgPoint(evt);
    dragOffset.x = p.x - state[id].x;
    dragOffset.y = p.y - state[id].y;
    try { evt.target.setPointerCapture && evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    evt.preventDefault();
  }
  function moveDrag(evt) {
    if (!active) return;
    const p = svgPoint(evt);
    const c = constraints[active];
    let nx = p.x - dragOffset.x;
    let ny = state[active].fixedY ? state[active].y : (p.y - dragOffset.y);
    nx = clamp(nx, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);
    state[active].x = nx;
    state[active].y = ny;
    render();
  }
  function endDrag() {
    if (!active) return;
    figs[active].classList.remove('dragging');
    active = null;
  }

  for (const id of Object.keys(figs)) {
    const el = figs[id];
    el.addEventListener('pointerdown', (e) => startDrag(e, id));
  }
  svg.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  for (const id of Object.keys(figs)) {
    const el = figs[id];
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', id + ', drag or use arrow keys to move');
    el.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 1 : 6;
      let moved = false;
      const p = state[id];
      const c = constraints[id];
      if (e.key === 'ArrowLeft')  { p.x = clamp(p.x - step, c.minX, c.maxX); moved = true; }
      if (e.key === 'ArrowRight') { p.x = clamp(p.x + step, c.minX, c.maxX); moved = true; }
      if (!p.fixedY && (e.key === 'ArrowUp'))   { p.y = clamp(p.y - step, c.minY, c.maxY); moved = true; }
      if (!p.fixedY && (e.key === 'ArrowDown')) { p.y = clamp(p.y + step, c.minY, c.maxY); moved = true; }
      if (moved) { e.preventDefault(); render(); }
    });
    el.addEventListener('focus', () => el.classList.add('active'));
    el.addEventListener('blur',  () => el.classList.remove('active'));
  }

  // --- Presets ---
  const presets = {
    default: {
      talker:   { x: 80,  y: T_Y },
      mic:      { x: 80 + 7.08 * PX_PER_FT, y: M_Y },
      speaker:  { x: 390, y: 126 },
      listener: { x: 80 + 49.42 * PX_PER_FT, y: L_Y },
    },
    leanIn: {
      talker:   { x: 158, y: T_Y },
      mic:      { x: 172, y: M_Y },
      speaker:  { x: 390, y: 126 },
      listener: { x: 80 + 49.42 * PX_PER_FT, y: L_Y },
    },
    speakerClose: {
      talker:   { x: 80,  y: T_Y },
      mic:      { x: 172, y: M_Y },
      speaker:  { x: 235, y: 265 },
      listener: { x: 80 + 49.42 * PX_PER_FT, y: L_Y },
    },
    speakerOverhead: {
      talker:   { x: 80,  y: T_Y },
      mic:      { x: 172, y: M_Y },
      speaker:  { x: 705, y: 145 },
      listener: { x: 80 + 49.42 * PX_PER_FT, y: L_Y },
    },
    micDownstage: {
      talker:   { x: 80,  y: T_Y },
      mic:      { x: 330, y: M_Y },
      speaker:  { x: 390, y: 126 },
      listener: { x: 80 + 49.42 * PX_PER_FT, y: L_Y },
    },
    zero: {
      talker:   { x: 80,  y: T_Y },
      mic:      { x: 172, y: M_Y },
      speaker:  { x: 205, y: 280 },
      listener: { x: 80 + 49.42 * PX_PER_FT, y: L_Y },
    },
  };

  function tweenTo(targets, duration) {
    duration = (prefersReduced ? 0 : (duration || 700));
    if (duration === 0) {
      for (const id of Object.keys(state)) {
        if (targets[id]) { state[id].x = targets[id].x; state[id].y = targets[id].y; }
      }
      render();
      return;
    }
    const start = performance.now();
    const from = {};
    for (const id of Object.keys(state)) from[id] = { x: state[id].x, y: state[id].y };
    function step(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const k = easeInOutCubic(t);
      for (const id of Object.keys(state)) {
        if (!targets[id]) continue;
        state[id].x = from[id].x + (targets[id].x - from[id].x) * k;
        state[id].y = from[id].y + (targets[id].y - from[id].y) * k;
      }
      render();
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('.exp-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      if (presets[key]) tweenTo(presets[key]);
    });
  });

  buildGrid();
  render();
})();


/* =====================================================================
   Slide navigation (lives outside the slide-0 IIFE so it runs even when
   slide 0 no longer hosts the interactive stage).
   ===================================================================== */
(() => {
  'use strict';
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  const totalSlides = slides.length;
  let currentSlide  = 0;
  // Find the initially-active slide from the DOM so deep links / refresh
  // keep their place.
  slides.forEach((s, idx) => { if (s.classList.contains('is-active')) currentSlide = idx; });

  const slideNav   = document.querySelector('.slide-nav');
  const navPrev    = document.querySelector('.slide-nav .prev');
  const navNext    = document.querySelector('.slide-nav .next');
  const navIndicator = document.querySelector('.slide-nav .indicator');
  const navCurrent = document.querySelector('.slide-nav .indicator .current');
  const navTotal   = document.querySelector('.slide-nav .indicator .total');
  const jumpMenu   = document.querySelector('.slide-nav .slide-jump');
  if (navTotal) navTotal.textContent = totalSlides;
  if (navCurrent) navCurrent.textContent = currentSlide + 1;

  // Extract the title for a given slide. Slide 0 has no .slide-eyebrow
  // (it uses the masthead instead). Slides 1+ use the pattern
  // "Potential acoustic gain · NN · Title" — we want just the Title segment.
  function slideTitle(slide, idx) {
    if (idx === 0) return 'Introduction';
    const eyebrow = slide.querySelector('.slide-eyebrow');
    if (!eyebrow) return '';
    // Pull text only (the separator spans render as "·"); split on "·".
    const parts = eyebrow.textContent.split('·').map(s => s.trim()).filter(Boolean);
    return parts[parts.length - 1] || '';
  }

  if (jumpMenu) {
    for (let i = 0; i < totalSlides; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slide-jump-item';
      btn.setAttribute('role', 'menuitem');
      btn.dataset.slide = String(i);
      const num = document.createElement('span');
      num.className = 'slide-jump-num';
      num.textContent = String(i + 1).padStart(2, '0');
      const title = document.createElement('span');
      title.className = 'slide-jump-title';
      title.textContent = slideTitle(slides[i], i);
      btn.appendChild(num);
      btn.appendChild(title);
      if (i === currentSlide) btn.classList.add('is-current');
      jumpMenu.appendChild(btn);
    }
  }

  function setJumpOpen(open) {
    if (!jumpMenu || !navIndicator) return;
    jumpMenu.hidden = !open;
    navIndicator.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // The slide-host is the wrapper around all the slides. Scrolling it to
  // the top of the viewport on every slide change gives each slide the
  // same vertical starting point — otherwise long slides (especially
  // slide 0's intro page) leave later slides scrolled past their headers.
  const slideHost = document.querySelector('.slide-host');

  function showSlide(i) {
    const next = Math.max(0, Math.min(totalSlides - 1, i));
    const changed = next !== currentSlide;
    currentSlide = next;
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === currentSlide));
    if (navCurrent) navCurrent.textContent = currentSlide + 1;
    if (navPrev) navPrev.disabled = currentSlide === 0;
    if (navNext) navNext.disabled = currentSlide === totalSlides - 1;
    if (jumpMenu) {
      jumpMenu.querySelectorAll('.slide-jump-item').forEach((btn, idx) => {
        btn.classList.toggle('is-current', idx === currentSlide);
      });
    }
    const activeSlide = slides[currentSlide];
    if (activeSlide) {
      requestAnimationFrame(() => {
        activeSlide.dispatchEvent(new CustomEvent('pag:slide-active', { bubbles: true }));
      });
    }
    if (changed && slideHost) {
      // Match the scroll position you'd land at if you opened the page on
      // slide 1: the top of the slide-host, with whatever margin sits above
      // it (the site nav) still visible.
      const top = slideHost.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  if (navPrev) {
    navPrev.disabled = currentSlide === 0;
    navPrev.addEventListener('click', () => showSlide(currentSlide - 1));
  }
  if (navNext) {
    navNext.disabled = currentSlide === totalSlides - 1;
    navNext.addEventListener('click', () => showSlide(currentSlide + 1));
  }
  if (navIndicator && jumpMenu) {
    navIndicator.addEventListener('click', () => setJumpOpen(jumpMenu.hidden));
  }
  if (jumpMenu) {
    jumpMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('.slide-jump-item');
      if (!btn) return;
      showSlide(parseInt(btn.dataset.slide, 10));
      setJumpOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (jumpMenu.hidden) return;
      if (slideNav && slideNav.contains(e.target)) return;
      setJumpOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !jumpMenu.hidden) setJumpOpen(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.target && e.target.closest && e.target.closest('.figure')) return;
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft')  showSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
  });
})();


/* =====================================================================
   Slide 5 — Interactive PAG explorer
   Same drag pattern as slide 0, plus ordering constraints.
   ===================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('stage5');
  if (!stage) return;
  const { PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, positionLabel, positionLabelAbove, placeAllLabels,
          tiltMicCapsule, applyCollisions } = PAG;

  const state = {
    talker:   { x: 80,                       y: T_Y,  fixedY: true  },
    mic:      { x: 80 + 7.08 * PX_PER_FT,    y: M_Y,  fixedY: true  },
    speaker:  { x: 390,                      y: 126,  fixedY: false },
    listener: { x: 80 + 49.42 * PX_PER_FT,   y: L_Y,  fixedY: true  },
  };

  const constraints = {
    talker:   { minX: 26, maxX: 870 },
    mic:      { minX: 26, maxX: 870 },
    speaker:  { minX: 32, maxX: 866, minY: 26, maxY: FLOOR_Y - 22 },
    listener: { minX: 26, maxX: 870 },
  };

  const MIN_GAP_TM = 22;
  const MIN_GAP_ML = 50;

  const figs = {
    talker:   document.getElementById('s5-fig-talker'),
    mic:      document.getElementById('s5-fig-mic'),
    speaker:  document.getElementById('s5-fig-speaker'),
    listener: document.getElementById('s5-fig-listener'),
  };
  const lineDS = document.getElementById('s5-lineDS');
  const lineD1 = document.getElementById('s5-lineD1');
  const lineD2 = document.getElementById('s5-lineD2');
  const lineD0 = document.getElementById('s5-lineD0');
  const labelDS = document.getElementById('s5-labelDS');
  const labelD1 = document.getElementById('s5-labelD1');
  const labelD2 = document.getElementById('s5-labelD2');
  const labelD0 = document.getElementById('s5-labelD0');
  const numDS = document.getElementById('s5-numDS');
  const numD1 = document.getElementById('s5-numD1');
  const numD2 = document.getElementById('s5-numD2');
  const numD0 = document.getElementById('s5-numD0');
  const pagValueEl = document.getElementById('s5-pagValue');

  function svgPoint(evt) {
    const pt = stage.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(stage.getScreenCTM().inverse());
  }

  function compute() {
    const t = state.talker, m = state.mic, s = state.speaker, l = state.listener;
    const Ds = feet(distPx(t, m));
    const D1 = feet(distPx(m, s));
    const D2 = feet(distPx(s, l));
    const D0 = feet(distPx(t, l));
    let pag;
    if (Ds <= 0.001 || D2 <= 0.001) pag = Infinity;
    else if (D1 <= 0.001) pag = -Infinity;
    else pag = 20 * Math.log10((D1 / Ds) * (D0 / D2));
    return { Ds, D1, D2, D0, pag };
  }

  function render() {
    for (const id of Object.keys(state)) {
      const p = state[id];
      let xform = 'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ')';
      if (id === 'speaker') {
        const dx = state.listener.x - p.x;
        const dy = state.listener.y - p.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        xform += ' rotate(' + angle.toFixed(1) + ')';
      }
      figs[id].setAttribute('transform', xform);
    }

    tiltMicCapsule(figs.mic, state.talker, state.mic);

    const { Ds, D1, D2, D0, pag } = compute();

    setLineEndpoints(lineDS, state.talker,  state.mic);
    setLineEndpoints(lineD1, state.mic,     state.speaker);
    setLineEndpoints(lineD2, state.speaker, state.listener);
    setLineEndpoints(lineD0, state.talker,  state.listener);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs, state, 380
    );

    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    numDS.textContent = Ds.toFixed(2);
    numD1.textContent = D1.toFixed(2);
    numD2.textContent = D2.toFixed(2);
    numD0.textContent = D0.toFixed(2);

    let pagDisplay;
    if (!isFinite(pag)) pagDisplay = pag < 0 ? '−∞ dB' : '+∞ dB';
    else pagDisplay = (pag >= 0 ? '' : '−') + Math.abs(pag).toFixed(1) + ' dB';
    pagValueEl.textContent = pagDisplay;
  }

  let active = null;
  let dragOffset = { x: 0, y: 0 };

  function startDrag(evt, id) {
    active = id;
    figs[id].classList.add('dragging');
    const p = svgPoint(evt);
    dragOffset.x = p.x - state[id].x;
    dragOffset.y = p.y - state[id].y;
    try { evt.target.setPointerCapture && evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    evt.preventDefault();
  }

  function moveDrag(evt) {
    if (!active) return;
    const p = svgPoint(evt);
    const c = constraints[active];
    let nx = p.x - dragOffset.x;
    let ny = state[active].fixedY ? state[active].y : (p.y - dragOffset.y);
    nx = clamp(nx, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);

    if (active === 'talker') {
      nx = Math.min(nx, state.mic.x - MIN_GAP_TM);
    } else if (active === 'mic') {
      nx = Math.max(nx, state.talker.x + MIN_GAP_TM);
      nx = Math.min(nx, state.listener.x - MIN_GAP_ML);
    } else if (active === 'listener') {
      nx = Math.max(nx, state.mic.x + MIN_GAP_ML);
    }

    // 2D collision: push away from any other figure that we'd overlap.
    const resolved = applyCollisions(active, nx, ny, figs, state);
    nx = clamp(resolved.x, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(resolved.y, c.minY, c.maxY);

    state[active].x = nx;
    state[active].y = ny;
    render();
  }

  function endDrag() {
    if (!active) return;
    figs[active].classList.remove('dragging');
    active = null;
  }

  for (const id of Object.keys(figs)) {
    figs[id].addEventListener('pointerdown', (e) => {
      dismissHint();
      startDrag(e, id);
    });
  }
  stage.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // --- Drag hint: a brief banner + figure pulse when the user lands on this
  // slide for the first time in the session. Dismisses on first drag or
  // after an auto-fade timeout.
  const hint = document.getElementById('s5-drag-hint');
  let hintTimer = null;
  let hintShown = false;

  function dismissHint() {
    if (hint) hint.classList.remove('is-visible');
    stage.classList.remove('is-pulsing');
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
  }

  function showHint() {
    if (hintShown || !hint) return;
    hintShown = true;
    requestAnimationFrame(() => {
      hint.classList.add('is-visible');
      stage.classList.add('is-pulsing');
    });
    // Pulse animation is ~1.2s × 2 = 2.4s; banner lingers a bit longer.
    hintTimer = setTimeout(() => {
      hint.classList.remove('is-visible');
      stage.classList.remove('is-pulsing');
      hintTimer = null;
    }, 5500);
  }

  stage.closest('.slide').addEventListener('pag:slide-active', () => {
    render();
    showHint();
  });
  render();
  // If slide 5 is the initially-active slide, fire the hint after first render.
  if (stage.closest('.slide').classList.contains('is-active')) {
    showHint();
  }
})();


/* =====================================================================
   Slide 6 — Relationships demo
   Click the eye to step through key relationships that improve PAG.
   ===================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('stage6');
  if (!stage) return;
  const { PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, positionLabel, positionLabelAbove, placeAllLabels,
          tiltMicCapsule, applyCollisions,
          easeInOutCubic, prefersReduced } = PAG;

  // Canonical baseline geometry — matches slide 4.
  // D_S=7'1", D_1=22'7", D_2=30'2", D_0=49'5". PAG = 14.4 dB.
  const baseline = {
    talker:   { x: 80,  y: T_Y },
    mic:      { x: 172, y: M_Y },
    speaker:  { x: 390, y: 126 },
    listener: { x: 722, y: L_Y },
  };

  // Each scenario's overrides accumulate on the baseline (not on each other);
  // see showState(). Coordinates are chosen to reproduce the canonical
  // distances and PAG values from Digital Sound & Music's slide 7.
  // Speaker y is kept >= ~140 so the D₁ label (which sits 50 px above the
  // speaker) doesn't ride up into the relationship caption at y=56.
  const states = [
    { caption: '',                                                                            overrides: {} },
    { caption: 'Moving the loudspeaker further away from the microphone',                     overrides: { speaker: { x: 390, y: 140 } } },
    { caption: 'Moving the loudspeaker closer to the listener',                               overrides: { speaker: { x: 513, y: 165 } } },
    { caption: 'Moving the sound source closer to the microphone (or vice versa)',            overrides: { speaker: { x: 513, y: 165 }, talker: { x: 160, y: T_Y } } },
  ];

  let currentState = 0;
  const state = {
    talker:   { ...baseline.talker,   fixedY: true  },
    mic:      { ...baseline.mic,      fixedY: true  },
    speaker:  { ...baseline.speaker,  fixedY: false },
    listener: { ...baseline.listener, fixedY: true  },
  };

  const dragConstraints = {
    talker:   { minX: 26, maxX: 870 },
    mic:      { minX: 26, maxX: 870 },
    speaker:  { minX: 32, maxX: 866, minY: 26, maxY: FLOOR_Y - 22 },
    listener: { minX: 26, maxX: 870 },
  };
  const MIN_GAP_TM = 22;
  const MIN_GAP_ML = 50;

  const figs = {
    talker:   document.getElementById('s6-fig-talker'),
    mic:      document.getElementById('s6-fig-mic'),
    speaker:  document.getElementById('s6-fig-speaker'),
    listener: document.getElementById('s6-fig-listener'),
  };
  const lineDS = document.getElementById('s6-lineDS');
  const lineD1 = document.getElementById('s6-lineD1');
  const lineD2 = document.getElementById('s6-lineD2');
  const lineD0 = document.getElementById('s6-lineD0');
  const labelDS = document.getElementById('s6-labelDS');
  const labelD1 = document.getElementById('s6-labelD1');
  const labelD2 = document.getElementById('s6-labelD2');
  const labelD0 = document.getElementById('s6-labelD0');
  const captionEl = document.getElementById('s6-caption');
  const pagValueEl = document.getElementById('s6-pagValue');
  const revealBtn = document.getElementById('s6-reveal');
  const revealLabel = document.getElementById('s6-revealLabel');

  function compute() {
    const t = state.talker, m = state.mic, s = state.speaker, l = state.listener;
    const Ds = feet(distPx(t, m));
    const D1 = feet(distPx(m, s));
    const D2 = feet(distPx(s, l));
    const D0 = feet(distPx(t, l));
    let pag;
    if (Ds <= 0.001 || D2 <= 0.001) pag = Infinity;
    else if (D1 <= 0.001) pag = -Infinity;
    else pag = 20 * Math.log10((D1 / Ds) * (D0 / D2));
    return { Ds, D1, D2, D0, pag };
  }

  function render() {
    for (const id of Object.keys(state)) {
      const p = state[id];
      let xform = 'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ')';
      if (id === 'speaker') {
        const dx = state.listener.x - p.x;
        const dy = state.listener.y - p.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        xform += ' rotate(' + angle.toFixed(1) + ')';
      }
      figs[id].setAttribute('transform', xform);
    }

    tiltMicCapsule(figs.mic, state.talker, state.mic);

    const { Ds, D1, D2, D0, pag } = compute();

    setLineEndpoints(lineDS, state.talker,  state.mic);
    setLineEndpoints(lineD1, state.mic,     state.speaker);
    setLineEndpoints(lineD2, state.speaker, state.listener);
    setLineEndpoints(lineD0, state.talker,  state.listener);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs, state, 380
    );

    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    let pagDisplay;
    if (!isFinite(pag)) pagDisplay = pag < 0 ? '−∞ dB' : '+∞ dB';
    else pagDisplay = (pag >= 0 ? '' : '−') + Math.abs(pag).toFixed(1) + ' dB';
    pagValueEl.textContent = pagDisplay;
  }

  function tweenTo(targets, duration) {
    duration = (prefersReduced ? 0 : (duration || 700));
    if (duration === 0) {
      for (const id of Object.keys(state)) {
        if (targets[id]) { state[id].x = targets[id].x; state[id].y = targets[id].y; }
      }
      render();
      return;
    }
    const start = performance.now();
    const from = {};
    for (const id of Object.keys(state)) from[id] = { x: state[id].x, y: state[id].y };
    function step(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const k = easeInOutCubic(t);
      for (const id of Object.keys(state)) {
        if (!targets[id]) continue;
        state[id].x = from[id].x + (targets[id].x - from[id].x) * k;
        state[id].y = from[id].y + (targets[id].y - from[id].y) * k;
      }
      render();
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function showState(index) {
    currentState = index;
    const def = states[index];

    const targets = {};
    for (const id of Object.keys(baseline)) {
      targets[id] = { ...baseline[id], ...(def.overrides[id] || {}) };
    }

    captionEl.setAttribute('opacity', '0');
    setTimeout(() => {
      captionEl.textContent = def.caption;
      captionEl.setAttribute('opacity', def.caption ? '1' : '0');
    }, 220);

    tweenTo(targets, 700);

    if (index === 0) {
      revealLabel.textContent = 'Show the first relationship';
      revealBtn.setAttribute('aria-label', 'Show the first relationship');
    } else if (index < states.length - 1) {
      revealLabel.textContent = 'Show the next relationship';
      revealBtn.setAttribute('aria-label', 'Show the next relationship');
    } else {
      revealLabel.textContent = 'Show it to me again';
      revealBtn.setAttribute('aria-label', 'Show it to me again');
    }
  }

  let active = null;
  let dragOffset = { x: 0, y: 0 };

  function svgPoint(evt) {
    const pt = stage.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(stage.getScreenCTM().inverse());
  }

  function exitDemoCycle() {
    currentState = 0;
    captionEl.setAttribute('opacity', '0');
    setTimeout(() => { captionEl.textContent = ''; }, 220);
    revealLabel.textContent = 'Show the first relationship';
    revealBtn.setAttribute('aria-label', 'Show the first relationship');
  }

  function startDrag(evt, id) {
    active = id;
    figs[id].classList.add('dragging');
    const p = svgPoint(evt);
    dragOffset.x = p.x - state[id].x;
    dragOffset.y = p.y - state[id].y;
    try { evt.target.setPointerCapture && evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    evt.preventDefault();
    exitDemoCycle();
  }

  function moveDrag(evt) {
    if (!active) return;
    const p = svgPoint(evt);
    const c = dragConstraints[active];
    let nx = p.x - dragOffset.x;
    let ny = state[active].fixedY ? state[active].y : (p.y - dragOffset.y);
    nx = clamp(nx, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);

    if (active === 'talker') {
      nx = Math.min(nx, state.mic.x - MIN_GAP_TM);
    } else if (active === 'mic') {
      nx = Math.max(nx, state.talker.x + MIN_GAP_TM);
      nx = Math.min(nx, state.listener.x - MIN_GAP_ML);
    } else if (active === 'listener') {
      nx = Math.max(nx, state.mic.x + MIN_GAP_ML);
    }

    // 2D collision: push away from any other figure that we'd overlap.
    const resolved = applyCollisions(active, nx, ny, figs, state);
    nx = clamp(resolved.x, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(resolved.y, c.minY, c.maxY);

    state[active].x = nx;
    state[active].y = ny;
    render();
  }

  function endDrag() {
    if (!active) return;
    figs[active].classList.remove('dragging');
    active = null;
  }

  for (const id of Object.keys(figs)) {
    figs[id].addEventListener('pointerdown', (e) => startDrag(e, id));
  }
  stage.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  revealBtn.addEventListener('click', () => {
    showState((currentState + 1) % states.length);
  });

  stage.closest('.slide').addEventListener('pag:slide-active', () => render());
  render();
})();


/* =====================================================================
   Slide 7 — Microphone directivity
   Adds a polar pattern correction to PAG. The mic's on-axis direction
   points at the talker; the off-axis angle to the loudspeaker drives
   the rejection (in dB) added on top of the geometric PAG.
   ===================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('stage7');
  if (!stage) return;
  const { PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, positionLabel, positionLabelAbove, placeAllLabels,
          tiltMicCapsule, applyCollisions,
          polarResponse, buildMicLobePath } = PAG;

  // Baseline geometry: D_S=9'3", D_1=14'4", D_2=35'2", D_0=51'7".
  // PAG omni ≈ 7.1 dB. Deliberately different from the canonical demo's
  // starting position so this slide can stand on its own.
  const state = {
    talker:   { x: 80,    y: T_Y,  fixedY: true  },
    mic:      { x: 200,   y: M_Y,  fixedY: true  },
    speaker:  { x: 320,   y: 180,  fixedY: false },
    listener: { x: 750,   y: L_Y,  fixedY: true  },
    pattern:  'omni',
  };

  const constraints = {
    talker:   { minX: 26, maxX: 870 },
    mic:      { minX: 26, maxX: 870 },
    speaker:  { minX: 32, maxX: 866, minY: 26, maxY: FLOOR_Y - 22 },
    listener: { minX: 26, maxX: 870 },
  };

  const MIN_GAP_TM = 22;
  const MIN_GAP_ML = 50;

  const figs = {
    talker:   document.getElementById('s7-fig-talker'),
    mic:      document.getElementById('s7-fig-mic'),
    speaker:  document.getElementById('s7-fig-speaker'),
    listener: document.getElementById('s7-fig-listener'),
  };
  const lineDS = document.getElementById('s7-lineDS');
  const lineD1 = document.getElementById('s7-lineD1');
  const lineD2 = document.getElementById('s7-lineD2');
  const lineD0 = document.getElementById('s7-lineD0');
  const labelDS = document.getElementById('s7-labelDS');
  const labelD1 = document.getElementById('s7-labelD1');
  const labelD2 = document.getElementById('s7-labelD2');
  const labelD0 = document.getElementById('s7-labelD0');
  const onAxisLine = document.getElementById('s7-onaxis');
  const angleArc = document.getElementById('s7-angleArc');
  const angleLabel = document.getElementById('s7-angleLabel');
  const polarLobe = document.getElementById('s7-polarLobe');
  const polarLobePath = document.getElementById('s7-polarLobePath');
  const pagValueEl = document.getElementById('s7-pagValue');

  // Microphone directivity correction in dB. Capped at 25 dB max rejection
  // (real mics don't achieve infinite null due to frequency-dependent
  // pattern broadening — see MATH.md).
  const NULL_CAP_LINEAR = Math.pow(10, -25 / 20);
  function micCorrectionDb(pattern, theta) {
    const D = Math.abs(polarResponse(pattern, theta));
    const Dclamped = Math.max(D, NULL_CAP_LINEAR);
    return -20 * Math.log10(Dclamped);
  }

  function compute() {
    const t = state.talker, m = state.mic, s = state.speaker, l = state.listener;
    const Ds = feet(distPx(t, m));
    const D1 = feet(distPx(m, s));
    const D2 = feet(distPx(s, l));
    const D0 = feet(distPx(t, l));
    let pagOmni;
    if (Ds <= 0.001 || D2 <= 0.001) pagOmni = Infinity;
    else if (D1 <= 0.001) pagOmni = -Infinity;
    else pagOmni = 20 * Math.log10((D1 / Ds) * (D0 / D2));

    // Off-axis angle at the mic, between (mic→talker) and (mic→speaker).
    const va = { x: t.x - m.x, y: t.y - m.y };
    const vb = { x: s.x - m.x, y: s.y - m.y };
    const la = Math.hypot(va.x, va.y) || 1;
    const lb = Math.hypot(vb.x, vb.y) || 1;
    const dot = (va.x * vb.x + va.y * vb.y) / (la * lb);
    const theta = Math.acos(clamp(dot, -1, 1));
    const corrDb = micCorrectionDb(state.pattern, theta);

    return { Ds, D1, D2, D0, pagOmni, theta, corrDb };
  }

  const LOBE_SCALE = 30;  // px at full unity response
  // Cache pre-computed lobe paths per pattern — lobe shape depends only on
  // the polar pattern, not on figure positions, so rebuilding the 97-sample
  // path on every drag frame is wasted work.
  const lobePathCache = {};
  function getLobePath(pattern) {
    if (!(pattern in lobePathCache)) {
      lobePathCache[pattern] = buildMicLobePath(pattern, LOBE_SCALE);
    }
    return lobePathCache[pattern];
  }

  function render() {
    // Talker, mic, listener: simple translate.
    for (const id of ['talker', 'mic', 'listener']) {
      const p = state[id];
      figs[id].setAttribute('transform', 'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ')');
    }

    // Speaker: rotate to face listener.
    {
      const p = state.speaker;
      const dx = state.listener.x - p.x;
      const dy = state.listener.y - p.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      figs.speaker.setAttribute('transform',
        'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')');
    }

    const { Ds, D1, D2, D0, pagOmni, theta, corrDb } = compute();

    tiltMicCapsule(figs.mic, state.talker, state.mic);

    // Mic on-axis: point from mic toward talker.
    {
      const m = state.mic, t = state.talker;
      const dx = t.x - m.x, dy = t.y - m.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      // Draw on-axis indicator: from mic, extending past talker a bit.
      const end = { x: m.x + ux * 70, y: m.y + uy * 70 };
      onAxisLine.setAttribute('x1', m.x.toFixed(1));
      onAxisLine.setAttribute('y1', m.y.toFixed(1));
      onAxisLine.setAttribute('x2', end.x.toFixed(1));
      onAxisLine.setAttribute('y2', end.y.toFixed(1));
      // Mic on-axis direction in degrees (for rotating the polar lobe).
      const onAxisDeg = Math.atan2(dy, dx) * 180 / Math.PI;
      polarLobe.setAttribute('transform',
        'translate(' + m.x.toFixed(1) + ', ' + m.y.toFixed(1) + ') rotate(' + onAxisDeg.toFixed(1) + ')');
      polarLobePath.setAttribute('d', getLobePath(state.pattern));
      // Hide lobe for omni so the giant circle doesn't dominate.
      polarLobe.setAttribute('opacity', state.pattern === 'omni' ? '0.35' : '1');
    }

    // Angle arc between mic-talker and mic-speaker, centered at mic.
    {
      const m = state.mic, t = state.talker, s = state.speaker;
      const aT = Math.atan2(t.y - m.y, t.x - m.x);
      const aS = Math.atan2(s.y - m.y, s.x - m.x);
      const r = 26;
      // Sweep direction: pick the shorter way.
      let delta = aS - aT;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      const sweepFlag = delta > 0 ? 1 : 0;
      const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
      const p1 = { x: m.x + r * Math.cos(aT), y: m.y + r * Math.sin(aT) };
      const p2 = { x: m.x + r * Math.cos(aS), y: m.y + r * Math.sin(aS) };
      angleArc.setAttribute('d', `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
      // Pin the degree reading to the bottom-right of the polar pattern.
      angleLabel.setAttribute('x', (m.x + 36).toFixed(1));
      angleLabel.setAttribute('y', (m.y + 30).toFixed(1));
      angleLabel.textContent = Math.round(theta * 180 / Math.PI) + '°';
    }

    setLineEndpoints(lineDS, state.talker,  state.mic);
    setLineEndpoints(lineD1, state.mic,     state.speaker);
    setLineEndpoints(lineD2, state.speaker, state.listener);
    setLineEndpoints(lineD0, state.talker,  state.listener);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs, state, 380
    );

    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    // PAG display: breakdown form. "4.5 dB + 12 dB = 16.5 dB"
    let baseStr, corrStr, totalStr;
    if (!isFinite(pagOmni)) {
      baseStr = pagOmni < 0 ? '−∞ dB' : '+∞ dB';
      totalStr = baseStr;
      corrStr = '+' + corrDb.toFixed(1) + ' dB';
    } else {
      baseStr = (pagOmni >= 0 ? '' : '−') + Math.abs(pagOmni).toFixed(1) + ' dB';
      corrStr = '+ ' + corrDb.toFixed(1) + ' dB';
      const total = pagOmni + corrDb;
      totalStr = (total >= 0 ? '' : '−') + Math.abs(total).toFixed(1) + ' dB';
    }
    pagValueEl.textContent = baseStr + ' ' + corrStr + ' = ' + totalStr;
  }

  // Drag with ordering constraints.
  let active = null;
  let dragOffset = { x: 0, y: 0 };

  function svgPoint(evt) {
    const pt = stage.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(stage.getScreenCTM().inverse());
  }

  function startDrag(evt, id) {
    active = id;
    figs[id].classList.add('dragging');
    const p = svgPoint(evt);
    dragOffset.x = p.x - state[id].x;
    dragOffset.y = p.y - state[id].y;
    try { evt.target.setPointerCapture && evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    evt.preventDefault();
  }

  function moveDrag(evt) {
    if (!active) return;
    const p = svgPoint(evt);
    const c = constraints[active];
    let nx = p.x - dragOffset.x;
    let ny = state[active].fixedY ? state[active].y : (p.y - dragOffset.y);
    nx = clamp(nx, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);

    if (active === 'talker') {
      nx = Math.min(nx, state.mic.x - MIN_GAP_TM);
    } else if (active === 'mic') {
      nx = Math.max(nx, state.talker.x + MIN_GAP_TM);
      nx = Math.min(nx, state.listener.x - MIN_GAP_ML);
    } else if (active === 'listener') {
      nx = Math.max(nx, state.mic.x + MIN_GAP_ML);
    }

    // 2D collision: push away from any other figure that we'd overlap.
    const resolved = applyCollisions(active, nx, ny, figs, state);
    nx = clamp(resolved.x, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(resolved.y, c.minY, c.maxY);

    state[active].x = nx;
    state[active].y = ny;
    render();
  }

  function endDrag() {
    if (!active) return;
    figs[active].classList.remove('dragging');
    active = null;
  }

  for (const id of Object.keys(figs)) {
    figs[id].addEventListener('pointerdown', (e) => startDrag(e, id));
  }
  stage.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Polar pattern toggle buttons.
  const slide = stage.closest('.slide');
  const toggleButtons = slide.querySelectorAll('.pattern-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.pattern = btn.dataset.pattern;
      toggleButtons.forEach(b => b.classList.toggle('is-active', b === btn));
      render();
    });
  });

  stage.closest('.slide').addEventListener('pag:slide-active', () => render());
  render();
})();


/* =====================================================================
   Slide 8 — Microphone AND loudspeaker directivity
   Adds a loudspeaker coverage cone with a piecewise model:
     inside beam (|θ| ≤ BW/2): cos^n falloff (-6 dB at edge)
     outside beam:              6 dB at edge + 0.27 dB per degree past edge
   Empirical model — matches the canonical Digital Sound & Music demo.
   ===================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('stage8');
  if (!stage) return;
  const { PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, positionLabel, positionLabelAbove, placeAllLabels,
          tiltMicCapsule, applyCollisions,
          polarResponse, buildMicLobePath } = PAG;

  const state = {
    talker:   { x: 80,    y: T_Y,  fixedY: true  },
    mic:      { x: 172,   y: M_Y,  fixedY: true  },
    speaker:  { x: 234,   y: 218,  fixedY: false },
    listener: { x: 722,   y: L_Y,  fixedY: true  },
    pattern:  'omni',
    speakerBW: 90,
  };

  const constraints = {
    talker:   { minX: 26, maxX: 870 },
    mic:      { minX: 26, maxX: 870 },
    speaker:  { minX: 32, maxX: 866, minY: 26, maxY: FLOOR_Y - 22 },
    listener: { minX: 26, maxX: 870 },
  };

  const MIN_GAP_TM = 22;
  const MIN_GAP_ML = 50;

  const figs = {
    talker:   document.getElementById('s8-fig-talker'),
    mic:      document.getElementById('s8-fig-mic'),
    speaker:  document.getElementById('s8-fig-speaker'),
    listener: document.getElementById('s8-fig-listener'),
  };
  const lineDS = document.getElementById('s8-lineDS');
  const lineD1 = document.getElementById('s8-lineD1');
  const lineD2 = document.getElementById('s8-lineD2');
  const lineD0 = document.getElementById('s8-lineD0');
  const labelDS = document.getElementById('s8-labelDS');
  const labelD1 = document.getElementById('s8-labelD1');
  const labelD2 = document.getElementById('s8-labelD2');
  const labelD0 = document.getElementById('s8-labelD0');
  const onAxisLine = document.getElementById('s8-onaxis');
  const angleArc = document.getElementById('s8-angleArc');
  const angleLabel = document.getElementById('s8-angleLabel');
  const polarLobe = document.getElementById('s8-polarLobe');
  const polarLobePath = document.getElementById('s8-polarLobePath');
  const speakerLobe = document.getElementById('s8-speakerLobe');
  const speakerCone6 = document.getElementById('s8-speakerCone6');
  const speakerCone0 = document.getElementById('s8-speakerCone0');
  const speakerEdgeLabel = document.getElementById('s8-speakerEdgeLabel');
  const speakerAxisLabel = document.getElementById('s8-speakerAxisLabel');
  const pagValueEl = document.getElementById('s8-pagValue');

  const MIC_NULL_CAP_LINEAR = Math.pow(10, -25 / 20);
  function micCorrectionDb(pattern, theta) {
    const D = Math.abs(polarResponse(pattern, theta));
    return -20 * Math.log10(Math.max(D, MIC_NULL_CAP_LINEAR));
  }

  // Loudspeaker correction: piecewise empirical model.
  // theta is OFF-AXIS angle in radians (0 = on-axis pointed at listener).
  // Inside beam (|θ| ≤ BW/2): cos^n falloff giving -6 dB exactly at the edge.
  // Outside: 6 dB + 0.27 dB per degree past the beam edge (linear in dB).
  function speakerCorrectionDb(bwDeg, theta) {
    const thetaDeg = Math.abs(theta * 180 / Math.PI);
    const halfBw = bwDeg / 2;
    if (thetaDeg <= halfBw) {
      // Inside beam — cos^n. -6 dB at the edge ⇒ n s.t. cos^n(halfBw/2) = 0.5.
      const quarterRad = (halfBw / 2) * Math.PI / 180;
      const n = Math.log(0.5) / Math.log(Math.cos(quarterRad));
      const D = Math.pow(Math.cos(thetaDeg * Math.PI / 180 / 2), n);
      return -20 * Math.log10(Math.max(D, 1e-6));
    } else {
      return 6 + 0.27 * (thetaDeg - halfBw);
    }
  }

  function compute() {
    const t = state.talker, m = state.mic, s = state.speaker, l = state.listener;
    const Ds = feet(distPx(t, m));
    const D1 = feet(distPx(m, s));
    const D2 = feet(distPx(s, l));
    const D0 = feet(distPx(t, l));
    let pagOmni;
    if (Ds <= 0.001 || D2 <= 0.001) pagOmni = Infinity;
    else if (D1 <= 0.001) pagOmni = -Infinity;
    else pagOmni = 20 * Math.log10((D1 / Ds) * (D0 / D2));

    // Mic off-axis (mic→talker vs mic→speaker).
    const va = { x: t.x - m.x, y: t.y - m.y };
    const vb = { x: s.x - m.x, y: s.y - m.y };
    const la = Math.hypot(va.x, va.y) || 1;
    const lb = Math.hypot(vb.x, vb.y) || 1;
    const micTheta = Math.acos(clamp((va.x*vb.x + va.y*vb.y) / (la*lb), -1, 1));
    const micCorr = micCorrectionDb(state.pattern, micTheta);

    // Speaker off-axis (speaker→listener vs speaker→mic).
    const sa = { x: l.x - s.x, y: l.y - s.y };
    const sb = { x: m.x - s.x, y: m.y - s.y };
    const lsa = Math.hypot(sa.x, sa.y) || 1;
    const lsb = Math.hypot(sb.x, sb.y) || 1;
    const spkTheta = Math.acos(clamp((sa.x*sb.x + sa.y*sb.y) / (lsa*lsb), -1, 1));
    const spkCorr = speakerCorrectionDb(state.speakerBW, spkTheta);

    return { Ds, D1, D2, D0, pagOmni, micTheta, micCorr, spkTheta, spkCorr };
  }

  const MIC_LOBE_SCALE = 30;
  const lobePathCache = {};
  function getLobePath(pattern) {
    if (!(pattern in lobePathCache)) {
      lobePathCache[pattern] = buildMicLobePath(pattern, MIC_LOBE_SCALE);
    }
    return lobePathCache[pattern];
  }

  // Loudspeaker coverage cone (local coords; +x is on-axis toward listener).
  // Two nested wedges: main beam (-6 dB at edge) and a brighter on-axis core.
  const SPEAKER_CONE_LENGTH = 520;
  function buildSpeakerWedge(halfAngleDeg) {
    const half = halfAngleDeg * Math.PI / 180;
    const L = SPEAKER_CONE_LENGTH;
    const x1 = L * Math.cos(half), y1 = -L * Math.sin(half);
    const x2 = L * Math.cos(half), y2 =  L * Math.sin(half);
    return `M 0,0 L ${x1.toFixed(1)},${y1.toFixed(1)} A ${L},${L} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
  }

  function render() {
    for (const id of ['talker', 'mic', 'listener']) {
      const p = state[id];
      figs[id].setAttribute('transform', 'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ')');
    }
    // Speaker rotates to face listener.
    const speakerAngle = Math.atan2(state.listener.y - state.speaker.y, state.listener.x - state.speaker.x) * 180 / Math.PI;
    figs.speaker.setAttribute('transform',
      'translate(' + state.speaker.x.toFixed(1) + ', ' + state.speaker.y.toFixed(1) + ') rotate(' + speakerAngle.toFixed(1) + ')');
    // Speaker cones use same transform so they point toward listener.
    speakerLobe.setAttribute('transform',
      'translate(' + state.speaker.x.toFixed(1) + ', ' + state.speaker.y.toFixed(1) + ') rotate(' + speakerAngle.toFixed(1) + ')');
    speakerLobe.setAttribute('data-bw', String(state.speakerBW));
    const halfBw = state.speakerBW / 2;
    // Approximate "on-axis core" at half-power inward — visual depth cue only.
    const halfCore = halfBw * 0.55;
    speakerCone6.setAttribute('d', buildSpeakerWedge(halfBw));
    speakerCone0.setAttribute('d', buildSpeakerWedge(halfCore));

    // Position labels along the cone edges. Coordinates are in the cone's
    // local frame (+x = on-axis toward listener). Each label is rotated to
    // match the angle of the line it sits on, so the text reads along the arc.
    // Place -6 dB label along the inner (brighter) cone's upper edge so it
    // visually sits ON the dark cone boundary rather than out in space.
    const halfCoreRad = halfCore * Math.PI / 180;
    const edgeR = 240;
    const edgeX = edgeR * Math.cos(halfCoreRad);
    const edgeY = -edgeR * Math.sin(halfCoreRad);
    speakerEdgeLabel.setAttribute('x', edgeX.toFixed(1));
    speakerEdgeLabel.setAttribute('y', edgeY.toFixed(1));
    speakerEdgeLabel.setAttribute('transform',
      'rotate(' + (-halfCore).toFixed(1) + ' ' + edgeX.toFixed(1) + ' ' + edgeY.toFixed(1) + ')');
    const axisR = 110;
    speakerAxisLabel.setAttribute('x', axisR.toFixed(1));
    speakerAxisLabel.setAttribute('y', '0');
    speakerAxisLabel.textContent = state.speakerBW + ' DEGREES';

    const { Ds, D1, D2, D0, pagOmni, micTheta, micCorr, spkCorr } = compute();

    tiltMicCapsule(figs.mic, state.talker, state.mic);

    // Mic on-axis line + polar lobe.
    {
      const m = state.mic, t = state.talker;
      const dx = t.x - m.x, dy = t.y - m.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const end = { x: m.x + ux * 70, y: m.y + uy * 70 };
      onAxisLine.setAttribute('x1', m.x.toFixed(1));
      onAxisLine.setAttribute('y1', m.y.toFixed(1));
      onAxisLine.setAttribute('x2', end.x.toFixed(1));
      onAxisLine.setAttribute('y2', end.y.toFixed(1));
      const onAxisDeg = Math.atan2(dy, dx) * 180 / Math.PI;
      polarLobe.setAttribute('transform',
        'translate(' + m.x.toFixed(1) + ', ' + m.y.toFixed(1) + ') rotate(' + onAxisDeg.toFixed(1) + ')');
      polarLobePath.setAttribute('d', getLobePath(state.pattern));
      polarLobe.setAttribute('opacity', state.pattern === 'omni' ? '0.35' : '1');
    }

    // Mic angle arc.
    {
      const m = state.mic, t = state.talker, s = state.speaker;
      const aT = Math.atan2(t.y - m.y, t.x - m.x);
      const aS = Math.atan2(s.y - m.y, s.x - m.x);
      const r = 26;
      let delta = aS - aT;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      const sweepFlag = delta > 0 ? 1 : 0;
      const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
      const p1 = { x: m.x + r * Math.cos(aT), y: m.y + r * Math.sin(aT) };
      const p2 = { x: m.x + r * Math.cos(aS), y: m.y + r * Math.sin(aS) };
      angleArc.setAttribute('d', `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
      // Pin the degree reading to the bottom-right of the polar pattern.
      angleLabel.setAttribute('x', (m.x + 36).toFixed(1));
      angleLabel.setAttribute('y', (m.y + 30).toFixed(1));
      angleLabel.textContent = Math.round(micTheta * 180 / Math.PI) + '°';
    }

    setLineEndpoints(lineDS, state.talker,  state.mic);
    setLineEndpoints(lineD1, state.mic,     state.speaker);
    setLineEndpoints(lineD2, state.speaker, state.listener);
    setLineEndpoints(lineD0, state.talker,  state.listener);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs, state, 380
    );

    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    // PAG display: base + mic + speaker = total.
    let baseStr, totalStr;
    const total = (isFinite(pagOmni) ? pagOmni : 0) + micCorr + spkCorr;
    if (!isFinite(pagOmni)) {
      baseStr = pagOmni < 0 ? '−∞ dB' : '+∞ dB';
      totalStr = baseStr;
    } else {
      baseStr = (pagOmni >= 0 ? '' : '−') + Math.abs(pagOmni).toFixed(1) + ' dB';
      totalStr = (total >= 0 ? '' : '−') + Math.abs(total).toFixed(1) + ' dB';
    }
    const micStr = '+ ' + micCorr.toFixed(1) + ' dB';
    const spkStr = '+ ' + spkCorr.toFixed(1) + ' dB';
    pagValueEl.textContent = baseStr + ' ' + micStr + ' ' + spkStr + ' = ' + totalStr;
  }

  // Drag.
  let active = null;
  let dragOffset = { x: 0, y: 0 };

  function svgPoint(evt) {
    const pt = stage.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(stage.getScreenCTM().inverse());
  }

  function startDrag(evt, id) {
    active = id;
    figs[id].classList.add('dragging');
    const p = svgPoint(evt);
    dragOffset.x = p.x - state[id].x;
    dragOffset.y = p.y - state[id].y;
    try { evt.target.setPointerCapture && evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    evt.preventDefault();
  }

  function moveDrag(evt) {
    if (!active) return;
    const p = svgPoint(evt);
    const c = constraints[active];
    let nx = p.x - dragOffset.x;
    let ny = state[active].fixedY ? state[active].y : (p.y - dragOffset.y);
    nx = clamp(nx, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);

    if (active === 'talker') {
      nx = Math.min(nx, state.mic.x - MIN_GAP_TM);
    } else if (active === 'mic') {
      nx = Math.max(nx, state.talker.x + MIN_GAP_TM);
      nx = Math.min(nx, state.listener.x - MIN_GAP_ML);
    } else if (active === 'listener') {
      nx = Math.max(nx, state.mic.x + MIN_GAP_ML);
    }

    const resolved = applyCollisions(active, nx, ny, figs, state);
    nx = clamp(resolved.x, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(resolved.y, c.minY, c.maxY);

    state[active].x = nx;
    state[active].y = ny;
    render();
  }

  function endDrag() {
    if (!active) return;
    figs[active].classList.remove('dragging');
    active = null;
  }

  for (const id of Object.keys(figs)) {
    figs[id].addEventListener('pointerdown', (e) => startDrag(e, id));
  }
  stage.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Toggle buttons.
  const slide = stage.closest('.slide');
  slide.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pattern = btn.dataset.pattern;
      slide.querySelectorAll('.pattern-btn').forEach(b => b.classList.toggle('is-active', b === btn));
      render();
    });
  });
  slide.querySelectorAll('.speaker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.speakerBW = parseInt(btn.dataset.speaker, 10);
      slide.querySelectorAll('.speaker-btn').forEach(b => b.classList.toggle('is-active', b === btn));
      render();
    });
  });

  slide.addEventListener('pag:slide-active', () => render());
  render();
})();


/* =====================================================================
   Slide 9 — How much gain?
   Auto-animation: speaker drifts from a 10 dB PAG position to a no-gain
   position when the slide becomes visible. Restarts each time the slide
   is shown.
   ===================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('stage9');
  if (!stage) return;
  const { T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, positionLabel, positionLabelAbove, placeAllLabels,
          tiltMicCapsule, easeInOutCubic, prefersReduced } = PAG;

  // Geometry: D_S=8'4", D_0=49'5". State A=(365,232) for 10 dB; State B=(188,232) for ~0 dB.
  const T = { x: 80,  y: T_Y };
  const M = { x: 188, y: M_Y };
  const L = { x: 722, y: L_Y };
  const SPEAKER_A = { x: 365, y: 232 };  // 10 dB PAG
  const SPEAKER_B = { x: 188, y: 232 };  // No gain

  let speaker = { x: SPEAKER_A.x, y: SPEAKER_A.y };

  const figs = {
    talker:   document.getElementById('s9-fig-talker'),
    mic:      document.getElementById('s9-fig-mic'),
    speaker:  document.getElementById('s9-fig-speaker'),
    listener: document.getElementById('s9-fig-listener'),
  };
  const lineDS = document.getElementById('s9-lineDS');
  const lineD1 = document.getElementById('s9-lineD1');
  const lineD2 = document.getElementById('s9-lineD2');
  const lineD0 = document.getElementById('s9-lineD0');
  const labelDS = document.getElementById('s9-labelDS');
  const labelD1 = document.getElementById('s9-labelD1');
  const labelD2 = document.getElementById('s9-labelD2');
  const labelD0 = document.getElementById('s9-labelD0');
  const markerLine = document.getElementById('s9-markerLine');
  const gradient   = document.getElementById('s9-gainGradient');
  const labelGood  = document.getElementById('s9-labelGood');
  const labelBad   = document.getElementById('s9-labelBad');
  const pagValueEl = document.getElementById('s9-pagValue');
  const pagBar = pagValueEl.parentElement;

  function render() {
    figs.talker.setAttribute('transform',   'translate(' + T.x + ', ' + T.y + ')');
    figs.mic.setAttribute('transform',      'translate(' + M.x + ', ' + M.y + ')');
    figs.listener.setAttribute('transform', 'translate(' + L.x + ', ' + L.y + ')');
    const ang = Math.atan2(L.y - speaker.y, L.x - speaker.x) * 180 / Math.PI;
    figs.speaker.setAttribute('transform',
      'translate(' + speaker.x.toFixed(1) + ', ' + speaker.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')');

    tiltMicCapsule(figs.mic, T, M);

    const Ds = feet(distPx(T, M));
    const D1 = feet(distPx(M, speaker));
    const D2 = feet(distPx(speaker, L));
    const D0 = feet(distPx(T, L));
    const pag = 20 * Math.log10((D1 / Ds) * (D0 / D2));

    setLineEndpoints(lineDS, T, M);
    setLineEndpoints(lineD1, M, speaker);
    setLineEndpoints(lineD2, speaker, L);
    setLineEndpoints(lineD0, T, L);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs,
      { talker: T, mic: M, speaker: speaker, listener: L },
      380
    );

    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    // PAG bar: green-ish 10 dB at start, fading to red "NO GAIN" near zero.
    if (pag < 1) {
      pagBar.classList.add('is-bad');
      pagValueEl.textContent = 'NO GAIN BEFORE FEEDBACK';
    } else {
      pagBar.classList.remove('is-bad');
      pagValueEl.textContent = pag.toFixed(1) + ' dB';
    }
  }

  // Place the top markers at the two speaker positions.
  function setupMarkers() {
    // The line spans between the two speaker positions, with a gradient that
    // runs from red (at SPEAKER_B, the "no gain" end) to green (at SPEAKER_A,
    // the "10 dB PAG" end). Labels sit directly above each end.
    // Positioned above the D_1 distance label (which centers around y=182).
    const yLine = 128;
    const yLabel = yLine - 14;
    markerLine.setAttribute('x1', SPEAKER_B.x.toFixed(1));
    markerLine.setAttribute('x2', SPEAKER_A.x.toFixed(1));
    markerLine.setAttribute('y1', yLine);
    markerLine.setAttribute('y2', yLine);
    // Gradient endpoints in user space match the line endpoints so the colors
    // line up with the speaker positions regardless of line direction.
    gradient.setAttribute('x1', SPEAKER_B.x.toFixed(1));
    gradient.setAttribute('y1', yLine);
    gradient.setAttribute('x2', SPEAKER_A.x.toFixed(1));
    gradient.setAttribute('y2', yLine);
    // Labels centered over each speaker position.
    labelBad.setAttribute('x', SPEAKER_B.x.toFixed(1));
    labelBad.setAttribute('y', yLabel.toFixed(1));
    labelGood.setAttribute('x', SPEAKER_A.x.toFixed(1));
    labelGood.setAttribute('y', yLabel.toFixed(1));
  }
  setupMarkers();

  // Animation: A → B over ~6 seconds, ease-in-out.
  const ANIM_MS = 6000;
  let animStart = null;
  let animFrame = null;

  function step(now) {
    if (animStart === null) animStart = now;
    const t = clamp((now - animStart) / ANIM_MS, 0, 1);
    const k = easeInOutCubic(t);
    speaker.x = SPEAKER_A.x + (SPEAKER_B.x - SPEAKER_A.x) * k;
    speaker.y = SPEAKER_A.y + (SPEAKER_B.y - SPEAKER_A.y) * k;
    render();
    if (t < 1) animFrame = requestAnimationFrame(step);
    else animFrame = null;
  }

  function startAnimation() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animStart = null;
    speaker.x = SPEAKER_A.x;
    speaker.y = SPEAKER_A.y;
    render();
    if (prefersReduced) {
      speaker.x = SPEAKER_B.x;
      speaker.y = SPEAKER_B.y;
      render();
      return;
    }
    // Small delay so the slide settles before the move begins.
    setTimeout(() => {
      animFrame = requestAnimationFrame(step);
    }, 700);
  }

  // Restart animation whenever the slide becomes active.
  const slide = stage.closest('.slide');
  slide.addEventListener('pag:slide-active', () => {
    startAnimation();
  });

  // Initial render — if the slide is already visible, kick off the animation.
  render();
  if (slide.classList.contains('is-active')) startAnimation();
})();


/* =====================================================================
   Slides 10 & 11 — Faders in action
   Static PAG geometry. Click the operator to open a fader overlay that
   produces a feedback-like tone when the fader enters the red zone.
   Slide 10 = 1 dB PAG (original geometry). Slide 11 = 22.8 dB PAG with
   the source moved close to the mic.
   ===================================================================== */
(() => {
  'use strict';

  function buildFaderSlide(prefix, config) {
    const stage = document.getElementById('stage' + prefix);
    if (!stage) return;
    const { T_Y, M_Y, L_Y,
            distPx, feet, fmtFeetInches,
            setLineEndpoints, setLabelText, placeAllLabels,
            tiltMicCapsule } = PAG;

    const T = { x: config.T.x,  y: T_Y };
    const M = { x: config.M.x,  y: M_Y };
    const L = { x: config.L.x,  y: L_Y };
    const S = { x: config.S.x,  y: config.S.y };
    const OP = { x: config.OP.x, y: config.OP.y };

    const id = (suffix) => document.getElementById('s' + prefix + '-' + suffix);
    const figs = {
      talker:   id('fig-talker'),
      mic:      id('fig-mic'),
      speaker:  id('fig-speaker'),
      listener: id('fig-listener'),
      operator: id('fig-operator'),
    };
    const lineDS = id('lineDS');
    const lineD1 = id('lineD1');
    const lineD2 = id('lineD2');
    const lineD0 = id('lineD0');
    const labelDS = id('labelDS');
    const labelD1 = id('labelD1');
    const labelD2 = id('labelD2');
    const labelD0 = id('labelD0');
    const opLabel = id('operator-label');
    const bubble = id('speech-bubble');
    const bubbleShape = bubble.querySelector('.speech-bubble-shape');
    const bubbleText = bubble.querySelector('.speech-bubble-text');

    function render() {
      figs.talker.setAttribute('transform',   'translate(' + T.x + ', ' + T.y + ')');
      figs.mic.setAttribute('transform',      'translate(' + M.x + ', ' + M.y + ')');
      figs.listener.setAttribute('transform', 'translate(' + L.x + ', ' + L.y + ')');
      const ang = Math.atan2(L.y - S.y, L.x - S.x) * 180 / Math.PI;
      figs.speaker.setAttribute('transform',
        'translate(' + S.x + ', ' + S.y + ') rotate(' + ang.toFixed(1) + ')');
      figs.operator.setAttribute('transform', 'translate(' + OP.x + ', ' + OP.y + ')');
      opLabel.setAttribute('x', OP.x);
      opLabel.setAttribute('y', (OP.y + 28).toFixed(1));

      tiltMicCapsule(figs.mic, T, M);

      // Speech bubble — rounded rect with a tail pointing down at the operator.
      const bx = OP.x - 70;
      const by = OP.y - 80;
      const bw = 76, bh = 44, br = 12;
      const left = bx - bw/2, right = bx + bw/2;
      const top = by - bh/2, bottom = by + bh/2;
      const tailApex = { x: OP.x - 12, y: OP.y - 48 };
      const tailBase1 = { x: right - 18, y: bottom };
      const tailBase2 = { x: right - 4,  y: bottom };
      const d =
        `M ${left + br} ${top}` +
        ` H ${right - br}` +
        ` Q ${right} ${top} ${right} ${top + br}` +
        ` V ${bottom - br}` +
        ` Q ${right} ${bottom} ${right - br} ${bottom}` +
        ` L ${tailBase2.x} ${bottom}` +
        ` L ${tailApex.x} ${tailApex.y}` +
        ` L ${tailBase1.x} ${bottom}` +
        ` H ${left + br}` +
        ` Q ${left} ${bottom} ${left} ${bottom - br}` +
        ` V ${top + br}` +
        ` Q ${left} ${top} ${left + br} ${top}` +
        ` Z`;
      bubbleShape.setAttribute('d', d);
      bubbleText.setAttribute('x', bx);
      bubbleText.setAttribute('y', by - 4);
      bubbleText.querySelector('tspan').setAttribute('x', bx);

      setLineEndpoints(lineDS, T, M);
      setLineEndpoints(lineD1, M, S);
      setLineEndpoints(lineD2, S, L);
      setLineEndpoints(lineD0, T, L);

      const Ds = feet(distPx(T, M));
      const D1 = feet(distPx(M, S));
      const D2 = feet(distPx(S, L));
      const D0 = feet(distPx(T, L));

      placeAllLabels(
        { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
        figs,
        { talker: T, mic: M, speaker: S, listener: L },
        380
      );
      setLabelText(labelDS, fmtFeetInches(Ds));
      setLabelText(labelD1, fmtFeetInches(D1));
      setLabelText(labelD2, fmtFeetInches(D2));
      setLabelText(labelD0, fmtFeetInches(D0));
    }

    // --- Fader overlay ---
    const overlay = id('fader-overlay');
    const closeBtn = id('fader-close');
    const knob = id('fader-knob');
    const track = knob.parentElement;

    let faderValue = 0;
    // Where the FEEDBACK zone starts on the 0-100 fader scale. Slide 10
    // (1 dB PAG) puts feedback near the bottom; slide 11 (22.8 dB PAG)
    // pushes it near the top.
    const FEEDBACK_THRESHOLD = config.feedbackThreshold;

    function setFader(value) {
      faderValue = Math.max(0, Math.min(100, value));
      const trackRect = track.getBoundingClientRect();
      const usableHeight = trackRect.height - 28;
      const yFromBottom = (faderValue / 100) * usableHeight;
      knob.style.bottom = yFromBottom.toFixed(1) + 'px';
      knob.setAttribute('aria-valuenow', String(Math.round(faderValue)));
      updateFeedback();
    }

    let audioCtx = null;
    let osc1 = null, osc2 = null, gain = null;
    let toneActive = false;

    function ensureAudio() {
      if (audioCtx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
    }

    function startTone() {
      ensureAudio();
      if (!audioCtx || toneActive) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      osc1 = audioCtx.createOscillator();
      osc2 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 2080;
      osc2.frequency.value = 4150;
      gain = audioCtx.createGain();
      gain.gain.value = 0;
      const harmonicGain = audioCtx.createGain();
      harmonicGain.gain.value = 0.35;
      osc1.connect(gain);
      osc2.connect(harmonicGain).connect(gain);
      gain.connect(audioCtx.destination);
      osc1.start();
      osc2.start();
      toneActive = true;
    }

    function stopTone() {
      if (!toneActive || !audioCtx) return;
      const now = audioCtx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.08);
      osc1.stop(now + 0.1);
      osc2.stop(now + 0.1);
      toneActive = false;
    }

    function updateFeedback() {
      if (faderValue < FEEDBACK_THRESHOLD) {
        if (toneActive) stopTone();
        return;
      }
      if (!toneActive) startTone();
      if (!audioCtx) return;
      const intoRed = (faderValue - FEEDBACK_THRESHOLD) / (100 - FEEDBACK_THRESHOLD);
      const targetGain = 0.005 + 0.18 * intoRed;
      const now = audioCtx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(targetGain, now, 0.03);
    }

    function openOverlay() {
      overlay.hidden = false;
      requestAnimationFrame(() => setFader(0));
      document.addEventListener('keydown', handleEsc);
    }

    function closeOverlay() {
      overlay.hidden = true;
      stopTone();
      document.removeEventListener('keydown', handleEsc);
    }

    function handleEsc(e) {
      if (e.key === 'Escape') closeOverlay();
    }

    figs.operator.addEventListener('click', openOverlay);
    figs.operator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openOverlay();
      }
    });
    bubble.addEventListener('click', openOverlay);
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay();
    });

    let dragging = false;

    function knobYToValue(clientY) {
      const trackRect = track.getBoundingClientRect();
      const usableHeight = trackRect.height - 28;
      const yFromBottom = trackRect.bottom - clientY - 14;
      return (yFromBottom / usableHeight) * 100;
    }

    knob.addEventListener('pointerdown', (e) => {
      dragging = true;
      knob.classList.add('is-dragging');
      knob.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    knob.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      setFader(knobYToValue(e.clientY));
    });
    knob.addEventListener('pointerup', (e) => {
      dragging = false;
      knob.classList.remove('is-dragging');
      try { knob.releasePointerCapture(e.pointerId); } catch (err) {}
    });
    knob.addEventListener('pointercancel', () => {
      dragging = false;
      knob.classList.remove('is-dragging');
    });
    knob.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 1 : 5;
      if (e.key === 'ArrowUp')   { setFader(faderValue + step); e.preventDefault(); }
      if (e.key === 'ArrowDown') { setFader(faderValue - step); e.preventDefault(); }
      if (e.key === 'Home')      { setFader(100); e.preventDefault(); }
      if (e.key === 'End')       { setFader(0);   e.preventDefault(); }
    });

    track.addEventListener('pointerdown', (e) => {
      if (e.target === knob) return;
      setFader(knobYToValue(e.clientY));
    });

    const slide = stage.closest('.slide');
    slide.addEventListener('pag:slide-active', () => {
      render();
      if (!slide.classList.contains('is-active')) {
        closeOverlay();
      }
    });
    const navObserver = new MutationObserver(() => {
      if (!slide.classList.contains('is-active') && !overlay.hidden) {
        closeOverlay();
      }
    });
    navObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });

    render();
  }

  // Slide 10 — original 1 dB PAG geometry. Feedback near the bottom of the fader.
  buildFaderSlide('10', {
    T:  { x: 80  },
    M:  { x: 172 },
    L:  { x: 722 },
    S:  { x: 171, y: 232 },
    OP: { x: 800, y: 220 },
    feedbackThreshold: 52,
  });

  // Slide 11 — source moved within 6" of the mic. PAG ≈ 22.8 dB.
  // Feedback zone is small relative to the much larger reinforcement
  // headroom; threshold matches the visual layout (top ~28% of the track).
  buildFaderSlide('11', {
    T:  { x: 130 },
    M:  { x: 172 },
    L:  { x: 722 },
    S:  { x: 171, y: 232 },
    OP: { x: 800, y: 220 },
    feedbackThreshold: 72,
  });
})();


/* =====================================================================
   Sandbox stage (index.html)
   Live PAG playground: drag the four figures, toggle the mic polar
   pattern and the loudspeaker beamwidth. When a directivity option is
   "off" its visual overlay hides and the PAG equation drops the
   corresponding correction term.
   ===================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('sandbox-stage');
  if (!stage) return;
  const { PX_PER_FT, SVG_W, FLOOR_Y, T_Y, M_Y, L_Y,
          clamp, distPx, feet, fmtFeetInches,
          setLineEndpoints, setLabelText, placeAllLabels,
          tiltMicCapsule, applyCollisions,
          polarResponse, buildMicLobePath } = PAG;

  // Baseline geometry mirrors the canonical demo (slides 4–6).
  const state = {
    talker:   { x: 80,                       y: T_Y,  fixedY: true  },
    mic:      { x: 80 + 7.08 * PX_PER_FT,    y: M_Y,  fixedY: true  },
    speaker:  { x: 390,                      y: 126,  fixedY: false },
    listener: { x: 80 + 49.42 * PX_PER_FT,   y: L_Y,  fixedY: true  },
    // 'omni' is the "no directivity benefit" baseline for both the mic and
    // the loudspeaker — it adds no correction term, since an omni element
    // contributes 0 dB of off-axis rejection.
    micMode:     'omni',         // 'omni' | 'cardioid' | 'supercardioid' | 'hypercardioid'
    speakerMode: 'omni',         // 'omni' | '90' | '60' | '40'
  };

  const constraints = {
    talker:   { minX: 26, maxX: 870 },
    mic:      { minX: 26, maxX: 870 },
    speaker:  { minX: 32, maxX: 866, minY: 26, maxY: FLOOR_Y - 22 },
    listener: { minX: 26, maxX: 870 },
  };

  const MIN_GAP_TM = 22;
  const MIN_GAP_ML = 50;

  const figs = {
    talker:   document.getElementById('sandbox-fig-talker'),
    mic:      document.getElementById('sandbox-fig-mic'),
    speaker:  document.getElementById('sandbox-fig-speaker'),
    listener: document.getElementById('sandbox-fig-listener'),
  };
  const lineDS = document.getElementById('sandbox-lineDS');
  const lineD1 = document.getElementById('sandbox-lineD1');
  const lineD2 = document.getElementById('sandbox-lineD2');
  const lineD0 = document.getElementById('sandbox-lineD0');
  const labelDS = document.getElementById('sandbox-labelDS');
  const labelD1 = document.getElementById('sandbox-labelD1');
  const labelD2 = document.getElementById('sandbox-labelD2');
  const labelD0 = document.getElementById('sandbox-labelD0');
  const onAxisLine = document.getElementById('sandbox-onaxis');
  const angleArc = document.getElementById('sandbox-angleArc');
  const angleLabel = document.getElementById('sandbox-angleLabel');
  const polarLobe = document.getElementById('sandbox-polarLobe');
  const polarLobePath = document.getElementById('sandbox-polarLobePath');
  const speakerLobe = document.getElementById('sandbox-speakerLobe');
  const speakerCone6 = document.getElementById('sandbox-speakerCone6');
  const speakerCone0 = document.getElementById('sandbox-speakerCone0');
  const pagValueEl = document.getElementById('sandbox-pagValue');
  const corrTermsEl = document.getElementById('sandbox-corrTerms');
  const numDSEl = document.getElementById('sandbox-numDS');
  const numD1El = document.getElementById('sandbox-numD1');
  const numD2El = document.getElementById('sandbox-numD2');
  const numD0El = document.getElementById('sandbox-numD0');

  // --- Directivity math (lifted from slide 7/8 of the guide) ---
  const MIC_NULL_CAP_LINEAR = Math.pow(10, -25 / 20);
  function micCorrectionDb(pattern, theta) {
    // 'omni' returns D=1 at every angle, so the correction is 0 dB —
    // no special-casing needed.
    const D = Math.abs(polarResponse(pattern, theta));
    return -20 * Math.log10(Math.max(D, MIC_NULL_CAP_LINEAR));
  }
  function speakerCorrectionDb(mode, theta) {
    // 'omni' = omnidirectional loudspeaker: no off-axis attenuation, so
    // no PAG contribution. Directional modes carry a numeric beamwidth.
    if (mode === 'omni') return 0;
    const bwDeg = parseFloat(mode);
    const thetaDeg = Math.abs(theta * 180 / Math.PI);
    const halfBw = bwDeg / 2;
    if (thetaDeg <= halfBw) {
      const quarterRad = (halfBw / 2) * Math.PI / 180;
      const n = Math.log(0.5) / Math.log(Math.cos(quarterRad));
      const D = Math.pow(Math.cos(thetaDeg * Math.PI / 180 / 2), n);
      return -20 * Math.log10(Math.max(D, 1e-6));
    }
    return 6 + 0.27 * (thetaDeg - halfBw);
  }

  function compute() {
    const t = state.talker, m = state.mic, s = state.speaker, l = state.listener;
    const Ds = feet(distPx(t, m));
    const D1 = feet(distPx(m, s));
    const D2 = feet(distPx(s, l));
    const D0 = feet(distPx(t, l));
    let pagGeom;
    if (Ds <= 0.001 || D2 <= 0.001) pagGeom = Infinity;
    else if (D1 <= 0.001) pagGeom = -Infinity;
    else pagGeom = 20 * Math.log10((D1 / Ds) * (D0 / D2));

    const va = { x: t.x - m.x, y: t.y - m.y };
    const vb = { x: s.x - m.x, y: s.y - m.y };
    const la = Math.hypot(va.x, va.y) || 1;
    const lb = Math.hypot(vb.x, vb.y) || 1;
    const micTheta = Math.acos(clamp((va.x*vb.x + va.y*vb.y) / (la*lb), -1, 1));
    const micCorr = micCorrectionDb(state.micMode, micTheta);

    const sa = { x: l.x - s.x, y: l.y - s.y };
    const sb = { x: m.x - s.x, y: m.y - s.y };
    const lsa = Math.hypot(sa.x, sa.y) || 1;
    const lsb = Math.hypot(sb.x, sb.y) || 1;
    const spkTheta = Math.acos(clamp((sa.x*sb.x + sa.y*sb.y) / (lsa*lsb), -1, 1));
    const spkCorr = speakerCorrectionDb(state.speakerMode, spkTheta);

    return { Ds, D1, D2, D0, pagGeom, micTheta, micCorr, spkTheta, spkCorr };
  }

  // --- Visual helpers ---
  const MIC_LOBE_SCALE = 30;
  const lobePathCache = {};
  function getLobePath(pattern) {
    if (!(pattern in lobePathCache)) lobePathCache[pattern] = buildMicLobePath(pattern, MIC_LOBE_SCALE);
    return lobePathCache[pattern];
  }

  const SPEAKER_CONE_LENGTH = 520;
  function buildSpeakerWedge(halfAngleDeg) {
    const half = halfAngleDeg * Math.PI / 180;
    const L = SPEAKER_CONE_LENGTH;
    const x1 = L * Math.cos(half), y1 = -L * Math.sin(half);
    const x2 = L * Math.cos(half), y2 =  L * Math.sin(half);
    return `M 0,0 L ${x1.toFixed(1)},${y1.toFixed(1)} A ${L},${L} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
  }

  function render() {
    for (const id of ['talker', 'mic', 'listener']) {
      const p = state[id];
      figs[id].setAttribute('transform', 'translate(' + p.x.toFixed(1) + ', ' + p.y.toFixed(1) + ')');
    }
    const speakerAngle = Math.atan2(state.listener.y - state.speaker.y, state.listener.x - state.speaker.x) * 180 / Math.PI;
    figs.speaker.setAttribute('transform',
      'translate(' + state.speaker.x.toFixed(1) + ', ' + state.speaker.y.toFixed(1) + ') rotate(' + speakerAngle.toFixed(1) + ')');

    tiltMicCapsule(figs.mic, state.talker, state.mic);

    // --- Speaker coverage cone ---
    // Omni = no coverage cone (radiates equally everywhere). Use the
    // .is-hidden class (display: none) rather than the hidden attribute —
    // SVG support for the attribute is inconsistent and some browsers
    // leave the previously-rendered geometry behind.
    speakerLobe.classList.toggle('is-hidden', state.speakerMode === 'omni');
    if (state.speakerMode !== 'omni') {
      speakerLobe.setAttribute('data-bw', state.speakerMode);
      speakerLobe.setAttribute('transform',
        'translate(' + state.speaker.x.toFixed(1) + ', ' + state.speaker.y.toFixed(1) + ') rotate(' + speakerAngle.toFixed(1) + ')');
      const bwDeg = parseFloat(state.speakerMode);
      const halfBw = bwDeg / 2;
      const halfCore = halfBw * 0.55;
      speakerCone6.setAttribute('d', buildSpeakerWedge(halfBw));
      speakerCone0.setAttribute('d', buildSpeakerWedge(halfCore));
    }

    const { Ds, D1, D2, D0, pagGeom, micTheta, micCorr, spkTheta, spkCorr } = compute();

    // --- Mic polar overlay ---
    // The polar lobe is always drawn (the omni circle still shows, so the
    // mic visibly has a pattern). But omni contributes no off-axis
    // rejection, so its on-axis line, angle arc/label, and PAG correction
    // term are suppressed — those only appear for directional patterns.
    const micDirectional = state.micMode !== 'omni';
    const m = state.mic, t = state.talker, s = state.speaker;
    const dx = t.x - m.x, dy = t.y - m.y;
    const len = Math.hypot(dx, dy) || 1;
    const onAxisDeg = Math.atan2(dy, dx) * 180 / Math.PI;

    // Polar lobe — shown for every pattern including omni.
    polarLobe.classList.remove('is-hidden');
    polarLobe.setAttribute('transform',
      'translate(' + m.x.toFixed(1) + ', ' + m.y.toFixed(1) + ') rotate(' + onAxisDeg.toFixed(1) + ')');
    polarLobePath.setAttribute('d', getLobePath(state.micMode));
    polarLobe.setAttribute('opacity', state.micMode === 'omni' ? '0.35' : '1');

    // On-axis line + angle arc/label — directional patterns only.
    onAxisLine.classList.toggle('is-hidden', !micDirectional);
    angleArc.classList.toggle('is-hidden', !micDirectional);
    angleLabel.classList.toggle('is-hidden', !micDirectional);
    if (micDirectional) {
      const ux = dx / len, uy = dy / len;
      const endP = { x: m.x + ux * 70, y: m.y + uy * 70 };
      onAxisLine.setAttribute('x1', m.x.toFixed(1));
      onAxisLine.setAttribute('y1', m.y.toFixed(1));
      onAxisLine.setAttribute('x2', endP.x.toFixed(1));
      onAxisLine.setAttribute('y2', endP.y.toFixed(1));

      // Angle arc between mic→talker and mic→speaker.
      const aT = Math.atan2(t.y - m.y, t.x - m.x);
      const aS = Math.atan2(s.y - m.y, s.x - m.x);
      const r = 26;
      let delta = aS - aT;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      const sweepFlag = delta > 0 ? 1 : 0;
      const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
      const p1 = { x: m.x + r * Math.cos(aT), y: m.y + r * Math.sin(aT) };
      const p2 = { x: m.x + r * Math.cos(aS), y: m.y + r * Math.sin(aS) };
      angleArc.setAttribute('d', `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
      angleLabel.setAttribute('x', (m.x + 36).toFixed(1));
      angleLabel.setAttribute('y', (m.y + 30).toFixed(1));
      angleLabel.textContent = Math.round(micTheta * 180 / Math.PI) + '°';
    }

    // --- Distance lines + labels ---
    setLineEndpoints(lineDS, state.talker,  state.mic);
    setLineEndpoints(lineD1, state.mic,     state.speaker);
    setLineEndpoints(lineD2, state.speaker, state.listener);
    setLineEndpoints(lineD0, state.talker,  state.listener);

    placeAllLabels(
      { DS: labelDS, D1: labelD1, D2: labelD2, D0: labelD0 },
      figs,
      { talker: state.talker, mic: state.mic, speaker: state.speaker, listener: state.listener },
      380
    );
    setLabelText(labelDS, fmtFeetInches(Ds));
    setLabelText(labelD1, fmtFeetInches(D1));
    setLabelText(labelD2, fmtFeetInches(D2));
    setLabelText(labelD0, fmtFeetInches(D0));

    // --- PAG readout + equation ---
    const total = pagGeom + micCorr + spkCorr;
    if (!isFinite(total)) {
      pagValueEl.textContent = total > 0 ? '∞ dB' : '-∞ dB';
    } else {
      // Show breakdown only when at least one correction is active.
      const corrPieces = [];
      if (state.micMode !== 'omni') corrPieces.push(micCorr.toFixed(1) + ' dB');
      if (state.speakerMode !== 'omni') corrPieces.push(spkCorr.toFixed(1) + ' dB');
      if (corrPieces.length === 0) {
        pagValueEl.textContent = pagGeom.toFixed(1) + ' dB';
      } else {
        pagValueEl.textContent = pagGeom.toFixed(1) + ' dB + ' + corrPieces.join(' + ') + ' = ' + total.toFixed(1) + ' dB';
      }
    }
    // Equation tail: add "+ mic correction" / "+ loudspeaker correction" as appropriate.
    const tail = [];
    if (state.micMode !== 'omni')     tail.push('mic correction');
    if (state.speakerMode !== 'omni') tail.push('loudspeaker correction');
    corrTermsEl.textContent = tail.length ? ' + ' + tail.join(' + ') : '';

    // Numeric substitution row — matches the slide 5 "side-by-side" layout.
    numDSEl.textContent = Ds.toFixed(2);
    numD1El.textContent = D1.toFixed(2);
    numD2El.textContent = D2.toFixed(2);
    numD0El.textContent = D0.toFixed(2);
  }

  // --- Drag ---
  let active = null;
  const dragOffset = { x: 0, y: 0 };
  function svgPoint(evt) {
    const pt = stage.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(stage.getScreenCTM().inverse());
  }
  function startDrag(evt, id) {
    active = id;
    figs[id].classList.add('dragging');
    const p = svgPoint(evt);
    dragOffset.x = p.x - state[id].x;
    dragOffset.y = p.y - state[id].y;
    try { evt.target.setPointerCapture && evt.target.setPointerCapture(evt.pointerId); } catch (e) {}
    evt.preventDefault();
  }
  function moveDrag(evt) {
    if (!active) return;
    const p = svgPoint(evt);
    const c = constraints[active];
    let nx = p.x - dragOffset.x;
    let ny = state[active].fixedY ? state[active].y : (p.y - dragOffset.y);
    nx = clamp(nx, c.minX, c.maxX);
    if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);

    // Pairwise gap enforcement (mirrors slide 5 behaviour).
    if (active === 'talker') {
      if (Math.abs(nx - state.mic.x) < MIN_GAP_TM) nx = state.mic.x - MIN_GAP_TM;
    } else if (active === 'mic') {
      if (Math.abs(nx - state.talker.x) < MIN_GAP_TM) nx = state.talker.x + MIN_GAP_TM;
    } else if (active === 'speaker') {
      const dx = nx - state.mic.x, dy = ny - state.mic.y;
      const d = Math.hypot(dx, dy);
      if (d < MIN_GAP_ML) {
        const a = Math.atan2(dy, dx);
        nx = state.mic.x + MIN_GAP_ML * Math.cos(a);
        ny = state.mic.y + MIN_GAP_ML * Math.sin(a);
        nx = clamp(nx, c.minX, c.maxX);
        if (!state[active].fixedY) ny = clamp(ny, c.minY, c.maxY);
      }
    }

    const resolved = applyCollisions(active, nx, ny, figs, state);
    state[active].x = resolved.x;
    if (!state[active].fixedY) state[active].y = resolved.y;
    render();
  }
  function endDrag() {
    if (!active) return;
    figs[active].classList.remove('dragging');
    active = null;
  }

  for (const id of Object.keys(figs)) {
    figs[id].addEventListener('pointerdown', (e) => startDrag(e, id));
  }
  stage.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // --- Control pills ---
  document.querySelectorAll('.sandbox-controls .pill[data-mic]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.micMode = btn.dataset.mic;
      document.querySelectorAll('.sandbox-controls .pill[data-mic]').forEach(b => b.classList.toggle('is-active', b === btn));
      render();
    });
  });
  document.querySelectorAll('.sandbox-controls .pill[data-speaker]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.speakerMode = btn.dataset.speaker;
      document.querySelectorAll('.sandbox-controls .pill[data-speaker]').forEach(b => b.classList.toggle('is-active', b === btn));
      render();
    });
  });

  render();
})();
