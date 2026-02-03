# TextGarden Architecture

## System Overview

```mermaid
graph TB
    subgraph HTML["index.html"]
        Toolbar["Toolbar<br/>(new, import, export, undo, redo, search, zen, fullscreen)"]
        Breadcrumb["Breadcrumb Navigation"]
        Columns["Columns Container<br/>(horizontal scroll, 6 max levels)"]
        ExpandedEditor["Expanded Editor Overlay<br/>(modal, fullscreen, split-left, split-right)"]
        ZenMode["Zen Mode<br/>(stacked textareas, structure bar, breadcrumb, map)"]
        Modals["Modals<br/>(search, print, shortcuts, templates, analysis)"]
        DocDropdown["Document Dropdown<br/>(settings, recent docs, analytics)"]
    end

    subgraph JS["js/app.js"]
        State["State Object"]
        TreeOps["Tree Operations"]
        Rendering["Rendering Engine"]
        Events["Event System"]
        Storage["Storage Layer"]
        ImportExport["Import / Export"]
    end

    Toolbar --> Events
    Columns --> Events
    ExpandedEditor --> Events
    ZenMode --> Events
    Modals --> Events
    DocDropdown --> Events

    Events --> State
    Events --> TreeOps
    TreeOps --> State
    State --> Rendering
    Rendering --> Columns
    Rendering --> ExpandedEditor
    State --> Storage
    Storage --> State
    ImportExport --> State
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> Viewing: init()

    Viewing --> InlineEditing: double-click card
    InlineEditing --> Viewing: blur / Ctrl+Enter / Escape

    Viewing --> ExpandedEditing: click expand btn / press E
    ExpandedEditing --> Viewing: Save / Cancel / Escape
    ExpandedEditing --> ExpandedEditing: click different card (split mode)

    Viewing --> ZenMode: press Z / click zen btn
    ZenMode --> Viewing: Escape / exit zen

    Viewing --> Searching: Ctrl+F
    Searching --> Viewing: Escape / select result

    Viewing --> Dragging: drag card
    Dragging --> Viewing: drop
```

## Data Model

```mermaid
classDiagram
    class State {
        +Array~Node~ tree
        +Array~string~ selectedPath
        +string editingId
        +string expandedEditingId
        +string filename
        +boolean hasUnsavedChanges
        +Array undoStack
        +Array redoStack
        +string editorViewMode
        +boolean zenMode
        +string zenRootId
        +boolean zenDepthIndent
        +Object columnWidths
        +Set collapsedColumns
    }

    class Node {
        +string id
        +string title
        +string content
        +Array~Node~ children
    }

    class TreeWalker {
        +traverse(tree, callback)
        +map(tree, fn)
        +filter(tree, predicate)
        +find(tree, predicate)
        +count(tree, predicate)
        +getAllText(tree)
        +getWordCount(tree)
        +flatten(tree)
    }

    State "1" *-- "*" Node : tree
    Node "1" *-- "*" Node : children
    TreeWalker ..> Node : operates on
```

## Function Groups

