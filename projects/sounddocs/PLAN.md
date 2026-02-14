# SoundDocs: Pro Audio Documentation Suite

## Context

Rebuilding three core tools from the open-source [SoundDocs](https://github.com/SoundDocs/sounddocs) project as a client-side Vite + React SPA for the site's lab. The original uses Supabase for auth/persistence/collaboration. Our version strips all backend dependencies, using localStorage + JSON export/import instead. This gives students free access to professional audio documentation tools without accounts or subscriptions.

**Three tools, one SPA:**
1. **Patch Sheet Editor** — Input/output channel mapping for live shows (tabular)
2. **Stage Plot Designer** — 2D drag-and-drop stage layout (canvas)
3. **Run of Show** — Event timeline/schedule editor (table + time calculations)

**Tech stack:** Vite + React 18 + TypeScript + Zustand + React Router (hash) + jsPDF. Dark-first UI with `--sd-*` scoped CSS tokens. Same build pattern as the modular DAW.

---

## Architecture

### File Structure

```
projects/sounddocs/
├── index.html                  # Shell: site CSS + nav + #root + dual scripts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore                  # node_modules/, dist/
├── assets/                     # Committed build output
└── src/
    ├── main.tsx                # createHashRouter + ReactDOM
    ├── App.tsx                 # Layout shell (.sd-app, header, <Outlet>)
    │
    ├── types/
    │   ├── documents.ts        # DocumentMeta, type discriminator
    │   ├── patch-sheet.ts      # InputChannel, OutputChannel, PatchSheetDoc
    │   ├── stage-plot.ts       # StageElement, StageSize, StagePlotDoc
    │   └── run-of-show.ts      # RunOfShowItem, CustomColumnDef, RunOfShowDoc
    │
    ├── store/
    │   ├── document-store.ts   # Registry (Zustand + persist to localStorage)
    │   ├── patch-sheet-store.ts # Active editing (Zustand + zundo)
    │   ├── stage-plot-store.ts
    │   └── run-of-show-store.ts
    │
    ├── lib/
    │   ├── storage.ts          # localStorage helpers with sd- prefixed keys
    │   ├── export-json.ts      # JSON export/import with version validation
    │   ├── export-pdf.ts       # jsPDF wrapper
    │   ├── time-utils.ts       # HH:MM:SS parsing, duration math
    │   └── id.ts               # nanoid wrapper
    │
    ├── hooks/
    │   ├── use-auto-save.ts    # 1500ms debounced save
    │   └── use-undo-redo.ts    # Zundo temporal wrapper
    │
    ├── pages/
    │   ├── HomePage.tsx        # Dashboard with tool cards + recent docs
    │   ├── PatchSheetPage.tsx  # Document list + editor
    │   ├── StagePlotPage.tsx
    │   └── RunOfShowPage.tsx
    │
    ├── components/
    │   ├── layout/
    │   │   ├── AppHeader.tsx       # Tool tabs + app title
    │   │   ├── Sidebar.tsx         # Document list panel
    │   │   └── Toolbar.tsx         # Undo/redo, doc name, export
    │   │
    │   ├── shared/
    │   │   ├── DocumentList.tsx
    │   │   ├── DocumentCard.tsx
    │   │   ├── EditableCell.tsx    # Click-to-edit table cell
    │   │   ├── ExportMenu.tsx
    │   │   ├── ImportModal.tsx
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── ColorPicker.tsx
    │   │   └── EmptyState.tsx
    │   │
    │   ├── patch-sheet/
    │   │   ├── PatchSheetEditor.tsx
    │   │   ├── InputTable.tsx
    │   │   ├── OutputTable.tsx
    │   │   ├── ChannelRow.tsx
    │   │   ├── PatchSheetMetadata.tsx
    │   │   └── channel-defaults.ts
    │   │
    │   ├── stage-plot/
    │   │   ├── StagePlotEditor.tsx
    │   │   ├── StageCanvas.tsx     # DOM-based drag/drop canvas
    │   │   ├── StageElement.tsx    # Draggable/resizable/rotatable
    │   │   ├── ElementPalette.tsx
    │   │   ├── PropertiesPanel.tsx
    │   │   ├── StageSizeSelector.tsx
    │   │   ├── BackgroundUpload.tsx
    │   │   └── element-types.ts
    │   │
    │   └── run-of-show/
    │       ├── RunOfShowEditor.tsx
    │       ├── TimelineTable.tsx
    │       ├── TimelineRow.tsx
    │       ├── SectionHeader.tsx
    │       ├── ColumnManager.tsx
    │       └── column-defaults.ts
    │
    └── styles/
        ├── tokens.css          # --sd-* design tokens on .sd-app
        ├── index.css           # Imports + app shell layout
        ├── layout.css          # Header, sidebar, main
        ├── components.css      # Shared: buttons, inputs, tables, modals
        ├── patch-sheet.css
        ├── stage-plot.css
        └── run-of-show.css
```

### Routing (Hash Router)

```
/#/                         HomePage
/#/patch-sheets             PatchSheetPage (list)
/#/patch-sheets/:id         PatchSheetPage (editing)
/#/stage-plots              StagePlotPage (list)
/#/stage-plots/:id          StagePlotPage (editing)
/#/run-of-show              RunOfShowPage (list)
/#/run-of-show/:id          RunOfShowPage (editing)
```

Hash routing is required because GitHub Pages has no server-side redirect support for SPA paths.

### State Management

**Document registry** (`document-store.ts`): Zustand + `persist` middleware. Stores metadata only (id, type, name, timestamps). Persisted to `sd-documents` localStorage key.

**Per-tool editing stores** (3 stores, each with `zundo` temporal for undo/redo):
- `patch-sheet-store.ts`: `inputs[]`, `outputs[]`, `metadata`, `activeTab`
- `stage-plot-store.ts`: `elements[]`, `stageSize`, `selectedElementId`, `background`
- `run-of-show-store.ts`: `items[]`, `customColumns[]`, `columnColors`

Each document's data is stored under its own localStorage key (`sd-patch-{id}`, `sd-stage-{id}`, `sd-ros-{id}`), preventing serialization bottleneck and isolating failures.

**Why separate stores instead of one?** The three tools have fundamentally different data shapes: arrays of channel rows, positioned canvas elements, and timeline items with cascading time dependencies. A single store would need complex discriminated unions for every action. Separate editing stores keep each tool's actions cleanly namespaced.

### Data Models

**Patch Sheet:**
```typescript
interface InputChannel {
  id: string;
  channelNumber: string;
  name: string;
  micType: 'dynamic' | 'condenser' | 'di' | 'ribbon' | 'wireless';
  device: string;
  phantom: boolean;
  connection: 'analog-snake' | 'dante' | 'direct';
  connectionDetails: string;
  notes: string;
  isStereo: boolean;
  stereoChannelNumber: string;
}

interface OutputChannel {
  id: string;
  channelNumber: string;
  name: string;
  sourceType: string;
  sourceDetails: string;
  destinationType: string;
  destinationGear: string;
  notes: string;
}

interface PatchSheetMetadata {
  venue: string;
  date: string;
  fohEngineer: string;
  monitorEngineer: string;
  notes: string;
}
```

**Stage Plot:**
```typescript
type StageSize = 'small-narrow' | 'small-wide' | 'medium-narrow' | 'medium-wide' |
                 'large-narrow' | 'large-wide' | 'xlarge-narrow' | 'xlarge-wide';

interface StageElement {
  id: string;
  type: string; // 'microphone', 'electric-guitar', 'drums', etc.
  label: string;
  x: number; y: number;
  width: number; height: number;
  rotation: number;
  color: string;
  labelVisible: boolean;
}
```

**Run of Show:**
```typescript
interface RunOfShowItem {
  id: string;
  type: 'item' | 'header';
  itemNumber: string;
  startTime: string; // "HH:MM:SS"
  duration: string;  // "MM:SS"
  audio: string;
  video: string;
  lights: string;
  productionNotes: string;
  privateNotes: string;
  highlightColor?: string;
  headerTitle?: string;
  [customKey: string]: unknown; // dynamic custom columns
}

interface CustomColumnDef {
  id: string;
  name: string;
  type: 'text' | 'number' | 'time';
  highlightColor?: string;
}
```

### CSS Approach

Scoped `--sd-*` tokens on `.sd-app` (same pattern as `--daw-*` on `.daw-app` in `projects/modular-daw/src/styles/tokens.css`). Dark-first, always dark regardless of site theme. All selectors prefixed `.sd-`. Print styles via `@media print` force white bg and hide chrome.

### Build/Deploy

Same as modular DAW:
- `vite.config.ts` with `serve-site-root` plugin, `base: '/projects/sounddocs/'`, lib build mode
- Build script: `tsc -b && vite build && rm -rf assets && mkdir -p assets && cp dist/index.js dist/index.css assets/`
- `index.html` dual-script pattern (production: `assets/`, dev: `./src/main.tsx`)
- Dependencies: react, react-dom, react-router-dom, zustand, zundo, nanoid, jspdf, jspdf-autotable

---

## Implementation Phases

### Phase 1: Scaffolding + Patch Sheet Editor

Patch Sheet first — simplest tool (tabular, no canvas, no time math) but establishes all shared infrastructure.

**Step 1.1: Project skeleton**
- `index.html` (templated from modular-daw)
- `package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`
- `npm install`

**Step 1.2: Routing + app shell**
- `src/main.tsx` with `createHashRouter`
- `src/App.tsx` with `.sd-app`, `AppHeader`, `<Outlet>`
- Design tokens (`tokens.css`) and base styles

**Step 1.3: Document infrastructure**
- Type definitions (`types/`)
- `document-store.ts` with persist
- `lib/storage.ts`, `lib/id.ts`
- Shared components: `DocumentList`, `DocumentCard`, `EmptyState`, `ConfirmDialog`

**Step 1.4: Patch Sheet Editor**
- `patch-sheet-store.ts` with zundo
- `PatchSheetEditor`, `InputTable`, `OutputTable`, `ChannelRow`
- `EditableCell` component
- `PatchSheetMetadata`
- `useAutoSave` hook
- `Toolbar` with undo/redo

**Step 1.5: Export/Import**
- `ExportMenu`, `ImportModal`
- `lib/export-json.ts`
- `lib/export-pdf.ts` (jsPDF table export)

**Verify:** Create patch sheet, edit channels, reload (auto-saved), switch documents, delete, export JSON, import JSON, export PDF, `npm run build` passes.

### Phase 2: Run of Show Editor

Shares table infrastructure from Phase 1. New: time calculations, custom columns, row reordering, color highlighting.

**Step 2.1:** Types + store (`run-of-show-store.ts`)
**Step 2.2:** `lib/time-utils.ts` (parse, calculate, format)
**Step 2.3:** `TimelineTable`, `TimelineRow`, `SectionHeader`
**Step 2.4:** `ColumnManager` for custom columns
**Step 2.5:** `ColorPicker`, row highlighting
**Step 2.6:** Drag-to-reorder rows
**Step 2.7:** Time auto-cascading (start + duration → next start)
**Step 2.8:** PDF export

**Verify:** Create run of show, add items + headers, custom columns, time auto-calc, reorder, color rows, export PDF/JSON.

### Phase 3: Stage Plot Designer

Most technically complex. Native DOM positioning for elements (no canvas library needed for tens of elements).

**Step 3.1:** Types + store (`stage-plot-store.ts`)
**Step 3.2:** `StageCanvas` with pointer-event drag system
**Step 3.3:** `StageElement` (drag, resize, rotate)
**Step 3.4:** `ElementPalette` with SVG icons for ~20 element types
**Step 3.5:** `PropertiesPanel` (label, color, rotation, size)
**Step 3.6:** `StageSizeSelector`, `BackgroundUpload`
**Step 3.7:** Element duplication/deletion
**Step 3.8:** PDF export (DOM-to-canvas snapshot)

**Verify:** Create stage plot, add elements from palette, drag/resize/rotate, change properties, background image, different stage sizes, export PDF/JSON.

### Phase 4: Polish

**Step 4.1:** `HomePage` dashboard with tool cards + recent documents
**Step 4.2:** Print-friendly CSS (`@media print`)
**Step 4.3:** Keyboard shortcuts (Ctrl+Z undo, Ctrl+S save, etc.)
**Step 4.4:** Add to `lab.html` listing
**Step 4.5:** Update `CLAUDE.md` project structure

---

## Key Files to Template From

| Template file | Purpose |
|---|---|
| `projects/modular-daw/vite.config.ts` | Vite config with `serve-site-root` plugin |
| `projects/modular-daw/index.html` | Shell HTML with dual-script pattern |
| `projects/modular-daw/package.json` | Build script, dependencies |
| `projects/modular-daw/src/store/graph-store.ts` | Zustand + zundo pattern |
| `projects/modular-daw/src/styles/tokens.css` | Scoped CSS token pattern |
| `projects/modular-daw/src/hooks/use-undo-redo.ts` | Undo/redo hook |

---

## Verification

After each phase:
1. `npm run build` passes
2. Open page, create/edit/save documents
3. Reload browser — documents persist
4. Export JSON, import on fresh browser — data round-trips
5. Site light mode and dark mode — SoundDocs always dark
6. Navigation between tools works

---

## Reference: SoundDocs Original Features

The original SoundDocs app (github.com/SoundDocs/sounddocs) includes features we're intentionally omitting:
- **Supabase backend** (auth, real-time collaboration, sharing) — replaced with localStorage
- **Comms Planner** (wireless intercom RF planning) — too specialized for initial release
- **AcoustIQ Audio Analyzer** (FFT, transfer functions) — requires Python capture agent
- **Technical Rider Manager** — could be added later
- **Production Schedule** — could be added later
- **Pixel Map Designer** — lighting-specific, low priority
- **Corporate/Theater Mic Plots** — variants of stage plot, could extend later
- **Real-time collaboration** — requires backend
- **Document sharing** — requires backend

These could be added in future phases if useful for students.
