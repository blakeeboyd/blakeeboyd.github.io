#!/usr/bin/env node
/* King's Cribbage eval harness. Decodes each test board with ffmpeg into raw
   RGBA, runs core.js detection, and prints geometry diagnostics. Used to
   iterate on the renderer-agnostic pipeline without firing up the browser.

   Usage: node projects/kings-cribbage/test/run-eval.js
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const KC = require('../js/core.js');

const BOARDS_DIR = path.join(__dirname, '..', 'test-boards');
const MAX_SIDE = 1600;

function decodeToRGBA(file) {
  // Probe dimensions, scale to max side ≤ MAX_SIDE, then dump raw RGBA.
  const probe = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=s=x:p=0', file,
  ], { encoding: 'utf8' }).trim();
  const [w0, h0] = probe.split('x').map(Number);
  const s = Math.min(1, MAX_SIDE / Math.max(w0, h0));
  const w = Math.round(w0 * s), h = Math.round(h0 * s);
  const raw = execFileSync('ffmpeg', [
    '-v', 'error', '-i', file,
    '-vf', `scale=${w}:${h}:flags=bilinear`,
    '-f', 'rawvideo', '-pix_fmt', 'rgba', 'pipe:1',
  ], { maxBuffer: 1024 * 1024 * 256 });
  return { data: raw, width: w, height: h };
}

function fmt(n) { return String(n).padStart(4); }

function cropToBbox(img, grid) {
  const cw = grid.x1 - grid.x0 + 1, ch = grid.y1 - grid.y0 + 1;
  const out = Buffer.alloc(cw * ch * 4);
  const { data, width: W } = img;
  for (let y = 0; y < ch; y++) {
    const srcRow = ((grid.y0 + y) * W + grid.x0) * 4;
    data.copy(out, y * cw * 4, srcRow, srcRow + cw * 4);
  }
  return { data: out, width: cw, height: ch };
}

function drawOverlay(img, grid, outFile) {
  // Paint cyan gridlines onto the RGBA buffer, then re-encode to PNG via
  // ffmpeg. Stride one pixel.
  const { data, width: W, height: H } = img;
  const buf = Buffer.from(data);
  const paint = (x, y) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const i = (y * W + x) * 4;
    buf[i] = 34; buf[i+1] = 211; buf[i+2] = 238; buf[i+3] = 255;  // cyan
  };
  for (const x of grid.cb.map(v => v + grid.x0)) {
    for (let y = grid.y0; y <= grid.y1; y++) { paint(x, y); paint(x-1, y); paint(x+1, y); }
  }
  for (const y of grid.rb.map(v => v + grid.y0)) {
    for (let x = grid.x0; x <= grid.x1; x++) { paint(x, y); paint(x, y-1); paint(x, y+1); }
  }
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-f', 'rawvideo', '-pix_fmt', 'rgba',
    '-s', `${W}x${H}`, '-i', 'pipe:0',
    outFile,
  ], { input: buf });
}

function evalBoard(file, outDir) {
  const name = path.basename(file);
  console.log(`\n=== ${name} ===`);
  const img = decodeToRGBA(file);
  console.log(`  decoded: ${img.width} × ${img.height}`);
  const grid = KC.findBoardGrid(img);
  if (!grid) { console.log('  findBoardGrid → null'); return; }
  console.log(`  board bbox: x=${grid.x0}…${grid.x1}  y=${grid.y0}…${grid.y1}`);
  console.log(`  pitch: x=${grid.pitchX}  y=${grid.pitchY}`);
  console.log(`  scores: x=${grid.scoreX.toFixed(0)}  y=${grid.scoreY.toFixed(0)}`);
  const w = grid.x1 - grid.x0, h = grid.y1 - grid.y0;
  console.log(`  span: w=${w} (${(w/13).toFixed(1)}/cell)  h=${h} (${(h/13).toFixed(1)}/cell)`);

  // Classify cells.
  const cropped = cropToBbox(img, grid);
  const { cells, palette } = KC.classifyCells(cropped, grid.rb, grid.cb);
  const occ = cells.filter(c => c.occupied);
  const occR = occ.filter(c => c.color === 'R').length;
  const occB = occ.filter(c => c.color === 'B').length;
  const fmt3 = (p) => p ? `(${p.R|0},${p.G|0},${p.B|0})` : 'n/a';
  console.log(`  palette: felt=${fmt3(palette && palette.felt)}  light=${fmt3(palette && palette.light)}  dark=${fmt3(palette && palette.dark)}`);
  console.log(`  occupied: ${occ.length}  (R=${occR}, B=${occB})`);
  // Pretty 13×13 ASCII map: '.' = empty, 'L' = light tile, 'D' = dark tile.
  const grid2d = Array.from({ length: 13 }, () => Array(13).fill('.'));
  for (const c of cells) if (c.occupied) grid2d[c.r][c.c] = (c.color === 'B') ? 'L' : 'D';
  console.log('  layout:');
  for (const row of grid2d) console.log('    ' + row.join(' '));

  if (outDir) {
    const out = path.join(outDir, name.replace(/\.(png|jpe?g)$/i, '.grid.png'));
    drawOverlay(img, grid, out);
    console.log(`  wrote overlay: ${out}`);
  }
}

function main() {
  if (!fs.existsSync(BOARDS_DIR)) {
    console.error(`No test-boards dir at ${BOARDS_DIR}`);
    process.exit(1);
  }
  const outDir = path.join(BOARDS_DIR, 'eval-out');
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(BOARDS_DIR)
    .filter(f => /\.(png|jpe?g)$/i.test(f))
    .sort()
    .map(f => path.join(BOARDS_DIR, f));
  for (const f of files) {
    try { evalBoard(f, outDir); }
    catch (e) { console.error(`  ERROR: ${e.message}`); }
  }
}

main();