```mermaid
graph LR
    subgraph Core["Core Operations"]
        createNode["createNode()"]
        findNode["findNode()"]
        getAncestorIds["getAncestorIds()"]
        getNodeAtPath["getNodeAtPath()"]
        buildPathToNode["buildPathToNode()"]
    end

    subgraph Edit["Editing"]
        addSibling["addSibling()"]
        addChild["addChild()"]
        splitCard["splitCard()"]
        mergeWithPrevious["mergeWithPrevious()"]
        deleteSelected["deleteSelected()"]
        moveCard["moveCard()"]
        moveCardLeft["moveCardLeft()"]
        moveCardRight["moveCardRight()"]
    end

    subgraph UndoRedo["Undo / Redo"]
        saveState["saveState()"]
        undo["undo()"]
        redo["redo()"]
    end

    subgraph Selection["Selection & Navigation"]
        selectCard["selectCard()"]
        navigateCards["navigateCards()"]
        clearSelection["clearSelection()"]
        pushToFocusHistory["pushToFocusHistory()"]
        navigateFocusBack["navigateFocusBack()"]
        navigateFocusForward["navigateFocusForward()"]
    end

    subgraph InlineEdit["Inline Editing"]
        startEditing["startEditing()"]
        stopEditing["stopEditing()"]
    end

    subgraph ExpandedEdit["Expanded Editor"]
        openExpandedEditor["openExpandedEditor()"]
        closeExpandedEditor["closeExpandedEditor()"]
        updateExpandedPreview["updateExpandedPreview()"]
        insertMarkdown["insertMarkdown()"]
        applyEditorMode["applyEditorMode()"]
    end

    subgraph Zen["Zen Mode"]
        toggleZenMode["toggleZenMode()"]
        openZenEditor["openZenEditor()"]
        exitZenMode["exitZenMode()"]
        renderZenCards["renderZenCards()"]
        buildZenCardElement["buildZenCardElement()"]
        flattenSubtree["flattenSubtree()"]
        collectZenEdits["collectZenEdits()"]
        zenAddSiblingAfter["zenAddSiblingAfter()"]
        zenAddChildTo["zenAddChildTo()"]
        updateZenBreadcrumb["updateZenBreadcrumb()"]
        updateZenExpandedMap["updateZenExpandedMap()"]
        zenTypewriterScroll["zenTypewriterScroll()"]
    end

    subgraph Render["Rendering"]
        render["render()"]
        renderColumn["renderColumn()"]
        renderCard["renderCard()"]
        renderMarkdown["renderMarkdown()"]
        renderCardLinks["renderCardLinks()"]
    end

    subgraph DragDrop["Drag & Drop"]
        handleDragStart["handleDragStart()"]
        handleDragEnd["handleDragEnd()"]
        handleDragOver["handleDragOver()"]
        handleDrop["handleDrop()"]
    end

    subgraph IO["Import / Export"]
        saveDocumentAsJSON["saveDocumentAsJSON()"]
        exportAsMarkdown["exportAsMarkdown()"]
        treeToCommentMarkdown["treeToCommentMarkdown()"]
        commentMarkdownToTree["commentMarkdownToTree()"]
        treeToMarkdown["treeToMarkdown()"]
        markdownToTree["markdownToTree()"]
        importFile["importFile()"]
    end

    subgraph Persist["Persistence"]
        loadFromStorage["loadFromStorage()"]
        autoSave["autoSave()"]
        saveSettings["saveSettings()"]
        loadSettings["loadSettings()"]
        saveDocumentToRecent["saveDocumentToRecent()"]
        loadDocument["loadDocument()"]
    end

    subgraph Search["Search"]
        showSearchModal["showSearchModal()"]
        performModalSearch["performModalSearch()"]
        selectSearchResult["selectSearchResult()"]
    end

    subgraph DocMgmt["Document Management"]
        newDocument["newDocument()"]
        renameDocument["renameDocument()"]
        saveAsCopy["saveAsCopy()"]
        updateTitle["updateTitle()"]
    end

    subgraph Analytics["Analytics"]
        analyzeWordFrequency["analyzeWordFrequency()"]
        analyzeReadingLevel["analyzeReadingLevel()"]
        calculateDocStats["calculateDocStats()"]
        updateDocStats["updateDocStats()"]
    end

    subgraph Session["Session Tracking"]
        startSession["startSession()"]
        updateSessionTimer["updateSessionTimer()"]
        updateWordGoalProgress["updateWordGoalProgress()"]
        toggleTimerPause["toggleTimerPause()"]
        resetTimer["resetTimer()"]
    end
```

## Data Flow

