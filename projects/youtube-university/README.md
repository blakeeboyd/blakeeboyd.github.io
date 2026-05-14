# YouTube University

A curated library of YouTube videos for audio engineering students, generated from the Obsidian `video-breakdowns` vault.

## Workflow

`source/` is a symlink to the Obsidian vault at `~/Library/CloudStorage/SynologyDrive-Maranasati/Projects/Obsidian_Vaults/Selfsystem/video-breakdowns/`. To add or update a video:

1. Edit / add a Markdown file in the vault. The frontmatter format is documented in `0-readme.md` there.
2. From this project folder, run:
   ```
   npm run build
   ```

That regenerates `videos.json` and every page under `videos/`. Commit those alongside any source changes.

If the vault is unavailable (e.g. on a different machine), replace the symlink with a copy of the `.md` files.

## Output

- `videos.json` — index data consumed by the listing page
- `videos/<citekey>.html` — one page per video

## Frontmatter the build script consumes

```yaml
citekey: someCitekey2024
channel: Channel Name
title: Video title
duration: "12:34"
url: https://www.youtube.com/watch?v=...
domains: ["Live Sound"]                    # taxonomy: see 0-readme.md
subdomains: ["FOH Mixing"]                 # must belong to a listed domain
tags: [eq, phase]                          # controlled vocabulary
depth: foundational                        # foundational | applied | reflective
concepts:                                  # open-ended, feeds search
  - "all-pass filter"
  - "phase shift"
prerequisites:                             # optional, renders as "Before you watch"
  - "Watch X first"
learning_outcomes:                         # optional, renders next to prerequisites
  - "Derive a low-pass filter from an all-pass filter"
watch_for:                                 # optional, renders as clickable timestamps
  - timestamp: "0:12"
    text: "the all-pass filter appears"
related:                                   # optional, manual override for related-videos
  - someOtherCitekey
takeaway: "One-sentence editorial pitch."  # frontmatter version (currently unused on site)
bloom_levels: [Understand, Analyze]        # one per question
pipeline_candidate: true                   # selfsystem flag, not surfaced on site
courses: [MUS399]                          # selfsystem-only, not surfaced on site
```

## Body sections the build script consumes

```markdown
# Title

**Channel:** Name · **Duration:** mm:ss · ...

## Takeaway

A paragraph of prose. Becomes the editorial pitch on the video page.

## Questions

1. *(Understand)* Question text. The Bloom verb in parens-italics is parsed
   and rendered as a small badge.

## Answers

(Anything in this section is parsed and discarded — never reaches the site.)
```

Any other `## Heading` sections produce a build warning and are skipped — move that data to frontmatter instead.

## Scripts

- `npm run build` — regenerate `videos.json` and the per-video HTML
- `node scripts/strip-dead-sections.js [--dry-run]` — remove `## Before you watch`, `## Watch for`, `## Related videos` from source files (those are now sourced from frontmatter)
