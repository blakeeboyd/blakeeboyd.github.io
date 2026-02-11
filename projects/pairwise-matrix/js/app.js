/**
 * Pairwise Matrix
 * A tool for prioritizing items through head-to-head comparisons
 */

(function() {
    'use strict';

    // ========================================
    // State
    // ========================================

    var state = {
        id: null,
        context: '',
        items: [],          // [{id: 'A', label: 'Steak'}, ...]
        comparisons: {},    // {'A-B': 'A', 'A-C': 'B', ...}
        comparisonOrder: [], // [['A','B'], ['A','C'], ...]
        currentIndex: 0,
        phase: 'setup'      // 'setup', 'comparing', 'results'
    };

    var savedMatrices = [];

    var MIN_ITEMS = 2;
    var INITIAL_ITEM_COUNT = 4;
    var MAX_ITEMS = 26;

    // ========================================
    // DOM Elements
    // ========================================

    var contextInput = document.getElementById('context-input');
    var itemsGrid = document.getElementById('items-grid');
    var addItemBtn = document.getElementById('add-item-btn');
    var startBtn = document.getElementById('start-btn');
    var comparisonEstimate = document.getElementById('comparison-estimate');

    var setupSection = document.getElementById('setup-section');
    var comparisonSection = document.getElementById('comparison-section');
    var comparingBottom = document.getElementById('comparing-bottom');
    var matrixSection = document.getElementById('matrix-section');
    var resultsSection = document.getElementById('results-section');

    var currentComparisonEl = document.getElementById('current-comparison');
    var totalComparisonsEl = document.getElementById('total-comparisons');
    var progressFill = document.getElementById('progress-fill');
    var comparisonPrompt = document.getElementById('comparison-prompt');

    var cardA = document.getElementById('card-a');
    var cardALetter = document.getElementById('card-a-letter');
    var cardALabel = document.getElementById('card-a-label');
    var cardB = document.getElementById('card-b');
    var cardBLetter = document.getElementById('card-b-letter');
    var cardBLabel = document.getElementById('card-b-label');

    var undoBtn = document.getElementById('undo-btn');
    var cancelBtn = document.getElementById('cancel-btn');

    var toggleMatrixBtn = document.getElementById('toggle-matrix');
    var matrixContainer = document.getElementById('matrix-container');

    var resultsTitle = document.getElementById('results-title');
    var resultsList = document.getElementById('results-list');
    var resultsActions = document.getElementById('results-actions');
    var copyBtn = document.getElementById('copy-btn');
    var exportMdBtn = document.getElementById('export-md-btn');
    var exportJsonBtn = document.getElementById('export-json-btn');
    var printBtn = document.getElementById('print-btn');
    var saveBtn = document.getElementById('save-btn');
    var newBtn = document.getElementById('new-btn');

    var savedSection = document.getElementById('saved-section');
    var savedList = document.getElementById('saved-list');
    var importBtn = document.getElementById('import-btn');
    var importFile = document.getElementById('import-file');
    var shareBtn = document.getElementById('share-btn');

    // ========================================
    // Utilities
    // ========================================

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function getLetter(index) {
        return String.fromCharCode(65 + index);
    }

    function getComparisonKey(idA, idB) {
        return idA < idB ? idA + '-' + idB : idB + '-' + idA;
    }

    function calculateTotalComparisons(n) {
        return (n * (n - 1)) / 2;
    }

    function buildComparisonOrder(items) {
        var order = [];
        for (var j = 1; j < items.length; j++) {
            for (var i = 0; i < j; i++) {
                order.push([items[i].id, items[j].id]);
            }
        }
        return order;
    }

    function calculateWins(items, comparisons) {
        var wins = {};
        items.forEach(function(item) {
            wins[item.id] = 0;
        });

        Object.keys(comparisons).forEach(function(key) {
            var winner = comparisons[key];
            if (winner && wins[winner] !== undefined) {
                wins[winner]++;
            }
        });

        return wins;
    }

    function getRankedItems(items, comparisons) {
        var wins = calculateWins(items, comparisons);
        var ranked = items.slice().sort(function(a, b) {
            return wins[b.id] - wins[a.id];
        });
        return ranked.map(function(item) {
            return {
                id: item.id,
                label: item.label,
                wins: wins[item.id]
            };
        });
    }

    function findNextPendingIndex() {
        for (var i = 0; i < state.comparisonOrder.length; i++) {
            var pair = state.comparisonOrder[i];
            var key = getComparisonKey(pair[0], pair[1]);
            if (!state.comparisons[key]) {
                return i;
            }
        }
        return -1;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ========================================
    // Storage
    // ========================================

    function loadSavedMatrices() {
        try {
            var data = localStorage.getItem('pairwise-matrices');
            savedMatrices = data ? JSON.parse(data) : [];
        } catch (e) {
            savedMatrices = [];
        }
        renderSavedList();
    }

    function saveSavedMatrices() {
        try {
            localStorage.setItem('pairwise-matrices', JSON.stringify(savedMatrices));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    function saveCurrentMatrix() {
        if (!state.id) {
            state.id = generateId();
        }

        var matrix = {
            id: state.id,
            context: state.context,
            items: state.items,
            comparisons: state.comparisons,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        var existingIndex = savedMatrices.findIndex(function(m) {
            return m.id === state.id;
        });

        if (existingIndex >= 0) {
            matrix.createdAt = savedMatrices[existingIndex].createdAt;
            savedMatrices[existingIndex] = matrix;
        } else {
            savedMatrices.unshift(matrix);
        }

        saveSavedMatrices();
        renderSavedList();

        showToast('Matrix saved');
    }

    function loadMatrix(matrix) {
        state.id = matrix.id;
        state.context = matrix.context || '';
        state.items = matrix.items || [];
        state.comparisons = matrix.comparisons || {};
        state.comparisonOrder = buildComparisonOrder(state.items);

        contextInput.value = state.context;

        var allDone = state.comparisonOrder.every(function(pair) {
            var key = getComparisonKey(pair[0], pair[1]);
            return state.comparisons[key];
        });

        if (allDone) {
            state.phase = 'results';
            state.currentIndex = state.comparisonOrder.length;
            showResults();
        } else {
            state.currentIndex = findNextPendingIndex();
            state.phase = 'comparing';
            showComparison();
        }
    }

    function deleteMatrix(id) {
        savedMatrices = savedMatrices.filter(function(m) {
            return m.id !== id;
        });
        saveSavedMatrices();
        renderSavedList();
    }

    // ========================================
    // Modal
    // ========================================

    function showModal(options) {
        var previouslyFocused = document.activeElement;

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        var modal = document.createElement('div');
        modal.className = 'modal-dialog';
        modal.setAttribute('role', 'alertdialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');

        var title = document.createElement('h3');
        title.id = 'modal-title';
        title.className = 'modal-title';
        title.textContent = options.title || 'Confirm';

        var message = document.createElement('p');
        message.className = 'modal-message';
        message.textContent = options.message || '';

        var actions = document.createElement('div');
        actions.className = 'modal-actions';

        var modalCancelBtn = document.createElement('button');
        modalCancelBtn.className = 'modal-btn modal-btn-cancel';
        modalCancelBtn.textContent = options.cancelText || 'Cancel';

        var confirmBtn = document.createElement('button');
        confirmBtn.className = 'modal-btn modal-btn-confirm' + (options.danger ? ' modal-btn-danger' : '');
        confirmBtn.textContent = options.confirmText || 'Confirm';

        actions.appendChild(modalCancelBtn);
        actions.appendChild(confirmBtn);
        modal.appendChild(title);
        modal.appendChild(message);
        modal.appendChild(actions);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Focus confirm for normal, cancel for danger actions
        (options.danger ? modalCancelBtn : confirmBtn).focus();

        function close() {
            overlay.remove();
            document.removeEventListener('keydown', handleKeydown);
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') {
                close();
                if (options.onCancel) options.onCancel();
            }
            if (e.key === 'Tab') {
                var focused = document.activeElement;
                if (e.shiftKey && focused === modalCancelBtn) {
                    e.preventDefault();
                    confirmBtn.focus();
                } else if (!e.shiftKey && focused === confirmBtn) {
                    e.preventDefault();
                    modalCancelBtn.focus();
                }
            }
        }

        modalCancelBtn.addEventListener('click', function() {
            close();
            if (options.onCancel) options.onCancel();
        });

        confirmBtn.addEventListener('click', function() {
            close();
            if (options.onConfirm) options.onConfirm();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                close();
                if (options.onCancel) options.onCancel();
            }
        });

        document.addEventListener('keydown', handleKeydown);
    }

    // ========================================
    // UI Rendering
    // ========================================

    function showPhase(phase) {
        state.phase = phase;

        setupSection.style.display = (phase === 'setup') ? 'block' : 'none';
        comparisonSection.classList.toggle('visible', phase === 'comparing');
        comparingBottom.style.display = (phase === 'comparing' || phase === 'results') ? 'grid' : 'none';
        matrixSection.classList.toggle('visible', phase === 'comparing' || phase === 'results');
        resultsSection.classList.toggle('visible', phase === 'comparing' || phase === 'results');

        if (phase === 'setup') {
            savedSection.style.display = 'block';
        } else {
            savedSection.style.display = 'none';
        }
    }

    // ========================================
    // Dynamic Item Inputs
    // ========================================

    function renderItemInputs(count, labels) {
        itemsGrid.innerHTML = '';
        state.items = [];

        count = count || INITIAL_ITEM_COUNT;
        for (var i = 0; i < count; i++) {
            addItemRow((labels && labels[i]) ? labels[i] : '');
        }
        updateStartButton();
        updateComparisonEstimate();
    }

    function addItemRow(label) {
        if (state.items.length >= MAX_ITEMS) return null;

        var index = state.items.length;
        var id = getLetter(index);
        state.items.push({ id: id, label: label || '' });

        var row = document.createElement('div');
        row.className = 'item-input-row';
        row.dataset.index = index;

        var letter = document.createElement('span');
        letter.className = 'item-letter';
        letter.textContent = id;

        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Item ' + id;
        input.dataset.index = index;
        input.value = label || '';
        input.addEventListener('input', handleItemInput);
        input.addEventListener('keydown', handleItemKeydown);

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'item-remove-btn';
        removeBtn.tabIndex = -1;
        removeBtn.title = 'Remove item';
        removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        removeBtn.addEventListener('click', function() {
            removeItemRow(parseInt(row.dataset.index));
        });

        row.appendChild(letter);
        row.appendChild(input);
        row.appendChild(removeBtn);
        itemsGrid.appendChild(row);

        updateStartButton();
        updateComparisonEstimate();

        return input;
    }

    function removeItemRow(index) {
        if (state.items.length <= MIN_ITEMS) return;

        state.items.splice(index, 1);

        // Re-assign IDs sequentially
        state.items.forEach(function(item, i) {
            item.id = getLetter(i);
        });

        // Re-render preserving values
        var labels = state.items.map(function(item) { return item.label; });
        itemsGrid.innerHTML = '';
        state.items = [];
        labels.forEach(function(label) {
            addItemRow(label);
        });

        updateStartButton();
        updateComparisonEstimate();
    }

    function handleItemInput(e) {
        var index = parseInt(e.target.dataset.index);
        state.items[index].label = e.target.value.trim();
        updateStartButton();
        updateComparisonEstimate();
    }

    function handleItemKeydown(e) {
        var index = parseInt(this.dataset.index);

        if (e.key === 'Tab' && !e.shiftKey) {
            // Last input with content: add a new row
            if (index === state.items.length - 1 && this.value.trim()) {
                e.preventDefault();
                var newInput = addItemRow('');
                if (newInput) newInput.focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            var nextInput = itemsGrid.querySelector('input[data-index="' + (index + 1) + '"]');
            if (nextInput) {
                nextInput.focus();
            } else if (canStart()) {
                startComparing();
            }
        } else if (e.key === 'Backspace' && this.value === '' && state.items.length > MIN_ITEMS) {
            e.preventDefault();
            var prevInput = itemsGrid.querySelector('input[data-index="' + (index - 1) + '"]');
            removeItemRow(index);
            if (prevInput) prevInput.focus();
        }
    }

    function canStart() {
        var filledCount = state.items.filter(function(item) {
            return item.label.length > 0;
        }).length;
        return filledCount >= MIN_ITEMS;
    }

    function updateStartButton() {
        startBtn.disabled = !canStart();
    }

    function updateComparisonEstimate() {
        var filledCount = state.items.filter(function(item) {
            return item.label.length > 0;
        }).length;

        if (filledCount >= 2) {
            var total = calculateTotalComparisons(filledCount);
            comparisonEstimate.textContent = total + ' comparison' + (total !== 1 ? 's' : '');
        } else {
            comparisonEstimate.textContent = '';
        }
    }

    // ========================================
    // Comparing
    // ========================================

    function startComparing() {
        if (!canStart()) return;

        // Filter to only items with labels, re-assign IDs
        state.items = state.items.filter(function(item) {
            return item.label.trim().length > 0;
        });
        state.items.forEach(function(item, i) {
            item.id = getLetter(i);
        });

        state.context = contextInput.value.trim();
        state.comparisons = {};
        state.comparisonOrder = buildComparisonOrder(state.items);
        state.currentIndex = 0;
        state.id = null;

        showComparison();
    }

    function showComparison() {
        showPhase('comparing');

        var total = state.comparisonOrder.length;
        totalComparisonsEl.textContent = total;

        updateComparisonUI();
        renderMatrix();
        updateLiveResults();
    }

    function updateComparisonUI() {
        var total = state.comparisonOrder.length;
        var completedCount = Object.keys(state.comparisons).length;

        currentComparisonEl.textContent = Math.min(completedCount + 1, total);
        progressFill.style.width = ((completedCount / total) * 100) + '%';

        if (state.currentIndex >= total) {
            showResults();
            return;
        }

        var pair = state.comparisonOrder[state.currentIndex];
        var itemA = state.items.find(function(i) { return i.id === pair[0]; });
        var itemB = state.items.find(function(i) { return i.id === pair[1]; });

        cardALetter.textContent = itemA.id;
        cardALabel.textContent = itemA.label;
        cardBLetter.textContent = itemB.id;
        cardBLabel.textContent = itemB.label;

        if (state.context) {
            comparisonPrompt.textContent = state.context;
        } else {
            comparisonPrompt.textContent = 'Which is more important?';
        }

        undoBtn.disabled = Object.keys(state.comparisons).length === 0;
    }

    function pickWinner(winnerId) {
        if (state.currentIndex >= state.comparisonOrder.length) return;

        var pair = state.comparisonOrder[state.currentIndex];
        var key = getComparisonKey(pair[0], pair[1]);
        state.comparisons[key] = winnerId;

        // Find next uncompleted comparison
        var nextIndex = findNextPendingIndex();

        renderMatrix();
        updateLiveResults();

        if (nextIndex === -1) {
            state.currentIndex = state.comparisonOrder.length;
            showResults();
        } else {
            state.currentIndex = nextIndex;
            updateComparisonUI();
        }
    }

    function undoComparison() {
        // Find the most recently completed comparison
        var lastCompletedIndex = -1;
        for (var i = state.comparisonOrder.length - 1; i >= 0; i--) {
            var pair = state.comparisonOrder[i];
            var key = getComparisonKey(pair[0], pair[1]);
            if (state.comparisons[key]) {
                lastCompletedIndex = i;
                break;
            }
        }

        if (lastCompletedIndex === -1) return;

        var pair = state.comparisonOrder[lastCompletedIndex];
        var key = getComparisonKey(pair[0], pair[1]);
        delete state.comparisons[key];

        state.currentIndex = lastCompletedIndex;

        renderMatrix();
        updateLiveResults();
        updateComparisonUI();
    }

    // ========================================
    // Live Results
    // ========================================

    function updateLiveResults() {
        var ranked = getRankedItems(state.items, state.comparisons);
        var totalComparisons = state.comparisonOrder.length;
        var completedCount = Object.keys(state.comparisons).length;

        if (state.context) {
            resultsTitle.textContent = state.context;
        } else {
            resultsTitle.textContent = 'Rankings';
        }

        var html = '';
        ranked.forEach(function(item, index) {
            html += '<li>';
            html += '<span class="results-rank">' + (index + 1) + '</span>';
            html += '<span class="results-item-name">' + escapeHtml(item.label) + '</span>';
            html += '<span class="results-wins">' + item.wins + '</span>';
            html += '</li>';
        });
        resultsList.innerHTML = html;

        // Show export actions only when all comparisons are done
        var allDone = completedCount >= totalComparisons;
        if (resultsActions) {
            resultsActions.style.display = allDone ? 'flex' : 'none';
        }
    }

    // ========================================
    // Matrix Rendering
    // ========================================

    function renderMatrix() {
        var wins = calculateWins(state.items, state.comparisons);
        var ranked = getRankedItems(state.items, state.comparisons);
        var n = state.items.length;

        // Build rank lookup (1-based, ties get same rank)
        var rankOf = {};
        ranked.forEach(function(item, i) {
            if (i === 0 || item.wins !== ranked[i - 1].wins) {
                rankOf[item.id] = i + 1;
            } else {
                rankOf[item.id] = rankOf[ranked[i - 1].id];
            }
        });

        var html = '<table class="matrix-table">';

        // Data rows: diagonal letter, lower triangle comparisons, item label
        state.items.forEach(function(rowItem, rowIndex) {
            html += '<tr>';

            for (var colIndex = 0; colIndex < n; colIndex++) {
                if (colIndex < rowIndex) {
                    // Lower triangle: comparison result
                    var colItem = state.items[colIndex];
                    var key = getComparisonKey(rowItem.id, colItem.id);
                    var winner = state.comparisons[key];
                    if (winner) {
                        html += '<td class="winner" data-key="' + key + '" data-a="' + colItem.id + '" data-b="' + rowItem.id + '">' + winner + '</td>';
                    } else {
                        html += '<td class="pending" data-key="' + key + '" data-a="' + colItem.id + '" data-b="' + rowItem.id + '">?</td>';
                    }
                } else if (colIndex === rowIndex) {
                    // Diagonal: letter ID
                    html += '<td class="diagonal">' + rowItem.id + '</td>';
                } else {
                    // Upper triangle: empty
                    html += '<td class="empty"></td>';
                }
            }

            html += '<td class="item-label" title="' + escapeHtml(rowItem.label) + '">' + escapeHtml(rowItem.label) + '</td>';
            html += '</tr>';
        });

        // Column letters row
        html += '<tr class="footer-row">';
        for (var c = 0; c < n; c++) {
            html += '<td class="footer-letter">' + state.items[c].id + '</td>';
        }
        html += '<td class="footer-label">Item</td>';
        html += '</tr>';

        // Count (wins) row
        html += '<tr class="footer-row">';
        for (var c = 0; c < n; c++) {
            html += '<td class="footer-count">' + wins[state.items[c].id] + '</td>';
        }
        html += '<td class="footer-label">Count</td>';
        html += '</tr>';

        // Rank row
        html += '<tr class="footer-row">';
        for (var c = 0; c < n; c++) {
            html += '<td class="footer-rank">' + rankOf[state.items[c].id] + '</td>';
        }
        html += '<td class="footer-label">Rank</td>';
        html += '</tr>';

        html += '</table>';
        matrixContainer.innerHTML = html;

        // Add click handlers for pending cells (to jump to that comparison)
        matrixContainer.querySelectorAll('.pending[data-key]').forEach(function(cell) {
            cell.addEventListener('click', function() {
                var key = this.dataset.key;
                var index = state.comparisonOrder.findIndex(function(pair) {
                    return getComparisonKey(pair[0], pair[1]) === key;
                });
                if (index >= 0) {
                    state.currentIndex = index;

                    if (state.phase === 'results') {
                        state.phase = 'comparing';
                        showComparison();
                    } else {
                        updateComparisonUI();
                    }
                }
            });
        });

        // Add click handlers for winner cells (to re-decide that comparison)
        matrixContainer.querySelectorAll('.winner[data-key]').forEach(function(cell) {
            cell.addEventListener('click', function() {
                var key = this.dataset.key;

                // Clear the existing result
                delete state.comparisons[key];

                // Find the next uncompleted comparison (which includes the one we just cleared)
                var nextIndex = findNextPendingIndex();

                if (nextIndex === -1) {
                    showResults();
                    return;
                }

                state.currentIndex = nextIndex;

                if (state.phase === 'results') {
                    state.phase = 'comparing';
                    showComparison();
                } else {
                    renderMatrix();
                    updateLiveResults();
                    updateComparisonUI();
                }
            });
        });
    }

    // ========================================
    // Results
    // ========================================

    function showResults() {
        showPhase('results');
        updateLiveResults();
        renderMatrix();
    }

    // ========================================
    // Saved List
    // ========================================

    function renderSavedList() {
        if (savedMatrices.length === 0) {
            savedList.innerHTML = '<p class="no-saved">No saved matrices yet.</p>';
            return;
        }

        var html = '';
        savedMatrices.forEach(function(matrix) {
            var date = new Date(matrix.updatedAt || matrix.createdAt);
            var dateStr = date.toLocaleDateString();
            var itemCount = matrix.items ? matrix.items.length : 0;

            html += '<div class="saved-item" data-id="' + matrix.id + '">';
            html += '<div class="saved-item-info">';
            html += '<div class="saved-item-context">' + escapeHtml(matrix.context || 'Untitled') + '</div>';
            html += '<div class="saved-item-meta">' + itemCount + ' items &middot; ' + dateStr + '</div>';
            html += '</div>';
            html += '<button class="saved-item-delete" data-id="' + matrix.id + '" title="Delete">';
            html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
            html += '</button>';
            html += '</div>';
        });
        savedList.innerHTML = html;

        // Add click handlers
        savedList.querySelectorAll('.saved-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (e.target.closest('.saved-item-delete')) return;
                var id = this.dataset.id;
                var matrix = savedMatrices.find(function(m) { return m.id === id; });
                if (matrix) {
                    loadMatrix(matrix);
                }
            });
        });

        savedList.querySelectorAll('.saved-item-delete').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.dataset.id;
                showModal({
                    title: 'Delete matrix?',
                    message: 'This cannot be undone.',
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    danger: true,
                    onConfirm: function() { deleteMatrix(id); }
                });
            });
        });
    }

    // ========================================
    // Export Functions
    // ========================================

    function getResultsText() {
        var ranked = getRankedItems(state.items, state.comparisons);
        var total = state.comparisonOrder.length;

        var lines = [];
        if (state.context) {
            lines.push(state.context);
            lines.push('');
        }

        ranked.forEach(function(item, index) {
            lines.push((index + 1) + '. ' + item.label + ' (' + item.wins + '/' + total + ' wins)');
        });

        return lines.join('\n');
    }

    function getResultsMarkdown() {
        var ranked = getRankedItems(state.items, state.comparisons);
        var total = state.comparisonOrder.length;

        var lines = [];
        if (state.context) {
            lines.push('# ' + state.context);
            lines.push('');
        }

        lines.push('## Results');
        lines.push('');

        ranked.forEach(function(item, index) {
            lines.push((index + 1) + '. **' + item.label + '** (' + item.wins + '/' + total + ' wins)');
        });

        lines.push('');
        lines.push('## Comparison Matrix');
        lines.push('');

        // Build markdown table
        var headerRow = '| |';
        var separatorRow = '|---|';
        state.items.forEach(function(item) {
            headerRow += ' ' + item.id + ' |';
            separatorRow += ':---:|';
        });
        headerRow += ' Wins |';
        separatorRow += ':---:|';

        lines.push(headerRow);
        lines.push(separatorRow);

        var wins = calculateWins(state.items, state.comparisons);

        state.items.forEach(function(rowItem) {
            var row = '| ' + rowItem.id + ': ' + rowItem.label + ' |';
            state.items.forEach(function(colItem) {
                if (rowItem.id === colItem.id) {
                    row += ' - |';
                } else {
                    var key = getComparisonKey(rowItem.id, colItem.id);
                    var winner = state.comparisons[key] || '?';
                    row += ' ' + winner + ' |';
                }
            });
            row += ' ' + wins[rowItem.id] + ' |';
            lines.push(row);
        });

        lines.push('');
        lines.push('---');
        lines.push('*Generated with [Pairwise Matrix](https://blakeeboyd.github.io/projects/pairwise-matrix/)*');

        return lines.join('\n');
    }

    function getResultsJson() {
        return JSON.stringify({
            version: 1,
            type: 'pairwise-matrix',
            context: state.context,
            items: state.items,
            comparisons: state.comparisons,
            results: getRankedItems(state.items, state.comparisons),
            exportedAt: new Date().toISOString()
        }, null, 2);
    }

    // ========================================
    // URL Sharing
    // ========================================

    function encodeStateToUrl() {
        var data = {
            c: state.context,
            i: state.items.map(function(item) { return item.label; }),
            r: state.comparisons
        };

        var jsonStr = JSON.stringify(data);
        var encoded = btoa(unescape(encodeURIComponent(jsonStr)));

        return window.location.origin + window.location.pathname + '#share=' + encoded;
    }

    function decodeStateFromUrl() {
        var hash = window.location.hash;
        if (!hash.startsWith('#share=')) return null;

        try {
            var encoded = hash.substring(7);
            var jsonStr = decodeURIComponent(escape(atob(encoded)));
            var data = JSON.parse(jsonStr);

            if (!data.i || !Array.isArray(data.i) || data.i.length < 2) {
                return null;
            }

            var items = data.i.map(function(label, index) {
                return { id: getLetter(index), label: label };
            });

            return {
                context: data.c || '',
                items: items,
                comparisons: data.r || {}
            };
        } catch (e) {
            console.warn('Failed to decode shared URL:', e);
            return null;
        }
    }

    function shareViaUrl() {
        var url = encodeStateToUrl();

        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function() {
                showToast('Share link copied to clipboard');
            }).catch(function() {
                promptShareUrl(url);
            });
        } else {
            promptShareUrl(url);
        }
    }

    function promptShareUrl(url) {
        var input = document.createElement('input');
        input.value = url;
        input.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;max-width:500px;padding:12px;font-size:14px;border:1px solid var(--color-border);border-radius:6px;z-index:1001;';

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;';

        overlay.addEventListener('click', function() {
            overlay.remove();
            input.remove();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(input);
        input.select();
        showToast('Copy the URL to share');
    }

    function loadFromSharedUrl() {
        var shared = decodeStateFromUrl();
        if (!shared) return false;

        state.id = null;
        state.context = shared.context;
        state.items = shared.items;
        state.comparisons = shared.comparisons;
        state.comparisonOrder = buildComparisonOrder(state.items);

        var allDone = state.comparisonOrder.every(function(pair) {
            var key = getComparisonKey(pair[0], pair[1]);
            return state.comparisons[key];
        });

        if (allDone) {
            state.phase = 'results';
            state.currentIndex = state.comparisonOrder.length;
            showResults();
        } else {
            state.currentIndex = findNextPendingIndex();
            state.phase = 'comparing';
            showComparison();
        }

        history.replaceState(null, '', window.location.pathname);

        showToast('Loaded shared matrix');
        return true;
    }

    function downloadFile(content, filename, type) {
        var blob = new Blob([content], { type: type });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                showToast('Copied to clipboard');
            }).catch(function() {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard');
        } catch (e) {
            showToast('Failed to copy');
        }
        document.body.removeChild(textarea);
    }

    function showToast(message) {
        var existing = document.querySelector('.toast');
        if (existing) {
            existing.remove();
        }

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:0.75rem 1.25rem;border-radius:6px;font-size:0.875rem;z-index:1000;animation:fadeIn 0.2s ease;';
        document.body.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.2s';
            setTimeout(function() {
                toast.remove();
            }, 200);
        }, 2000);
    }

    // ========================================
    // Import
    // ========================================

    function importFromFile(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result;

            try {
                var data = JSON.parse(content);
                if (data.type === 'pairwise-matrix' && data.items) {
                    loadMatrix({
                        id: generateId(),
                        context: data.context || '',
                        items: data.items,
                        comparisons: data.comparisons || {},
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                    showToast('Matrix imported');
                    return;
                }
            } catch (err) {
                // Not JSON, try markdown parsing
            }

            // Try to parse markdown
            var lines = content.split('\n');
            var items = [];
            var contextLine = '';

            lines.forEach(function(line) {
                var headingMatch = line.match(/^#\s+(.+)/);
                if (headingMatch && !contextLine) {
                    contextLine = headingMatch[1];
                    return;
                }

                var listMatch = line.match(/^\d+\.\s+\*?\*?(.+?)\*?\*?\s*\(/);
                if (listMatch) {
                    items.push(listMatch[1].trim());
                }
            });

            if (items.length >= 2) {
                state.context = contextLine;
                state.items = items.map(function(label, i) {
                    return { id: getLetter(i), label: label };
                });
                state.comparisons = {};
                state.comparisonOrder = buildComparisonOrder(state.items);
                state.currentIndex = 0;
                state.id = null;

                contextInput.value = state.context;
                showComparison();
                showToast('Items imported - comparisons reset');
            } else {
                showToast('Could not parse file');
            }
        };
        reader.readAsText(file);
    }

    // ========================================
    // Event Handlers
    // ========================================

    addItemBtn.addEventListener('click', function() {
        var newInput = addItemRow('');
        if (newInput) newInput.focus();
    });

    startBtn.addEventListener('click', startComparing);

    cardA.addEventListener('click', function() {
        var pair = state.comparisonOrder[state.currentIndex];
        if (pair) pickWinner(pair[0]);
    });

    cardB.addEventListener('click', function() {
        var pair = state.comparisonOrder[state.currentIndex];
        if (pair) pickWinner(pair[1]);
    });

    undoBtn.addEventListener('click', undoComparison);

    cancelBtn.addEventListener('click', function() {
        showModal({
            title: 'Cancel comparison?',
            message: 'Your progress will be lost.',
            confirmText: 'Cancel Comparison',
            cancelText: 'Keep Going',
            danger: true,
            onConfirm: resetToSetup
        });
    });

    toggleMatrixBtn.addEventListener('click', function() {
        var isVisible = matrixContainer.style.display !== 'none';
        matrixContainer.style.display = isVisible ? 'none' : 'block';
        toggleMatrixBtn.textContent = isVisible ? 'Show' : 'Hide';
    });

    copyBtn.addEventListener('click', function() {
        copyToClipboard(getResultsText());
    });

    exportMdBtn.addEventListener('click', function() {
        var filename = (state.context || 'pairwise-matrix').replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.md';
        downloadFile(getResultsMarkdown(), filename, 'text/markdown');
    });

    exportJsonBtn.addEventListener('click', function() {
        var filename = (state.context || 'pairwise-matrix').replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.json';
        downloadFile(getResultsJson(), filename, 'application/json');
    });

    printBtn.addEventListener('click', function() {
        window.print();
    });

    saveBtn.addEventListener('click', saveCurrentMatrix);

    newBtn.addEventListener('click', function() {
        showModal({
            title: 'Start new matrix?',
            message: 'This will clear the current matrix.',
            confirmText: 'Start New',
            cancelText: 'Keep Current',
            onConfirm: resetToSetup
        });
    });

    importBtn.addEventListener('click', function() {
        importFile.click();
    });

    importFile.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            importFromFile(e.target.files[0]);
            e.target.value = '';
        }
    });

    shareBtn.addEventListener('click', shareViaUrl);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (state.phase !== 'comparing') return;

        // Ignore if typing in an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Ignore if a modal is open
        if (document.querySelector('.modal-overlay')) return;

        var pair = state.comparisonOrder[state.currentIndex];
        if (!pair) return;

        if (e.key === '1' || e.key === 'ArrowLeft') {
            e.preventDefault();
            pickWinner(pair[0]);
        } else if (e.key === '2' || e.key === 'ArrowRight') {
            e.preventDefault();
            pickWinner(pair[1]);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            undoComparison();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelBtn.click();
        }
    });

    // ========================================
    // Initialize
    // ========================================

    function resetToSetup() {
        state = {
            id: null,
            context: '',
            items: [],
            comparisons: {},
            comparisonOrder: [],
            currentIndex: 0,
            phase: 'setup'
        };

        contextInput.value = '';

        showPhase('setup');
        renderItemInputs(INITIAL_ITEM_COUNT);
        loadSavedMatrices();
    }

    function init() {
        // Check for shared URL first
        if (loadFromSharedUrl()) {
            return;
        }

        showPhase('setup');
        renderItemInputs(INITIAL_ITEM_COUNT);
        loadSavedMatrices();

        // Focus context input on load
        contextInput.focus();
    }

    init();
})();