```mermaid
flowchart TD
    User([User Action]) --> Events{Event Handler}

    Events -->|"click, dblclick,<br/>keydown, drag"| TreeMod[Modify Tree]
    Events -->|"input"| UpdateContent[Update Node Content]
    Events -->|"Ctrl+Z"| Undo[Undo / Redo]

    TreeMod --> SaveState[saveState<br/>push to undoStack]
    UpdateContent --> SaveState
    Undo --> RestoreState[Restore from Stack]

    SaveState --> StateObj[(State Object)]
    RestoreState --> StateObj

    StateObj --> Render[render]
    Render --> DOM[Update DOM<br/>columns, cards, breadcrumb]

    StateObj --> AutoSave[autoSave<br/>debounced]
    AutoSave --> LocalStorage[(localStorage)]

    LocalStorage -->|"page load"| LoadStorage[loadFromStorage]
    LoadStorage --> StateObj

    subgraph ImportExport["Import / Export"]
        JSONDocFile[".json Document"] -->|"importFile()"| StateObj
        StateObj -->|"saveDocumentAsJSON()"| JSONDocExport[".json Download"]
        MDFile[".md File"] -->|"commentMarkdownToTree()<br/>or markdownToTree()"| StateObj
        StateObj -->|"treeToCommentMarkdown()"| MDExport[".md Download"]
        JSONSettingsFile[".json Settings"] -->|"applySettings()"| StateObj
        StateObj -->|"exportSettings()"| JSONSettingsExport[".json Download"]
    end
```

## Import / Export Formats

### JSON Document (primary, lossless)

```json
{
  "version": 1,
  "type": "textgarden-document",
  "filename": "My Document",
  "tree": [
    {
      "id": "uuid",
      "title": "Chapter 1",
      "content": "Body text with **markdown**.",
      "children": [...]
    }
  ],
  "selectedPath": ["uuid-1", "uuid-2"],
  "exportedAt": "2026-02-03T12:00:00.000Z"
}
```

### Markdown Export (comment-based structure)

```markdown
<!-- textgarden:node depth="1" title="Chapter 1" -->
Introduction text with **markdown**.

<!-- textgarden:node depth="2" title="Scene 1" -->
The scene opens...
```

Comments are invisible in rendered markdown (GitHub, VS Code preview, etc.). On import, files without comment markers fall back to heading-based parsing (`markdownToTree()`) for compatibility with generic markdown files.

## Zen Mode Flow

```mermaid
flowchart TD
    Enter["toggleZenMode()"] --> SaveMode["Save current editorViewMode"]
    SaveMode --> SetZen["state.zenMode = true<br/>state.zenRootId = selected card"]
    SetZen --> Flatten["flattenSubtree(rootNode)<br/>build ordered card list"]
    Flatten --> RenderCards["renderZenCards()<br/>build stacked textareas"]
    RenderCards --> OpenEditor["openZenEditor()<br/>fullscreen overlay"]
    OpenEditor --> RenderUI["Show structure bar:<br/>breadcrumb + map toggle"]

    subgraph ZenEditing["Zen Editing Loop"]
        Type["User types in textarea"] --> AutoResize["autoResizeZenTextarea()"]
        Focus["Focus card"] --> UpdateBreadcrumb["updateZenBreadcrumb()<br/>read from DOM"]
        UpdateBreadcrumb --> UpdateMap["updateZenExpandedMap()<br/>build column tree view"]
        Tab["Tab"] --> ZenChild["zenAddChildTo()<br/>modify tree, re-render"]
        ShiftTab["Shift+Tab"] --> ZenSibling["zenAddSiblingAfter()<br/>modify tree, re-render"]
        ArrowKeys["Arrow Up/Down"] --> Navigate["focusPreviousZenCard()<br/>focusNextZenCard()"]
        CmdM["Cmd+M"] --> ToggleMap["toggleZenMap()<br/>show/hide tree overlay"]
        ClickMap["Click map card"] --> JumpTo["Focus target card textarea"]
        HoverSeparator["Hover separator bar"] --> ShowActions["Show + sibling / + child buttons"]
    end

    OpenEditor --> ZenEditing

    Escape["Escape"] --> CollectEdits["collectZenEdits()<br/>sync textareas to tree"]
    CollectEdits --> RestoreMode["exitZenMode()<br/>restore editor mode"]
    RestoreMode --> Render["render()"]
```

### Zen Mode UI Structure

Each card in zen mode is a `.zen-card` element containing:

1. **Separator bar** (`.zen-card-separator`): shows index (e.g., "1.2"), card title, and hover-reveal action buttons ("+ sibling", "+ child")
2. **Textarea** (`.zen-card-editor`): auto-resizing textarea for the card's content

