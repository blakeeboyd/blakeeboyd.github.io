/**
 * TextGarden - Tree-structured writing tool
 * A writing tool for organizing ideas horizontally in columns
 */

(function() {
    'use strict';

    // =========================================================================
    // State
    // =========================================================================

    const state = {
        tree: [],                    // Array of root-level nodes
        selectedPath: [],            // Array of node IDs from root to selected
        editingId: null,             // ID of card being edited
        expandedEditingId: null,     // ID of card being edited in expanded view
        filename: 'Untitled',        // Current document filename
        hasUnsavedChanges: false,    // Track unsaved changes
        undoStack: [],               // Undo history
        redoStack: [],               // Redo history
        maxUndoSteps: 50,            // Limit undo history
        searchQuery: '',             // Current search query
        searchMatches: [],           // IDs of matching cards
        columnWidths: {},            // Custom column widths { index: width }
        collapsedColumns: new Set(), // Set of collapsed column indices
        editorPreviewHidden: false,  // Whether expanded editor preview is hidden
        editorViewMode: 'default',   // Expanded editor mode: default, fullscreen, split-left, split-right
        draggedId: null,             // ID of card being dragged
        focusHistory: [],            // History of selected paths for back/forward
        focusHistoryIndex: -1,       // Current position in focus history
        zenMode: false,              // Zen mode for distraction-free writing
        preZenEditorMode: null,      // Editor mode before entering zen mode
        zenRootId: null,             // ID of root card being edited in zen mode
        zenBrowserFullscreen: true,  // Whether zen mode requests browser fullscreen
        zenWidth: 'medium',          // Zen mode text width: narrow, medium, wide
        zenTypewriter: true,         // Whether to center cursor vertically in Zen mode
        typewriterScroll: true,      // Whether to use typewriter scrolling
        showCardBadges: false,       // Whether to show child count badges on cards
        wordGoalEnabled: false,      // Whether to show word goal progress
        wordGoal: 500,               // Session word goal
        sessionTimerEnabled: false,  // Whether to show session timer
        sessionStartTime: null,      // When the current session started
        sessionStartWords: 0,        // Word count at session start
        timerMode: 'stopwatch',      // Timer mode: 'stopwatch' or 'pomodoro'
        pomodoroDuration: 25,        // Pomodoro duration in minutes
        timerPaused: false,          // Whether timer is paused
        timerPausedAt: null,         // Time when timer was paused
        timerElapsedBeforePause: 0,  // Elapsed time before pause (for pomodoro)
        focusFade: false,            // Whether to use focus fade in Zen mode
        cardPreviewEnabled: false,   // Whether to show card preview on hover
        zenDepthIndent: true         // Whether to indent cards by depth in Zen mode
    };

    // =========================================================================
    // DOM Elements
    // =========================================================================

    const columnsContainer = document.getElementById('columns');
    const fileInput = document.getElementById('file-input');
    const docTitle = document.getElementById('doc-title');
    const docStats = document.getElementById('doc-stats');
    const toast = document.getElementById('toast');
    const searchBtn = document.getElementById('search-btn');

    // Expanded editor elements
    const expandedOverlay = document.getElementById('expanded-editor-overlay');
    const expandedInput = document.getElementById('expanded-editor-input');
    const expandedPreview = document.getElementById('expanded-editor-preview');
    const expandedSaveBtn = document.getElementById('expanded-editor-save');
    const expandedCancelBtn = document.getElementById('expanded-editor-cancel');

    // =========================================================================
    // Utility Functions
    // =========================================================================

    function generateId() {
        return crypto.randomUUID ? crypto.randomUUID() :
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
    }

    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function showToast(message, duration = 2000) {
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), duration);
    }

    // =========================================================================
    // Writing Analysis Functions
    // =========================================================================

    // Common words to filter out from frequency analysis
    const STOP_WORDS = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'it', 'its',
        'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
        'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their',
        'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
        'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
        'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also'
    ]);

    function getAllText() {
        let text = '';
        function traverse(nodes) {
            for (const node of nodes) {
                text += node.content + ' ';
                if (node.children.length > 0) {
                    traverse(node.children);
                }
            }
        }
        traverse(state.tree);
        return text;
    }

    function analyzeWordFrequency() {
        const text = getAllText().toLowerCase();
        // Extract words, removing punctuation
        const words = text.match(/[a-z]+/g) || [];

        // Count word frequencies, excluding stop words
        const freq = {};
        for (const word of words) {
            if (word.length > 2 && !STOP_WORDS.has(word)) {
                freq[word] = (freq[word] || 0) + 1;
            }
        }

        // Sort by frequency
        const sorted = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

        return sorted;
    }

    function showWordFrequency() {
        const freq = analyzeWordFrequency();
        const analysisOverlay = document.getElementById('analysis-overlay');
        const analysisTitle = document.getElementById('analysis-title');
        const analysisContent = document.getElementById('analysis-content');

        analysisTitle.innerHTML = 'Word Frequency <button id="analysis-close" class="analysis-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>';

        if (freq.length === 0) {
            analysisContent.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 20px 0;">No content to analyze yet. Start writing!</p>';
        } else {
            const maxCount = freq[0][1];
            let html = '<p style="color: var(--color-text-muted); margin-bottom: 16px;">Most frequent words (excluding common words)</p>';
            html += '<div class="word-freq-list">';
            for (const [word, count] of freq) {
                const pct = (count / maxCount) * 100;
                html += `
                    <span class="word-freq-word">${word}</span>
                    <span class="word-freq-count">${count}×</span>
                    <div class="word-freq-bar"><div class="word-freq-bar-fill" style="width: ${pct}%"></div></div>
                `;
            }
            html += '</div>';
            analysisContent.innerHTML = html;
        }

        analysisOverlay.classList.add('visible');

        // Close button handler
        const closeBtn = analysisOverlay.querySelector('#analysis-close');
        closeBtn.onclick = () => analysisOverlay.classList.remove('visible');
        analysisOverlay.onclick = (e) => {
            if (e.target === analysisOverlay) {
                analysisOverlay.classList.remove('visible');
            }
        };
    }

    function analyzeReadingLevel() {
        const text = getAllText();
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.match(/[a-z]+/gi) || [];
        const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

        if (words.length === 0 || sentences.length === 0) {
            return null;
        }

        // Flesch-Kincaid Grade Level
        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

        // Flesch Reading Ease
        const readingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

        return {
            gradeLevel: Math.max(0, Math.round(gradeLevel * 10) / 10),
            readingEase: Math.max(0, Math.min(100, Math.round(readingEase))),
            wordCount: words.length,
            sentenceCount: sentences.length,
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10
        };
    }

    function countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;

        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    function getReadingLevelDescription(gradeLevel) {
        if (gradeLevel <= 5) return 'Easy to read (Elementary level)';
        if (gradeLevel <= 8) return 'Fairly easy (Middle school level)';
        if (gradeLevel <= 10) return 'Standard (High school level)';
        if (gradeLevel <= 12) return 'Fairly difficult (College level)';
        return 'Difficult (Graduate level)';
    }

    function showReadingLevel() {
        const analysis = analyzeReadingLevel();
        const analysisOverlay = document.getElementById('analysis-overlay');
        const analysisTitle = document.getElementById('analysis-title');
        const analysisContent = document.getElementById('analysis-content');

        analysisTitle.innerHTML = 'Reading Level <button id="analysis-close" class="analysis-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>';

        if (!analysis) {
            analysisContent.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 20px 0;">No content to analyze yet. Start writing!</p>';
        } else {
            analysisContent.innerHTML = `
                <div class="reading-level-score">Grade ${analysis.gradeLevel}</div>
                <div class="reading-level-desc">${getReadingLevelDescription(analysis.gradeLevel)}</div>
                <p style="color: var(--color-text-muted); font-size: 0.8125rem; text-align: center;">
                    Flesch Reading Ease: ${analysis.readingEase}/100
                </p>
                <div class="reading-level-stats">
                    <div class="reading-level-stat">
                        <div class="reading-level-stat-value">${analysis.wordCount.toLocaleString()}</div>
                        <div class="reading-level-stat-label">Words</div>
                    </div>
                    <div class="reading-level-stat">
                        <div class="reading-level-stat-value">${analysis.sentenceCount}</div>
                        <div class="reading-level-stat-label">Sentences</div>
                    </div>
                    <div class="reading-level-stat">
                        <div class="reading-level-stat-value">${analysis.avgWordsPerSentence}</div>
                        <div class="reading-level-stat-label">Words/Sentence</div>
                    </div>
                </div>
            `;
        }

        analysisOverlay.classList.add('visible');

        // Close button handler
        const closeBtn = analysisOverlay.querySelector('#analysis-close');
        closeBtn.onclick = () => analysisOverlay.classList.remove('visible');
        analysisOverlay.onclick = (e) => {
            if (e.target === analysisOverlay) {
                analysisOverlay.classList.remove('visible');
            }
        };
    }

    // =========================================================================
    // Tree Operations
    // =========================================================================

    function createNode(title = '', content = '') {
        return {
            id: generateId(),
            title: title,
            content: content,
            children: []
        };
    }

    /**
     * Generic tree walker utility for common tree operations.
     * Provides a consistent way to traverse and manipulate the tree structure.
     */
    const TreeWalker = {
        /**
         * Traverse tree and call callback for each node (depth-first).
         * @param {Array} tree - Array of root nodes
         * @param {Function} callback - (node, depth, parent, index) => void
         * @param {number} depth - Current depth (internal)
         * @param {Object} parent - Parent node (internal)
         */
        traverse(tree, callback, depth = 0, parent = null) {
            for (let i = 0; i < tree.length; i++) {
                callback(tree[i], depth, parent, i);
                if (tree[i].children.length > 0) {
                    this.traverse(tree[i].children, callback, depth + 1, tree[i]);
                }
            }
        },

        /**
         * Map tree to new structure, preserving hierarchy.
         * @param {Array} tree - Array of root nodes
         * @param {Function} fn - (node, depth, parent) => new node
         * @returns {Array} - New tree with mapped nodes
         */
        map(tree, fn, depth = 0, parent = null) {
            return tree.map(node => {
                const mapped = fn(node, depth, parent);
                if (node.children.length > 0) {
                    mapped.children = this.map(node.children, fn, depth + 1, node);
                }
                return mapped;
            });
        },

        /**
         * Collect all nodes that match a predicate into a flat array.
         * @param {Array} tree - Array of root nodes
         * @param {Function} predicate - (node, depth, parent) => boolean
         * @returns {Array} - Flat array of matching nodes
         */
        filter(tree, predicate, depth = 0, parent = null) {
            const results = [];
            for (const node of tree) {
                if (predicate(node, depth, parent)) {
                    results.push(node);
                }
                if (node.children.length > 0) {
                    results.push(...this.filter(node.children, predicate, depth + 1, node));
                }
            }
            return results;
        },

        /**
         * Find first node matching predicate.
         * @param {Array} tree - Array of root nodes
         * @param {Function} predicate - (node, depth, parent) => boolean
         * @returns {Object|null} - First matching node or null
         */
        find(tree, predicate, depth = 0, parent = null) {
            for (const node of tree) {
                if (predicate(node, depth, parent)) {
                    return node;
                }
                if (node.children.length > 0) {
                    const found = this.find(node.children, predicate, depth + 1, node);
                    if (found) return found;
                }
            }
            return null;
        },

        /**
         * Count nodes matching predicate (or all if no predicate).
         * @param {Array} tree - Array of root nodes
         * @param {Function} predicate - (node, depth, parent) => boolean (optional)
         * @returns {number} - Count of matching nodes
         */
        count(tree, predicate = () => true, depth = 0, parent = null) {
            let count = 0;
            for (const node of tree) {
                if (predicate(node, depth, parent)) {
                    count++;
                }
                if (node.children.length > 0) {
                    count += this.count(node.children, predicate, depth + 1, node);
                }
            }
            return count;
        },

        /**
         * Get all text content from tree.
         * @param {Array} tree - Array of root nodes
         * @returns {string} - Concatenated content
         */
        getAllText(tree) {
            let text = '';
            this.traverse(tree, node => {
                text += node.content + ' ';
            });
            return text;
        },

        /**
         * Get total word count of tree.
         * @param {Array} tree - Array of root nodes
         * @returns {number} - Word count
         */
        getWordCount(tree) {
            const text = this.getAllText(tree);
            const words = text.trim().split(/\s+/);
            return text.trim() ? words.length : 0;
        },

        /**
         * Flatten tree to array of nodes with depth info.
         * @param {Array} tree - Array of root nodes
         * @returns {Array} - Array of { node, depth, parent }
         */
        flatten(tree, depth = 0, parent = null) {
            const results = [];
            for (const node of tree) {
                results.push({ node, depth, parent });
                if (node.children.length > 0) {
                    results.push(...this.flatten(node.children, depth + 1, node));
                }
            }
            return results;
        }
    };

    function findNode(tree, id, parent = null, index = 0) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                return { node: tree[i], parent, siblings: tree, index: i };
            }
            const found = findNode(tree[i].children, id, tree[i], i);
            if (found) return found;
        }
        return null;
    }

    function getNodeAtPath(tree, path) {
        if (!path.length) return null;

        let current = tree;
        let node = null;

        for (const id of path) {
            node = current.find(n => n.id === id);
            if (!node) return null;
            current = node.children;
        }

        return node;
    }

    function getAncestorIds(tree, targetId, path = []) {
        for (const node of tree) {
            if (node.id === targetId) {
                return path;
            }
            const found = getAncestorIds(node.children, targetId, [...path, node.id]);
            if (found) return found;
        }
        return null;
    }

    // =========================================================================
    // Undo/Redo
    // =========================================================================

    function saveState() {
        state.undoStack.push({
            tree: deepClone(state.tree),
            selectedPath: [...state.selectedPath]
        });

        if (state.undoStack.length > state.maxUndoSteps) {
            state.undoStack.shift();
        }

        state.redoStack = [];
        markUnsaved();
    }

    function undo() {
        if (state.undoStack.length === 0) return;

        state.redoStack.push({
            tree: deepClone(state.tree),
            selectedPath: [...state.selectedPath]
        });

        const previous = state.undoStack.pop();
        state.tree = previous.tree;
        state.selectedPath = previous.selectedPath;

        render();
        showToast('Undone');
    }

    function redo() {
        if (state.redoStack.length === 0) return;

        state.undoStack.push({
            tree: deepClone(state.tree),
            selectedPath: [...state.selectedPath]
        });

        const next = state.redoStack.pop();
        state.tree = next.tree;
        state.selectedPath = next.selectedPath;

        render();
        showToast('Redone');
    }

    // =========================================================================
    // Card Operations
    // =========================================================================

    function addSibling(below = true) {
        if (state.selectedPath.length === 0) {
            // No selection, add to root
            const newNode = createNode();
            saveState();
            state.tree.push(newNode);
            state.selectedPath = [newNode.id];
            render();
            startEditing(newNode.id);
            return;
        }

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return;

        const newNode = createNode();
        saveState();

        const insertIndex = below ? result.index + 1 : result.index;
        result.siblings.splice(insertIndex, 0, newNode);

        // Update selection to the new node
        state.selectedPath[state.selectedPath.length - 1] = newNode.id;

        render();
        startEditing(newNode.id);
    }

    const MAX_DEPTH = 6; // Intentional constraint to prevent overgrown gardens
    const LEVEL_NAMES = ['Roots', 'Stems', 'Branches', 'Twigs', 'Buds', 'Leaves'];

    function addChild() {
        if (state.selectedPath.length === 0) {
            addSibling();
            return;
        }

        // Enforce depth limit
        if (state.selectedPath.length >= MAX_DEPTH) {
            showToast(`You're at the ${LEVEL_NAMES[MAX_DEPTH - 1]} level — that's as deep as it goes`);
            return;
        }

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return;

        // Don't allow adding children to empty cards
        if (!result.node.content.trim()) {
            showToast('Add content to this card first');
            return;
        }

        const newNode = createNode();
        saveState();

        result.node.children.push(newNode);
        state.selectedPath.push(newNode.id);

        render();
        startEditing(newNode.id);
    }

    /**
     * Split the current card at the cursor position.
     * Content before cursor stays in current card, content after becomes a new sibling.
     * @param {number} cursorPosition - Position in the text where to split
     * @param {string} fullContent - The current content of the card
     * @returns {boolean} - Whether the split was successful
     */
    function splitCard(cursorPosition, fullContent) {
        if (state.selectedPath.length === 0) return false;

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return false;

        const beforeCursor = fullContent.substring(0, cursorPosition).trimEnd();
        const afterCursor = fullContent.substring(cursorPosition).trimStart();

        // Don't split if there's nothing on one side
        if (!afterCursor) {
            showToast('Nothing to split after cursor');
            return false;
        }

        saveState();

        // Update current node with content before cursor
        result.node.content = beforeCursor;

        // Create new node with content after cursor
        const newNode = createNode('', afterCursor);
        const insertIndex = result.index + 1;
        result.siblings.splice(insertIndex, 0, newNode);

        // Select the new node
        state.selectedPath[state.selectedPath.length - 1] = newNode.id;

        render();
        startEditing(newNode.id);
        showToast('Card split');
        return true;
    }

    /**
     * Merge the current card with the sibling above it.
     * Content from the card above is prepended to the current card.
     * @returns {boolean} - Whether the merge was successful
     */
    function mergeWithPrevious() {
        if (state.selectedPath.length === 0) return false;

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return false;

        // Can't merge if this is the first card in the list
        if (result.index === 0) {
            showToast('No card above to merge with');
            return false;
        }

        const previousNode = result.siblings[result.index - 1];

        // Don't merge if previous card has children
        if (previousNode.children.length > 0) {
            showToast('Cannot merge: card above has children');
            return false;
        }

        saveState();

        // Combine content: previous card content + newlines + current content
        const separator = previousNode.content.trim() && result.node.content.trim() ? '\n\n' : '';
        result.node.content = previousNode.content.trim() + separator + result.node.content.trim();

        // Inherit title from previous card if current has none
        if (!result.node.title && previousNode.title) {
            result.node.title = previousNode.title;
        }

        // Remove the previous node
        result.siblings.splice(result.index - 1, 1);

        render();
        startEditing(result.node.id);
        showToast('Cards merged');
        return true;
    }

    function deleteSelected() {
        if (state.selectedPath.length === 0) return;

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return;

        // Confirm if has children
        if (result.node.children.length > 0) {
            if (!confirm(`Delete this card and its ${result.node.children.length} child card(s)?`)) {
                return;
            }
        }

        saveState();
        result.siblings.splice(result.index, 1);

        // Update selection
        if (result.siblings.length > 0) {
            const newIndex = Math.min(result.index, result.siblings.length - 1);
            state.selectedPath[state.selectedPath.length - 1] = result.siblings[newIndex].id;
        } else {
            state.selectedPath.pop();
        }

        render();
        showToast('Card deleted');
    }

    function moveCard(direction) {
        if (state.selectedPath.length === 0) return;

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return;

        const newIndex = result.index + direction;
        if (newIndex < 0 || newIndex >= result.siblings.length) return;

        saveState();

        // Swap
        const temp = result.siblings[result.index];
        result.siblings[result.index] = result.siblings[newIndex];
        result.siblings[newIndex] = temp;

        render();
    }

    function moveCardLeft() {
        // Move card up one level in the hierarchy (become sibling of parent)
        if (state.selectedPath.length < 2) return; // Must have a parent to move left

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const parentId = state.selectedPath[state.selectedPath.length - 2];

        const result = findNode(state.tree, selectedId);
        const parentResult = findNode(state.tree, parentId);
        if (!result || !parentResult) return;

        saveState();

        // Remove from current location
        const [movedNode] = result.siblings.splice(result.index, 1);

        // Insert after the parent in parent's sibling list
        parentResult.siblings.splice(parentResult.index + 1, 0, movedNode);

        // Update selection path (now a sibling of former parent)
        state.selectedPath.pop();
        state.selectedPath[state.selectedPath.length - 1] = movedNode.id;

        render();
        scrollSelectedIntoView();
        const newLevel = state.selectedPath.length;
        showToast(`Moved to ${LEVEL_NAMES[newLevel - 1]} level`);
    }

    function moveCardRight() {
        // Move card into the sibling above it (become its last child)
        if (state.selectedPath.length === 0) return;

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return;

        // Need a sibling above to move into
        if (result.index === 0) {
            showToast('No sibling above to move into');
            return;
        }

        const targetSibling = result.siblings[result.index - 1];

        saveState();

        // Remove from current location
        const [movedNode] = result.siblings.splice(result.index, 1);

        // Add as last child of the sibling above
        targetSibling.children.push(movedNode);

        // Update selection path (now a child of former sibling)
        // First, update path to include the target sibling, then the moved node
        state.selectedPath[state.selectedPath.length - 1] = targetSibling.id;
        state.selectedPath.push(movedNode.id);

        render();

        // Scroll to the new column (card moved right into a deeper level)
        setTimeout(() => {
            const selectedCard = document.querySelector('.card.selected');
            if (selectedCard) {
                selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }, 100);

        const newLevel = state.selectedPath.length;
        showToast(`Moved to ${LEVEL_NAMES[newLevel - 1]} level`);
    }

    // =========================================================================
    // Drag and Drop
    // =========================================================================

    function handleDragStart(e, nodeId) {
        state.draggedId = nodeId;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', nodeId);
        // Add dragging class after a short delay to avoid affecting drag image
        setTimeout(() => {
            const card = document.querySelector(`.card[data-id="${nodeId}"]`);
            if (card) card.classList.add('dragging');
        }, 0);
    }

    function handleDragEnd(e) {
        state.draggedId = null;

        // Remove drop indicator
        removeDropIndicator();

        // Remove all drag-related classes
        document.querySelectorAll('.card.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.card.drop-target').forEach(el => el.classList.remove('drop-target'));
        document.querySelectorAll('.column.drag-over').forEach(el => el.classList.remove('drag-over'));
    }

    function handleDragOver(e, targetId, targetColumnIndex) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!state.draggedId || state.draggedId === targetId) {
            return;
        }

        // Check if this would be dropping onto a descendant
        const draggedResult = findNode(state.tree, state.draggedId);
        if (draggedResult && isDescendant(draggedResult.node, targetId)) {
            e.dataTransfer.dropEffect = 'none';
            return;
        }

        const targetCard = e.currentTarget;
        const rect = targetCard.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const dropAbove = e.clientY < midY;

        // Update drop indicator position
        updateDropIndicator(targetCard, dropAbove);
    }

    function updateDropIndicator(targetCard, above) {
        // Remove any existing indicators
        removeDropIndicator();

        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        indicator.dataset.above = above ? 'true' : 'false';

        // Insert before or after the target card
        if (above) {
            targetCard.parentNode.insertBefore(indicator, targetCard);
        } else {
            targetCard.parentNode.insertBefore(indicator, targetCard.nextSibling);
        }
    }

    function removeDropIndicator() {
        document.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
    }

    function handleDragLeave(e) {
        const relatedTarget = e.relatedTarget;
        const card = e.currentTarget;

        // If we're moving to a child element within the same card, ignore
        if (relatedTarget && card.contains(relatedTarget)) {
            return;
        }

        // If we're entering another card, that card's dragover will handle the indicator
        const enteringAnotherCard = relatedTarget && relatedTarget.closest('.card');
        if (!enteringAnotherCard) {
            removeDropIndicator();
        }
    }

    function handleDrop(e, targetId, targetColumnIndex) {
        e.preventDefault();
        e.stopPropagation();

        if (!state.draggedId || state.draggedId === targetId) {
            handleDragEnd(e);
            return;
        }

        const draggedResult = findNode(state.tree, state.draggedId);
        const targetResult = findNode(state.tree, targetId);

        if (!draggedResult || !targetResult) {
            handleDragEnd(e);
            return;
        }

        // Check if dropping onto a descendant (would create cycle)
        if (isDescendant(draggedResult.node, targetId)) {
            showToast('Cannot move a card into its own children');
            handleDragEnd(e);
            return;
        }

        // Determine drop position from the indicator
        const indicator = document.querySelector('.drop-indicator');
        const dropAbove = indicator && indicator.dataset.above === 'true';

        saveState();

        // Remove from current location
        const [movedNode] = draggedResult.siblings.splice(draggedResult.index, 1);

        // Recalculate target index after removal (in case it shifted)
        const newTargetResult = findNode(state.tree, targetId);
        if (!newTargetResult) {
            // Target was removed? Shouldn't happen, but restore and bail
            draggedResult.siblings.splice(draggedResult.index, 0, movedNode);
            handleDragEnd(e);
            return;
        }

        // Calculate new index
        let newIndex = newTargetResult.index;
        if (!dropAbove) newIndex++;

        // Insert at new location
        newTargetResult.siblings.splice(newIndex, 0, movedNode);

        // Update selection to the moved node
        const ancestors = getAncestorIds(state.tree, movedNode.id) || [];
        state.selectedPath = [...ancestors, movedNode.id];

        handleDragEnd(e);
        render();
        showToast('Card moved');
    }

    function handleColumnDragOver(e, columnIndex) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!state.draggedId) return;

        // Only show column drop zone if not over a card
        if (e.target.closest('.card')) return;

        // Add visual feedback to the column
        const column = e.currentTarget.closest('.column');
        if (column) {
            column.classList.add('drag-over');
        }

        // Show drop indicator at end of column (before add button)
        removeDropIndicator();
        const columnContent = e.currentTarget;
        const addBtn = columnContent.querySelector('.add-card-btn');

        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        if (addBtn) {
            columnContent.insertBefore(indicator, addBtn);
        } else {
            columnContent.appendChild(indicator);
        }
    }

    function handleColumnDragLeave(e) {
        const column = e.currentTarget.closest('.column');
        if (column) {
            column.classList.remove('drag-over');
        }
        // Remove indicator when leaving column entirely
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
            removeDropIndicator();
        }
    }

    function handleColumnDrop(e, columnIndex, parentId) {
        e.preventDefault();
        e.stopPropagation();

        if (!state.draggedId) {
            handleDragEnd(e);
            return;
        }

        const draggedResult = findNode(state.tree, state.draggedId);
        if (!draggedResult) {
            handleDragEnd(e);
            return;
        }

        // Dropping into root column (column 0 with no parent)
        if (columnIndex === 0) {
            saveState();
            const [movedNode] = draggedResult.siblings.splice(draggedResult.index, 1);
            state.tree.push(movedNode);
            state.selectedPath = [movedNode.id];
            handleDragEnd(e);
            render();
            showToast('Moved to root level');
            return;
        }

        // Dropping as child of the selected card in previous column
        if (parentId) {
            const parentResult = findNode(state.tree, parentId);
            if (!parentResult) {
                handleDragEnd(e);
                return;
            }

            // Check for cycle
            if (isDescendant(draggedResult.node, parentId) || state.draggedId === parentId) {
                showToast('Cannot move a card into itself or its children');
                handleDragEnd(e);
                return;
            }

            saveState();
            const [movedNode] = draggedResult.siblings.splice(draggedResult.index, 1);
            parentResult.node.children.push(movedNode);

            const ancestors = getAncestorIds(state.tree, movedNode.id) || [];
            state.selectedPath = [...ancestors, movedNode.id];

            handleDragEnd(e);
            render();
            showToast(`Moved to ${LEVEL_NAMES[columnIndex] || 'level ' + (columnIndex + 1)}`);
        }
    }

    function isDescendant(node, targetId) {
        if (node.id === targetId) return true;
        for (const child of node.children) {
            if (isDescendant(child, targetId)) return true;
        }
        return false;
    }

    // =========================================================================
    // Selection & Navigation
    // =========================================================================

    function pushToFocusHistory(path) {
        if (path.length === 0) return;

        // Don't add if same as current position
        if (state.focusHistoryIndex >= 0) {
            const current = state.focusHistory[state.focusHistoryIndex];
            if (current && JSON.stringify(current) === JSON.stringify(path)) {
                return;
            }
        }

        // Remove any forward history when navigating to a new place
        if (state.focusHistoryIndex < state.focusHistory.length - 1) {
            state.focusHistory = state.focusHistory.slice(0, state.focusHistoryIndex + 1);
        }

        // Add new entry
        state.focusHistory.push([...path]);
        state.focusHistoryIndex = state.focusHistory.length - 1;

        // Limit history size
        if (state.focusHistory.length > 50) {
            state.focusHistory.shift();
            state.focusHistoryIndex--;
        }
    }

    function navigateFocusBack() {
        if (state.focusHistoryIndex <= 0) {
            showToast('No previous location');
            return;
        }

        state.focusHistoryIndex--;
        const path = state.focusHistory[state.focusHistoryIndex];

        // Verify the path still exists
        const node = getNodeAtPath(state.tree, path);
        if (node) {
            state.selectedPath = [...path];
            render();
            scrollSelectedIntoView();
        } else {
            // Path no longer valid, try again
            navigateFocusBack();
        }
    }

    function navigateFocusForward() {
        if (state.focusHistoryIndex >= state.focusHistory.length - 1) {
            showToast('No next location');
            return;
        }

        state.focusHistoryIndex++;
        const path = state.focusHistory[state.focusHistoryIndex];

        // Verify the path still exists
        const node = getNodeAtPath(state.tree, path);
        if (node) {
            state.selectedPath = [...path];
            render();
            scrollSelectedIntoView();
        } else {
            // Path no longer valid, try again
            navigateFocusForward();
        }
    }

    function removeEmptySelectedCard() {
        // Remove the currently selected card if it's empty (no content)
        if (state.selectedPath.length === 0) return null;

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return null;

        // Only remove if content is empty and has no children
        if (result.node.content.trim() === '' && result.node.children.length === 0) {
            result.siblings.splice(result.index, 1);
            return selectedId;
        }
        return null;
    }

    function selectCard(id, columnIndex) {
        if (state.editingId) {
            stopEditing();
        }

        // If expanded editor is open (not zen mode), sync content to tree before anything else
        if (state.expandedEditingId && !state.zenMode) {
            const currentResult = findNode(state.tree, state.expandedEditingId);
            if (currentResult) {
                const editorContent = expandedInput.value;
                if (currentResult.node.content !== editorContent) {
                    saveState();
                    currentResult.node.content = editorContent;
                }
            }
        }

        // Remove current card if empty before navigating away
        const removedId = removeEmptySelectedCard();
        if (removedId && removedId === id) {
            // User clicked on the empty card itself, don't proceed
            return;
        }

        // If expanded editor is open, switch to the clicked card
        if (state.expandedEditingId && !state.zenMode && state.expandedEditingId !== id) {
            state.expandedEditingId = id;
            const newResult = findNode(state.tree, id);
            if (newResult) {
                expandedInput.value = newResult.node.content;
                updateExpandedPreview();
                setTimeout(() => {
                    expandedInput.focus();
                    const len = expandedInput.value.length;
                    expandedInput.setSelectionRange(len, len);
                    expandedInput.scrollTop = expandedInput.scrollHeight;
                }, 50);
            }
        }

        // Build the path to this card
        const ancestors = getAncestorIds(state.tree, id) || [];
        state.selectedPath = [...ancestors, id];

        // Track in focus history
        pushToFocusHistory(state.selectedPath);

        render();

        // Scroll to show the next column if it exists
        setTimeout(() => {
            const columns = columnsContainer.querySelectorAll('.column');
            if (columns[columnIndex + 1]) {
                columns[columnIndex + 1].scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
            }
        }, 50);
    }

    function navigateCards(direction) {
        if (state.selectedPath.length === 0) {
            // Select first card if nothing selected
            if (state.tree.length > 0) {
                state.selectedPath = [state.tree[0].id];
                render();
                scrollSelectedIntoView();
            }
            return;
        }

        const selectedId = state.selectedPath[state.selectedPath.length - 1];
        const result = findNode(state.tree, selectedId);
        if (!result) return;

        // Check if current card is empty (will be removed after navigation)
        const isCurrentEmpty = result.node.content.trim() === '' && result.node.children.length === 0;

        let newIndex;
        switch (direction) {
            case 'up':
                newIndex = result.index - 1;
                if (newIndex >= 0) {
                    const targetId = result.siblings[newIndex].id;
                    if (isCurrentEmpty) {
                        result.siblings.splice(result.index, 1);
                    }
                    state.selectedPath[state.selectedPath.length - 1] = targetId;
                    render();
                    scrollSelectedIntoView();
                }
                break;
            case 'down':
                // When going down, if we remove current card, the next one shifts up
                newIndex = isCurrentEmpty ? result.index : result.index + 1;
                if (isCurrentEmpty) {
                    result.siblings.splice(result.index, 1);
                }
                if (newIndex < result.siblings.length) {
                    state.selectedPath[state.selectedPath.length - 1] = result.siblings[newIndex].id;
                    render();
                    scrollSelectedIntoView();
                } else if (result.siblings.length > 0) {
                    // If we were at the end, select the last card
                    state.selectedPath[state.selectedPath.length - 1] = result.siblings[result.siblings.length - 1].id;
                    render();
                    scrollSelectedIntoView();
                } else {
                    // No more siblings, go to parent
                    state.selectedPath.pop();
                    render();
                    scrollSelectedIntoView();
                }
                break;
            case 'left':
                if (state.selectedPath.length > 1) {
                    if (isCurrentEmpty) {
                        result.siblings.splice(result.index, 1);
                    }
                    state.selectedPath.pop();
                    render();
                    scrollSelectedIntoView();
                }
                break;
            case 'right':
                const node = result.node;
                if (node.children.length > 0) {
                    state.selectedPath.push(node.children[0].id);
                    render();
                    scrollSelectedIntoView();
                }
                break;
        }
    }

    function scrollSelectedIntoView() {
        setTimeout(() => {
            const selectedCard = document.querySelector('.card.selected');
            if (selectedCard) {
                selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }, 50);
    }

    function clearSelection() {
        if (state.editingId) {
            stopEditing();
        }
        // Remove empty card before clearing selection
        removeEmptySelectedCard();
        state.selectedPath = [];
        render();
    }

    // =========================================================================
    // Editing
    // =========================================================================

    function startEditing(id) {
        if (state.editingId === id) return;

        if (state.editingId) {
            stopEditing();
        }

        state.editingId = id;
        render();

        // Focus the textarea
        const textarea = document.querySelector('.card-editor');
        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }

    function stopEditing(save = true) {
        if (!state.editingId) return;

        const editingId = state.editingId;

        if (save) {
            const result = findNode(state.tree, editingId);
            if (result) {
                // Use pending values if set, otherwise read from DOM
                const newTitle = state.pendingTitle !== undefined ? state.pendingTitle :
                    (document.querySelector('.card-title-editor')?.value || '');
                const newContent = state.pendingContent !== undefined ? state.pendingContent :
                    (document.querySelector('.card-editor')?.value || '');

                const titleChanged = (result.node.title || '') !== newTitle;
                const contentChanged = result.node.content !== newContent;

                if (titleChanged || contentChanged) {
                    saveState();
                    result.node.title = newTitle;
                    result.node.content = newContent;
                }
            }
        }

        // Clear pending values
        state.pendingTitle = undefined;
        state.pendingContent = undefined;
        state.editingId = null;

        // Remove empty card after stopping editing (no title AND no content)
        const result = findNode(state.tree, editingId);
        if (result && (!result.node.title || result.node.title.trim() === '') &&
            result.node.content.trim() === '' && result.node.children.length === 0) {
            result.siblings.splice(result.index, 1);

            // Update selection to sibling or parent
            if (result.siblings.length > 0) {
                const newIndex = Math.min(result.index, result.siblings.length - 1);
                state.selectedPath[state.selectedPath.length - 1] = result.siblings[newIndex].id;
            } else {
                state.selectedPath.pop();
            }
        }

        render();
    }

    // =========================================================================
    // Expanded Editing
    // =========================================================================

    function openExpandedEditor(id) {
        const result = findNode(state.tree, id);
        if (!result) return;

        // Close inline editing if open
        if (state.editingId) {
            stopEditing();
        }

        state.expandedEditingId = id;
        expandedInput.value = result.node.content;
        updateExpandedPreview();

        // Apply body classes for split mode toolbar compression and column offset
        if (state.editorViewMode === 'split-left' || state.editorViewMode === 'split-right') {
            document.body.classList.add('editor-split-active');
            document.body.classList.add(state.editorViewMode === 'split-left' ? 'editor-split-left' : 'editor-split-right');
        }

        // Ensure this card is selected in the tree
        if (state.selectedPath[state.selectedPath.length - 1] !== id) {
            const ancestors = getAncestorIds(state.tree, id) || [];
            state.selectedPath = [...ancestors, id];
            render();
        }

        // Scroll the card into view in the columns
        setTimeout(() => {
            const cardEl = columnsContainer.querySelector(`.card[data-id="${id}"]`);
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }, 100);

        expandedOverlay.classList.add('visible');
        // Delay focus to ensure overlay transition completes and element is fully visible
        setTimeout(() => {
            expandedInput.focus();
            // Place cursor at end of text (last line)
            const len = expandedInput.value.length;
            expandedInput.setSelectionRange(len, len);
            // Scroll textarea to show cursor at bottom
            expandedInput.scrollTop = expandedInput.scrollHeight;
        }, 50);
    }

    function closeExpandedEditor(save = true) {
        // If in zen mode, delegate to exitZenMode
        if (state.zenMode) {
            exitZenMode();
            return;
        }

        if (!state.expandedEditingId) return;

        if (save) {
            const result = findNode(state.tree, state.expandedEditingId);
            if (result && result.node.content !== expandedInput.value) {
                saveState();
                result.node.content = expandedInput.value;
                render();
            }
        }

        state.expandedEditingId = null;
        expandedOverlay.classList.remove('visible');

        // Remove body classes for split mode when editor is closed
        document.body.classList.remove('editor-split-active', 'editor-split-left', 'editor-split-right');
    }

    function updateExpandedPreview() {
        const previewTitle = expandedPreview.querySelector('.card-title');
        const previewContent = expandedPreview.querySelector('.card-content');
        let content = expandedInput.value;

        // Show title if the card has one
        const result = state.expandedEditingId ? findNode(state.tree, state.expandedEditingId) : null;
        if (result && result.node.title && result.node.title.trim()) {
            previewTitle.textContent = result.node.title;
            previewTitle.style.display = 'block';
        } else {
            previewTitle.style.display = 'none';
        }
        previewContent.innerHTML = renderMarkdown(content);
        updateWordCount();
    }

    function updateWordCount() {
        const wordCountEl = document.getElementById('expanded-editor-wordcount');
        if (!wordCountEl) return;

        const text = expandedInput.value.trim();

        if (!text) {
            wordCountEl.textContent = '';
            return;
        }

        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''} · ${chars} char${chars !== 1 ? 's' : ''}`;
    }

    // =========================================================================
    // Markdown Toolbar
    // =========================================================================

    function insertMarkdown(action) {
        const textarea = expandedInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        let before = '';
        let after = '';
        let replacement = selectedText;
        let cursorOffset = 0;

        switch (action) {
            case 'heading1':
                if (start === 0 || text[start - 1] === '\n') {
                    before = '# ';
                } else {
                    before = '\n# ';
                }
                cursorOffset = before.length;
                break;

            case 'heading2':
                if (start === 0 || text[start - 1] === '\n') {
                    before = '## ';
                } else {
                    before = '\n## ';
                }
                cursorOffset = before.length;
                break;

            case 'heading3':
                if (start === 0 || text[start - 1] === '\n') {
                    before = '### ';
                } else {
                    before = '\n### ';
                }
                cursorOffset = before.length;
                break;

            case 'bold':
                before = '**';
                after = '**';
                if (!selectedText) {
                    replacement = 'bold text';
                }
                cursorOffset = before.length;
                break;

            case 'italic':
                before = '*';
                after = '*';
                if (!selectedText) {
                    replacement = 'italic text';
                }
                cursorOffset = before.length;
                break;

            case 'strikethrough':
                before = '~~';
                after = '~~';
                if (!selectedText) {
                    replacement = 'strikethrough text';
                }
                cursorOffset = before.length;
                break;

            case 'link':
                if (selectedText) {
                    before = '[';
                    after = '](url)';
                    cursorOffset = before.length + selectedText.length + 2;
                } else {
                    before = '[link text](';
                    after = ')';
                    replacement = 'url';
                    cursorOffset = before.length;
                }
                break;

            case 'code':
                before = '`';
                after = '`';
                if (!selectedText) {
                    replacement = 'code';
                }
                cursorOffset = before.length;
                break;

            case 'bulletlist':
                if (start === 0 || text[start - 1] === '\n') {
                    before = '- ';
                } else {
                    before = '\n- ';
                }
                if (!selectedText) {
                    replacement = 'list item';
                }
                cursorOffset = before.length;
                break;

            case 'numberedlist':
                if (start === 0 || text[start - 1] === '\n') {
                    before = '1. ';
                } else {
                    before = '\n1. ';
                }
                if (!selectedText) {
                    replacement = 'list item';
                }
                cursorOffset = before.length;
                break;

            case 'blockquote':
                if (start === 0 || text[start - 1] === '\n') {
                    before = '> ';
                } else {
                    before = '\n> ';
                }
                if (!selectedText) {
                    replacement = 'quote';
                }
                cursorOffset = before.length;
                break;

            default:
                return;
        }

        const newText = text.substring(0, start) + before + replacement + after + text.substring(end);
        textarea.value = newText;

        // Set cursor position
        if (selectedText) {
            // Select the replacement text
            textarea.setSelectionRange(start + before.length, start + before.length + replacement.length);
        } else {
            // Select the placeholder text
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + replacement.length);
        }

        textarea.focus();
        updateExpandedPreview();
    }

    // =========================================================================
    // Search Modal
    // =========================================================================

    const searchModalOverlay = document.getElementById('search-modal-overlay');
    const searchModalInput = document.getElementById('search-modal-input');
    const searchModalResults = document.getElementById('search-modal-results');
    const searchModalClose = document.getElementById('search-modal-close');
    const searchModalCount = document.getElementById('search-modal-count');

    let searchModalSelectedIndex = 0;

    function showSearchModal() {
        searchModalOverlay.classList.add('visible');
        searchModalInput.value = '';
        searchModalSelectedIndex = 0;
        state.searchMatches = [];
        state.searchQuery = '';
        renderSearchResults();
        // Delay focus slightly to ensure modal is visible
        setTimeout(() => {
            searchModalInput.focus();
        }, 50);
    }

    function hideSearchModal() {
        searchModalOverlay.classList.remove('visible');
        state.searchQuery = '';
        state.searchMatches = [];
        render(); // Clear any highlights
    }

    function performModalSearch(query) {
        state.searchQuery = query.trim().toLowerCase();
        state.searchMatches = [];

        if (!state.searchQuery) {
            searchModalSelectedIndex = 0;
            renderSearchResults();
            return;
        }

        // Find all matching cards with their full info
        function searchTree(nodes) {
            for (const node of nodes) {
                const titleMatch = node.title && node.title.toLowerCase().includes(state.searchQuery);
                const contentMatch = node.content.toLowerCase().includes(state.searchQuery);
                if (titleMatch || contentMatch) {
                    state.searchMatches.push(node.id);
                }
                if (node.children.length > 0) {
                    searchTree(node.children);
                }
            }
        }

        searchTree(state.tree);
        searchModalSelectedIndex = 0;
        renderSearchResults();
    }

    function getNodePath(nodeId) {
        // Build the path from root to this node
        const path = [];
        const ancestors = getAncestorIds(state.tree, nodeId) || [];

        for (const ancestorId of ancestors) {
            const result = findNode(state.tree, ancestorId);
            if (result) {
                // Use title if available, otherwise fall back to first line of content
                if (result.node.title && result.node.title.trim()) {
                    path.push(result.node.title.trim());
                } else {
                    const firstLine = result.node.content.split('\n')[0].replace(/^#+\s*/, '').trim();
                    path.push(firstLine || 'Untitled');
                }
            }
        }

        return path;
    }

    function renderSearchResults() {
        if (!state.searchQuery) {
            searchModalResults.innerHTML = '<div class="search-modal-empty">Type to search your cards</div>';
            searchModalCount.textContent = '';
            return;
        }

        if (state.searchMatches.length === 0) {
            searchModalResults.innerHTML = '<div class="search-modal-empty">No cards found</div>';
            searchModalCount.textContent = '0 results';
            return;
        }

        searchModalCount.textContent = `${state.searchMatches.length} result${state.searchMatches.length === 1 ? '' : 's'}`;

        let html = '';
        state.searchMatches.forEach((nodeId, index) => {
            const result = findNode(state.tree, nodeId);
            if (!result) return;

            const path = getNodePath(nodeId);
            const title = result.node.title;
            const content = result.node.content;

            // Render and highlight title if present
            let titleHtml = '';
            if (title && title.trim()) {
                titleHtml = highlightSearchMatch(escapeHtml(title));
            }

            // Render markdown to HTML, then highlight the search term
            let renderedContent = renderMarkdown(content);
            renderedContent = highlightSearchMatch(renderedContent);

            const isSelected = index === searchModalSelectedIndex;

            html += `
                <button class="search-result-item${isSelected ? ' selected' : ''}" data-index="${index}" data-id="${nodeId}">
                    ${path.length > 0 ? `
                        <div class="search-result-path">
                            ${path.map(p => `<span>${escapeHtml(p)}</span>`).join('<span class="path-separator">›</span>')}
                        </div>
                    ` : ''}
                    ${titleHtml ? `<div class="search-result-title">${titleHtml}</div>` : ''}
                    <div class="search-result-content">${renderedContent}</div>
                </button>
            `;
        });

        searchModalResults.innerHTML = html;

        // Scroll selected item into view
        const selectedItem = searchModalResults.querySelector('.search-result-item.selected');
        if (selectedItem) {
            selectedItem.scrollIntoView({ block: 'nearest' });
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function selectSearchResult(index) {
        if (index < 0 || index >= state.searchMatches.length) return;

        const nodeId = state.searchMatches[index];
        const ancestors = getAncestorIds(state.tree, nodeId) || [];
        state.selectedPath = [...ancestors, nodeId];

        hideSearchModal();
        render();
        scrollSelectedIntoView();
    }

    function navigateSearchResults(direction) {
        if (state.searchMatches.length === 0) return;

        if (direction === 'up') {
            searchModalSelectedIndex = Math.max(0, searchModalSelectedIndex - 1);
        } else {
            searchModalSelectedIndex = Math.min(state.searchMatches.length - 1, searchModalSelectedIndex + 1);
        }

        renderSearchResults();
    }

    function highlightSearchMatch(text) {
        if (!state.searchQuery) return text;

        // Escape regex special characters in the search query
        const escaped = state.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // =========================================================================
    // Document Statistics
    // =========================================================================

    function calculateDocStats() {
        let totalWords = 0;
        let totalChars = 0;

        TreeWalker.traverse(state.tree, node => {
            // Count title
            const titleText = (node.title || '').trim();
            if (titleText) {
                totalWords += titleText.split(/\s+/).filter(w => w.length > 0).length;
                totalChars += titleText.length;
            }
            // Count content
            const text = node.content.trim();
            if (text) {
                totalWords += text.split(/\s+/).filter(w => w.length > 0).length;
                totalChars += text.length;
            }
        });

        // Calculate reading time (average 200 words per minute)
        const readingMinutes = Math.max(1, Math.ceil(totalWords / 200));

        return { words: totalWords, chars: totalChars, readingMinutes };
    }

    function updateDocStats() {
        const stats = calculateDocStats();
        if (stats.words === 0) {
            docStats.textContent = '';
        } else {
            docStats.textContent = `${stats.words.toLocaleString()} words · ${stats.readingMinutes} min read`;
        }
        // Also update word goal if enabled
        updateWordGoalProgress();
    }

    function startSession() {
        state.sessionStartTime = Date.now();
        state.sessionStartWords = calculateDocStats().words;
    }

    function updateSessionTimer() {
        const timerEl = document.getElementById('session-timer');
        const timerContainer = document.getElementById('session-timer-container');
        if (!timerEl || !timerContainer) return;

        if (!state.sessionTimerEnabled || !state.sessionStartTime) {
            timerContainer.hidden = true;
            return;
        }

        timerContainer.hidden = false;

        // Calculate elapsed time, accounting for pauses
        let elapsed;
        if (state.timerPaused && state.timerPausedAt) {
            elapsed = state.timerPausedAt - state.sessionStartTime;
        } else {
            elapsed = Date.now() - state.sessionStartTime;
        }

        // For pomodoro mode, show countdown
        if (state.timerMode === 'pomodoro') {
            const totalMs = state.pomodoroDuration * 60 * 1000;
            const remaining = Math.max(0, totalMs - elapsed);

            const seconds = Math.floor(remaining / 1000) % 60;
            const minutes = Math.floor(remaining / 60000);

            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Update visual state based on remaining time
            timerEl.classList.remove('timer-warning', 'timer-complete');
            if (remaining === 0) {
                timerEl.classList.add('timer-complete');
                // Trigger completion only once
                if (!timerEl.dataset.completed) {
                    timerEl.dataset.completed = 'true';
                    onTimerComplete();
                }
            } else if (remaining <= 60000) { // Last minute
                timerEl.classList.add('timer-warning');
                timerEl.dataset.completed = '';
            } else {
                timerEl.dataset.completed = '';
            }
        } else {
            // Stopwatch mode - count up
            const seconds = Math.floor(elapsed / 1000) % 60;
            const minutes = Math.floor(elapsed / 60000) % 60;
            const hours = Math.floor(elapsed / 3600000);

            timerEl.classList.remove('timer-warning', 'timer-complete');
            if (hours > 0) {
                timerEl.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        // Show paused indicator
        if (state.timerPaused) {
            timerEl.classList.add('timer-paused');
        } else {
            timerEl.classList.remove('timer-paused');
        }
    }

    function onTimerComplete() {
        // Play a gentle notification sound
        playTimerSound();
        showToast('Timer complete! Great work.');
    }

    function playTimerSound() {
        // Create a gentle two-tone chime using Web Audio API
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            const playTone = (freq, startTime, duration) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            const now = audioCtx.currentTime;
            playTone(523.25, now, 0.2);        // C5
            playTone(659.25, now + 0.15, 0.3); // E5
            playTone(783.99, now + 0.3, 0.4);  // G5
        } catch (e) {
            // Audio not available, skip sound
        }
    }

    function resetTimer() {
        state.sessionStartTime = Date.now();
        state.timerPaused = false;
        state.timerPausedAt = null;
        state.timerElapsedBeforePause = 0;
        const timerEl = document.getElementById('session-timer');
        if (timerEl) {
            timerEl.dataset.completed = '';
            timerEl.classList.remove('timer-complete', 'timer-warning', 'timer-paused');
        }
        updateSessionTimer();
        showToast('Timer reset');
    }

    function toggleTimerPause() {
        if (!state.sessionStartTime) return;

        if (state.timerPaused) {
            // Resume: adjust start time to account for pause duration
            const pauseDuration = Date.now() - state.timerPausedAt;
            state.sessionStartTime += pauseDuration;
            state.timerPaused = false;
            state.timerPausedAt = null;
        } else {
            // Pause
            state.timerPaused = true;
            state.timerPausedAt = Date.now();
        }
        updateSessionTimer();
    }

    function updateWordGoalProgress() {
        const progressEl = document.getElementById('word-goal-progress');
        if (!progressEl) return;

        if (!state.wordGoalEnabled) {
            progressEl.hidden = true;
            return;
        }

        // Start session if not already started
        if (!state.sessionStartTime) {
            startSession();
        }

        const currentWords = calculateDocStats().words;
        const sessionWords = currentWords - state.sessionStartWords;
        const progress = Math.min(100, (sessionWords / state.wordGoal) * 100);
        const isComplete = sessionWords >= state.wordGoal;

        progressEl.hidden = false;
        progressEl.innerHTML = `
            <div class="word-goal-bar">
                <div class="word-goal-fill${isComplete ? ' complete' : ''}" style="width: ${progress}%"></div>
            </div>
            <span class="word-goal-text${isComplete ? ' complete' : ''}">${sessionWords}/${state.wordGoal}</span>
        `;
    }

    // =========================================================================
    // Markdown Import/Export
    // =========================================================================

    // Export tree to markdown using heading levels for hierarchy
    // Level 1 = #, Level 2 = ##, etc. up to Level 6 = ######
    // This constraint (max 6 levels) is intentional to prevent overgrown gardens
    function treeToMarkdown(tree, depth = 1) {
        let md = '';
        const headingPrefix = '#'.repeat(Math.min(depth, MAX_DEPTH));

        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            const title = node.title ? node.title.trim() : '';
            const content = node.content ? node.content.trim() : '';

            // Use title as heading, or fall back to content for backwards compatibility
            if (title) {
                md += `${headingPrefix} ${title}\n\n`;
                if (content) {
                    md += `${content}\n\n`;
                }
            } else if (content) {
                // Backwards compatibility: check if content has heading
                const existingHeadingMatch = content.match(/^(#{1,6})\s+/);
                if (existingHeadingMatch) {
                    const restOfContent = content.replace(/^#{1,6}\s+/, '');
                    md += `${headingPrefix} ${restOfContent}\n\n`;
                } else {
                    md += `${headingPrefix} ${content}\n\n`;
                }
            }

            // Recursively process children at next depth level
            if (node.children.length > 0) {
                md += treeToMarkdown(node.children, depth + 1);
            }
        }

        return md;
    }

    // Parse markdown using heading levels for hierarchy
    // # = level 1, ## = level 2, etc. up to ###### = level 6
    function markdownToTree(md) {
        const lines = md.split('\n');
        const tree = [];
        const stack = [{ level: 0, children: tree }];
        let currentTitle = '';
        let currentContent = [];
        let currentLevel = 1;

        function flushContent() {
            if (currentTitle || currentContent.some(l => l.trim())) {
                // Create node with title and content separated
                const content = currentContent.join('\n').trim();
                const node = createNode(currentTitle, content);

                while (stack.length > 1 && stack[stack.length - 1].level >= currentLevel) {
                    stack.pop();
                }

                stack[stack.length - 1].children.push(node);
                stack.push({ level: currentLevel, children: node.children });
            }
            currentTitle = '';
            currentContent = [];
        }

        for (const line of lines) {
            const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);

            if (headingMatch) {
                flushContent();
                currentLevel = Math.min(headingMatch[1].length, MAX_DEPTH);
                currentTitle = headingMatch[2].trim();
            } else {
                if (currentTitle || currentContent.length > 0) {
                    currentContent.push(line);
                } else if (line.trim()) {
                    // Content without heading goes to level 1 as content-only card
                    currentContent.push(line);
                    currentLevel = 1;
                }
            }
        }

        flushContent();
        return tree;
    }

    // Convert tree to markdown with HTML comment markers for structure
    function treeToCommentMarkdown(tree, depth = 1) {
        let md = '';

        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            const title = node.title ? node.title.trim() : '';
            const content = node.content ? node.content.trim() : '';

            // Escape quotes in title for the comment attribute
            const escapedTitle = title.replace(/"/g, '&quot;');
            md += `<!-- textgarden:node depth="${depth}" title="${escapedTitle}" -->\n`;

            if (content) {
                md += content + '\n';
            }
            md += '\n';

            if (node.children.length > 0) {
                md += treeToCommentMarkdown(node.children, depth + 1);
            }
        }

        return md;
    }

    // Parse markdown with HTML comment markers back into tree
    function commentMarkdownToTree(md) {
        const lines = md.split('\n');
        const tree = [];
        const stack = [{ level: 0, children: tree }];
        let currentTitle = '';
        let currentContent = [];
        let currentLevel = 1;

        const commentRegex = /^<!-- textgarden:node depth="(\d+)" title="(.*?)" -->$/;

        function flushContent() {
            if (currentTitle !== '' || currentContent.some(l => l.trim())) {
                const content = currentContent.join('\n').trim();
                // Unescape quotes in title
                const unescapedTitle = currentTitle.replace(/&quot;/g, '"');
                const node = createNode(unescapedTitle, content);

                while (stack.length > 1 && stack[stack.length - 1].level >= currentLevel) {
                    stack.pop();
                }

                stack[stack.length - 1].children.push(node);
                stack.push({ level: currentLevel, children: node.children });
            }
            currentTitle = '';
            currentContent = [];
        }

        for (const line of lines) {
            const commentMatch = line.match(commentRegex);

            if (commentMatch) {
                flushContent();
                currentLevel = Math.min(parseInt(commentMatch[1], 10), MAX_DEPTH);
                currentTitle = commentMatch[2];
            } else {
                // Only start collecting content after we've seen at least one marker
                if (currentTitle !== '' || currentContent.length > 0 || stack.length > 1) {
                    currentContent.push(line);
                } else if (line.trim()) {
                    currentContent.push(line);
                    currentLevel = 1;
                }
            }
        }

        flushContent();
        return tree;
    }

    // Save document as JSON (primary save format, lossless)
    function saveDocumentAsJSON() {
        const data = {
            version: 1,
            type: 'textgarden-document',
            filename: state.filename,
            tree: state.tree,
            selectedPath: state.selectedPath,
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const baseName = state.filename.replace(/\.(md|txt|markdown|json)$/, '');
        a.download = `${baseName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        state.hasUnsavedChanges = false;
        updateTitle();
        showToast('Saved to ' + a.download);
    }

    // Export document as markdown (secondary format, for sharing)
    function exportAsMarkdown() {
        const md = treeToCommentMarkdown(state.tree);
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const baseName = state.filename.replace(/\.(md|txt|markdown|json)$/, '');
        a.download = `${baseName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Exported to ' + a.download);
    }

    // Export settings as JSON (separate from document)
    function exportSettings() {
        const data = {
            version: 1,
            type: 'textgarden-settings',
            settings: {
                columnWidths: state.columnWidths,
                collapsedColumns: Array.from(state.collapsedColumns),
                editorPreviewHidden: state.editorPreviewHidden,
                editorMode: state.editorViewMode,
                zenBrowserFullscreen: state.zenBrowserFullscreen
            },
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'textgarden-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Settings exported');
    }

    // Apply parsed settings data to state
    function applySettings(data) {
        if (data.settings.columnWidths) {
            state.columnWidths = data.settings.columnWidths;
        }
        if (data.settings.collapsedColumns) {
            state.collapsedColumns = new Set(data.settings.collapsedColumns);
        }
        if (data.settings.editorPreviewHidden !== undefined) {
            state.editorPreviewHidden = data.settings.editorPreviewHidden;
            applyEditorPreviewState();
        }
        if (data.settings.editorMode) {
            state.editorViewMode = data.settings.editorMode;
            applyEditorMode(state.editorViewMode);
        }
        if (data.settings.zenBrowserFullscreen !== undefined) {
            state.zenBrowserFullscreen = data.settings.zenBrowserFullscreen;
            localStorage.setItem('textgarden-zen-fullscreen', state.zenBrowserFullscreen);
            const toggle = document.getElementById('zen-fullscreen-toggle');
            if (toggle) toggle.checked = state.zenBrowserFullscreen;
        }
        render();
        showToast('Settings imported');
    }

    // Import settings from JSON file (used by dedicated settings import button)
    function importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.type !== 'textgarden-settings' || !data.settings) {
                    showToast('Error: Not a valid settings file');
                    return;
                }
                applySettings(data);
            } catch (err) {
                showToast('Error: Invalid settings file');
            }
        };
        reader.readAsText(file);
    }

    // Load document data into state (shared by JSON import and markdown import)
    function loadDocumentData(tree, filename) {
        state.tree = tree;
        state.filename = filename;
        state.selectedPath = [];
        state.hasUnsavedChanges = false;
        state.undoStack = [];
        state.redoStack = [];
        currentDocId = generateDocId();
        saveDocumentToRecent();
        updateTitle();
        render();
    }

    function importFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;

            if (file.name.endsWith('.json')) {
                try {
                    const data = JSON.parse(content);

                    // Settings file
                    if (data.type === 'textgarden-settings' && data.settings) {
                        applySettings(data);
                        return;
                    }

                    // Document file
                    if (data.type === 'textgarden-document' && data.tree) {
                        if (state.tree.length > 0 && state.hasUnsavedChanges) {
                            if (!confirm('You have unsaved changes. Opening a file will replace the current document. Continue?')) {
                                return;
                            }
                        }
                        state.tree = data.tree;
                        state.filename = data.filename || file.name.replace(/\.json$/, '');
                        state.selectedPath = data.selectedPath || [];
                        state.hasUnsavedChanges = false;
                        state.undoStack = [];
                        state.redoStack = [];
                        currentDocId = generateDocId();
                        saveDocumentToRecent();
                        updateTitle();
                        render();
                        showToast('Opened ' + state.filename);
                        return;
                    }

                    showToast('Error: Unrecognized JSON file format');
                } catch (err) {
                    showToast('Error: Invalid JSON file');
                }
                return;
            }

            // Markdown/text file
            if (state.tree.length > 0 && state.hasUnsavedChanges) {
                if (!confirm('You have unsaved changes. Opening a file will replace the current document. Continue?')) {
                    return;
                }
            }

            // Check for comment-based format, fall back to heading-based
            const hasCommentMarkers = content.includes('<!-- textgarden:node ');
            const tree = hasCommentMarkers
                ? commentMarkdownToTree(content)
                : markdownToTree(content);

            loadDocumentData(tree, file.name.replace(/\.(md|txt|markdown)$/, ''));
            showToast('Opened ' + file.name);
        };
        reader.readAsText(file);
    }

    function newDocument() {
        if (state.hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Create a new document anyway?')) {
                return;
            }
        }

        currentDocId = generateDocId();
        state.tree = [];
        state.selectedPath = [];
        state.filename = 'Untitled';
        state.hasUnsavedChanges = false;
        state.undoStack = [];
        state.redoStack = [];
        state.searchQuery = '';
        state.searchMatches = [];
        searchInput.value = '';
        searchResults.textContent = '';
        searchClear.hidden = true;

        // Persist the empty state immediately so autosave doesn't restore old data
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            tree: state.tree,
            filename: state.filename,
            selectedPath: state.selectedPath,
            docId: currentDocId
        }));

        updateTitle();
        render();
    }

    // =========================================================================
    // Local Storage & Recent Documents
    // =========================================================================

    const STORAGE_KEY = 'textgarden-autosave';
    const DOCS_STORAGE_KEY = 'textgarden-documents';
    const SETTINGS_KEY = 'textgarden-settings';
    const COLUMN_WIDTHS_KEY = 'textgarden-column-widths';
    const MAX_RECENT_DOCS = 10;

    // Centralized settings management
    function loadSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                // Apply loaded settings to state
                if (settings.zenBrowserFullscreen !== undefined) state.zenBrowserFullscreen = settings.zenBrowserFullscreen;
                if (settings.zenWidth !== undefined) state.zenWidth = settings.zenWidth;
                if (settings.zenTypewriter !== undefined) state.zenTypewriter = settings.zenTypewriter;
                if (settings.typewriterScroll !== undefined) state.typewriterScroll = settings.typewriterScroll;
                if (settings.showCardBadges !== undefined) state.showCardBadges = settings.showCardBadges;
                if (settings.wordGoalEnabled !== undefined) state.wordGoalEnabled = settings.wordGoalEnabled;
                if (settings.wordGoal !== undefined) state.wordGoal = settings.wordGoal;
                if (settings.sessionTimerEnabled !== undefined) state.sessionTimerEnabled = settings.sessionTimerEnabled;
                if (settings.timerMode !== undefined) state.timerMode = settings.timerMode;
                if (settings.pomodoroDuration !== undefined) state.pomodoroDuration = settings.pomodoroDuration;
                if (settings.focusFade !== undefined) state.focusFade = settings.focusFade;
                if (settings.cardPreviewEnabled !== undefined) state.cardPreviewEnabled = settings.cardPreviewEnabled;
                if (settings.zenDepthIndent !== undefined) state.zenDepthIndent = settings.zenDepthIndent;
                if (settings.editorPreviewHidden !== undefined) state.editorPreviewHidden = settings.editorPreviewHidden;
                if (settings.editorViewMode !== undefined) state.editorViewMode = settings.editorViewMode;
                return true;
            }

            // Migration: load from old individual keys
            migrateOldSettings();
            return false;
        } catch (e) {
            console.warn('Failed to load settings:', e);
            return false;
        }
    }

    function saveSettings() {
        try {
            const settings = {
                zenBrowserFullscreen: state.zenBrowserFullscreen,
                zenWidth: state.zenWidth,
                zenTypewriter: state.zenTypewriter,
                typewriterScroll: state.typewriterScroll,
                showCardBadges: state.showCardBadges,
                wordGoalEnabled: state.wordGoalEnabled,
                wordGoal: state.wordGoal,
                sessionTimerEnabled: state.sessionTimerEnabled,
                timerMode: state.timerMode,
                pomodoroDuration: state.pomodoroDuration,
                focusFade: state.focusFade,
                cardPreviewEnabled: state.cardPreviewEnabled,
                zenDepthIndent: state.zenDepthIndent,
                editorPreviewHidden: state.editorPreviewHidden,
                editorViewMode: state.editorViewMode
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    }

    function migrateOldSettings() {
        // Migrate old individual localStorage keys to consolidated settings
        const oldKeys = {
            'textgarden-zen-fullscreen': 'zenBrowserFullscreen',
            'textgarden-typewriter-scroll': 'typewriterScroll',
            'textgarden-card-badges': 'showCardBadges',
            'textgarden-word-goal-enabled': 'wordGoalEnabled',
            'textgarden-word-goal': 'wordGoal',
            'textgarden-session-timer': 'sessionTimerEnabled',
            'textgarden-focus-fade': 'focusFade',
            'textgarden-card-preview': 'cardPreviewEnabled',
            'textgarden-preview-hidden': 'editorPreviewHidden',
            'textgarden-editor-mode': 'editorViewMode'
        };

        let migrated = false;
        for (const [oldKey, stateKey] of Object.entries(oldKeys)) {
            const value = localStorage.getItem(oldKey);
            if (value !== null) {
                migrated = true;
                // Handle boolean values stored as strings
                if (value === 'true') {
                    state[stateKey] = true;
                } else if (value === 'false') {
                    state[stateKey] = false;
                } else if (!isNaN(Number(value))) {
                    state[stateKey] = Number(value);
                } else {
                    state[stateKey] = value;
                }
                // Remove old key
                localStorage.removeItem(oldKey);
            }
        }

        // Migrate old gingko-writer-column-widths key
        const oldColumnWidths = localStorage.getItem('gingko-writer-column-widths');
        if (oldColumnWidths) {
            localStorage.setItem(COLUMN_WIDTHS_KEY, oldColumnWidths);
            localStorage.removeItem('gingko-writer-column-widths');
        }

        if (migrated) {
            saveSettings();
        }
    }
    let saveTimeout = null;
    let currentDocId = null;

    function generateDocId() {
        return 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    function getRecentDocs() {
        try {
            const saved = localStorage.getItem(DOCS_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Failed to load recent documents:', e);
            return [];
        }
    }

    function saveRecentDocs(docs) {
        try {
            localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
        } catch (e) {
            console.warn('Failed to save recent documents:', e);
        }
    }

    function saveDocumentToRecent() {
        if (!currentDocId) {
            currentDocId = generateDocId();
        }

        const docs = getRecentDocs();
        const stats = calculateDocStats();

        // Remove existing entry for this doc
        const existingIndex = docs.findIndex(d => d.id === currentDocId);
        if (existingIndex !== -1) {
            docs.splice(existingIndex, 1);
        }

        // Add to beginning
        docs.unshift({
            id: currentDocId,
            filename: state.filename,
            tree: state.tree,
            selectedPath: state.selectedPath,
            wordCount: stats.words,
            updatedAt: Date.now(),
            editorPreviewHidden: state.editorPreviewHidden,
            editorMode: state.editorViewMode
        });

        // Keep only MAX_RECENT_DOCS
        if (docs.length > MAX_RECENT_DOCS) {
            docs.length = MAX_RECENT_DOCS;
        }

        saveRecentDocs(docs);
    }

    function loadDocument(docId) {
        const docs = getRecentDocs();
        const doc = docs.find(d => d.id === docId);

        if (!doc) {
            showToast('Document not found');
            return false;
        }

        if (state.hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Switch documents anyway?')) {
                return false;
            }
        }

        currentDocId = doc.id;
        state.tree = doc.tree || [];
        state.filename = doc.filename || 'Untitled';
        state.selectedPath = doc.selectedPath || [];
        state.hasUnsavedChanges = false;
        state.undoStack = [];
        state.redoStack = [];

        // Restore editor preferences if present
        if (doc.editorPreviewHidden !== undefined) {
            state.editorPreviewHidden = doc.editorPreviewHidden;
            applyEditorPreviewState();
        }
        if (doc.editorMode) {
            state.editorViewMode = doc.editorMode;
            applyEditorMode(state.editorViewMode);
        }

        updateTitle();
        render();
        closeDocDropdown();
        showToast('Opened ' + state.filename);
        return true;
    }

    function deleteRecentDoc(docId, event) {
        event.stopPropagation();

        if (docId === currentDocId) {
            showToast('Cannot delete the current document');
            return;
        }

        const docs = getRecentDocs();
        const index = docs.findIndex(d => d.id === docId);
        if (index !== -1) {
            docs.splice(index, 1);
            saveRecentDocs(docs);
            renderRecentDocs();
            showToast('Document removed from history');
        }
    }

    function autoSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveDocumentToRecent();

            // Also save to legacy storage key for compatibility
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                tree: state.tree,
                filename: state.filename,
                selectedPath: state.selectedPath,
                docId: currentDocId,
                editorPreviewHidden: state.editorPreviewHidden,
                editorMode: state.editorViewMode
            }));

            // Show save indicator
            showSaveIndicator();
        }, 1000);
    }

    function showSaveIndicator() {
        const indicator = document.getElementById('save-indicator');
        if (!indicator) return;

        indicator.hidden = false;
        indicator.classList.add('visible');

        // Hide after 2 seconds
        setTimeout(() => {
            indicator.classList.remove('visible');
            setTimeout(() => {
                indicator.hidden = true;
            }, 300);
        }, 2000);
    }

    function loadFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                state.tree = data.tree || [];
                state.filename = data.filename || 'Untitled';
                state.selectedPath = data.selectedPath || [];
                currentDocId = data.docId || generateDocId();

                // Restore editor preferences if present
                if (data.editorPreviewHidden !== undefined) {
                    state.editorPreviewHidden = data.editorPreviewHidden;
                }
                if (data.editorMode) {
                    state.editorViewMode = data.editorMode;
                }
                return true;
            }
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
        }
        currentDocId = generateDocId();
        return false;
    }

    // =========================================================================
    // UI Updates
    // =========================================================================

    function markUnsaved() {
        state.hasUnsavedChanges = true;
        updateTitle();
        autoSave();
    }

    function updateTitle() {
        docTitle.textContent = state.filename;
        docTitle.classList.toggle('unsaved', state.hasUnsavedChanges);
        document.title = `${state.filename}${state.hasUnsavedChanges ? ' *' : ''} - TextGarden`;
    }

    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        if (state.selectedPath.length === 0) {
            breadcrumb.hidden = true;
            return;
        }

        breadcrumb.hidden = false;
        breadcrumb.innerHTML = '';

        // Add root level indicator
        const rootItem = document.createElement('span');
        rootItem.className = 'breadcrumb-item';
        const rootLink = document.createElement('span');
        rootLink.className = 'breadcrumb-link';
        rootLink.textContent = state.filename || 'Document';
        rootLink.addEventListener('click', () => {
            state.selectedPath = [];
            render();
        });
        rootItem.appendChild(rootLink);
        breadcrumb.appendChild(rootItem);

        // Add path items
        state.selectedPath.forEach((id, index) => {
            const result = findNode(state.tree, id);
            if (!result) return;

            // Add separator
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = '›';
            breadcrumb.appendChild(separator);

            // Add item
            const item = document.createElement('span');
            item.className = 'breadcrumb-item';

            const isLast = index === state.selectedPath.length - 1;
            const title = result.node.title && result.node.title.trim()
                ? result.node.title.trim()
                : result.node.content.split('\n')[0].replace(/^#+\s*/, '').trim() || 'Untitled';

            if (isLast) {
                const current = document.createElement('span');
                current.className = 'breadcrumb-current';
                current.textContent = title;
                item.appendChild(current);
            } else {
                const link = document.createElement('span');
                link.className = 'breadcrumb-link';
                link.textContent = title;
                link.addEventListener('click', () => {
                    state.selectedPath = state.selectedPath.slice(0, index + 1);
                    render();
                });
                item.appendChild(link);
            }

            breadcrumb.appendChild(item);
        });
    }

    // =========================================================================
    // Documents Dropdown
    // =========================================================================

    const docTitleBtn = document.getElementById('doc-title-btn');
    const docDropdownMenu = document.getElementById('doc-dropdown-menu');
    const recentDocsList = document.getElementById('recent-docs-list');
    const renameDocBtn = document.getElementById('rename-doc-btn');
    const saveCopyBtn = document.getElementById('save-copy-btn');
    const exportMdBtn = document.getElementById('export-md-btn');

    function toggleDocDropdown() {
        const isHidden = docDropdownMenu.hidden;
        if (isHidden) {
            renderRecentDocs();
            docDropdownMenu.hidden = false;
        } else {
            docDropdownMenu.hidden = true;
        }
    }

    function closeDocDropdown() {
        docDropdownMenu.hidden = true;
    }

    function renderRecentDocs() {
        const docs = getRecentDocs();

        if (docs.length === 0) {
            recentDocsList.innerHTML = '<div class="no-recent-docs">No recent documents</div>';
            return;
        }

        recentDocsList.innerHTML = '';

        for (const doc of docs) {
            const item = document.createElement('button');
            item.className = 'recent-doc-item';
            if (doc.id === currentDocId) {
                item.classList.add('current');
            }

            const info = document.createElement('div');
            info.className = 'recent-doc-info';

            const name = document.createElement('div');
            name.className = 'recent-doc-name';
            name.textContent = doc.filename;
            info.appendChild(name);

            const meta = document.createElement('div');
            meta.className = 'recent-doc-meta';
            const date = new Date(doc.updatedAt);
            const timeAgo = formatTimeAgo(date);
            meta.textContent = `${doc.wordCount || 0} words · ${timeAgo}`;
            info.appendChild(meta);

            item.appendChild(info);

            // Delete button (only for non-current docs)
            if (doc.id !== currentDocId) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'recent-doc-delete';
                deleteBtn.title = 'Remove from history';
                deleteBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                `;
                deleteBtn.addEventListener('click', (e) => deleteRecentDoc(doc.id, e));
                item.appendChild(deleteBtn);
            }

            item.addEventListener('click', () => loadDocument(doc.id));
            recentDocsList.appendChild(item);
        }
    }

    function formatTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    }

    function renameDocument() {
        const newName = prompt('Enter new document name:', state.filename);
        if (newName && newName.trim() && newName.trim() !== state.filename) {
            state.filename = newName.trim();
            markUnsaved();
            updateTitle();
            showToast('Document renamed');
        }
        closeDocDropdown();
    }

    function saveAsCopy() {
        // Generate new ID and save as copy
        const oldId = currentDocId;
        currentDocId = generateDocId();
        state.filename = state.filename + ' (copy)';
        state.hasUnsavedChanges = false;

        saveDocumentToRecent();
        updateTitle();
        closeDocDropdown();
        showToast('Saved as copy');
    }

    function findCardByTitle(searchTitle) {
        // Search all cards for one whose title matches the search title
        const normalizedSearch = searchTitle.toLowerCase().trim();

        function searchTree(nodes) {
            for (const node of nodes) {
                // First check the title field
                if (node.title) {
                    const normalizedTitle = node.title.toLowerCase().trim();
                    if (normalizedTitle === normalizedSearch || normalizedTitle.includes(normalizedSearch)) {
                        return node.id;
                    }
                }
                // Fall back to first line of content for backwards compatibility
                const firstLine = node.content.split('\n')[0]
                    .replace(/^#+\s*/, '') // Remove heading markers
                    .toLowerCase()
                    .trim();
                if (firstLine === normalizedSearch || firstLine.includes(normalizedSearch)) {
                    return node.id;
                }
                const found = searchTree(node.children);
                if (found) return found;
            }
            return null;
        }

        return searchTree(state.tree);
    }

    function renderCardLinks(html) {
        // Convert [[card title]] to clickable links
        return html.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
            const cardId = findCardByTitle(title);
            if (cardId) {
                return `<a href="#" class="card-link" data-card-id="${cardId}" title="Go to: ${title}">${title}</a>`;
            }
            // Card not found - show as broken link
            return `<span class="card-link-broken" title="Card not found: ${title}">${title}</span>`;
        });
    }

    function renderMarkdown(content) {
        if (!content.trim()) return '';

        try {
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            let html = marked.parse(content);
            html = renderCardLinks(html);
            return html;
        } catch (e) {
            return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }

    function renderCard(node, columnIndex, isSelected, isDimmed, isFinalSelected) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = node.id;

        if (isSelected) card.classList.add('selected');
        if (isSelected && !isFinalSelected) card.classList.add('in-path');
        if (isDimmed) card.classList.add('dimmed');
        if (node.children.length > 0) card.classList.add('has-children');
        if (state.searchMatches.includes(node.id)) card.classList.add('search-match');

        // Drag and drop attributes - disable when editing to allow text selection
        const isEditing = state.editingId === node.id;
        card.draggable = !isEditing;
        if (!isEditing) {
            card.addEventListener('dragstart', (e) => handleDragStart(e, node.id));
            card.addEventListener('dragend', handleDragEnd);
        }
        card.addEventListener('dragover', (e) => handleDragOver(e, node.id, columnIndex));
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', (e) => handleDrop(e, node.id, columnIndex));

        if (isEditing) {
            card.classList.add('editing');

            // Title input
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.className = 'card-title-editor';
            titleInput.value = node.title || '';
            titleInput.placeholder = 'Title (optional)';

            // Content textarea
            const textarea = document.createElement('textarea');
            textarea.className = 'card-editor';
            textarea.value = node.content;
            textarea.placeholder = 'Type here...';

            // Shared stop editing handler
            const handleStopEditing = (save) => {
                if (save) {
                    // Store title and content from inputs
                    state.pendingTitle = titleInput.value;
                    state.pendingContent = textarea.value;
                }
                stopEditing(save);
            };

            // Title input events
            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStopEditing(false);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    textarea.focus();
                } else if (e.key === 'Tab' && !e.shiftKey) {
                    e.preventDefault();
                    textarea.focus();
                }
            });

            // Textarea events
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStopEditing(false);
                } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStopEditing(true);
                } else if (e.key === 'Tab' && e.shiftKey) {
                    e.preventDefault();
                    titleInput.focus();
                } else if (e.key === '\\' && (e.ctrlKey || e.metaKey)) {
                    // Split card at cursor position
                    e.preventDefault();
                    e.stopPropagation();
                    const cursorPos = textarea.selectionStart;
                    splitCard(cursorPos, textarea.value);
                } else if (e.key === 'Backspace' && (e.ctrlKey || e.metaKey)) {
                    // Merge with previous card
                    e.preventDefault();
                    e.stopPropagation();
                    mergeWithPrevious();
                }
            });

            // Handle blur - save when clicking outside both inputs
            let blurTimeout;
            const handleBlur = () => {
                blurTimeout = setTimeout(() => {
                    // Check if focus is still within the card
                    if (!card.contains(document.activeElement)) {
                        handleStopEditing(true);
                    }
                }, 100);
            };
            const handleFocus = () => {
                clearTimeout(blurTimeout);
            };

            titleInput.addEventListener('blur', handleBlur);
            titleInput.addEventListener('focus', handleFocus);
            textarea.addEventListener('blur', handleBlur);
            textarea.addEventListener('focus', handleFocus);

            // Auto-resize textarea
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });

            card.appendChild(titleInput);
            card.appendChild(textarea);

            // Initial resize and focus
            setTimeout(() => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
                // Always focus content first so user can start typing immediately
                textarea.focus();
            }, 0);
        } else {
            // Add title if present and not an auto-generated "Card X" title
            const title = node.title && node.title.trim();
            const isAutoTitle = title && /^Card\s+[\d.]+$/.test(title);
            if (title && !isAutoTitle) {
                const titleEl = document.createElement('div');
                titleEl.className = 'card-title';
                let titleText = title;
                if (state.searchMatches.includes(node.id) && state.searchQuery) {
                    titleText = highlightSearchMatch(titleText);
                }
                titleEl.innerHTML = titleText;
                card.appendChild(titleEl);
            }

            // Add content
            const content = document.createElement('div');
            content.className = 'card-content';
            let renderedContent = renderMarkdown(node.content);
            // Apply search highlighting if this card matches
            if (state.searchMatches.includes(node.id) && state.searchQuery) {
                renderedContent = highlightSearchMatch(renderedContent);
            }
            content.innerHTML = renderedContent;
            card.appendChild(content);

            // Add expand button only for the final selected card
            if (isFinalSelected) {
                const expandBtn = document.createElement('button');
                expandBtn.className = 'card-expand-btn';
                expandBtn.title = 'Expand editor';
                expandBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                `;
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openExpandedEditor(node.id);
                });
                card.appendChild(expandBtn);
            }

            // Add child count badge if enabled and card has children
            if (state.showCardBadges && node.children.length > 0) {
                const badge = document.createElement('span');
                badge.className = 'card-badge';
                badge.textContent = node.children.length;
                badge.title = `${node.children.length} child card${node.children.length > 1 ? 's' : ''}`;
                card.appendChild(badge);
            }

            card.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCard(node.id, columnIndex);
            });

            card.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                startEditing(node.id);
            });
        }

        return card;
    }

    function renderColumn(nodes, columnIndex, selectedIdAtThisLevel, hasDeepSelection) {
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.index = columnIndex;

        const isCollapsed = state.collapsedColumns.has(columnIndex);
        if (isCollapsed) {
            column.classList.add('collapsed');
        }

        // Apply custom width if set (only if not collapsed)
        if (!isCollapsed && state.columnWidths[columnIndex]) {
            column.style.width = state.columnWidths[columnIndex] + 'px';
            column.style.minWidth = state.columnWidths[columnIndex] + 'px';
        }

        const header = document.createElement('div');
        header.className = 'column-header';

        const headerText = document.createElement('span');
        headerText.textContent = LEVEL_NAMES[columnIndex] || `Level ${columnIndex + 1}`;
        header.appendChild(headerText);

        // Add collapse toggle button
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'collapse-toggle';
        collapseBtn.title = isCollapsed ? 'Expand column' : 'Collapse column';
        collapseBtn.innerHTML = isCollapsed
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleColumnCollapse(columnIndex);
        });
        header.appendChild(collapseBtn);

        column.appendChild(header);

        // Click on collapsed column to expand it
        if (isCollapsed) {
            column.addEventListener('click', () => toggleColumnCollapse(columnIndex));
        }

        const content = document.createElement('div');
        content.className = 'column-content';

        // Add drag handlers for dropping cards into this column
        // parentId is the selected card from the previous column
        const parentId = columnIndex > 0 ? state.selectedPath[columnIndex - 1] : null;
        content.addEventListener('dragover', (e) => handleColumnDragOver(e, columnIndex));
        content.addEventListener('dragleave', handleColumnDragLeave);
        content.addEventListener('drop', (e) => handleColumnDrop(e, columnIndex, parentId));

        for (const node of nodes) {
            const isSelected = node.id === selectedIdAtThisLevel;
            // A card is "dimmed" if it's NOT selected but there IS a selection in this column
            const isDimmed = !isSelected && selectedIdAtThisLevel !== null;
            // isFinalSelected: true only for the deepest card in the selection path
            const isFinalSelected = isSelected && node.id === state.selectedPath[state.selectedPath.length - 1];
            content.appendChild(renderCard(node, columnIndex, isSelected, isDimmed, isFinalSelected));
        }

        // Add card button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-card-btn';
        addBtn.textContent = '+ Add card';
        addBtn.addEventListener('click', () => {
            if (columnIndex === 0 || state.selectedPath.length >= columnIndex) {
                // Adding at root or to a selected parent
                const newNode = createNode();
                saveState();

                if (columnIndex === 0) {
                    state.tree.push(newNode);
                    state.selectedPath = [newNode.id];
                } else {
                    const parentId = state.selectedPath[columnIndex - 1];
                    const result = findNode(state.tree, parentId);
                    if (result) {
                        result.node.children.push(newNode);
                        state.selectedPath = state.selectedPath.slice(0, columnIndex);
                        state.selectedPath.push(newNode.id);
                    }
                }

                render();
                startEditing(newNode.id);
            }
        });
        content.appendChild(addBtn);

        column.appendChild(content);

        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'column-resize-handle';
        resizeHandle.addEventListener('mousedown', (e) => startColumnResize(e, column, columnIndex));
        column.appendChild(resizeHandle);

        return column;
    }

    // =========================================================================
    // Column Resizing
    // =========================================================================

    let resizeState = {
        isResizing: false,
        column: null,
        columnIndex: null,
        startX: 0,
        startWidth: 0
    };

    function startColumnResize(e, column, columnIndex) {
        e.preventDefault();
        e.stopPropagation();

        resizeState.isResizing = true;
        resizeState.column = column;
        resizeState.columnIndex = columnIndex;
        resizeState.startX = e.clientX;
        resizeState.startWidth = column.offsetWidth;

        column.classList.add('resizing');
        document.body.classList.add('resizing-column');

        document.addEventListener('mousemove', handleColumnResize);
        document.addEventListener('mouseup', stopColumnResize);
    }

    function handleColumnResize(e) {
        if (!resizeState.isResizing) return;

        const deltaX = e.clientX - resizeState.startX;
        const newWidth = Math.max(200, Math.min(800, resizeState.startWidth + deltaX));

        resizeState.column.style.width = newWidth + 'px';
        resizeState.column.style.minWidth = newWidth + 'px';
        state.columnWidths[resizeState.columnIndex] = newWidth;
    }

    function stopColumnResize() {
        if (!resizeState.isResizing) return;

        resizeState.column.classList.remove('resizing');
        document.body.classList.remove('resizing-column');

        resizeState.isResizing = false;
        resizeState.column = null;

        document.removeEventListener('mousemove', handleColumnResize);
        document.removeEventListener('mouseup', stopColumnResize);

        // Save column widths
        saveColumnWidths();
    }

    function saveColumnWidths() {
        try {
            localStorage.setItem(COLUMN_WIDTHS_KEY, JSON.stringify(state.columnWidths));
        } catch (e) {
            console.warn('Failed to save column widths:', e);
        }
    }

    function loadColumnWidths() {
        try {
            const saved = localStorage.getItem(COLUMN_WIDTHS_KEY);
            if (saved) {
                state.columnWidths = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load column widths:', e);
        }
    }

    // =========================================================================
    // Column Collapse
    // =========================================================================

    function toggleColumnCollapse(columnIndex) {
        if (state.collapsedColumns.has(columnIndex)) {
            state.collapsedColumns.delete(columnIndex);
        } else {
            state.collapsedColumns.add(columnIndex);
        }
        render();
    }

    function autoCollapseColumns() {
        // Auto-collapse columns that are more than 3 levels behind the selection
        // to keep focus on current work
        const maxVisibleColumns = 4;
        const selectedDepth = state.selectedPath.length;

        if (selectedDepth > maxVisibleColumns) {
            for (let i = 0; i < selectedDepth - maxVisibleColumns; i++) {
                state.collapsedColumns.add(i);
            }
        }
    }

    // =========================================================================
    // Fullscreen Mode
    // =========================================================================

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                document.querySelector('.app').classList.add('fullscreen-mode');
            }).catch(err => {
                showToast('Fullscreen not available');
            });
        } else {
            document.exitFullscreen().then(() => {
                document.querySelector('.app').classList.remove('fullscreen-mode');
            });
        }
    }

    // Handle fullscreen change from other sources (Esc key, etc.)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            document.querySelector('.app').classList.remove('fullscreen-mode');
            // If in Zen mode and user pressed Esc to exit fullscreen, also exit Zen mode
            if (state.zenMode) {
                exitZenMode();
            }
        }
    });

    // =========================================================================
    // Zen Mode
    // =========================================================================

    function toggleZenMode() {
        if (state.zenMode) {
            exitZenMode();
            return;
        }

        // If no card is selected, select the first one
        if (state.selectedPath.length === 0 && state.tree.length > 0) {
            state.selectedPath = [state.tree[0].id];
            render();
        }

        if (state.selectedPath.length === 0) {
            showToast('No card to edit');
            return;
        }

        state.zenMode = true;

        // Get the root of the current branch (first card in selection path)
        const rootId = state.selectedPath[0];
        state.zenRootId = rootId;

        // Store previous editor mode to restore later
        state.preZenEditorMode = state.editorViewMode;

        // Switch to fullscreen mode and add zen styling
        state.editorViewMode = 'fullscreen';
        applyEditorMode('fullscreen');
        document.body.classList.add('zen-mode');
        applyZenWidth();

        // Open zen editor with markdown document
        openZenEditor();
    }

    function applyZenWidth() {
        // Remove all zen width classes
        document.body.classList.remove('zen-width-narrow', 'zen-width-medium', 'zen-width-wide');
        // Apply the current setting
        if (state.zenWidth) {
            document.body.classList.add(`zen-width-${state.zenWidth}`);
        }
    }

    // =========================================================================
    // Zen Stacked Textareas - each card gets its own textarea
    // =========================================================================

    const zenCardsContainer = document.getElementById('zen-cards-container');

    // Flatten a subtree into an ordered array of {node, depth, index} for rendering
    function flattenSubtree(node, depth = 1, index = '1') {
        const result = [{ node, depth, index }];
        node.children.forEach((child, i) => {
            const childIndex = `${index}.${i + 1}`;
            result.push(...flattenSubtree(child, depth + 1, childIndex));
        });
        return result;
    }

    // Get the currently focused zen card's node ID
    function getActiveZenCardId() {
        const active = zenCardsContainer.querySelector('.zen-card-active');
        return active ? active.dataset.id : null;
    }

    // Get all zen card elements in order
    function getZenCards() {
        return Array.from(zenCardsContainer.querySelectorAll('.zen-card'));
    }

    // Get the zen card element for a given node ID
    function getZenCardById(id) {
        return zenCardsContainer.querySelector(`.zen-card[data-id="${id}"]`);
    }

    // Auto-resize a textarea to fit its content
    function autoResizeZenTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Build a single zen-card DOM element
    function buildZenCardElement(node, depth, index) {
        const card = document.createElement('div');
        card.className = 'zen-card';
        card.dataset.id = node.id;
        card.dataset.depth = depth;
        card.dataset.index = index;

        const title = (node.title && node.title.trim()) ? node.title.trim() : '';

        // Separator bar
        const separator = document.createElement('div');
        separator.className = 'zen-card-separator';

        const indexSpan = document.createElement('span');
        indexSpan.className = 'zen-card-index';
        indexSpan.textContent = index;
        separator.appendChild(indexSpan);

        const titleSpan = document.createElement('span');
        titleSpan.className = 'zen-card-title';
        titleSpan.textContent = title;
        separator.appendChild(titleSpan);

        // Hover action buttons
        const actions = document.createElement('div');
        actions.className = 'zen-card-actions';

        const siblingBtn = document.createElement('button');
        siblingBtn.className = 'zen-card-action';
        siblingBtn.textContent = '+ sibling';
        siblingBtn.title = 'Add sibling card (Shift+Tab)';
        siblingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            zenAddSiblingAfter(node.id);
        });
        actions.appendChild(siblingBtn);

        if (depth < 6) {
            const childBtn = document.createElement('button');
            childBtn.className = 'zen-card-action';
            childBtn.textContent = '+ child';
            childBtn.title = 'Add child card (Tab)';
            childBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                zenAddChildTo(node.id);
            });
            actions.appendChild(childBtn);
        }

        separator.appendChild(actions);

        // Click separator to focus this card's textarea
        separator.addEventListener('click', () => {
            const textarea = card.querySelector('.zen-card-editor');
            if (textarea) textarea.focus();
        });

        card.appendChild(separator);

        // Textarea for card content
        const textarea = document.createElement('textarea');
        textarea.className = 'zen-card-editor';
        textarea.value = node.content || '';
        textarea.placeholder = 'Write here...';
        textarea.rows = 1;

        // Auto-resize on input
        textarea.addEventListener('input', () => {
            autoResizeZenTextarea(textarea);
            state.hasUnsavedChanges = true;
        });

        // Track active card on focus
        textarea.addEventListener('focus', () => {
            // Remove active from all cards
            getZenCards().forEach(c => c.classList.remove('zen-card-active'));
            card.classList.add('zen-card-active');
            updateZenBreadcrumb();
        });

        // Arrow key navigation between textareas
        textarea.addEventListener('keydown', (e) => {
            handleZenCardKeydown(e, textarea, card);
        });

        card.appendChild(textarea);
        return card;
    }

    // Handle keydown in a zen card textarea
    function handleZenCardKeydown(e, textarea, card) {
        const isMod = e.ctrlKey || e.metaKey;

        // Tab = add child, Shift+Tab = add sibling
        if (e.key === 'Tab' && state.zenMode) {
            e.preventDefault();
            e.stopPropagation();
            const nodeId = card.dataset.id;
            if (e.shiftKey) {
                zenAddSiblingAfter(nodeId);
            } else {
                zenAddChildTo(nodeId);
            }
            return;
        }

        // Cmd/Ctrl+M = toggle map
        if (e.key === 'm' && isMod && state.zenMode) {
            e.preventDefault();
            e.stopPropagation();
            toggleZenMap();
            return;
        }

        // Escape = exit zen mode
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            closeExpandedEditor(false);
            return;
        }

        // Markdown shortcuts
        if (e.key === 'b' && isMod) {
            e.preventDefault();
            insertMarkdownInZen(textarea, 'bold');
            return;
        }
        if (e.key === 'i' && isMod) {
            e.preventDefault();
            insertMarkdownInZen(textarea, 'italic');
            return;
        }
        if (e.key === 'k' && isMod) {
            e.preventDefault();
            insertMarkdownInZen(textarea, 'link');
            return;
        }

        // Arrow navigation between cards
        if (e.key === 'ArrowUp') {
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const isFirstLine = !textBefore.includes('\n');
            if (isFirstLine) {
                e.preventDefault();
                focusPreviousZenCard(card, true);
            }
        } else if (e.key === 'ArrowDown') {
            const cursorPos = textarea.selectionStart;
            const textAfter = textarea.value.substring(cursorPos);
            const isLastLine = !textAfter.includes('\n');
            if (isLastLine) {
                e.preventDefault();
                focusNextZenCard(card, false);
            }
        }

        // Typewriter scroll after cursor movement
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            setTimeout(() => {
                if (state.zenMode && state.zenTypewriter) {
                    zenTypewriterScroll();
                }
            }, 0);
        }
    }

    // Insert markdown formatting in a specific zen textarea
    function insertMarkdownInZen(textarea, type) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);

        let before = '', after = '';
        if (type === 'bold') { before = '**'; after = '**'; }
        else if (type === 'italic') { before = '*'; after = '*'; }
        else if (type === 'link') { before = '['; after = '](url)'; }

        const newText = text.substring(0, start) + before + selected + after + text.substring(end);
        textarea.value = newText;

        if (selected) {
            textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
        } else {
            textarea.setSelectionRange(start + before.length, start + before.length);
        }
        textarea.focus();
        autoResizeZenTextarea(textarea);
    }

    // Focus the previous zen card's textarea (cursor at end)
    function focusPreviousZenCard(currentCard, atEnd) {
        const cards = getZenCards();
        const idx = cards.indexOf(currentCard);
        if (idx > 0) {
            const prevCard = cards[idx - 1];
            const prevTextarea = prevCard.querySelector('.zen-card-editor');
            if (prevTextarea) {
                prevTextarea.focus();
                if (atEnd) {
                    const len = prevTextarea.value.length;
                    prevTextarea.setSelectionRange(len, len);
                }
            }
        }
    }

    // Focus the next zen card's textarea (cursor at start)
    function focusNextZenCard(currentCard, atStart) {
        const cards = getZenCards();
        const idx = cards.indexOf(currentCard);
        if (idx < cards.length - 1) {
            const nextCard = cards[idx + 1];
            const nextTextarea = nextCard.querySelector('.zen-card-editor');
            if (nextTextarea) {
                nextTextarea.focus();
                if (atStart) {
                    nextTextarea.setSelectionRange(0, 0);
                } else {
                    nextTextarea.setSelectionRange(0, 0);
                }
            }
        }
    }

    // Render all zen cards from the subtree
    function renderZenCards(rootNode, selectedCardId) {
        zenCardsContainer.innerHTML = '';
        const flattened = flattenSubtree(rootNode);

        flattened.forEach(({ node, depth, index }) => {
            const cardEl = buildZenCardElement(node, depth, index);
            zenCardsContainer.appendChild(cardEl);
        });

        // Auto-resize all textareas
        zenCardsContainer.querySelectorAll('.zen-card-editor').forEach(ta => {
            autoResizeZenTextarea(ta);
        });

        // Focus the selected card
        const targetId = selectedCardId || rootNode.id;
        const targetCard = getZenCardById(targetId);
        if (targetCard) {
            const textarea = targetCard.querySelector('.zen-card-editor');
            if (textarea) {
                textarea.focus();
                const len = textarea.value.length;
                textarea.setSelectionRange(len, len);
            }
        }
    }

    // Collect edits from zen textareas back into the tree
    function collectZenEdits() {
        const cards = getZenCards();
        cards.forEach(cardEl => {
            const nodeId = cardEl.dataset.id;
            const textarea = cardEl.querySelector('.zen-card-editor');
            if (!textarea) return;

            const result = findNode(state.tree, nodeId);
            if (result) {
                result.node.content = textarea.value;
            }
        });
    }

    // Add a sibling card after the specified node in the tree, then re-render zen
    function zenAddSiblingAfter(nodeId) {
        if (!state.zenMode) return;

        // Can't add a sibling to the zen root (it would be outside the editing scope)
        if (nodeId === state.zenRootId) {
            showToast('Cannot add sibling to root card in Zen mode');
            return;
        }

        // First, collect current edits so we don't lose anything
        collectZenEdits();

        const result = findNode(state.tree, nodeId);
        if (!result || !result.parent) return;

        saveState();

        // Create new sibling after this node
        const newNode = createNode();
        const insertIndex = result.index + 1;
        result.parent.children.splice(insertIndex, 0, newNode);

        state.hasUnsavedChanges = true;

        // Re-render zen cards and focus the new card
        const rootResult = findNode(state.tree, state.zenRootId);
        if (rootResult) {
            renderZenCards(rootResult.node, newNode.id);
        }
    }

    // Add a child card to the specified node, then re-render zen
    function zenAddChildTo(nodeId) {
        if (!state.zenMode) return;

        const result = findNode(state.tree, nodeId);
        if (!result) return;

        // Check max depth
        const depth = parseInt(getZenCardById(nodeId)?.dataset.depth || '1', 10);
        if (depth >= 6) return;

        // Collect current edits
        collectZenEdits();

        saveState();

        const newNode = createNode();
        result.node.children.push(newNode);

        state.hasUnsavedChanges = true;

        // Re-render zen cards and focus the new card
        const rootResult = findNode(state.tree, state.zenRootId);
        if (rootResult) {
            renderZenCards(rootResult.node, newNode.id);
        }
    }

    function buildPathToNode(tree, targetId, currentPath = []) {
        // Build the path (array of IDs) from root to the target node
        for (const node of tree) {
            const newPath = [...currentPath, node.id];
            if (node.id === targetId) {
                return newPath;
            }
            if (node.children && node.children.length > 0) {
                const found = buildPathToNode(node.children, targetId, newPath);
                if (found) return found;
            }
        }
        return null;
    }

    function openZenEditor() {
        const rootResult = findNode(state.tree, state.zenRootId);
        if (!rootResult) return;

        // Get the currently selected card ID (deepest in path)
        const selectedCardId = state.selectedPath[state.selectedPath.length - 1];

        // Render stacked textareas from the subtree
        renderZenCards(rootResult.node, selectedCardId);

        // Zen mode is always fullscreen in the app
        expandedOverlay.classList.add('fullscreen');
        expandedOverlay.classList.add('visible');

        // Request browser fullscreen if setting is enabled
        if (state.zenBrowserFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        setTimeout(() => {
            // Update the structure bar breadcrumb
            if (window.updateZenBreadcrumb) {
                window.updateZenBreadcrumb();
            }

            // Trigger initial scroll to center the focused card
            if (state.zenTypewriter) {
                zenTypewriterScroll();
            }
        }, 50);
    }

    function exitZenMode() {
        if (!state.zenMode) return;

        // Collect edits from stacked textareas back into the tree
        const activeCardId = getActiveZenCardId();
        saveState(); // For undo
        collectZenEdits();
        state.hasUnsavedChanges = true;

        const zenRootId = state.zenRootId;

        state.zenMode = false;
        state.zenRootId = null;
        document.body.classList.remove('zen-mode');
        document.body.classList.remove('zen-width-narrow', 'zen-width-medium', 'zen-width-wide');

        // Collapse expanded map if open
        const zenBar = document.getElementById('zen-structure-bar');
        if (zenBar) zenBar.classList.remove('map-expanded');

        // Clear the stacked textareas
        zenCardsContainer.innerHTML = '';

        // Restore previous editor mode
        if (state.preZenEditorMode) {
            state.editorViewMode = state.preZenEditorMode;
            applyEditorMode(state.preZenEditorMode);
            state.preZenEditorMode = null;
        }

        // Close expanded editor overlay
        expandedOverlay.classList.remove('visible');
        expandedOverlay.classList.remove('fullscreen');
        document.body.classList.remove('editor-split-active');

        // Exit browser fullscreen if we're in it
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        // Set selection to the card where the cursor was
        const pathToRoot = buildPathToNode(state.tree, zenRootId) || [];
        const cursorCardId = activeCardId || zenRootId;

        if (cursorCardId === zenRootId) {
            state.selectedPath = pathToRoot;
        } else {
            const rootResult = findNode(state.tree, zenRootId);
            if (rootResult) {
                const subPath = buildPathToNode(rootResult.node.children, cursorCardId) || [];
                state.selectedPath = [...pathToRoot, ...subPath];
            } else {
                state.selectedPath = pathToRoot;
            }
        }

        // Re-render to show updated cards
        render();

        // Scroll selected card into view
        setTimeout(() => {
            const selectedCard = document.querySelector('.card.selected');
            if (selectedCard) {
                selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            }
        }, 50);
    }

    // =========================================================================
    // Print / Export PDF
    // =========================================================================

    const printOverlay = document.getElementById('print-preview-overlay');
    const printAllColumns = document.getElementById('print-all-columns');
    const printHeaders = document.getElementById('print-headers');
    const printCancel = document.getElementById('print-cancel');
    const printConfirm = document.getElementById('print-confirm');

    function showPrintDialog() {
        printOverlay.classList.add('visible');
    }

    function hidePrintDialog() {
        printOverlay.classList.remove('visible');
    }

    function executePrint() {
        // Apply print options
        if (!printHeaders.checked) {
            document.body.classList.add('print-no-headers');
        }

        hidePrintDialog();

        // Small delay to let modal close
        setTimeout(() => {
            window.print();

            // Clean up
            document.body.classList.remove('print-no-headers');
        }, 100);
    }

    // =========================================================================
    // Keyboard Shortcuts Modal
    // =========================================================================

    const shortcutsOverlay = document.getElementById('shortcuts-overlay');
    const shortcutsClose = document.getElementById('shortcuts-close');

    function showShortcutsDialog() {
        shortcutsOverlay.classList.add('visible');
    }

    function hideShortcutsDialog() {
        shortcutsOverlay.classList.remove('visible');
    }

    // =========================================================================
    // Templates
    // =========================================================================

    const templatesOverlay = document.getElementById('templates-overlay');
    const templatesGrid = document.getElementById('templates-grid');
    const templatesClose = document.getElementById('templates-close');

    const templates = [
        {
            id: 'novel',
            icon: '📖',
            name: 'Novel Outline',
            description: 'Three-act structure for fiction writing',
            tree: [
                {
                    id: generateId(),
                    title: 'Act 1: Setup',
                    content: 'Introduce the protagonist and their ordinary world.',
                    children: [
                        { id: generateId(), title: 'Opening Scene', content: 'Hook the reader with an engaging opening.', children: [] },
                        { id: generateId(), title: 'Inciting Incident', content: 'The event that disrupts the status quo.', children: [] },
                        { id: generateId(), title: 'First Plot Point', content: 'Protagonist commits to the journey.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'Act 2: Confrontation',
                    content: 'Rising action and complications.',
                    children: [
                        { id: generateId(), title: 'Rising Action', content: 'Series of obstacles and challenges.', children: [] },
                        { id: generateId(), title: 'Midpoint', content: 'Major revelation or turning point.', children: [] },
                        { id: generateId(), title: 'Crisis', content: 'Darkest moment before the climax.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'Act 3: Resolution',
                    content: 'Climax and conclusion.',
                    children: [
                        { id: generateId(), title: 'Climax', content: 'The final confrontation.', children: [] },
                        { id: generateId(), title: 'Resolution', content: 'Tie up loose ends and show the new normal.', children: [] }
                    ]
                }
            ]
        },
        {
            id: 'essay',
            icon: '📝',
            name: 'Essay',
            description: 'Classic five-paragraph essay structure',
            tree: [
                {
                    id: generateId(),
                    title: 'Introduction',
                    content: 'Introduce your topic and thesis statement.',
                    children: [
                        { id: generateId(), title: 'Hook', content: 'Grab the reader\'s attention.', children: [] },
                        { id: generateId(), title: 'Background', content: 'Provide context for your topic.', children: [] },
                        { id: generateId(), title: 'Thesis', content: 'State your main argument.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'Body Paragraph 1',
                    content: 'First main point supporting your thesis.',
                    children: [
                        { id: generateId(), title: 'Topic Sentence', content: 'Introduce the point.', children: [] },
                        { id: generateId(), title: 'Evidence', content: 'Provide supporting evidence.', children: [] },
                        { id: generateId(), title: 'Analysis', content: 'Explain how the evidence supports your thesis.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'Body Paragraph 2',
                    content: 'Second main point supporting your thesis.',
                    children: []
                },
                {
                    id: generateId(),
                    title: 'Body Paragraph 3',
                    content: 'Third main point supporting your thesis.',
                    children: []
                },
                {
                    id: generateId(),
                    title: 'Conclusion',
                    content: 'Summarize and restate your thesis.',
                    children: []
                }
            ]
        },
        {
            id: 'research',
            icon: '🔬',
            name: 'Research Paper',
            description: 'Academic research paper structure',
            tree: [
                { id: generateId(), title: 'Abstract', content: 'Brief summary of the research.', children: [] },
                {
                    id: generateId(),
                    title: 'Introduction',
                    content: 'Background and research question.',
                    children: [
                        { id: generateId(), title: 'Problem Statement', content: 'What problem does this research address?', children: [] },
                        { id: generateId(), title: 'Research Questions', content: 'What questions will be answered?', children: [] },
                        { id: generateId(), title: 'Significance', content: 'Why is this research important?', children: [] }
                    ]
                },
                { id: generateId(), title: 'Literature Review', content: 'Summary of existing research.', children: [] },
                { id: generateId(), title: 'Methodology', content: 'How the research was conducted.', children: [] },
                { id: generateId(), title: 'Results', content: 'Present the findings.', children: [] },
                { id: generateId(), title: 'Discussion', content: 'Interpret the results.', children: [] },
                { id: generateId(), title: 'Conclusion', content: 'Summarize key findings and implications.', children: [] },
                { id: generateId(), title: 'References', content: 'List of cited sources.', children: [] }
            ]
        },
        {
            id: 'blog',
            icon: '✏️',
            name: 'Blog Post',
            description: 'Engaging blog post structure',
            tree: [
                {
                    id: generateId(),
                    title: 'Headline',
                    content: 'Write a compelling headline that promises value.',
                    children: []
                },
                {
                    id: generateId(),
                    title: 'Introduction',
                    content: 'Hook readers and preview what they\'ll learn.',
                    children: []
                },
                {
                    id: generateId(),
                    title: 'Main Content',
                    content: 'Deliver on your headline\'s promise.',
                    children: [
                        { id: generateId(), title: 'Point 1', content: 'First key point with examples.', children: [] },
                        { id: generateId(), title: 'Point 2', content: 'Second key point with examples.', children: [] },
                        { id: generateId(), title: 'Point 3', content: 'Third key point with examples.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'Conclusion',
                    content: 'Summarize and include a call to action.',
                    children: []
                }
            ]
        },
        {
            id: 'screenplay',
            icon: '🎬',
            name: 'Screenplay',
            description: 'Film or TV script structure',
            tree: [
                { id: generateId(), title: 'FADE IN:', content: 'Opening visual.', children: [] },
                {
                    id: generateId(),
                    title: 'ACT ONE',
                    content: 'Setup and inciting incident.',
                    children: [
                        { id: generateId(), title: 'INT. LOCATION - DAY', content: 'Scene description and action.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'ACT TWO',
                    content: 'Confrontation and rising action.',
                    children: []
                },
                {
                    id: generateId(),
                    title: 'ACT THREE',
                    content: 'Climax and resolution.',
                    children: []
                },
                { id: generateId(), title: 'FADE OUT.', content: 'The End.', children: [] }
            ]
        },
        {
            id: 'brainstorm',
            icon: '💡',
            name: 'Brainstorm',
            description: 'Free-form idea generation',
            tree: [
                {
                    id: generateId(),
                    title: 'Main Topic',
                    content: 'What are you brainstorming about?',
                    children: [
                        { id: generateId(), title: 'Idea 1', content: 'First idea or concept.', children: [] },
                        { id: generateId(), title: 'Idea 2', content: 'Second idea or concept.', children: [] },
                        { id: generateId(), title: 'Idea 3', content: 'Third idea or concept.', children: [] }
                    ]
                },
                {
                    id: generateId(),
                    title: 'Questions',
                    content: 'What questions need answering?',
                    children: []
                },
                {
                    id: generateId(),
                    title: 'Next Steps',
                    content: 'What actions should you take?',
                    children: []
                }
            ]
        }
    ];

    function showTemplatesDialog() {
        renderTemplates();
        templatesOverlay.classList.add('visible');
    }

    function hideTemplatesDialog() {
        templatesOverlay.classList.remove('visible');
    }

    function renderTemplates() {
        templatesGrid.innerHTML = '';

        for (const template of templates) {
            const card = document.createElement('button');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-icon">${template.icon}</div>
                <div class="template-name">${template.name}</div>
                <div class="template-description">${template.description}</div>
            `;
            card.addEventListener('click', () => applyTemplate(template));
            templatesGrid.appendChild(card);
        }
    }

    function applyTemplate(template) {
        if (state.tree.length > 0 && state.hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Apply template anyway?')) {
                return;
            }
        }

        // Deep clone the template tree with new IDs
        function cloneWithNewIds(nodes) {
            return nodes.map(node => ({
                id: generateId(),
                title: node.title || '',
                content: node.content,
                children: cloneWithNewIds(node.children)
            }));
        }

        currentDocId = generateDocId();
        state.tree = cloneWithNewIds(template.tree);
        state.selectedPath = state.tree.length > 0 ? [state.tree[0].id] : [];
        state.filename = template.name;
        state.hasUnsavedChanges = false;
        state.undoStack = [];
        state.redoStack = [];

        hideTemplatesDialog();
        updateTitle();
        render();
        showToast('Template applied: ' + template.name);
    }

    function render() {
        columnsContainer.innerHTML = '';
        updateDocStats();
        updateBreadcrumb();

        if (state.tree.length === 0 && state.selectedPath.length === 0) {
            // Empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <h2>Start Writing</h2>
                <p>Create your first card to begin organizing your ideas in a tree structure.</p>
                <button id="start-btn">Create First Card</button>
            `;
            columnsContainer.appendChild(emptyState);

            document.getElementById('start-btn').addEventListener('click', () => {
                addSibling();
            });
            return;
        }

        // Determine which columns to show based on selected path
        const columnsToRender = [];
        let currentNodes = state.tree;
        let pathIndex = 0;

        // Always show root column
        columnsToRender.push({
            nodes: currentNodes,
            selectedId: state.selectedPath[0] || null,
            hasDeepSelection: state.selectedPath.length > 1
        });

        // Show columns for the selected path
        while (pathIndex < state.selectedPath.length) {
            const selectedId = state.selectedPath[pathIndex];
            const selectedNode = currentNodes.find(n => n.id === selectedId);

            if (selectedNode && selectedNode.children.length > 0) {
                currentNodes = selectedNode.children;
                pathIndex++;
                columnsToRender.push({
                    nodes: currentNodes,
                    selectedId: state.selectedPath[pathIndex] || null,
                    hasDeepSelection: pathIndex < state.selectedPath.length - 1
                });
            } else {
                break;
            }
        }

        // Render columns
        columnsToRender.forEach((col, index) => {
            const column = renderColumn(col.nodes, index, col.selectedId, col.hasDeepSelection);
            columnsContainer.appendChild(column);
        });

        // Add empty column for adding children to the selected card (if it has no children)
        // But only if we haven't reached MAX_DEPTH
        if (state.selectedPath.length > 0 && state.selectedPath.length < MAX_DEPTH) {
            const lastId = state.selectedPath[state.selectedPath.length - 1];
            const result = findNode(state.tree, lastId);
            if (result && result.node.children.length === 0) {
                const emptyColumnIndex = columnsToRender.length;
                const emptyColumn = document.createElement('div');
                emptyColumn.className = 'column';
                emptyColumn.dataset.index = emptyColumnIndex;

                const header = document.createElement('div');
                header.className = 'column-header';
                header.textContent = LEVEL_NAMES[emptyColumnIndex] || `Level ${emptyColumnIndex + 1}`;
                emptyColumn.appendChild(header);

                const content = document.createElement('div');
                content.className = 'column-content';

                // Add drag handlers for dropping into empty column (as child of selected card)
                content.addEventListener('dragover', (e) => handleColumnDragOver(e, emptyColumnIndex));
                content.addEventListener('dragleave', handleColumnDragLeave);
                content.addEventListener('drop', (e) => handleColumnDrop(e, emptyColumnIndex, lastId));

                const addBtn = document.createElement('button');
                addBtn.className = 'add-card-btn';
                addBtn.textContent = '+ Add child card';
                addBtn.addEventListener('click', addChild);
                content.appendChild(addBtn);

                emptyColumn.appendChild(content);
                columnsContainer.appendChild(emptyColumn);
            }
        }
    }

    // =========================================================================
    // Event Handlers
    // =========================================================================

    function setupEventListeners() {
        // Toolbar buttons
        document.getElementById('new-btn').addEventListener('click', newDocument);
        document.getElementById('import-btn').addEventListener('click', () => fileInput.click());
        document.getElementById('export-btn').addEventListener('click', saveDocumentAsJSON);
        document.getElementById('undo-btn').addEventListener('click', undo);
        document.getElementById('redo-btn').addEventListener('click', redo);
        document.getElementById('nav-back-btn').addEventListener('click', navigateFocusBack);
        document.getElementById('nav-forward-btn').addEventListener('click', navigateFocusForward);

        // Search button
        searchBtn.addEventListener('click', showSearchModal);

        // Search modal
        let searchModalTimeout;
        searchModalInput.addEventListener('input', (e) => {
            clearTimeout(searchModalTimeout);
            searchModalTimeout = setTimeout(() => {
                performModalSearch(e.target.value);
            }, 100);
        });

        searchModalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                hideSearchModal();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                selectSearchResult(searchModalSelectedIndex);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateSearchResults('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateSearchResults('up');
            }
        });

        searchModalClose.addEventListener('click', hideSearchModal);

        searchModalOverlay.addEventListener('click', (e) => {
            if (e.target === searchModalOverlay) {
                hideSearchModal();
            }
        });

        searchModalResults.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (item) {
                const index = parseInt(item.dataset.index, 10);
                selectSearchResult(index);
            }
        });

        // Document dropdown
        docTitleBtn.addEventListener('click', toggleDocDropdown);
        renameDocBtn.addEventListener('click', renameDocument);
        saveCopyBtn.addEventListener('click', saveAsCopy);
        exportMdBtn.addEventListener('click', () => {
            exportAsMarkdown();
            closeDocDropdown();
        });

        // Load all settings from consolidated storage
        loadSettings();

        // Zen fullscreen toggle
        const zenFullscreenToggle = document.getElementById('zen-fullscreen-toggle');
        zenFullscreenToggle.checked = state.zenBrowserFullscreen;
        zenFullscreenToggle.addEventListener('change', (e) => {
            state.zenBrowserFullscreen = e.target.checked;
            saveSettings();
        });

        // Zen width select
        const zenWidthSelect = document.getElementById('zen-width-select');
        zenWidthSelect.value = state.zenWidth;
        zenWidthSelect.addEventListener('change', (e) => {
            state.zenWidth = e.target.value;
            applyZenWidth();
            saveSettings();
        });

        // Zen typewriter toggle (center cursor vertically)
        const zenTypewriterToggle = document.getElementById('zen-typewriter-toggle');
        zenTypewriterToggle.checked = state.zenTypewriter;
        zenTypewriterToggle.addEventListener('change', (e) => {
            state.zenTypewriter = e.target.checked;
            saveSettings();
        });

        // Typewriter scroll toggle
        const typewriterToggle = document.getElementById('typewriter-scroll-toggle');
        typewriterToggle.checked = state.typewriterScroll;
        typewriterToggle.addEventListener('change', (e) => {
            state.typewriterScroll = e.target.checked;
            saveSettings();
        });

        // Card badges toggle
        const cardBadgesToggle = document.getElementById('show-card-badges-toggle');
        cardBadgesToggle.checked = state.showCardBadges;
        cardBadgesToggle.addEventListener('change', (e) => {
            state.showCardBadges = e.target.checked;
            saveSettings();
            render();
        });

        // Word goal toggle and input
        const wordGoalToggle = document.getElementById('word-goal-toggle');
        const wordGoalInputWrapper = document.getElementById('word-goal-input-wrapper');
        const wordGoalInput = document.getElementById('word-goal-input');
        wordGoalToggle.checked = state.wordGoalEnabled;
        wordGoalInput.value = state.wordGoal;
        wordGoalInputWrapper.hidden = !state.wordGoalEnabled;
        wordGoalToggle.addEventListener('change', (e) => {
            state.wordGoalEnabled = e.target.checked;
            wordGoalInputWrapper.hidden = !state.wordGoalEnabled;
            saveSettings();
            if (state.wordGoalEnabled && !state.sessionStartTime) {
                startSession();
            }
            updateWordGoalProgress();
        });
        wordGoalInput.addEventListener('change', (e) => {
            state.wordGoal = parseInt(e.target.value, 10) || 500;
            saveSettings();
            updateWordGoalProgress();
        });

        // Session timer toggle and options
        const sessionTimerToggle = document.getElementById('session-timer-toggle');
        const timerOptions = document.getElementById('timer-options');
        const timerModeRadios = document.querySelectorAll('input[name="timer-mode"]');
        const pomodoroDurationWrapper = document.getElementById('pomodoro-duration-wrapper');
        const pomodoroDurationSelect = document.getElementById('pomodoro-duration-select');
        const timerContainer = document.getElementById('session-timer-container');
        const timerPauseBtn = document.getElementById('timer-pause-btn');
        const timerResetBtn = document.getElementById('timer-reset-btn');

        // Initialize timer UI state
        sessionTimerToggle.checked = state.sessionTimerEnabled;
        timerOptions.hidden = !state.sessionTimerEnabled;
        document.querySelector(`input[name="timer-mode"][value="${state.timerMode}"]`).checked = true;
        pomodoroDurationWrapper.hidden = state.timerMode !== 'pomodoro';
        pomodoroDurationSelect.value = state.pomodoroDuration;

        sessionTimerToggle.addEventListener('change', (e) => {
            state.sessionTimerEnabled = e.target.checked;
            timerOptions.hidden = !e.target.checked;
            timerContainer.hidden = !e.target.checked;
            saveSettings();
            if (state.sessionTimerEnabled && !state.sessionStartTime) {
                startSession();
            }
            updateSessionTimer();
        });

        timerModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.timerMode = e.target.value;
                pomodoroDurationWrapper.hidden = e.target.value !== 'pomodoro';
                // Reset timer when changing modes
                resetTimer();
                saveSettings();
            });
        });

        pomodoroDurationSelect.addEventListener('change', (e) => {
            state.pomodoroDuration = parseInt(e.target.value, 10);
            // Reset timer when changing duration
            resetTimer();
            saveSettings();
        });

        // Timer control buttons
        timerPauseBtn.addEventListener('click', () => {
            toggleTimerPause();
            updateTimerPauseButton();
        });

        timerResetBtn.addEventListener('click', () => {
            resetTimer();
            updateTimerPauseButton();
        });

        // Click on timer to toggle pause
        document.getElementById('session-timer').addEventListener('click', () => {
            toggleTimerPause();
            updateTimerPauseButton();
        });

        function updateTimerPauseButton() {
            const pauseIcon = timerPauseBtn.querySelector('.timer-icon-pause');
            const playIcon = timerPauseBtn.querySelector('.timer-icon-play');
            if (state.timerPaused) {
                pauseIcon.hidden = true;
                playIcon.hidden = false;
                timerPauseBtn.title = 'Resume';
            } else {
                pauseIcon.hidden = false;
                playIcon.hidden = true;
                timerPauseBtn.title = 'Pause';
            }
        }

        // Start session timer interval
        setInterval(updateSessionTimer, 1000);

        // Zen depth indent toggle
        const zenDepthIndentToggle = document.getElementById('zen-depth-indent-toggle');
        zenDepthIndentToggle.checked = state.zenDepthIndent;
        if (state.zenDepthIndent) {
            document.body.classList.add('zen-depth-indent');
        }
        zenDepthIndentToggle.addEventListener('change', (e) => {
            state.zenDepthIndent = e.target.checked;
            saveSettings();
            document.body.classList.toggle('zen-depth-indent', state.zenDepthIndent);
        });

        // Focus fade toggle
        const focusFadeToggle = document.getElementById('focus-fade-toggle');
        focusFadeToggle.checked = state.focusFade;
        // Apply focus-fade class on load if enabled
        if (state.focusFade) {
            document.body.classList.add('focus-fade');
        }
        focusFadeToggle.addEventListener('change', (e) => {
            state.focusFade = e.target.checked;
            saveSettings();
            document.body.classList.toggle('focus-fade', state.focusFade);
        });

        // Card preview toggle
        const cardPreviewToggle = document.getElementById('card-preview-toggle');
        cardPreviewToggle.checked = state.cardPreviewEnabled;
        cardPreviewToggle.addEventListener('change', (e) => {
            state.cardPreviewEnabled = e.target.checked;
            saveSettings();
        });

        // Card preview hover handling
        const cardPreviewEl = document.getElementById('card-preview');
        const cardPreviewContent = cardPreviewEl.querySelector('.card-preview-content');
        let previewTimeout = null;

        columnsContainer.addEventListener('mouseover', (e) => {
            if (!state.cardPreviewEnabled) return;
            const card = e.target.closest('.card');
            if (!card || card.classList.contains('selected')) return;

            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(() => {
                const nodeId = card.dataset.id;
                const node = findNode(state.tree, nodeId);
                if (!node || node.children.length === 0) return;

                // Build preview content
                let html = '';
                const childPreviews = node.children.slice(0, 4).map(child => {
                    const text = child.content.replace(/[#*_`~\[\]]/g, '').trim();
                    return text.substring(0, 50) + (text.length > 50 ? '...' : '');
                });

                html = '<div class="card-preview-children">';
                childPreviews.forEach(text => {
                    html += `<div class="card-preview-child">${escapeHtml(text)}</div>`;
                });
                if (node.children.length > 4) {
                    html += `<div class="card-preview-child" style="opacity: 0.6">+${node.children.length - 4} more</div>`;
                }
                html += '</div>';

                cardPreviewContent.innerHTML = html;

                // Position the preview
                const rect = card.getBoundingClientRect();
                cardPreviewEl.style.left = `${rect.right + 10}px`;
                cardPreviewEl.style.top = `${rect.top}px`;

                // Adjust if off-screen
                cardPreviewEl.hidden = false;
                const previewRect = cardPreviewEl.getBoundingClientRect();
                if (previewRect.right > window.innerWidth) {
                    cardPreviewEl.style.left = `${rect.left - previewRect.width - 10}px`;
                }
                if (previewRect.bottom > window.innerHeight) {
                    cardPreviewEl.style.top = `${window.innerHeight - previewRect.height - 10}px`;
                }
            }, 400);
        });

        columnsContainer.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                clearTimeout(previewTimeout);
                cardPreviewEl.hidden = true;
            }
        });

        // Writing analysis buttons
        const wordFrequencyBtn = document.getElementById('word-frequency-btn');
        const readingLevelBtn = document.getElementById('reading-level-btn');

        wordFrequencyBtn.addEventListener('click', () => {
            showWordFrequency();
            closeDocDropdown();
        });

        readingLevelBtn.addEventListener('click', () => {
            showReadingLevel();
            closeDocDropdown();
        });

        // Settings export/import
        const exportSettingsBtn = document.getElementById('export-settings-btn');
        const importSettingsBtn = document.getElementById('import-settings-btn');
        const settingsFileInput = document.getElementById('settings-file-input');

        exportSettingsBtn.addEventListener('click', () => {
            exportSettings();
            closeDocDropdown();
        });

        importSettingsBtn.addEventListener('click', () => {
            settingsFileInput.click();
            closeDocDropdown();
        });

        settingsFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                importSettings(file);
            }
            e.target.value = '';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!docDropdownMenu.hidden && !docDropdownMenu.contains(e.target) && !docTitleBtn.contains(e.target)) {
                closeDocDropdown();
            }
        });

        // Theme dropdown
        const themeToggle = document.getElementById('theme-toggle');
        const themeDropdownMenu = document.getElementById('theme-dropdown-menu');

        function updateThemeActiveState() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            themeDropdownMenu.querySelectorAll('.theme-option').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === theme);
            });
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme-preference', theme);
            updateThemeActiveState();
            closeThemeDropdown();
        }

        function toggleThemeDropdown() {
            const isHidden = themeDropdownMenu.hidden;
            themeDropdownMenu.hidden = !isHidden;
            if (!isHidden) return;
            updateThemeActiveState();
        }

        function closeThemeDropdown() {
            themeDropdownMenu.hidden = true;
        }

        updateThemeActiveState();

        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleThemeDropdown();
        });

        themeDropdownMenu.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => setTheme(btn.dataset.theme));
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-dropdown')) {
                closeThemeDropdown();
            }
        });

        // Fullscreen
        document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);

        // Zen mode
        document.getElementById('zen-btn').addEventListener('click', toggleZenMode);

        // Print
        document.getElementById('print-btn').addEventListener('click', showPrintDialog);
        printCancel.addEventListener('click', hidePrintDialog);
        printConfirm.addEventListener('click', executePrint);
        printOverlay.addEventListener('click', (e) => {
            if (e.target === printOverlay) hidePrintDialog();
        });

        // Shortcuts modal
        document.getElementById('shortcuts-btn').addEventListener('click', showShortcutsDialog);
        shortcutsClose.addEventListener('click', hideShortcutsDialog);
        shortcutsOverlay.addEventListener('click', (e) => {
            if (e.target === shortcutsOverlay) hideShortcutsDialog();
        });

        // Templates
        document.getElementById('templates-btn').addEventListener('click', showTemplatesDialog);
        templatesClose.addEventListener('click', hideTemplatesDialog);
        templatesOverlay.addEventListener('click', (e) => {
            if (e.target === templatesOverlay) hideTemplatesDialog();
        });

        // File input
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importFile(e.target.files[0]);
            }
            e.target.value = '';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Handle search modal - has its own handlers
            if (searchModalOverlay.classList.contains('visible')) {
                return; // Let the search modal input handle all keys
            }

            // Handle shortcuts modal - can close with Escape anytime
            if (shortcutsOverlay.classList.contains('visible')) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    hideShortcutsDialog();
                }
                return;
            }

            // Skip if expanded editor is open (it has its own handlers)
            if (state.expandedEditingId) {
                return;
            }

            // Skip if inline editing
            if (state.editingId && !['Escape', 'Tab'].includes(e.key) &&
                !(e.key === 'Enter' && (e.ctrlKey || e.metaKey))) {
                return;
            }

            // Skip navigation keys if focus is on an input (except mod+key shortcuts)
            const activeEl = document.activeElement;
            const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
            const isMod = e.ctrlKey || e.metaKey;

            if (isInputFocused && !state.editingId && !isMod) {
                // Allow certain keys to work even with input focused
                const allowedKeys = ['Escape'];
                if (!allowedKeys.includes(e.key)) {
                    return;
                }
            }

            switch (e.key) {
                case 'n':
                    if (isMod) {
                        e.preventDefault();
                        newDocument();
                    }
                    break;
                case 'o':
                    if (isMod) {
                        e.preventDefault();
                        fileInput.click();
                    }
                    break;
                case 's':
                    if (isMod) {
                        e.preventDefault();
                        saveDocumentAsJSON();
                    }
                    break;
                case 'z':
                    if (isMod && !state.editingId) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            redo();
                        } else {
                            undo();
                        }
                    } else if (!state.editingId && !isMod) {
                        e.preventDefault();
                        toggleZenMode();
                    }
                    break;
                case 'f':
                    if (isMod) {
                        e.preventDefault();
                        showSearchModal();
                    }
                    break;
                case 'p':
                    if (isMod) {
                        e.preventDefault();
                        showPrintDialog();
                    }
                    break;
                case 'Enter':
                    if (!state.editingId && state.selectedPath.length > 0) {
                        e.preventDefault();
                        if (isMod) {
                            // Cmd/Ctrl+Enter: add sibling below
                            // Cmd/Ctrl+Shift+Enter: add sibling above
                            if (e.shiftKey) {
                                addSibling(false);
                            } else {
                                addSibling(true);
                            }
                        } else {
                            // Enter: edit selected card
                            const selectedId = state.selectedPath[state.selectedPath.length - 1];
                            startEditing(selectedId);
                        }
                    }
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (state.editingId) {
                        stopEditing(true);
                    }
                    addChild();
                    break;
                case 'Delete':
                case 'Backspace':
                    if (!state.editingId && state.selectedPath.length > 0) {
                        e.preventDefault();
                        deleteSelected();
                    }
                    break;
                case 'Escape':
                    if (state.zenMode) {
                        exitZenMode();
                    } else if (state.editingId) {
                        stopEditing(false);
                    } else {
                        clearSelection();
                    }
                    break;
                case 'ArrowUp':
                    if (!state.editingId) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            moveCard(-1);
                        } else if (isMod) {
                            addSibling(false); // Add sibling above
                        } else {
                            navigateCards('up');
                        }
                    }
                    break;
                case 'ArrowDown':
                    if (!state.editingId) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            moveCard(1);
                        } else if (isMod) {
                            addSibling(true); // Add sibling below
                        } else {
                            navigateCards('down');
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if (!state.editingId) {
                        e.preventDefault();
                        if (e.altKey) {
                            navigateFocusBack(); // Browser-like back
                        } else if (e.shiftKey) {
                            moveCardLeft(); // Move up hierarchy
                        } else {
                            navigateCards('left');
                        }
                    }
                    break;
                case 'ArrowRight':
                    if (!state.editingId) {
                        e.preventDefault();
                        if (e.altKey) {
                            navigateFocusForward(); // Browser-like forward
                        } else if (e.shiftKey) {
                            moveCardRight(); // Move into sibling above
                        } else if (isMod) {
                            addChild(); // Add child card
                        } else {
                            navigateCards('right');
                        }
                    }
                    break;
                case 'F2':
                    if (state.selectedPath.length > 0 && !state.editingId) {
                        e.preventDefault();
                        startEditing(state.selectedPath[state.selectedPath.length - 1]);
                    }
                    break;
                case 'e':
                    // 'e' to expand selected card for editing (when not in edit mode)
                    if (state.selectedPath.length > 0 && !state.editingId && !isMod) {
                        e.preventDefault();
                        openExpandedEditor(state.selectedPath[state.selectedPath.length - 1]);
                    }
                    break;
                case 'F11':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case '?':
                    if (!state.editingId) {
                        e.preventDefault();
                        showShortcutsDialog();
                    }
                    break;
            }
        });

        // Click outside cards - compress to clicked column
        columnsContainer.addEventListener('click', (e) => {
            if (e.target === columnsContainer) {
                // Clicked on the container itself, clear all selection
                clearSelection();
            } else if (e.target.classList.contains('column-content')) {
                // Clicked on empty space within a column - preserve selection up to that column
                const column = e.target.closest('.column');
                if (column) {
                    const columnIndex = parseInt(column.dataset.index, 10);
                    if (state.editingId) {
                        stopEditing();
                    }
                    // Keep selection path up to and including this column's level
                    state.selectedPath = state.selectedPath.slice(0, columnIndex + 1);
                    render();
                }
            }
        });

        // Card link clicks
        columnsContainer.addEventListener('click', (e) => {
            const cardLink = e.target.closest('.card-link');
            if (cardLink) {
                e.preventDefault();
                e.stopPropagation();
                const cardId = cardLink.dataset.cardId;
                if (cardId) {
                    const ancestors = getAncestorIds(state.tree, cardId) || [];
                    state.selectedPath = [...ancestors, cardId];
                    pushToFocusHistory(state.selectedPath);
                    render();
                    scrollSelectedIntoView();
                }
            }
        });

        // Drag and drop for file import (only apply visual feedback for external file drags)
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            // Only show drop zone visual if not dragging a card internally
            if (!state.draggedId && e.dataTransfer.types.includes('Files')) {
                document.body.style.opacity = '0.5';
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.relatedTarget === null) {
                document.body.style.opacity = '';
            }
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            document.body.style.opacity = '';

            // Only process file drops if not a card drag
            if (!state.draggedId) {
                const files = e.dataTransfer.files;
                if (files.length > 0 && /\.(json|gingko|md|txt|markdown)$/i.test(files[0].name)) {
                    importFile(files[0]);
                }
            }
        });

        // Warn before leaving with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (state.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        // Expanded editor events
        expandedSaveBtn.addEventListener('click', () => closeExpandedEditor(true));
        expandedCancelBtn.addEventListener('click', () => closeExpandedEditor(false));

        // Click overlay background to save and close (but not in split modes where tree is visible)
        expandedOverlay.addEventListener('click', (e) => {
            if (e.target === expandedOverlay) {
                const isSplitMode = expandedOverlay.classList.contains('split-left') ||
                                    expandedOverlay.classList.contains('split-right');
                if (!isSplitMode) {
                    closeExpandedEditor(true);
                }
            }
        });

        // Forward scroll events from overlay backdrop to columns container
        expandedOverlay.addEventListener('wheel', (e) => {
            // Only forward if scrolling on the backdrop itself (not inside the editor)
            if (e.target === expandedOverlay) {
                columnsContainer.scrollLeft += e.deltaX || e.deltaY;
            }
        }, { passive: true });

        // Live preview update
        expandedInput.addEventListener('input', updateExpandedPreview);

        // Typewriter scrolling - keep cursor at fixed vertical position
        function typewriterScroll() {
            // Normal expanded editor typewriter (1/3 from top)
            if (!state.typewriterScroll || state.zenMode) return;

            const textarea = expandedInput;
            const styles = getComputedStyle(textarea);
            let lineHeight = parseFloat(styles.lineHeight);
            if (isNaN(lineHeight) || lineHeight < 10) {
                const fontSize = parseFloat(styles.fontSize) || 16;
                lineHeight = fontSize * (parseFloat(styles.lineHeight) || 1.8);
            }

            const textareaHeight = textarea.clientHeight;
            const cursorPosition = textarea.selectionStart;
            const textBeforeCursor = textarea.value.substring(0, cursorPosition);
            const linesBeforeCursor = textBeforeCursor.split('\n').length;

            const targetLine = linesBeforeCursor * lineHeight;
            const focusPoint = textareaHeight / 3;
            const targetScrollTop = targetLine - focusPoint;

            textarea.scrollTop = Math.max(0, targetScrollTop);
        }

        // Zen mode typewriter - scrolls the active card's textarea toward vertical center
        function zenTypewriterScroll() {
            if (!state.zenMode || !state.zenTypewriter) return;

            const activeCard = zenCardsContainer.querySelector('.zen-card-active');
            if (!activeCard) return;

            const textarea = activeCard.querySelector('.zen-card-editor');
            if (!textarea) return;

            // Scroll the active card's textarea into the center of the container
            const container = zenCardsContainer;
            const containerRect = container.getBoundingClientRect();
            const textareaRect = textarea.getBoundingClientRect();

            // Get cursor position within the textarea
            const styles = getComputedStyle(textarea);
            let lineHeight = parseFloat(styles.lineHeight);
            if (isNaN(lineHeight) || lineHeight < 10) {
                const fontSize = parseFloat(styles.fontSize) || 16;
                lineHeight = fontSize * 1.8;
            }

            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const cursorLine = textBefore.split('\n').length - 1;
            const cursorOffsetInTextarea = cursorLine * lineHeight;

            // Target: center the cursor line in the container
            const targetScrollTop = (textareaRect.top - containerRect.top + container.scrollTop)
                + cursorOffsetInTextarea
                - (containerRect.height / 2);

            container.scrollTop = Math.max(0, targetScrollTop);
        }

        // Expose for use in openZenEditor
        window.zenTypewriterScroll = zenTypewriterScroll;

        // =====================================================================
        // Zen Structure Bar - shows position in hierarchy and add card buttons
        // =====================================================================

        const zenBreadcrumb = document.getElementById('zen-breadcrumb');
        const zenAddSiblingBtn = document.getElementById('zen-add-sibling');
        const zenAddChildBtn = document.getElementById('zen-add-child');

        // Get the active zen card's metadata (index, depth, id)
        function getActiveZenCardInfo() {
            const active = zenCardsContainer.querySelector('.zen-card-active');
            if (!active) return null;
            return {
                id: active.dataset.id,
                index: active.dataset.index,
                depth: parseInt(active.dataset.depth, 10),
                element: active
            };
        }

        // Build a card list from the current zen DOM for breadcrumb/map
        function getZenCardList() {
            return getZenCards().map(card => ({
                id: card.dataset.id,
                index: card.dataset.index,
                depth: parseInt(card.dataset.depth, 10),
                title: card.querySelector('.zen-card-title').textContent || card.dataset.index
            }));
        }

        // Navigate to a specific card by its index
        function zenNavigateTo(index) {
            const card = zenCardsContainer.querySelector(`.zen-card[data-index="${index}"]`);
            if (card) {
                const textarea = card.querySelector('.zen-card-editor');
                if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(0, 0);
                }
                if (state.zenTypewriter) {
                    zenTypewriterScroll();
                }
            }
        }

        // Update the mini-map display based on active card
        function updateZenBreadcrumb() {
            if (!state.zenMode || !zenBreadcrumb) return;

            const info = getActiveZenCardInfo();
            if (!info) return;

            const cards = getZenCardList();
            const currentIndex = info.index;
            const currentParts = currentIndex.split('.');

            // Find parent index
            const parentIndex = currentParts.length > 1
                ? currentParts.slice(0, -1).join('.')
                : null;

            // Find siblings
            const siblings = cards.filter(c => {
                if (c.depth !== info.depth) return false;
                const cParts = c.index.split('.');
                const cParent = cParts.slice(0, -1).join('.');
                return cParent === (parentIndex || '');
            });

            // Find direct children
            const children = cards.filter(c => {
                if (c.depth !== info.depth + 1) return false;
                return c.index.startsWith(currentIndex + '.');
            }).slice(0, 3);

            // Build mini-map HTML
            let html = '<div class="zen-minimap">';

            if (parentIndex) {
                const parent = cards.find(c => c.index === parentIndex);
                if (parent) {
                    html += '<div class="zen-minimap-row zen-minimap-parent">';
                    html += `<span class="zen-minimap-item" data-index="${parentIndex}" title="${parent.title}">${parentIndex}</span>`;
                    html += '</div>';
                    html += '<div class="zen-minimap-connector">│</div>';
                }
            }

            html += '<div class="zen-minimap-row zen-minimap-siblings">';
            siblings.forEach((sib, i) => {
                if (i > 0) html += '<span class="zen-minimap-sep">·</span>';
                const isCurrent = sib.index === currentIndex;
                html += `<span class="zen-minimap-item${isCurrent ? ' current' : ''}" data-index="${sib.index}" title="${sib.title}">${sib.index}</span>`;
            });
            html += '</div>';

            if (children.length > 0) {
                html += '<div class="zen-minimap-connector">│</div>';
                html += '<div class="zen-minimap-row zen-minimap-children">';
                children.forEach((child, i) => {
                    if (i > 0) html += '<span class="zen-minimap-sep">·</span>';
                    html += `<span class="zen-minimap-item" data-index="${child.index}" title="${child.title}">${child.index}</span>`;
                });
                const allChildren = cards.filter(c => c.depth === info.depth + 1 && c.index.startsWith(currentIndex + '.'));
                if (allChildren.length > 3) {
                    html += '<span class="zen-minimap-more">…</span>';
                }
                html += '</div>';
            }

            html += '</div>';
            zenBreadcrumb.innerHTML = html;

            // Click handlers for navigation
            zenBreadcrumb.querySelectorAll('.zen-minimap-item').forEach(item => {
                item.addEventListener('click', () => {
                    zenNavigateTo(item.dataset.index);
                });
            });

            // Disable child button at max depth
            if (zenAddChildBtn) {
                zenAddChildBtn.disabled = info.depth >= 6;
                zenAddChildBtn.style.opacity = info.depth >= 6 ? '0.4' : '1';
            }

            updateZenExpandedMap();
        }

        // Expanded map toggle and rendering
        const zenMapToggle = document.getElementById('zen-map-toggle');
        const zenExpandedMap = document.getElementById('zen-expanded-map');
        const zenStructureBar = document.getElementById('zen-structure-bar');

        function toggleZenMap() {
            if (!state.zenMode) return;
            zenStructureBar.classList.toggle('map-expanded');
            if (zenStructureBar.classList.contains('map-expanded')) {
                updateZenExpandedMap();
            }
        }

        if (zenMapToggle) {
            zenMapToggle.addEventListener('click', toggleZenMap);
        }

        function updateZenExpandedMap() {
            if (!zenExpandedMap || !zenStructureBar.classList.contains('map-expanded')) return;

            const cards = getZenCardList();
            const info = getActiveZenCardInfo();
            if (!info || cards.length === 0) return;

            const currentIndex = info.index;
            const currentParts = currentIndex.split('.');

            const ancestorIndices = new Set();
            for (let i = 1; i < currentParts.length; i++) {
                ancestorIndices.add(currentParts.slice(0, i).join('.'));
            }

            const maxLevel = Math.max(...cards.map(c => c.depth));

            let html = '<div class="zen-map-columns">';
            for (let level = 1; level <= maxLevel; level++) {
                const levelCards = cards.filter(c => c.depth === level);
                if (levelCards.length === 0) continue;

                html += '<div class="zen-map-column">';
                html += `<div class="zen-map-column-header">Level ${level}</div>`;

                levelCards.forEach(c => {
                    const isCurrent = c.index === currentIndex;
                    const isAncestor = ancestorIndices.has(c.index);
                    let cls = 'zen-map-card';
                    if (isCurrent) cls += ' current';
                    else if (isAncestor) cls += ' ancestor';

                    const displayTitle = c.title || c.index;
                    html += `<div class="${cls}" data-index="${c.index}" title="${c.title}">${c.index} ${displayTitle}</div>`;
                });

                html += '</div>';
            }
            html += '</div>';
            zenExpandedMap.innerHTML = html;

            zenExpandedMap.querySelectorAll('.zen-map-card').forEach(card => {
                card.addEventListener('click', () => {
                    zenNavigateTo(card.dataset.index);
                    updateZenExpandedMap();
                });
            });

            const currentCard = zenExpandedMap.querySelector('.zen-map-card.current');
            if (currentCard) {
                currentCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }

        // Wire up Zen structure bar buttons
        if (zenAddSiblingBtn) {
            zenAddSiblingBtn.addEventListener('click', () => {
                const activeId = getActiveZenCardId();
                if (activeId) zenAddSiblingAfter(activeId);
            });
        }
        if (zenAddChildBtn) {
            zenAddChildBtn.addEventListener('click', () => {
                const activeId = getActiveZenCardId();
                if (activeId) zenAddChildTo(activeId);
            });
        }

        // Expose for use when entering Zen mode
        window.updateZenBreadcrumb = updateZenBreadcrumb;

        // Expanded editor event listeners (non-zen mode only)
        expandedInput.addEventListener('input', () => {
            typewriterScroll();
        });
        expandedInput.addEventListener('click', () => {
            typewriterScroll();
        });
        expandedInput.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                setTimeout(() => { typewriterScroll(); }, 0);
            }
        });
        expandedInput.addEventListener('keyup', (e) => {
            if (['Enter', 'Backspace', 'Delete'].includes(e.key)) {
                typewriterScroll();
            }
        });

        // Keyboard shortcuts in expanded editor (non-zen mode - zen handles its own via card keydown)
        expandedInput.addEventListener('keydown', (e) => {
            const isMod = e.ctrlKey || e.metaKey;

            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                closeExpandedEditor(false);
            } else if (e.key === 'Enter' && isMod) {
                e.preventDefault();
                e.stopPropagation();
                closeExpandedEditor(true);
            } else if (e.key === 'b' && isMod) {
                e.preventDefault();
                insertMarkdown('bold');
            } else if (e.key === 'i' && isMod) {
                e.preventDefault();
                insertMarkdown('italic');
            } else if (e.key === 'k' && isMod) {
                e.preventDefault();
                insertMarkdown('link');
            } else if (e.key === '\\' && isMod) {
                e.preventDefault();
                e.stopPropagation();
                const cursorPos = expandedInput.selectionStart;
                if (splitCard(cursorPos, expandedInput.value)) {
                    closeExpandedEditor(false);
                }
            } else if (e.key === 'Backspace' && isMod) {
                e.preventDefault();
                e.stopPropagation();
                if (mergeWithPrevious()) {
                    closeExpandedEditor(false);
                }
            }
        });

        // Markdown toolbar buttons
        const toolbarButtons = document.querySelectorAll('.md-toolbar-btn[data-md]');
        toolbarButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.md;
                insertMarkdown(action);
            });
        });

        // Preview toggle
        const togglePreviewBtn = document.getElementById('toggle-preview-btn');
        togglePreviewBtn.addEventListener('click', () => {
            state.editorPreviewHidden = !state.editorPreviewHidden;
            applyEditorPreviewState();
            markUnsaved();
        });

        // Editor size mode buttons
        const editorModeButtons = document.querySelectorAll('.view-mode-btn[data-mode]');

        editorModeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                state.editorViewMode = btn.dataset.mode;
                applyEditorMode(state.editorViewMode);
                markUnsaved();
            });
        });

        // Apply initial editor states (already loaded by loadSettings())
        applyEditorPreviewState();
        applyEditorMode(state.editorViewMode || 'default');
    }

    // Apply editor preview hidden state to UI
    function applyEditorPreviewState() {
        const togglePreviewBtn = document.getElementById('toggle-preview-btn');
        if (state.editorPreviewHidden) {
            expandedOverlay.classList.add('preview-hidden');
            togglePreviewBtn.classList.remove('active');
        } else {
            expandedOverlay.classList.remove('preview-hidden');
            togglePreviewBtn.classList.add('active');
        }
        saveSettings();
    }

    // Apply editor mode to UI
    function applyEditorMode(mode) {
        const editorModes = ['default', 'fullscreen', 'split-left', 'split-right'];
        const editorModeButtons = document.querySelectorAll('.view-mode-btn[data-mode]');

        // Remove all mode classes from overlay
        editorModes.forEach(m => {
            expandedOverlay.classList.remove(m);
        });

        // Add new mode class (default has no class)
        if (mode !== 'default') {
            expandedOverlay.classList.add(mode);
        }

        // Update body class for split mode toolbar compression and column offset
        // Only apply when expanded editor is actually open
        if (state.expandedEditingId) {
            document.body.classList.remove('editor-split-active', 'editor-split-left', 'editor-split-right');
            if (mode === 'split-left' || mode === 'split-right') {
                document.body.classList.add('editor-split-active');
                document.body.classList.add(mode === 'split-left' ? 'editor-split-left' : 'editor-split-right');
            }
        }

        // Update button states
        editorModeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update state and save
        state.editorViewMode = mode;
        saveSettings();
    }

    // =========================================================================
    // Initialization
    // =========================================================================

    function init() {
        // Load column widths preference
        loadColumnWidths();

        // Load saved document or start fresh
        if (!loadFromStorage()) {
            // Start with sample content for first-time users
            const welcome = createNode('# Welcome to TextGarden\n\nA place for ideas to grow. Click cards to navigate, double-click to edit.');
            const tip1 = createNode('## Getting Around\n\nUse arrow keys to move between cards. Press Tab to plant a new idea deeper, Enter to add one alongside.');
            const tip2 = createNode('## Tending Your Garden\n\nYour ideas grow from Root to Leaf across six levels. Export as Markdown to save, import to continue cultivating.');

            welcome.children.push(tip1, tip2);
            state.tree.push(welcome);
            state.selectedPath = [welcome.id];
        }

        updateTitle();
        render();
        setupEventListeners();
    }

    // Debug helper - expose state for console inspection
    window.textGardenDebug = {
        getState: () => state,
        getTree: () => state.tree,
        printTree: () => {
            function printNode(node, indent = 0) {
                const prefix = '  '.repeat(indent);
                console.log(`${prefix}- ${node.title || node.content.slice(0, 30) || '(empty)'} [${node.id.slice(0, 8)}...]`);
                console.log(`${prefix}  children: ${node.children.length}`);
                for (const child of node.children) {
                    printNode(child, indent + 1);
                }
            }
            console.log('=== Tree Structure ===');
            for (const node of state.tree) {
                printNode(node);
            }
        },
        findCard: (titleOrContent) => {
            function search(nodes, term) {
                for (const node of nodes) {
                    if ((node.title && node.title.includes(term)) ||
                        (node.content && node.content.includes(term))) {
                        console.log('Found:', node.title || node.content.slice(0, 50));
                        console.log('  ID:', node.id);
                        console.log('  Children:', node.children.length);
                        if (node.children.length > 0) {
                            console.log('  Child titles:', node.children.map(c => c.title || c.content.slice(0, 30)));
                        }
                    }
                    search(node.children, term);
                }
            }
            search(state.tree, titleOrContent);
        }
    };

    // Start the app
    init();
})();
