/**
 * PechaKucha Player
 * A web-based presentation player with automatic slide timing
 */

(function() {
    'use strict';

    // State
    let images = [];           // Array of { name, dataUrl, notes, duration }
    let titleSlide = null;     // { name, dataUrl, notes } | null (always a copy)
    let currentIndex = 0;
    let slideTimer = null;
    let progressTimer = null;
    let slideStartTime = null;
    let isPaused = false;
    let pausedTimeRemaining = 0;
    let pausedElapsedOnSlide = 0;  // Time elapsed on current slide when paused (ms)
    let currentSlideDuration = 0;  // Remaining duration for current slide timer (in ms)
    let fullSlideDuration = 0;     // Total duration for current slide (in ms)
    let presentationStartTime = null;
    let draggedIndex = null;   // For drag-and-drop reordering
    let insertPosition = null; // 'before' or 'after' relative to hovered thumbnail
    let insertIndicator = null; // Floating indicator element
    let hoveredIndex = null;   // Currently hovered thumbnail index
    let selectedIndex = null;  // Currently selected thumbnail index
    let undoStack = [];        // Stack of undoable actions: { type, ...data }
    let toastTimer = null;     // Timer for auto-hiding toast

    // External presentation state
    let presentationWindow = null;
    let windowCheckTimer = null;
    let isExternalPresentation = false;

    // Settings (will be read from inputs)
    let slideDuration = 20;    // Seconds per slide (global default)

    // DOM Elements
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const slideshowSection = document.getElementById('slideshow-section');
    const completeSection = document.getElementById('complete-section');

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const DEFAULT_SLIDE_DURATION = 20;

    const slideNotice = document.getElementById('slide-notice');
    const thumbnails = document.getElementById('thumbnails');
    const startBtn = document.getElementById('start-btn');
    const startFromBtn = document.getElementById('start-from-btn');
    const resetBtn = document.getElementById('reset-btn');

    const currentSlide = document.getElementById('current-slide');
    const slideCounter = document.getElementById('slide-counter');
    const progressFill = document.getElementById('progress-fill');
    const slideTimerDisplay = document.getElementById('slide-timer');
    const elapsedTimeDisplay = document.getElementById('elapsed-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const pauseIndicator = document.getElementById('pause-indicator');

    const finalSlideCount = document.getElementById('final-slide-count');
    const finalDuration = document.getElementById('final-duration');
    const restartBtn = document.getElementById('restart-btn');
    const newBtn = document.getElementById('new-btn');

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    const undoToast = document.getElementById('undo-toast');
    const toastShortcut = document.getElementById('toast-shortcut');
    const toastUndoBtn = document.getElementById('toast-undo-btn');

    // External presentation elements
    const modePresentRadio = document.getElementById('mode-present');
    const presenterSection = document.getElementById('presenter-section');
    const presenterCurrentImg = document.getElementById('presenter-current-img');
    const presenterNextImg = document.getElementById('presenter-next-img');
    const presenterNextPlaceholder = document.getElementById('presenter-next-placeholder');
    const presenterTime = document.getElementById('presenter-time');
    const presenterCounter = document.getElementById('presenter-counter');
    const presenterEndBtn = document.getElementById('presenter-end-btn');
    const presenterStartBtn = document.getElementById('presenter-start-btn');
    const presenterPauseBtn = document.getElementById('presenter-pause-btn');
    const presenterSkipBtn = document.getElementById('presenter-skip-btn');
    const presenterGridBtn = document.getElementById('presenter-grid-btn');
    const presenterGridOverlay = document.getElementById('presenter-grid-overlay');
    const presenterGrid = document.getElementById('presenter-grid');
    const presenterGridClose = document.getElementById('presenter-grid-close');

    // Notes elements
    const notesPanel = document.getElementById('notes-panel');
    const notesSlideNumber = document.getElementById('notes-slide-number');
    const notesInput = document.getElementById('notes-input');
    const notesCloseBtn = document.getElementById('notes-close-btn');
    const slideDurationOverride = document.getElementById('slide-duration-override');
    const presenterNotesInput = document.getElementById('presenter-notes-input');
    const presenterExportBtn = document.getElementById('presenter-export-btn');

    // Title slide elements
    const titleSlideSlot = document.getElementById('title-slide-slot');
    const titleSlotHint = document.getElementById('title-slot-hint');
    const titleSlideImg = document.getElementById('title-slide-img');
    const titleSlideRemove = document.getElementById('title-slide-remove');
    const setTitleBtn = document.getElementById('set-title-btn');

    // Export/Import elements
    const exportBtn = document.getElementById('export-btn');
    const importInput = document.getElementById('import-input');

    // Presenter progress bar
    const presenterProgressFill = document.getElementById('presenter-progress-fill');

    // Close window button
    const presenterCloseWindowBtn = document.getElementById('presenter-close-window-btn');

    // Elapsed/total time
    const presenterElapsed = document.getElementById('presenter-elapsed');
    const presenterTotal = document.getElementById('presenter-total');

    // Filmstrip for slide navigation
    const presenterFilmstrip = document.getElementById('presenter-filmstrip');

    // Timer overlay elements (practice mode)
    const showTimerOverlayCheckbox = document.getElementById('show-timer-overlay');
    const timerOverlay = document.getElementById('timer-overlay');
    const timerOverlayValue = document.getElementById('timer-overlay-value');
    const timerTogglePractice = document.getElementById('timer-toggle-practice');

    // Navigation arrows (practice mode)
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');

    // Completion screen buttons
    const editBtn = document.getElementById('edit-btn');

    // Image display mode
    const displayFitRadio = document.getElementById('display-fit');
    const displayFillRadio = document.getElementById('display-fill');

    // Natural sort comparison for filenames
    function naturalSort(a, b) {
        return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    }

    // Format seconds as M:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Get duration for a specific slide (per-slide override or global default)
    function getSlideDuration(index) {
        const slide = images[index];
        return (slide && slide.duration > 0) ? slide.duration : slideDuration;
    }

    // Calculate total presentation time (sum of all slide durations)
    function calculateTotalTime() {
        return images.reduce((sum, img, i) => sum + getSlideDuration(i), 0);
    }

    // Handle file selection (initial upload, replaces images array)
    function handleFiles(fileList) {
        const files = Array.from(fileList);

        // Check for JSON configuration file
        const jsonFile = files.find(f =>
            f.type === 'application/json' || f.name.endsWith('.json')
        );

        if (jsonFile) {
            importConfiguration(jsonFile);
            return;
        }

        // Filter to valid image files only
        const imageFiles = files.filter(file =>
            file.type.startsWith('image/')
        );

        if (imageFiles.length === 0) {
            return;
        }

        // Set default slide duration
        slideDuration = DEFAULT_SLIDE_DURATION;

        // Process each file
        images = [];
        let loaded = 0;

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                images.push({
                    name: file.name,
                    dataUrl: e.target.result,
                    notes: '',
                    duration: null  // null = use global default
                });
                loaded++;

                if (loaded === imageFiles.length) {
                    // All files loaded, sort and show preview
                    images.sort(naturalSort);
                    showPreview();
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Handle adding more files (appends to existing images, no auto-sort)
    function handleAddMoreFiles(fileList) {
        const imageFiles = Array.from(fileList).filter(file =>
            file.type.startsWith('image/')
        );

        if (imageFiles.length === 0) {
            return;
        }

        let loaded = 0;
        const newImages = [];

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                newImages.push({
                    name: file.name,
                    dataUrl: e.target.result,
                    notes: ''
                });
                loaded++;

                if (loaded === imageFiles.length) {
                    // Sort new images by filename, then append
                    newImages.sort(naturalSort);
                    images = images.concat(newImages);
                    showPreview();
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Show preview section with thumbnails
    function showPreview() {
        uploadSection.hidden = true;
        previewSection.hidden = false;
        completeSection.hidden = true;

        // Update slide count notice
        const count = images.length;
        slideNotice.textContent = `${count} slide${count !== 1 ? 's' : ''} ready`;
        slideNotice.classList.remove('warning');

        // Render thumbnails
        thumbnails.innerHTML = '';

        images.forEach((img, index) => {
            const thumb = document.createElement('div');
            let classes = 'pk-thumbnail';
            if (img.notes) classes += ' has-notes';
            if (img.duration) classes += ' has-custom-duration';
            thumb.className = classes;
            thumb.draggable = true;
            thumb.dataset.index = index;
            thumb.innerHTML = `
                <img src="${img.dataUrl}" alt="Slide ${index + 1}">
                <span class="pk-thumbnail-number">${index + 1}</span>
                <button class="pk-thumbnail-action pk-thumbnail-preview" aria-label="Preview slide ${index + 1}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button class="pk-thumbnail-action pk-thumbnail-delete" aria-label="Remove slide ${index + 1}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            // Preview button click handler
            const previewBtn = thumb.querySelector('.pk-thumbnail-preview');
            previewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showLightbox(index);
            });

            // Delete button click handler
            const deleteBtn = thumb.querySelector('.pk-thumbnail-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteImage(index);
            });

            // Click to select
            thumb.addEventListener('click', () => {
                selectThumbnail(index);
            });

            // Drag events for reordering
            thumb.addEventListener('dragstart', handleDragStart);
            thumb.addEventListener('dragover', handleDragOver);
            thumb.addEventListener('dragleave', handleDragLeave);
            thumb.addEventListener('drop', handleDrop);
            thumb.addEventListener('dragend', handleDragEnd);

            thumbnails.appendChild(thumb);
        });

        // Restore selection if it exists
        if (selectedIndex !== null && selectedIndex < images.length) {
            const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
            allThumbs[selectedIndex].classList.add('selected');
            updateStartFromButton();
        }

        // Add "Add More" card
        const addMoreCard = document.createElement('div');
        addMoreCard.className = 'pk-add-more';
        addMoreCard.innerHTML = `
            <svg class="pk-add-more-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <p class="pk-add-more-text">Add more</p>
        `;

        // Hidden file input for add more
        const addMoreInput = document.createElement('input');
        addMoreInput.type = 'file';
        addMoreInput.multiple = true;
        addMoreInput.accept = 'image/*';
        addMoreInput.style.display = 'none';
        addMoreInput.addEventListener('change', (e) => {
            handleAddMoreFiles(e.target.files);
        });
        addMoreCard.appendChild(addMoreInput);

        // Click to upload more
        addMoreCard.addEventListener('click', () => {
            addMoreInput.click();
        });

        // Drag and drop to upload more
        addMoreCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            addMoreCard.classList.add('dragover');
        });
        addMoreCard.addEventListener('dragleave', () => {
            addMoreCard.classList.remove('dragover');
        });
        addMoreCard.addEventListener('drop', (e) => {
            e.preventDefault();
            addMoreCard.classList.remove('dragover');
            // Only handle file drops, not thumbnail reordering
            if (e.dataTransfer.files.length > 0) {
                handleAddMoreFiles(e.dataTransfer.files);
            }
        });

        thumbnails.appendChild(addMoreCard);

        // Create floating insert indicator
        insertIndicator = document.createElement('div');
        insertIndicator.className = 'pk-insert-indicator';
        thumbnails.appendChild(insertIndicator);

        // Add grid-level drag handlers for drops in gaps
        thumbnails.addEventListener('dragover', handleGridDragOver);
        thumbnails.addEventListener('drop', handleGridDrop);

        // Click on empty space to deselect
        thumbnails.addEventListener('click', (e) => {
            if (e.target === thumbnails) {
                deselectThumbnail();
            }
        });
    }

    // Deselect the current thumbnail
    function deselectThumbnail() {
        if (selectedIndex !== null) {
            const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
            if (allThumbs[selectedIndex]) {
                allThumbs[selectedIndex].classList.remove('selected');
            }
            selectedIndex = null;
            updateStartFromButton();
            hideNotesPanel();
        }
    }

    // Position the floating insert indicator between thumbnails
    function positionInsertIndicator(targetIndex, position) {
        if (!insertIndicator) return;

        const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
        const gridRect = thumbnails.getBoundingClientRect();

        let indicatorLeft, indicatorTop, indicatorHeight;

        if (position === 'before') {
            const targetThumb = allThumbs[targetIndex];
            const targetRect = targetThumb.getBoundingClientRect();

            // Check if there's a thumbnail to the left on the same row
            const prevThumb = targetIndex > 0 ? allThumbs[targetIndex - 1] : null;

            if (prevThumb) {
                const prevRect = prevThumb.getBoundingClientRect();
                // Check if prev thumb is on the same row (similar top position)
                if (Math.abs(prevRect.top - targetRect.top) < 10) {
                    // Position in the gap between prev and target
                    indicatorLeft = (prevRect.right + targetRect.left) / 2 - gridRect.left - 2;
                } else {
                    // Target is at the start of a new row, position at left edge
                    indicatorLeft = targetRect.left - gridRect.left - 8;
                }
            } else {
                // First thumbnail, position at left edge
                indicatorLeft = targetRect.left - gridRect.left - 8;
            }

            indicatorTop = targetRect.top - gridRect.top - 4;
            indicatorHeight = targetRect.height + 8;
        } else {
            // position === 'after'
            const targetThumb = allThumbs[targetIndex];
            const targetRect = targetThumb.getBoundingClientRect();

            // Check if there's a thumbnail to the right on the same row
            const nextThumb = targetIndex < allThumbs.length - 1 ? allThumbs[targetIndex + 1] : null;

            if (nextThumb) {
                const nextRect = nextThumb.getBoundingClientRect();
                // Check if next thumb is on the same row
                if (Math.abs(nextRect.top - targetRect.top) < 10) {
                    // Position in the gap between target and next
                    indicatorLeft = (targetRect.right + nextRect.left) / 2 - gridRect.left - 2;
                } else {
                    // Target is at the end of a row, position at right edge
                    indicatorLeft = targetRect.right - gridRect.left + 4;
                }
            } else {
                // Last thumbnail, position at right edge
                indicatorLeft = targetRect.right - gridRect.left + 4;
            }

            indicatorTop = targetRect.top - gridRect.top - 4;
            indicatorHeight = targetRect.height + 8;
        }

        insertIndicator.style.left = `${indicatorLeft}px`;
        insertIndicator.style.top = `${indicatorTop}px`;
        insertIndicator.style.height = `${indicatorHeight}px`;
        insertIndicator.classList.add('visible');
    }

    function hideInsertIndicator() {
        if (insertIndicator) {
            insertIndicator.classList.remove('visible');
        }
    }

    // Drag and drop handlers for reordering
    function handleDragStart(e) {
        draggedIndex = parseInt(e.currentTarget.dataset.index, 10);
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const thumb = e.currentTarget;

        // Accept drags from both thumbnails and title slide
        if (!thumb.classList.contains('pk-thumbnail') || thumb.classList.contains('dragging')) {
            return;
        }

        // Skip if no thumbnail is being dragged
        if (draggedIndex === null) {
            return;
        }

        const targetIndex = parseInt(thumb.dataset.index, 10);

        // Determine if we're on the left or right half of the thumbnail
        const rect = thumb.getBoundingClientRect();
        const midpoint = rect.left + rect.width / 2;
        const isLeftHalf = e.clientX < midpoint;

        // Determine insertion position
        const newPosition = isLeftHalf ? 'before' : 'after';

        // Only update if something changed
        if (hoveredIndex !== targetIndex || insertPosition !== newPosition) {
            hoveredIndex = targetIndex;
            insertPosition = newPosition;
            positionInsertIndicator(targetIndex, newPosition);
        }
    }

    function handleDragLeave(e) {
        // Only hide if we're leaving the thumbnail grid entirely
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || !thumbnails.contains(relatedTarget)) {
            hideInsertIndicator();
            hoveredIndex = null;
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent grid handler from also firing

        performReorder();
    }

    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        draggedIndex = null;
        insertPosition = null;
        hoveredIndex = null;
        hideInsertIndicator();
    }

    // Perform the actual reorder based on current drag state
    function performReorder() {
        hideInsertIndicator();

        // If we have a valid drag state with position info, perform the reorder
        if (draggedIndex !== null && hoveredIndex !== null && insertPosition !== null) {
            // Calculate the new index based on insertion position
            let newIndex = insertPosition === 'before' ? hoveredIndex : hoveredIndex + 1;

            // Adjust if we're moving from before the target position
            if (draggedIndex < newIndex) {
                newIndex--;
            }

            // Only reorder if the position actually changes
            if (newIndex !== draggedIndex) {
                const [draggedImage] = images.splice(draggedIndex, 1);
                images.splice(newIndex, 0, draggedImage);
                showPreview();
                return; // showPreview resets state
            }
        }

        // Clean up state if no reorder happened
        draggedIndex = null;
        insertPosition = null;
        hoveredIndex = null;
    }

    // Grid-level drag handlers for catching drops in gaps between thumbnails
    function handleGridDragOver(e) {
        // Only handle if dragging a thumbnail
        if (draggedIndex === null) {
            return;
        }

        // Allow drops on the grid (for gaps between thumbnails)
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // If the mouse is in a gap (not over a thumbnail), find the nearest insertion point
        const target = e.target;
        if (target === thumbnails || target === insertIndicator || target.classList.contains('pk-add-more')) {
            findNearestInsertionPoint(e.clientX, e.clientY);
        }
    }

    // Find the nearest insertion point when the mouse is in a gap
    function findNearestInsertionPoint(mouseX, mouseY) {
        const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
        if (allThumbs.length === 0) return;

        let bestIndex = null;
        let bestPosition = null;
        let bestDistance = Infinity;

        allThumbs.forEach((thumb, index) => {
            if (parseInt(thumb.dataset.index, 10) === draggedIndex) return; // Skip dragged thumb

            const rect = thumb.getBoundingClientRect();

            // Check distance to left edge (insert before)
            const leftEdgeX = rect.left;
            const centerY = rect.top + rect.height / 2;
            const distToLeft = Math.sqrt(Math.pow(mouseX - leftEdgeX, 2) + Math.pow(mouseY - centerY, 2));

            if (distToLeft < bestDistance) {
                bestDistance = distToLeft;
                bestIndex = index;
                bestPosition = 'before';
            }

            // Check distance to right edge (insert after)
            const rightEdgeX = rect.right;
            const distToRight = Math.sqrt(Math.pow(mouseX - rightEdgeX, 2) + Math.pow(mouseY - centerY, 2));

            if (distToRight < bestDistance) {
                bestDistance = distToRight;
                bestIndex = index;
                bestPosition = 'after';
            }
        });

        // Update if we found a better insertion point
        if (bestIndex !== null && (hoveredIndex !== bestIndex || insertPosition !== bestPosition)) {
            hoveredIndex = bestIndex;
            insertPosition = bestPosition;
            positionInsertIndicator(bestIndex, bestPosition);
        }
    }

    function handleGridDrop(e) {
        e.preventDefault();
        performReorder();
    }

    // Delete an image
    function deleteImage(index) {
        // Save to undo stack before removing
        const deletedImage = images[index];
        undoStack.push({ type: 'deleteSlide', image: deletedImage, index: index });

        images.splice(index, 1);

        // Adjust selection if needed
        if (selectedIndex !== null) {
            if (index === selectedIndex) {
                selectedIndex = null;
                updateStartFromButton();
            } else if (index < selectedIndex) {
                selectedIndex--;
            }
        }

        // If no images left, return to upload
        if (images.length === 0) {
            resetToUpload();
        } else {
            showPreview();
            showUndoToast();
        }
    }

    // Undo the last action
    function undoDelete() {
        if (undoStack.length === 0) return;

        hideUndoToast();

        const lastAction = undoStack.pop();

        switch (lastAction.type) {
            case 'deleteSlide': {
                // Insert back at original position, or at end if that position no longer exists
                const insertIndex = Math.min(lastAction.index, images.length);
                images.splice(insertIndex, 0, lastAction.image);

                // Adjust selection if needed
                if (selectedIndex !== null && insertIndex <= selectedIndex) {
                    selectedIndex++;
                }
                break;
            }

            default:
                // Legacy format or unknown type - treat as deleteSlide
                if (lastAction.image) {
                    const insertIndex = Math.min(lastAction.index, images.length);
                    images.splice(insertIndex, 0, lastAction.image);
                    if (selectedIndex !== null && insertIndex <= selectedIndex) {
                        selectedIndex++;
                    }
                }
        }

        showPreview();
    }

    // Detect if device is primarily touch-based
    function isTouchDevice() {
        return ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0);
    }

    // Get the appropriate undo keyboard shortcut for the platform
    function getUndoShortcut() {
        // Check if Mac (includes iPad with keyboard)
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
                      navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
        return isMac ? '⌘Z' : 'Ctrl+Z';
    }

    // Show the undo toast notification
    function showUndoToast() {
        // Clear any existing timer
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }

        // Show or hide keyboard shortcut based on device type
        if (isTouchDevice()) {
            toastShortcut.hidden = true;
        } else {
            toastShortcut.textContent = getUndoShortcut();
            toastShortcut.hidden = false;
        }

        // Show the toast with animation
        undoToast.classList.add('visible');

        // Auto-hide after 5 seconds
        toastTimer = setTimeout(() => {
            hideUndoToast();
        }, 5000);
    }

    // Hide the undo toast notification
    function hideUndoToast() {
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
        undoToast.classList.remove('visible');
    }

    // Select a thumbnail
    function selectThumbnail(index) {
        const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');

        // Toggle selection if clicking the same thumbnail
        if (selectedIndex === index) {
            allThumbs[index].classList.remove('selected');
            selectedIndex = null;
            hideNotesPanel();
        } else {
            // Remove previous selection
            if (selectedIndex !== null && allThumbs[selectedIndex]) {
                allThumbs[selectedIndex].classList.remove('selected');
            }
            // Add new selection
            allThumbs[index].classList.add('selected');
            selectedIndex = index;
            showNotesPanel(index);
        }

        updateStartFromButton();
    }

    // Update the "Start from" button visibility and text
    function updateStartFromButton() {
        if (selectedIndex !== null) {
            startFromBtn.textContent = `Start from Slide ${selectedIndex + 1}`;
            startFromBtn.hidden = false;
        } else {
            startFromBtn.hidden = true;
        }
    }

    // Show the notes panel for a specific slide
    function showNotesPanel(index) {
        notesSlideNumber.textContent = index + 1;
        notesInput.value = images[index].notes || '';
        // Show duration override (empty string if null/undefined to use placeholder)
        slideDurationOverride.value = images[index].duration || '';
        slideDurationOverride.placeholder = slideDuration; // Show global default as placeholder
        notesPanel.hidden = false;
        updateSetTitleButton();
    }

    // Hide the notes panel
    function hideNotesPanel() {
        notesPanel.hidden = true;
    }

    // Save notes and duration for the currently selected slide
    function saveCurrentNotes() {
        if (selectedIndex !== null && images[selectedIndex]) {
            images[selectedIndex].notes = notesInput.value;
            // Save duration override (null if empty)
            const durationValue = parseInt(slideDurationOverride.value, 10);
            images[selectedIndex].duration = (durationValue > 0) ? durationValue : null;
            // Update thumbnail indicators
            const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
            if (allThumbs[selectedIndex]) {
                // Notes indicator
                if (notesInput.value) {
                    allThumbs[selectedIndex].classList.add('has-notes');
                } else {
                    allThumbs[selectedIndex].classList.remove('has-notes');
                }
                // Custom duration indicator
                if (images[selectedIndex].duration) {
                    allThumbs[selectedIndex].classList.add('has-custom-duration');
                } else {
                    allThumbs[selectedIndex].classList.remove('has-custom-duration');
                }
            }
        }
    }

    // ========================================
    // Title Slide Functions
    // ========================================

    // Set the title slide (copies from images array)
    function setTitleSlide(index) {
        const img = images[index];
        titleSlide = {
            name: img.name,
            dataUrl: img.dataUrl,
            notes: img.notes || ''
        };
        updateTitleSlideUI();
        updateSetTitleButton();
    }

    // Remove the title slide
    function removeTitleSlide() {
        titleSlide = null;
        updateTitleSlideUI();
        updateSetTitleButton();
    }

    // Update the title slide UI to reflect current state
    function updateTitleSlideUI() {
        if (titleSlide) {
            titleSlideSlot.classList.add('has-image');
            titleSlideImg.src = titleSlide.dataUrl;
            titleSlideImg.hidden = false;
            titleSlotHint.hidden = true;
            titleSlideRemove.hidden = false;
        } else {
            titleSlideSlot.classList.remove('has-image');
            titleSlideImg.src = '';
            titleSlideImg.hidden = true;
            titleSlotHint.hidden = false;
            titleSlideRemove.hidden = true;
        }
    }

    // Update "Set as Title" button state
    function updateSetTitleButton() {
        if (selectedIndex !== null && images[selectedIndex]) {
            const isCurrentTitle = titleSlide && images[selectedIndex].dataUrl === titleSlide.dataUrl;
            setTitleBtn.textContent = isCurrentTitle ? 'Title Slide ✓' : 'Set as Title Slide';
            setTitleBtn.disabled = isCurrentTitle;
        }
    }

    // ========================================
    // Configuration Export/Import Functions
    // ========================================

    // Export current configuration as JSON
    function exportConfiguration() {
        const config = {
            version: 1,
            exportedAt: new Date().toISOString(),
            settings: {
                slideDuration: slideDuration,
                displayMode: getDisplayMode()
            },
            titleSlide: titleSlide,
            slides: images
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pechakucha-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import configuration from JSON file
    function importConfiguration(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);

                if (config.version !== 1) {
                    throw new Error('Unsupported configuration version');
                }

                // Apply settings
                slideDuration = config.settings?.slideDuration || DEFAULT_SLIDE_DURATION;

                // Apply display mode
                const displayMode = config.settings?.displayMode || 'fit';
                displayFitRadio.checked = displayMode === 'fit';
                displayFillRadio.checked = displayMode === 'fill';

                // Apply title slide
                titleSlide = config.titleSlide || null;

                // Apply slides (ensure each has duration property for backward compatibility)
                images = (config.slides || []).map(slide => ({
                    ...slide,
                    duration: slide.duration || null
                }));

                // Show preview
                updateTitleSlideUI();
                showPreview();
            } catch (err) {
                alert('Invalid configuration file: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // Start slideshow from a specific index
    function startSlideshowFrom(startIndex) {
        if (images.length === 0) return;

        // Check if external display is selected
        if (modePresentRadio.checked) {
            startExternalPresentation(startIndex);
            return;
        }

        hideUndoToast();

        currentIndex = startIndex;
        isPaused = false;
        pausedTimeRemaining = 0;
        pausedElapsedOnSlide = 0;
        presentationStartTime = Date.now();

        previewSection.hidden = true;
        slideshowSection.hidden = false;
        completeSection.hidden = true;
        pauseIndicator.hidden = true;

        // Show/hide timer overlay based on checkbox and sync toggle
        timerOverlay.hidden = !showTimerOverlayCheckbox.checked;
        timerTogglePractice.checked = showTimerOverlayCheckbox.checked;

        // Apply image display mode
        applyDisplayMode();

        // Initialize elapsed/total time display
        elapsedTimeDisplay.textContent = '0:00';
        totalTimeDisplay.textContent = formatTime(calculateTotalTime());

        showSlide(startIndex);
    }

    // Show lightbox with image preview
    function showLightbox(index) {
        lightboxImage.src = images[index].dataUrl;
        lightboxImage.alt = `Slide ${index + 1} preview`;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    // Hide lightbox
    function hideLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }

    // Start the slideshow
    function startSlideshow() {
        if (images.length === 0) return;

        // Check if external display is selected
        if (modePresentRadio.checked) {
            startExternalPresentation(0);
            return;
        }

        hideUndoToast();

        currentIndex = 0;
        isPaused = false;
        pausedTimeRemaining = 0;
        pausedElapsedOnSlide = 0;
        presentationStartTime = Date.now();

        previewSection.hidden = true;
        slideshowSection.hidden = false;
        completeSection.hidden = true;
        pauseIndicator.hidden = true;

        // Show/hide timer overlay based on checkbox and sync toggle
        timerOverlay.hidden = !showTimerOverlayCheckbox.checked;
        timerTogglePractice.checked = showTimerOverlayCheckbox.checked;

        // Apply image display mode
        applyDisplayMode();

        // Initialize elapsed/total time display
        elapsedTimeDisplay.textContent = '0:00';
        totalTimeDisplay.textContent = formatTime(calculateTotalTime());

        showSlide(0);
    }

    // Display a specific slide
    function showSlide(index) {
        if (index >= images.length) {
            endSlideshow();
            return;
        }

        currentIndex = index;
        currentSlide.src = images[index].dataUrl;
        currentSlide.alt = `Slide ${index + 1} of ${images.length}`;
        slideCounter.textContent = `${index + 1} / ${images.length}`;

        // Update navigation arrow states
        updateNavArrows();

        startSlideTimer();
    }

    // Start timer for current slide
    function startSlideTimer() {
        clearTimers();

        const isResuming = pausedTimeRemaining > 0;

        slideStartTime = Date.now();

        if (isResuming) {
            // Resuming from pause: keep full duration, use remaining time for timer
            currentSlideDuration = pausedTimeRemaining;
            // fullSlideDuration stays the same
        } else {
            // New slide: set both to full duration, reset elapsed
            fullSlideDuration = getSlideDuration(currentIndex) * 1000;
            currentSlideDuration = fullSlideDuration;
            pausedElapsedOnSlide = 0;
        }

        // Initialize slide timer display immediately
        slideTimerDisplay.textContent = Math.ceil(currentSlideDuration / 1000);

        // Set progress bar: if resuming, show elapsed portion; if new slide, start at 0
        if (isResuming) {
            progressFill.style.width = `${(pausedElapsedOnSlide / fullSlideDuration) * 100}%`;
        } else {
            progressFill.style.width = '0%';
        }

        // Set timeout for slide advance
        slideTimer = setTimeout(() => {
            advanceSlide();
        }, currentSlideDuration);

        // Start progress animation
        updateProgress();
    }

    // Update progress bar and slide timer
    function updateProgress() {
        const elapsedSinceStart = Date.now() - slideStartTime;
        const remaining = Math.max(currentSlideDuration - elapsedSinceStart, 0);
        const remainingSeconds = Math.ceil(remaining / 1000);

        // Calculate progress based on total elapsed time on this slide
        const totalElapsedOnSlide = pausedElapsedOnSlide + elapsedSinceStart;
        const progress = Math.min(totalElapsedOnSlide / fullSlideDuration, 1);

        progressFill.style.width = `${progress * 100}%`;
        slideTimerDisplay.textContent = remainingSeconds;

        // Update timer overlay if visible
        if (!timerOverlay.hidden) {
            timerOverlayValue.textContent = remainingSeconds;
        }

        // Update elapsed time since presentation started
        if (presentationStartTime) {
            const totalElapsed = Math.floor((Date.now() - presentationStartTime) / 1000);
            elapsedTimeDisplay.textContent = formatTime(totalElapsed);
        }

        if (!isPaused && progress < 1) {
            progressTimer = requestAnimationFrame(updateProgress);
        }
    }

    // Advance to next slide
    function advanceSlide() {
        clearTimers();
        isPaused = false;
        pausedTimeRemaining = 0;
        pausedElapsedOnSlide = 0;
        const nextIndex = currentIndex + 1;
        showSlide(nextIndex);
    }

    // Toggle pause state
    function togglePause() {
        if (isPaused) {
            // Resume
            isPaused = false;
            pauseIndicator.hidden = true;
            startSlideTimer();
        } else {
            // Pause
            clearTimers();
            isPaused = true;
            pauseIndicator.hidden = false;

            // Calculate remaining time and elapsed time on this slide
            const elapsedSinceStart = Date.now() - slideStartTime;
            pausedTimeRemaining = Math.max(currentSlideDuration - elapsedSinceStart, 0);
            pausedElapsedOnSlide = pausedElapsedOnSlide + elapsedSinceStart;
        }
    }

    // Clear all timers
    function clearTimers() {
        if (slideTimer) {
            clearTimeout(slideTimer);
            slideTimer = null;
        }
        if (progressTimer) {
            cancelAnimationFrame(progressTimer);
            progressTimer = null;
        }
    }

    // Calculate elapsed time for slides before a given index
    function getElapsedTimeBeforeSlide(index) {
        let elapsed = 0;
        for (let i = 0; i < index; i++) {
            elapsed += getSlideDuration(i) * 1000;
        }
        return elapsed;
    }

    // Navigate to previous slide (practice mode)
    function goToPreviousSlide() {
        if (currentIndex > 0) {
            clearTimers();
            isPaused = false;
            pausedTimeRemaining = 0;
            pausedElapsedOnSlide = 0;
            // Adjust presentation start time so elapsed display reflects new position
            presentationStartTime = Date.now() - getElapsedTimeBeforeSlide(currentIndex - 1);
            showSlide(currentIndex - 1);
        }
    }

    // Navigate to next slide (practice mode)
    function goToNextSlide() {
        if (currentIndex < images.length - 1) {
            clearTimers();
            isPaused = false;
            pausedTimeRemaining = 0;
            pausedElapsedOnSlide = 0;
            // Adjust presentation start time so elapsed display reflects new position
            presentationStartTime = Date.now() - getElapsedTimeBeforeSlide(currentIndex + 1);
            showSlide(currentIndex + 1);
        }
    }

    // Update navigation arrow states
    function updateNavArrows() {
        navPrev.disabled = currentIndex === 0;
        navNext.disabled = currentIndex === images.length - 1;
    }

    // Exit slideshow and return to preview
    function exitSlideshow() {
        clearTimers();
        isPaused = false;
        slideshowSection.hidden = true;
        previewSection.hidden = false;
    }

    // Apply image display mode to slide containers
    function applyDisplayMode() {
        const isFill = displayFillRadio.checked;
        const objectFit = isFill ? 'cover' : 'contain';
        currentSlide.style.objectFit = objectFit;
    }

    // Get current display mode value
    function getDisplayMode() {
        return displayFillRadio.checked ? 'fill' : 'fit';
    }

    // End slideshow and show completion
    function endSlideshow() {
        clearTimers();
        slideshowSection.hidden = true;
        completeSection.hidden = false;

        // Calculate stats
        const totalSlides = images.length;
        const totalSeconds = totalSlides * slideDuration;

        finalSlideCount.textContent = totalSlides;
        finalDuration.textContent = formatTime(totalSeconds);
    }

    // Reset to upload state
    function resetToUpload() {
        clearTimers();
        hideUndoToast();
        endExternalPresentation();
        images = [];
        titleSlide = null;
        currentIndex = 0;
        isPaused = false;
        selectedIndex = null;
        undoStack = [];

        uploadSection.hidden = false;
        previewSection.hidden = true;
        slideshowSection.hidden = true;
        completeSection.hidden = true;
        presenterSection.hidden = true;

        thumbnails.innerHTML = '';
        fileInput.value = '';
        startFromBtn.hidden = true;
        updateTitleSlideUI();
    }

    // ========================================
    // External Presentation Functions
    // ========================================

    // Check if Window Management API is supported
    function hasWindowManagementAPI() {
        return 'getScreenDetails' in window;
    }

    // Check if display is extended (multiple monitors)
    function isExtendedDisplay() {
        return window.screen.isExtended === true;
    }

    // Open presentation window on second screen (Chrome/Edge with multi-screen)
    async function openOnSecondScreen() {
        if (!hasWindowManagementAPI()) return null;

        try {
            const screenDetails = await window.getScreenDetails();
            const secondScreen = screenDetails.screens.find(s => !s.isPrimary);

            if (secondScreen) {
                return window.open(
                    'presentation.html',
                    'PechaKucha Presentation',
                    `left=${secondScreen.left},top=${secondScreen.top},width=${secondScreen.width},height=${secondScreen.height}`
                );
            }
        } catch (e) {
            console.warn('Multi-screen API not available or permission denied:', e);
        }
        return null;
    }

    // Fallback: open window that user can manually move
    function openPresentationWindowFallback() {
        return window.open(
            'presentation.html',
            'PechaKucha Presentation',
            'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
        );
    }

    // Start external presentation (optionally from a specific slide index)
    async function startExternalPresentation(startIndex = 0) {
        if (images.length === 0) return;

        hideUndoToast();

        // Try to open on second screen first, fall back to regular window
        if (hasWindowManagementAPI() && isExtendedDisplay()) {
            presentationWindow = await openOnSecondScreen();
        }

        // Fallback if multi-screen didn't work
        if (!presentationWindow) {
            presentationWindow = openPresentationWindowFallback();
        }

        if (!presentationWindow) {
            alert('Unable to open presentation window. Please check your popup blocker settings.');
            return;
        }

        // Set up state
        isExternalPresentation = true;
        currentIndex = startIndex;
        isPaused = false;

        // Show presenter view
        previewSection.hidden = true;
        presenterSection.hidden = false;

        // Listen for messages from presentation window
        window.addEventListener('message', handlePresentationMessage);

        // Start checking if window is still open
        startWindowCheck();

        // Wait for presentation window to be ready, then initialize
        // The ready message will trigger sendInitToPresentation
    }

    // Handle messages from presentation window
    function handlePresentationMessage(event) {
        const data = event.data;

        switch (data.type) {
            case 'ready':
                sendInitToPresentation();
                break;
            case 'closed':
                endExternalPresentation();
                break;
        }
    }

    // Render the presenter filmstrip
    function renderPresenterFilmstrip() {
        presenterFilmstrip.innerHTML = '';

        images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'pk-presenter-filmstrip-thumb';
            thumb.dataset.index = index;

            const image = document.createElement('img');
            image.src = img.dataUrl;
            image.alt = `Slide ${index + 1}`;
            thumb.appendChild(image);

            const number = document.createElement('span');
            number.className = 'pk-presenter-filmstrip-number';
            number.textContent = index + 1;
            thumb.appendChild(number);

            // Click to jump to slide
            thumb.addEventListener('click', () => {
                jumpToExternalSlide(index);
            });

            presenterFilmstrip.appendChild(thumb);
        });

        updateFilmstripState();
    }

    // Update filmstrip visual state (current, past indicators)
    function updateFilmstripState() {
        const thumbs = presenterFilmstrip.querySelectorAll('.pk-presenter-filmstrip-thumb');
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('current', index === currentIndex);
            thumb.classList.toggle('past', index < currentIndex);
        });

        // Scroll current slide into view
        const currentThumb = presenterFilmstrip.querySelector('.pk-presenter-filmstrip-thumb.current');
        if (currentThumb) {
            currentThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    // Jump to a specific slide during presentation
    function jumpToExternalSlide(index) {
        if (index < 0 || index >= images.length) return;

        // Clear current timer
        clearTimers();

        // Update current index and show slide
        currentIndex = index;
        showExternalSlide(index);
        updateFilmstripState();

        // Restart timer if presentation is running (not waiting to start)
        if (presenterStartBtn.hidden) {
            isPaused = false;
            pausedTimeRemaining = 0;
            currentSlideDuration = getSlideDuration(index) * 1000;
            presenterPauseBtn.textContent = 'Pause';
            startExternalSlideTimer();
        }
    }

    // Send initialization data to presentation window
    function sendInitToPresentation() {
        if (!presentationWindow) return;

        // Check if we're on an extended display (second screen)
        const shouldFullscreen = isExtendedDisplay();

        presentationWindow.postMessage({
            type: 'init',
            images: images,
            titleSlide: titleSlide,
            settings: {
                slideDuration: slideDuration,
                displayMode: getDisplayMode()
            },
            startIndex: currentIndex,
            requestFullscreen: shouldFullscreen
        }, '*');

        // Render the filmstrip
        renderPresenterFilmstrip();

        // Show starting slide in presenter view (but don't start timer yet)
        showExternalSlide(currentIndex);
        // Update presenter view to show "waiting to start" state
        presenterTime.textContent = formatTime(slideDuration);
        // Show start button, hide pause/skip
        presenterStartBtn.hidden = false;
        presenterPauseBtn.hidden = true;
        presenterSkipBtn.hidden = true;
    }

    // Begin the slideshow (called when user clicks Start in main window)
    function beginExternalSlideshow() {
        // Send start command to presentation window
        if (presentationWindow && !presentationWindow.closed) {
            presentationWindow.postMessage({ type: 'start' }, '*');
        }

        // Hide start button, show pause/skip/grid
        presenterStartBtn.hidden = true;
        presenterPauseBtn.hidden = false;
        presenterSkipBtn.hidden = false;
        presenterGridBtn.hidden = false;

        // Set presentation start time and total time display
        presentationStartTime = Date.now();
        const totalSeconds = calculateTotalTime();
        presenterTotal.textContent = formatTime(totalSeconds);
        presenterElapsed.textContent = '0:00';

        // Initialize slide duration for first slide
        pausedTimeRemaining = 0;
        currentSlideDuration = getSlideDuration(currentIndex) * 1000;

        startExternalSlideTimer();
    }

    // Show a slide in external presentation
    function showExternalSlide(index) {
        if (index >= images.length) {
            endExternalPresentation();
            showCompletion();
            return;
        }

        currentIndex = index;

        // Update presenter view
        presenterCurrentImg.src = images[index].dataUrl;
        presenterCurrentImg.alt = `Slide ${index + 1}`;

        if (index + 1 < images.length) {
            presenterNextImg.src = images[index + 1].dataUrl;
            presenterNextImg.alt = `Slide ${index + 2}`;
            presenterNextImg.hidden = false;
            presenterNextPlaceholder.hidden = true;
        } else {
            presenterNextImg.src = '';
            presenterNextImg.hidden = true;
            presenterNextPlaceholder.hidden = false;
        }

        presenterCounter.textContent = `Slide ${index + 1} of ${images.length}`;

        // Update presenter notes
        presenterNotesInput.value = images[index].notes || '';

        // Update filmstrip state
        updateFilmstripState();

        // Send to presentation window
        if (presentationWindow && !presentationWindow.closed) {
            presentationWindow.postMessage({
                type: 'showSlide',
                index: index,
                timeRemaining: getSlideDuration(index) * 1000
            }, '*');
        }
    }

    // Start timer for external presentation
    function startExternalSlideTimer() {
        clearTimers();

        slideStartTime = Date.now();
        // Use pausedTimeRemaining if we have it, otherwise per-slide duration
        currentSlideDuration = pausedTimeRemaining > 0 ? pausedTimeRemaining : getSlideDuration(currentIndex) * 1000;

        // Timer for advancing slides
        slideTimer = setTimeout(() => {
            advanceExternalSlide();
        }, currentSlideDuration);

        // Progress update for presenter view
        updateExternalProgress();
    }

    // Update presenter view progress/timer
    function updateExternalProgress() {
        const elapsed = Date.now() - slideStartTime;
        const remaining = Math.max(currentSlideDuration - elapsed, 0);
        const remainingSeconds = Math.ceil(remaining / 1000);
        const progress = Math.min(elapsed / currentSlideDuration, 1);

        presenterTime.textContent = formatTime(remainingSeconds);

        // Update progress bar
        presenterProgressFill.style.width = `${progress * 100}%`;

        // Update elapsed time display
        if (presentationStartTime) {
            const totalElapsed = Math.floor((Date.now() - presentationStartTime) / 1000);
            presenterElapsed.textContent = formatTime(totalElapsed);
        }

        // Warning color when < 5 seconds
        if (remainingSeconds <= 5) {
            presenterTime.classList.add('warning');
        } else {
            presenterTime.classList.remove('warning');
        }

        if (!isPaused && remaining > 0) {
            progressTimer = requestAnimationFrame(updateExternalProgress);
        }
    }

    // Advance to next slide in external presentation
    function advanceExternalSlide() {
        clearTimers();
        isPaused = false;
        pausedTimeRemaining = 0;
        presenterPauseBtn.textContent = 'Pause';

        const nextIndex = currentIndex + 1;
        if (nextIndex >= images.length) {
            endExternalPresentation();
            showCompletion();
        } else {
            currentSlideDuration = getSlideDuration(nextIndex) * 1000;
            showExternalSlide(nextIndex);
            startExternalSlideTimer();
        }
    }

    // Toggle pause in external presentation
    function toggleExternalPause() {
        if (isPaused) {
            // Resume
            isPaused = false;
            presenterPauseBtn.textContent = 'Pause';

            if (presentationWindow && !presentationWindow.closed) {
                presentationWindow.postMessage({ type: 'resume' }, '*');
            }

            startExternalSlideTimer();
        } else {
            // Pause
            clearTimers();
            isPaused = true;
            presenterPauseBtn.textContent = 'Resume';

            // Calculate remaining time based on current slide's duration
            const elapsed = Date.now() - slideStartTime;
            pausedTimeRemaining = Math.max(currentSlideDuration - elapsed, 0);

            if (presentationWindow && !presentationWindow.closed) {
                presentationWindow.postMessage({ type: 'pause' }, '*');
            }
        }
    }

    // Skip to next slide in external presentation
    function skipExternalSlide() {
        advanceExternalSlide();
    }

    // Show completion screen
    function showCompletion() {
        presenterSection.hidden = true;
        completeSection.hidden = false;

        // Calculate stats
        const totalSlides = images.length;
        const totalSeconds = totalSlides * slideDuration;

        finalSlideCount.textContent = totalSlides;
        finalDuration.textContent = formatTime(totalSeconds);
    }

    // End external presentation
    function endExternalPresentation() {
        clearTimers();
        stopWindowCheck();

        window.removeEventListener('message', handlePresentationMessage);

        if (presentationWindow && !presentationWindow.closed) {
            presentationWindow.postMessage({ type: 'end' }, '*');
            presentationWindow.close();
        }

        presentationWindow = null;
        isExternalPresentation = false;
        isPaused = false;
        pausedTimeRemaining = 0;
    }

    // Return to preview from presenter view
    function exitPresenterView() {
        endExternalPresentation();
        presenterSection.hidden = true;
        previewSection.hidden = false;
    }

    // Check if presentation window is still open
    function startWindowCheck() {
        stopWindowCheck();
        windowCheckTimer = setInterval(() => {
            if (presentationWindow && presentationWindow.closed) {
                presentationWindow = null;
            }
        }, 500);
    }

    // Toggle external presentation window (close or reopen)
    function toggleExternalWindow() {
        if (presentationWindow && !presentationWindow.closed) {
            // Close the window
            presentationWindow.close();
            presentationWindow = null;
        } else {
            // Reopen the window
            reopenPresentationWindow();
        }
    }

    // Reopen the presentation window
    function reopenPresentationWindow() {
        presentationWindow = openPresentationWindowFallback();
        if (presentationWindow) {
            // Re-listen for messages
            window.addEventListener('message', handlePresentationMessage);
        }
    }

    function stopWindowCheck() {
        if (windowCheckTimer) {
            clearInterval(windowCheckTimer);
            windowCheckTimer = null;
        }
    }

    // ========================================
    // Presenter Grid View (Jump to Slide)
    // ========================================

    // Show the grid overlay with all slides
    function showPresenterGrid() {
        // Render thumbnails
        presenterGrid.innerHTML = images.map((img, i) => `
            <div class="pk-presenter-grid-item ${i === currentIndex ? 'current' : ''}" data-index="${i}">
                <img src="${img.dataUrl}" alt="Slide ${i + 1}">
                <span class="pk-presenter-grid-number">${i + 1}</span>
            </div>
        `).join('');

        presenterGridOverlay.hidden = false;

        // Add click handlers to each thumbnail
        presenterGrid.querySelectorAll('.pk-presenter-grid-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index, 10);
                jumpToSlide(index);
                hidePresenterGrid();
            });
        });
    }

    // Hide the grid overlay
    function hidePresenterGrid() {
        presenterGridOverlay.hidden = true;
    }

    // Toggle the grid overlay
    function togglePresenterGrid() {
        if (presenterGridOverlay.hidden) {
            showPresenterGrid();
        } else {
            hidePresenterGrid();
        }
    }

    // Jump to a specific slide during external presentation
    function jumpToSlide(index) {
        clearTimers();
        isPaused = false;
        pausedTimeRemaining = 0;
        currentSlideDuration = getSlideDuration(index) * 1000;
        presenterPauseBtn.textContent = 'Pause';

        showExternalSlide(index);
        startExternalSlideTimer();
    }

    // Event Listeners

    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Click to upload
    dropzone.addEventListener('click', (e) => {
        // Don't trigger if clicking the label/button
        if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Buttons
    startBtn.addEventListener('click', startSlideshow);
    startFromBtn.addEventListener('click', () => {
        if (selectedIndex !== null) {
            startSlideshowFrom(selectedIndex);
        }
    });
    resetBtn.addEventListener('click', resetToUpload);
    restartBtn.addEventListener('click', startSlideshow);
    newBtn.addEventListener('click', resetToUpload);

    // Export/Import buttons
    exportBtn.addEventListener('click', exportConfiguration);
    importInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importConfiguration(e.target.files[0]);
            e.target.value = ''; // Reset for re-import
        }
    });

    // External presentation buttons
    presenterEndBtn.addEventListener('click', exitPresenterView);
    presenterCloseWindowBtn.addEventListener('click', toggleExternalWindow);
    presenterStartBtn.addEventListener('click', beginExternalSlideshow);
    presenterPauseBtn.addEventListener('click', toggleExternalPause);
    presenterSkipBtn.addEventListener('click', skipExternalSlide);
    presenterGridBtn.addEventListener('click', showPresenterGrid);
    presenterGridClose.addEventListener('click', hidePresenterGrid);

    // Lightbox events - close on any click
    lightbox.addEventListener('click', hideLightbox);
    lightboxClose.addEventListener('click', hideLightbox);

    // Notes panel events
    notesCloseBtn.addEventListener('click', () => {
        saveCurrentNotes();
        deselectThumbnail();
    });
    notesInput.addEventListener('input', saveCurrentNotes);
    notesInput.addEventListener('blur', saveCurrentNotes);

    // Presenter notes input (during presentation)
    presenterNotesInput.addEventListener('input', () => {
        if (isExternalPresentation && currentIndex < images.length) {
            images[currentIndex].notes = presenterNotesInput.value;
        }
    });

    // Presenter export button
    presenterExportBtn.addEventListener('click', exportConfiguration);

    // Title slide remove button
    titleSlideRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTitleSlide();
    });

    // Set as Title button
    setTitleBtn.addEventListener('click', () => {
        if (selectedIndex !== null) {
            setTitleSlide(selectedIndex);
        }
    });

    // Toast undo button
    toastUndoBtn.addEventListener('click', undoDelete);

    // Navigation arrows (practice mode)
    navPrev.addEventListener('click', goToPreviousSlide);
    navNext.addEventListener('click', goToNextSlide);

    // Timer toggle in practice mode controls
    timerTogglePractice.addEventListener('change', () => {
        timerOverlay.hidden = !timerTogglePractice.checked;
        // Sync back to preview checkbox
        showTimerOverlayCheckbox.checked = timerTogglePractice.checked;
    });

    // Edit slides button on completion screen
    editBtn.addEventListener('click', () => {
        completeSection.hidden = true;
        previewSection.hidden = false;
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Ignore keyboard shortcuts when typing in an input or textarea
        const isTyping = document.activeElement?.tagName === 'INPUT' ||
                         document.activeElement?.tagName === 'TEXTAREA';

        // Handle lightbox close
        if (!lightbox.hidden && e.code === 'Escape') {
            e.preventDefault();
            hideLightbox();
            return;
        }

        // Handle presenter grid overlay
        if (!presenterGridOverlay.hidden && e.code === 'Escape') {
            e.preventDefault();
            hidePresenterGrid();
            return;
        }

        // Handle undo (Ctrl/Cmd+Z) when in preview section
        if (!previewSection.hidden && (e.metaKey || e.ctrlKey) && e.code === 'KeyZ' && !e.shiftKey) {
            e.preventDefault();
            undoDelete();
            return;
        }

        // Handle presenter view keyboard shortcuts (during external presentation)
        if (!presenterSection.hidden && isExternalPresentation) {
            // Only when presentation is actually running (start button is hidden)
            if (presenterStartBtn.hidden) {
                switch (e.code) {
                    case 'Space':
                        // Don't trigger pause when typing in notes
                        if (isTyping) return;
                        e.preventDefault();
                        toggleExternalPause();
                        return;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        // Don't interfere with text navigation
                        if (isTyping) return;
                        e.preventDefault();
                        skipExternalSlide();
                        return;
                    case 'KeyG':
                        // Don't trigger grid when typing
                        if (isTyping) return;
                        e.preventDefault();
                        togglePresenterGrid();
                        return;
                    case 'Escape':
                        e.preventDefault();
                        exitPresenterView();
                        return;
                }
            }
        }

        // Only handle slideshow controls when slideshow is visible
        if (slideshowSection.hidden) return;

        if (e.code === 'Space') {
            e.preventDefault();
            togglePause();
        } else if (e.code === 'Escape') {
            e.preventDefault();
            exitSlideshow();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            goToPreviousSlide();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            goToNextSlide();
        }
    });

    // Prevent spacebar scrolling when slideshow is active
    document.addEventListener('keypress', (e) => {
        if (!slideshowSection.hidden && e.code === 'Space') {
            e.preventDefault();
        }
    });

    // Drag-to-adjust for number inputs
    function setupDragToAdjust(input) {
        let isDragging = false;
        let startY = 0;
        let startValue = 0;
        const sensitivity = 0.5; // pixels per unit change

        function onMouseDown(e) {
            // Only activate on left mouse button and not when focused for typing
            if (e.button !== 0 || document.activeElement === input) return;

            isDragging = true;
            startY = e.clientY;
            startValue = parseInt(input.value, 10) || 0;
            input.classList.add('dragging');
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';

            e.preventDefault();
        }

        function onMouseMove(e) {
            if (!isDragging) return;

            const deltaY = startY - e.clientY; // Inverted: up increases
            const deltaValue = Math.round(deltaY * sensitivity);
            let newValue = startValue + deltaValue;

            // Clamp to min/max
            const min = parseInt(input.min, 10) || 1;
            const max = parseInt(input.max, 10) || 999;
            newValue = Math.max(min, Math.min(max, newValue));

            input.value = newValue;
        }

        function onMouseUp() {
            if (!isDragging) return;

            isDragging = false;
            input.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        input.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Initialize drag-to-adjust on number inputs
    setupDragToAdjust(slideDurationOverride);

})();