Cards are indented by depth when the "Depth indentation" setting is enabled. The active card's separator is highlighted with the accent color.

### Zen Mode vs Old Architecture

The previous implementation serialized the subtree into a single textarea as markdown with HTML comment markers as card boundaries. The current implementation renders one textarea per card, eliminating the need for markdown serialization/parsing during editing. Tree modifications (add sibling/child) directly modify `state.tree` and re-render.

## Storage Layout

```mermaid
graph LR
    subgraph localStorage
        AutoSave["textgarden-autosave<br/>{tree, selectedPath, filename, docId, ...}"]
        Docs["textgarden-documents<br/>[{id, filename, tree, wordCount, updatedAt}, ...]"]
        Settings["textgarden-settings<br/>{zenWidth, zenTypewriter, zenDepthIndent,<br/>focusFade, cardPreviewEnabled, ...}"]
        ColWidths["textgarden-column-widths<br/>{0: 320, 1: 280, ...}"]
        Theme["theme-preference<br/>'dusk' | 'twilight' | 'night'"]
    end
```

## UI Layout

```mermaid
graph TB
    subgraph AppLayout["App Layout"]
        direction TB
        TB["Toolbar (48px)<br/>buttons, title, stats, timer"]
        BC["Breadcrumb (conditional)"]
        subgraph Main["Main Content"]
            direction LR
            C1["Column 1<br/>Roots"]
            C2["Column 2<br/>Stems"]
            C3["Column 3<br/>Branches"]
            C4["Column 4<br/>Twigs"]
            C5["Column 5<br/>Buds"]
            C6["Column 6<br/>Leaves"]
        end
    end

    subgraph Overlays["Overlay Layers (z-index: 2000)"]
        EE["Expanded Editor<br/>(default, fullscreen, split-left, split-right)"]
        ZM["Zen Mode<br/>(stacked textareas in fullscreen overlay)"]
        SM["Search Modal"]
        PM["Print Modal"]
        SK["Shortcuts Modal"]
        TM["Templates Modal"]
        AN["Analysis Modal"]
    end

    subgraph SplitMode["Split Mode"]
        direction LR
        Editor["Editor (50vw)"]
        Tree["App (50vw)<br/>toolbar + columns"]
    end
```

## Keyboard Shortcuts

```mermaid
graph TB
    subgraph Global["Global Shortcuts"]
        G1["Ctrl+N → New document"]
        G2["Ctrl+O → Import file"]
        G3["Ctrl+S → Save as JSON"]
        G4["Ctrl+Z → Undo"]
        G5["Ctrl+Shift+Z → Redo"]
        G6["Ctrl+F → Search"]
        G7["F11 → Fullscreen"]
        G8["? → Shortcuts dialog"]
    end

    subgraph Nav["Navigation (when not editing)"]
        N1["Arrow keys → Navigate cards"]
        N2["Alt+← → Focus back"]
        N3["Alt+→ → Focus forward"]
        N4["E → Open expanded editor"]
        N5["Z → Toggle zen mode"]
    end

    subgraph Structure["Structure (when not editing)"]
        S1["Enter → Add sibling below"]
        S2["Shift+Enter → Add sibling above"]
        S3["Tab → Add child"]
        S4["Delete → Delete card"]
        S5["Alt+↑/↓ → Move card"]
        S6["Alt+←/→ → Promote/demote"]
    end

    subgraph Editor["In Expanded Editor"]
        E1["Ctrl+Enter → Save and close"]
        E2["Escape → Cancel"]
        E3["Ctrl+B → Bold"]
        E4["Ctrl+I → Italic"]
        E5["Ctrl+K → Link"]
    end

    subgraph Zen["In Zen Mode"]
        Z1["Tab → Add child card"]
        Z2["Shift+Tab → Add sibling card"]
        Z3["Ctrl+B/I/K → Markdown formatting"]
        Z4["Ctrl+M → Toggle map"]
        Z5["Arrow Up/Down → Navigate between cards"]
        Z6["Escape → Exit zen"]
    end
```
