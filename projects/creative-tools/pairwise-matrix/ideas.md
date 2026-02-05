# Pairwise Matrix: Future Ideas

## Data Persistence

### Google Drive Integration
- **Challenge**: Want to associate data with user's Google account without storing on our server, but also without creating visible files in their Drive
- **Option A**: Use Google Drive's App Data folder (hidden folder only this app can access)
- **Option B**: Store as JSON file in user's Drive (visible but portable)
- **Option C**: Use Google Tasks API to sync results as a task list
- **Research needed**: App Data folder requires OAuth consent screen review for "sensitive scope"

### Multiple Saved Matrices
- Like TextGarden's document management
- List of saved matrices in a dropdown/sidebar
- Each matrix has: id, context/question, items, comparisons, timestamps
- Quick switch between matrices without losing work

## Export Enhancements

### PDF Export
- Styled print view showing:
  - The decision context/question
  - The full matrix with all comparisons
  - The ranked results list
- CSS print styles or html2canvas approach

### Plain Text Export
- Simple ranked list for pasting into notes/chat
- Format: `1. Steak (5 wins)\n2. Chicken (3 wins)...`

### Re-importable Format
- JSON that preserves everything
- Markdown with embedded data (like TextGarden's comment-based format?)

## UX Improvements

### Guided Comparison Mode
- Instead of showing the full matrix, present one comparison at a time
- Large buttons: "A: Steak" vs "B: Chicken"
- Progress indicator: "Comparison 3 of 15"
- Reduces cognitive load for many items

### Undo/Redo
- Allow changing a comparison after the fact
- Either through the matrix view (click cell to re-compare)
- Or through undo button during guided mode

### Tie Handling
- What if user can't decide between two items?
- Option: "Skip" button that leaves comparison blank (neither gets a point)
- Option: "Tie" button that gives both half a point
- Current: Force a choice (simpler, cleaner rankings)

## Framework Presets

### Criteria Bundles
- User selects a framework, tool pre-fills suggested criteria as items
- Eisenhower-inspired: "Urgent", "Important", "Can Delegate", "Can Delete"
- Energy-based: "High Energy Required", "Low Energy OK", "Can Do Tired"
- Value-based: "High Impact", "Low Effort", "Aligns with Goals"

### Decision Templates
- "Wedding Menu" (with suggested item count guidance)
- "Daily Task Priority"
- "Vacation Destination"
- "Feature Prioritization"

## Visualization

### Matrix Heatmap
- Color cells by winner: A's color when A wins, B's color when B wins
- Makes patterns visible at a glance

### Win/Loss Network Graph
- Nodes are items, edges show who beat whom
- Direction of arrow indicates winner
- Could reveal "rock-paper-scissors" cycles (A beats B, B beats C, C beats A)

## Accessibility

### Screen Reader Support
- ARIA labels for all matrix cells
- Announce comparison prompt clearly
- Announce results in logical order

### Keyboard Navigation
- Full keyboard support for all interactions
- Arrow keys to navigate matrix
- Enter to select/confirm

## Integration Ideas

### Copy as Markdown Table
- One-click copy of matrix as GitHub-flavored markdown table
- Useful for documentation, meeting notes

### Webhook/API
- POST results to a URL when comparison completes
- Could integrate with automation tools (Zapier, Make)
- Privacy concern: opt-in only, user provides URL
