#!/usr/bin/env node
// Strip body sections that are now sourced from frontmatter instead.
//
// Sections removed:
//   ## Before you watch  (now: prerequisites + learning_outcomes)
//   ## Watch for          (now: watch_for)
//   ## Related videos     (now: related)
//
// Preserves: frontmatter, # Title line, ## Takeaway, ## Questions, ## Answers.
// Run with --dry-run to preview; without flags to write in place.
//
// Usage:
//   node scripts/strip-dead-sections.js --dry-run
//   node scripts/strip-dead-sections.js

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'source');
const DEAD = new Set(['before you watch', 'watch for', 'related videos']);
const DRY = process.argv.includes('--dry-run');

function stripDeadSections(text) {
  const lines = text.split('\n');

  // Find all "## Heading" lines with their index.
  const headings = [];
  lines.forEach((line, idx) => {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) headings.push({ name: m[1].toLowerCase(), idx, label: m[1] });
  });

  // Build a list of [start, end) ranges to delete.
  const toDelete = [];
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    if (!DEAD.has(h.name)) continue;
    const next = headings[i + 1];
    const end = next ? next.idx : lines.length;
    toDelete.push({ start: h.idx, end, label: h.label });
  }

  if (toDelete.length === 0) return { text, removed: [] };

  // Apply deletions from the bottom up so indexes don't shift.
  toDelete.sort((a, b) => b.start - a.start);
  let out = lines.slice();
  for (const { start, end } of toDelete) {
    out.splice(start, end - start);
  }

  // Collapse any runs of 3+ blank lines that the removals leave behind.
  const collapsed = [];
  let blankRun = 0;
  for (const line of out) {
    if (line.trim() === '') {
      blankRun++;
      if (blankRun <= 2) collapsed.push(line);
    } else {
      blankRun = 0;
      collapsed.push(line);
    }
  }
  // Trim trailing blank lines, leave a single newline at EOF
  while (collapsed.length && collapsed[collapsed.length - 1].trim() === '') collapsed.pop();
  collapsed.push('');

  return { text: collapsed.join('\n'), removed: toDelete.map((d) => d.label) };
}

function main() {
  // Resolve the symlink if present so we write through to the real file
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('0-'));
  let touched = 0;
  let totalRemoved = 0;
  for (const f of files) {
    const fullPath = path.join(SRC_DIR, f);
    const original = fs.readFileSync(fullPath, 'utf8');
    const { text, removed } = stripDeadSections(original);
    if (removed.length === 0) continue;
    touched++;
    totalRemoved += removed.length;
    console.log(`${DRY ? '[dry-run] would strip' : 'stripped'} ${removed.length} section${removed.length === 1 ? '' : 's'} from ${f}: ${removed.join(', ')}`);
    if (!DRY) fs.writeFileSync(fullPath, text);
  }
  console.log(
    `\n${DRY ? '[dry-run] ' : ''}${touched}/${files.length} files affected, ${totalRemoved} sections total.`,
  );
  if (DRY) console.log('Run without --dry-run to apply.');
}

main();
