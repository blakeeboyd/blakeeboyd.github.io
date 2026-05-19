# Third-party assets

A ledger of icons, fonts, and other third-party assets used on this site. Not a legal document — a working note for future-me. Each entry records what the asset is, where it came from, the license terms at the time it was added, and where it lives in the repo.

When the licensing of an entry changes (e.g. you cancel a paid subscription that supplied a no-attribution license, or a font changes its terms), update the entry here.

## Icons

| Asset | Source | License | Used in | Attribution required? |
|---|---|---|---|---|
| Dark mode moon-with-stars | [Noun Project](https://thenounproject.com/) icon ID `4066356` | Noun Pro subscription (paid) | [js/nav-component.js](js/nav-component.js) `.icon-moon` | No (covered by paid subscription) |
| All other SVG icons in `js/nav-component.js` and inline in `lab.html`, `projects.html`, etc. | Hand-drawn from the [Feather Icons](https://feathericons.com/) set or visually equivalent reconstructions | MIT (Feather) | Various pages | No |

## Fonts

| Asset | Source | License | Used in |
|---|---|---|---|
| Inter (weights 300–700) | [Google Fonts](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 | Site-wide body text |
| JetBrains Mono (weights 400–700) | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) | SIL Open Font License 1.1 | Monospace UI (tag chips, code, timestamps) |
| Source Serif 4 (weights 400, 600) | [Google Fonts](https://fonts.google.com/specimen/Source+Serif+4) | SIL Open Font License 1.1 | Long-form prose on YouTube University and elsewhere |

## Code & libraries

| Asset | Source | License | Used in |
|---|---|---|---|
| React 18, Zustand, React Flow, Vite (and assorted Vite plugins) | npm | MIT | `projects/modular-daw/`, `projects/soundbench/`, `projects/advance/` |
| jsPDF, jspdf-autotable, html2canvas | npm | MIT | `projects/advance/` (PDF export) |
| nanoid | npm | MIT | Several React projects (ID generation) |
| Zundo | npm | MIT | `projects/modular-daw/`, `projects/advance/` (undo/redo) |

## Audio

| Asset | Source | License | Used in |
|---|---|---|---|
| `audio/stadium-rock-mp3/` multi-track stems (drums, bass, guitar, keys, organ, pad, tambourine) | Original recordings | All rights reserved (personal use on this site) | `projects/filter-id/` |

## YouTube embed thumbnails

YouTube University pages display thumbnail images served from `i.ytimg.com` (e.g. `https://i.ytimg.com/vi/<id>/mqdefault.jpg`). These are hot-linked from YouTube under YouTube's standard embedding terms — not redistributed assets.

## How to update this file

When adding a new third-party asset:

1. Note where it came from and what license applied at the time of addition.
2. If the license requires attribution and the page renders the asset, also add the attribution line to a visible spot on that page.
3. If the license changes later (subscription expires, font is pulled, etc.), update the entry here rather than deleting it — the history matters.
