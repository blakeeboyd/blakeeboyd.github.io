# Pairwise Matrix Architecture

## Overview

A pairwise comparison tool that helps users prioritize items by comparing them head-to-head. Each item competes against every other item exactly once, and the item with the most "wins" is ranked highest.

## How Pairwise Comparison Works

Given N items, there are N×(N-1)/2 unique comparisons:
- 3 items → 3 comparisons
- 4 items → 6 comparisons
- 5 items → 10 comparisons
- 6 items → 15 comparisons
- 10 items → 45 comparisons

## System Flow

```mermaid
flowchart TD
    Start([User Opens Tool]) --> Setup[Setup Phase]

    subgraph Setup[Setup Phase]
        Q1[Enter decision context/question] --> Q2[Enter number of items]
        Q2 --> Items[Enter item names A, B, C...]
    end

    Setup --> Compare[Comparison Phase]

    subgraph Compare[Comparison Phase]
        Show[Show two items side by side] --> Pick[User picks winner]
        Pick --> Record[Record winner in matrix]
        Record --> Check{More comparisons?}
        Check -->|Yes| Show
        Check -->|No| Results
    end

    Compare --> Results[Results Phase]

    subgraph Results[Results Phase]
        Tally[Tally wins per item] --> Rank[Sort by wins descending]
        Rank --> Display[Display ranked list + matrix]
    end

    Results --> Export[Export Options]

    subgraph Export[Export Options]
        MD[Download Markdown]
        PDF[Print/PDF]
        JSON[Download JSON for re-import]
    end
```

## Data Model

```mermaid
classDiagram
    class State {
        +string context
        +Array~Item~ items
        +Object~string,string~ comparisons
        +number currentComparison
        +string phase
    }

    class Item {
        +string id
        +string label
        +number wins
    }

    class Comparison {
        +string itemA
        +string itemB
        +string winner
    }

    State "1" *-- "*" Item : items
    State "1" *-- "*" Comparison : comparisons
```

## UI States

```mermaid
stateDiagram-v2
    [*] --> Setup: page load

    Setup --> Comparing: all items entered
    Comparing --> Comparing: pick winner
    Comparing --> Results: all comparisons done

    Results --> Setup: start new
    Results --> Comparing: edit (re-compare)

    Setup --> Setup: load from storage/file
```

## Matrix Visualization

For items A, B, C, D, the matrix shows:

```
     A   B   C   D   Wins
A    -   ?   ?   ?
B    -   -   ?   ?
C    -   -   -   ?
D    -   -   -   -
```

- Diagonal is empty (no self-comparison)
- Upper triangle shows comparison results
- Lower triangle mirrors upper (if A beats B, then B loses to A)
- `?` indicates comparison not yet done
- Winner's letter fills the cell

## Storage

```mermaid
graph LR
    subgraph localStorage
        Matrices["pairwise-matrices<br/>[{id, context, items, comparisons, createdAt, updatedAt}]"]
        Settings["pairwise-settings<br/>{lastMatrixId}"]
    end

    subgraph Export
        MD[".md file"]
        JSON[".json file"]
        PDF["Print to PDF"]
    end
```

## Comparison Order

Comparisons are presented in a fixed order for consistency:
1. A vs B
2. A vs C
3. A vs D
4. B vs C
5. B vs D
6. C vs D

This ensures item A is compared against all others first, then B against remaining, etc.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1 or ← | Pick left item |
| 2 or → | Pick right item |
| Backspace | Undo last comparison |
| Escape | Cancel/go back |
