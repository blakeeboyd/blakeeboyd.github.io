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
    let lightboxPreviousFocus = null; // Element that had focus before lightbox opened
    let audioContext = null;   // Web Audio API context for beeps
    let lastBeepSecond = null; // Track which second we last beeped on (to avoid duplicates)

    // External presentation state
    let presentationWindow = null;
    let windowCheckTimer = null;
    let isExternalPresentation = false;

    // Settings (will be read from inputs)
    let slideDuration = 20;    // Seconds per slide (global default)

    // DOM Elements
    const pageHeader = document.querySelector('.page-header');
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
    const presenterNavGroup = document.getElementById('presenter-nav-group');
    const presenterPrevBtn = document.getElementById('presenter-prev-btn');
    const presenterNextBtn = document.getElementById('presenter-next-btn');

    // Notes elements
    const notesPanel = document.getElementById('notes-panel');
    const notesSlideNumber = document.getElementById('notes-slide-number');
    const notesInput = document.getElementById('notes-input');
    const notesCloseBtn = document.getElementById('notes-close-btn');
    const slideDurationOverride = document.getElementById('slide-duration-override');
    const slideDisplayModeOverride = document.getElementById('slide-display-mode');
    const zoomRow = document.getElementById('zoom-row');
    const slideZoomInput = document.getElementById('slide-zoom');
    const slideZoomValue = document.getElementById('slide-zoom-value');
    const slideZoomReset = document.getElementById('slide-zoom-reset');
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
    const exportPptxBtn = document.getElementById('export-pptx-btn');
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
    const timerOverlay = document.getElementById('timer-overlay');
    const timerOverlayValue = document.getElementById('timer-overlay-value');
    const timerTogglePractice = document.getElementById('timer-toggle-practice');

    // Practice mode notes panel
    const practiceNotesPanel = document.getElementById('practice-notes-panel');
    const practiceNotesText = document.getElementById('practice-notes-text');
    const notesTogglePractice = document.getElementById('notes-toggle-practice');

    // Audio warnings toggle
    const audioTogglePractice = document.getElementById('audio-toggle-practice');
    const audioTogglePresenter = document.getElementById('audio-toggle-presenter');

    // Practice mode ready overlay
    const practiceReadyOverlay = document.getElementById('practice-ready-overlay');
    const practiceReadyBackground = document.getElementById('practice-ready-background');
    const practiceSlideCount = document.getElementById('practice-slide-count');
    const practiceStartBtn = document.getElementById('practice-start-btn');

    // Navigation arrows (practice mode)
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');

    // Completion screen buttons
    const editBtn = document.getElementById('edit-btn');

    // Image display mode
    const displayModeSelect = document.getElementById('display-mode-select');

    // Display mode preview
    const displayPreview = document.getElementById('display-preview');
    const displayPreviewLabel = document.getElementById('display-preview-label');
    const displayPreviewFrame = document.getElementById('display-preview-frame');
    const displayPreviewImg = document.getElementById('display-preview-img');
    const focalPointMarker = document.getElementById('focal-point-marker');

    // Ken Burns animation origins (3x3 grid for variety)
    const kenBurnsOrigins = [
        'top left', 'top center', 'top right',
        'center left', 'center center', 'center right',
        'bottom left', 'bottom center', 'bottom right'
    ];
    let lastKenBurnsOrigin = -1;

    // Presentation mode toggle
    const modePracticeRadio = document.getElementById('mode-practice');

    // Update start button labels based on selected mode
    function updateStartButtonLabels() {
        const isPresentMode = modePresentRadio.checked;
        const modeLabel = isPresentMode ? 'Present' : 'Practice';
        startBtn.textContent = `Start ${modeLabel} Mode`;
        // startFromBtn text is updated in updateStartFromButton() with slide number
    }

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
                    duration: null,  // null = use global default
                    displayMode: null,  // null = use global default
                    zoom: null  // null = 100% (no zoom)
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
                    notes: '',
                    duration: null,
                    displayMode: null,
                    zoom: null
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
        pageHeader.hidden = true;
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
            if (img.displayMode) classes += ' has-custom-display-mode';
            thumb.className = classes;
            thumb.draggable = true;
            thumb.tabIndex = 0; // Make focusable for keyboard reordering
            thumb.dataset.index = index;
            var thumbMode = getSlideDisplayMode(index);
            thumb.setAttribute('data-mode', thumbMode);
            var thumbStyles = [];
            if (thumbMode === 'smartcrop') {
                var fp = getFocalPoint(index);
                thumbStyles.push('object-position: ' + fp.x + '% ' + fp.y + '%');
            }
            var zoom = getSlideZoom(index);
            var zoomModes = ['fill', 'smartcrop', 'kenburns'];
            if (zoomModes.indexOf(thumbMode) !== -1 && zoom !== 100) {
                thumbStyles.push('transform: scale(' + (zoom / 100) + ')');
            }
            var thumbImgStyle = thumbStyles.length ? ' style="' + thumbStyles.join('; ') + '"' : '';
            thumb.innerHTML = `
                <img src="${img.dataUrl}" alt="Slide ${index + 1}"${thumbImgStyle}>
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

            // Keyboard reordering with arrow keys
            thumb.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
                    e.preventDefault();
                    moveSlideUp(index);
                } else if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
                    e.preventDefault();
                    moveSlideDown(index);
                }
            });

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

    // Move slide up (toward beginning) via keyboard
    function moveSlideUp(index) {
        if (index <= 0 || index >= images.length) return;

        // Swap with previous slide
        const [slide] = images.splice(index, 1);
        images.splice(index - 1, 0, slide);

        // Update selection if needed
        if (selectedIndex === index) {
            selectedIndex = index - 1;
        } else if (selectedIndex === index - 1) {
            selectedIndex = index;
        }

        // Re-render and focus the moved thumbnail
        showPreview();
        focusThumbnail(index - 1);
    }

    // Move slide down (toward end) via keyboard
    function moveSlideDown(index) {
        if (index < 0 || index >= images.length - 1) return;

        // Swap with next slide
        const [slide] = images.splice(index, 1);
        images.splice(index + 1, 0, slide);

        // Update selection if needed
        if (selectedIndex === index) {
            selectedIndex = index + 1;
        } else if (selectedIndex === index + 1) {
            selectedIndex = index;
        }

        // Re-render and focus the moved thumbnail
        showPreview();
        focusThumbnail(index + 1);
    }

    // Focus a specific thumbnail by index
    function focusThumbnail(index) {
        const allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
        if (allThumbs[index]) {
            allThumbs[index].focus();
        }
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
            const isPresentMode = modePresentRadio.checked;
            const modeLabel = isPresentMode ? 'Present' : 'Practice';
            startFromBtn.textContent = `${modeLabel} from Slide ${selectedIndex + 1}`;
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
        // Show display mode override (empty string = use global default)
        slideDisplayModeOverride.value = images[index].displayMode || '';
        updateDefaultDisplayModeLabel();
        // Show zoom override
        var zoomVal = getSlideZoom(index);
        slideZoomInput.value = zoomVal;
        slideZoomValue.textContent = zoomVal + '%';
        updateZoomVisibility(index);
        notesPanel.hidden = false;
        updateSetTitleButton();
        updateDisplayModePreview(index);
    }

    // Hide the notes panel
    function hideNotesPanel() {
        notesPanel.hidden = true;
        displayPreview.hidden = true;
    }

    // Show/hide zoom slider based on the slide's effective display mode
    function updateZoomVisibility(index) {
        if (index === undefined || index === null) index = selectedIndex;
        var mode = (index !== null && index >= 0 && index < images.length) ? getSlideDisplayMode(index) : 'fit';
        var zoomModes = ['fill', 'smartcrop', 'kenburns'];
        zoomRow.hidden = zoomModes.indexOf(mode) === -1;
    }

    // Update the "Default (X)" label in the per-slide display mode dropdown
    function updateDefaultDisplayModeLabel() {
        var modeLabels = { fit: 'Fit', letterbox: 'Letterbox', fill: 'Fill', smartcrop: 'Smart Crop', kenburns: 'Ken Burns', native: 'Native' };
        var label = modeLabels[displayModeSelect.value] || 'Fit';
        slideDisplayModeOverride.options[0].textContent = 'Default (' + label + ')';
    }

    // Update the display mode preview to show how the slide will look
    function updateDisplayModePreview(index) {
        if (index === undefined || index === null) index = selectedIndex;
        var validSlide = index !== null && index >= 0 && index < images.length;
        displayPreview.hidden = !validSlide;
        if (!validSlide) return;

        var mode = getSlideDisplayMode(index);
        var modeLabels = { fit: 'Fit', letterbox: 'Letterbox', fill: 'Fill', smartcrop: 'Smart Crop', kenburns: 'Ken Burns', native: 'Native' };

        // Update preview image
        displayPreviewImg.src = images[index].dataUrl;
        displayPreviewFrame.setAttribute('data-mode', mode);

        // Smart Crop: show focal point marker and set object-position
        var isSmartCrop = mode === 'smartcrop';
        focalPointMarker.style.display = isSmartCrop ? '' : 'none';
        if (isSmartCrop) {
            var fp = getFocalPoint(index);
            focalPointMarker.style.left = fp.x + '%';
            focalPointMarker.style.top = fp.y + '%';
            displayPreviewImg.style.objectPosition = fp.x + '% ' + fp.y + '%';
        } else {
            displayPreviewImg.style.objectPosition = '';
        }

        // Apply zoom (only for cover-based modes)
        var zoom = getSlideZoom(index);
        var zoomModes = ['fill', 'smartcrop', 'kenburns'];
        displayPreviewImg.style.removeProperty('--pk-zoom');
        if (zoomModes.indexOf(mode) !== -1 && zoom !== 100) {
            if (mode === 'kenburns') {
                // Ken Burns uses CSS custom property for animation start/end scale
                displayPreviewImg.style.setProperty('--pk-zoom', zoom / 100);
                displayPreviewImg.style.transform = '';
            } else {
                displayPreviewImg.style.transform = 'scale(' + (zoom / 100) + ')';
            }
        } else {
            displayPreviewImg.style.transform = '';
        }

        // Update label
        var label = 'Preview: ' + (modeLabels[mode] || 'Fit');
        if (isSmartCrop) label += ' — click to set focal point';
        displayPreviewLabel.textContent = label;
    }

    // Save notes, duration, and display mode for the currently selected slide
    function saveCurrentNotes() {
        if (selectedIndex !== null && images[selectedIndex]) {
            images[selectedIndex].notes = notesInput.value;
            // Save duration override (null if empty)
            const durationValue = parseInt(slideDurationOverride.value, 10);
            images[selectedIndex].duration = (durationValue > 0) ? durationValue : null;
            // Save display mode override (null if "Default")
            images[selectedIndex].displayMode = slideDisplayModeOverride.value || null;
            // Save zoom (null if 100%)
            var zoomVal = parseInt(slideZoomInput.value, 10);
            images[selectedIndex].zoom = (zoomVal && zoomVal !== 100) ? zoomVal : null;
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
                // Custom display mode indicator
                if (images[selectedIndex].displayMode) {
                    allThumbs[selectedIndex].classList.add('has-custom-display-mode');
                } else {
                    allThumbs[selectedIndex].classList.remove('has-custom-display-mode');
                }
                // Update thumbnail display mode preview
                var thumbMode = getSlideDisplayMode(selectedIndex);
                allThumbs[selectedIndex].setAttribute('data-mode', thumbMode);
                var thumbImg = allThumbs[selectedIndex].querySelector('img');
                if (thumbImg) {
                    if (thumbMode === 'smartcrop') {
                        var fp = getFocalPoint(selectedIndex);
                        thumbImg.style.objectPosition = fp.x + '% ' + fp.y + '%';
                    } else {
                        thumbImg.style.objectPosition = '';
                    }
                    // Update thumbnail zoom
                    var thumbZoom = getSlideZoom(selectedIndex);
                    var zoomModes = ['fill', 'smartcrop', 'kenburns'];
                    if (zoomModes.indexOf(thumbMode) !== -1 && thumbZoom !== 100) {
                        thumbImg.style.transform = 'scale(' + (thumbZoom / 100) + ')';
                    } else {
                        thumbImg.style.transform = '';
                    }
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
                displayMode: getDisplayMode(),
                showTimerOverlay: timerTogglePractice.checked,
                showNotesPanel: notesTogglePractice.checked,
                enableAudioWarnings: audioTogglePractice.checked,
                presentationMode: modePresentRadio.checked ? 'present' : 'practice'
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

    // Load an image to get its natural dimensions (in pixels)
    function getImageDimensions(dataUrl) {
        return new Promise(function(resolve) {
            var img = new Image();
            img.onload = function() {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = function() {
                resolve({ width: 0, height: 0 });
            };
            img.src = dataUrl;
        });
    }

    // Build PptxGenJS addImage options based on display mode
    // slideW/slideH are in inches (10 x 5.625 for 16:9)
    function getPptxImageOptions(dataUrl, mode, focalPoint, imgDims, slideW, slideH, zoom) {
        var opts = { data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' };
        var zoomFactor = (zoom || 100) / 100;

        if (mode === 'native' && imgDims.width > 0 && imgDims.height > 0) {
            // Convert pixel dimensions to inches at 96 DPI
            var imgWInches = imgDims.width / 96;
            var imgHInches = imgDims.height / 96;
            // Cap to slide bounds
            if (imgWInches > slideW) { imgHInches *= slideW / imgWInches; imgWInches = slideW; }
            if (imgHInches > slideH) { imgWInches *= slideH / imgHInches; imgHInches = slideH; }
            // Center on slide
            opts.x = (slideW - imgWInches) / 2;
            opts.y = (slideH - imgHInches) / 2;
            opts.w = imgWInches;
            opts.h = imgHInches;
            // No sizing property: image placed at natural size (capped to fit)

        } else if (mode === 'fit') {
            opts.sizing = { type: 'contain', w: '100%', h: '100%' };

        } else if (mode === 'letterbox') {
            opts.sizing = { type: 'contain', w: '100%', h: '100%' };

        } else if (mode === 'smartcrop' && imgDims.width > 0 && imgDims.height > 0) {
            // PptxGenJS 'crop' uses image-relative coordinates in inches.
            // We calculate the visible crop region based on the focal point,
            // mimicking CSS object-fit:cover + object-position.
            var imgAspect = imgDims.width / imgDims.height;
            var slideAspect = slideW / slideH;
            var imgWInches = imgDims.width / 96;
            var imgHInches = imgDims.height / 96;

            // Start with the base cover crop
            var cropX = 0, cropY = 0, cropW = imgWInches, cropH = imgHInches;

            if (imgAspect > slideAspect) {
                cropH = imgHInches;
                cropW = imgHInches * slideAspect;
            } else {
                cropW = imgWInches;
                cropH = imgWInches / slideAspect;
            }

            // Apply zoom: shrink crop region by zoom factor (zoom in = see less)
            if (zoomFactor > 1) {
                cropW = cropW / zoomFactor;
                cropH = cropH / zoomFactor;
            }

            // Position crop around focal point
            var fpXInches = imgWInches * (focalPoint.x / 100);
            var fpYInches = imgHInches * (focalPoint.y / 100);
            cropX = fpXInches - cropW / 2;
            cropY = fpYInches - cropH / 2;
            // Clamp to image bounds
            if (cropX < 0) cropX = 0;
            if (cropY < 0) cropY = 0;
            if (cropX + cropW > imgWInches) cropX = imgWInches - cropW;
            if (cropY + cropH > imgHInches) cropY = imgHInches - cropH;

            opts.sizing = { type: 'crop', x: cropX, y: cropY, w: cropW, h: cropH };

        } else if ((mode === 'fill' || mode === 'kenburns') && zoomFactor > 1 && imgDims.width > 0 && imgDims.height > 0) {
            // Fill/Ken Burns with zoom: crop into center of image
            var imgAspect = imgDims.width / imgDims.height;
            var slideAspect = slideW / slideH;
            var imgWInches = imgDims.width / 96;
            var imgHInches = imgDims.height / 96;

            // Base cover crop
            var cropW, cropH;
            if (imgAspect > slideAspect) {
                cropH = imgHInches;
                cropW = imgHInches * slideAspect;
            } else {
                cropW = imgWInches;
                cropH = imgWInches / slideAspect;
            }

            // Shrink by zoom factor
            cropW = cropW / zoomFactor;
            cropH = cropH / zoomFactor;

            // Center crop
            var cropX = (imgWInches - cropW) / 2;
            var cropY = (imgHInches - cropH) / 2;

            opts.sizing = { type: 'crop', x: cropX, y: cropY, w: cropW, h: cropH };

        } else {
            // fill, kenburns (static cover at 100% zoom), or smartcrop fallback
            opts.sizing = { type: 'cover', w: '100%', h: '100%' };
        }

        return opts;
    }

    // Export presentation as PowerPoint file
    // PptxGenJS doesn't support auto-advance timing natively, so we post-process
    // the PPTX file to add the advTm attribute to slide transitions.
    async function exportPowerPoint() {
        if (typeof PptxGenJS === 'undefined') {
            alert('PowerPoint export is not available. Please check your internet connection and reload the page.');
            return;
        }

        if (images.length === 0) {
            alert('No slides to export.');
            return;
        }

        const pres = new PptxGenJS();

        // Set presentation properties
        pres.author = 'PechaKucha Player';
        pres.title = 'PechaKucha Presentation';
        pres.subject = 'Auto-generated presentation';

        // Set slide dimensions to 16:9 widescreen
        const slideW = 10;
        const slideH = 5.625;
        pres.defineLayout({ name: 'LAYOUT_16x9', width: slideW, height: slideH });
        pres.layout = 'LAYOUT_16x9';

        // Pre-load image dimensions if any slide uses native, smartcrop, or zoom > 100%
        var allDims = [];
        var needsDims = images.some(function(img, i) {
            var m = getSlideDisplayMode(i);
            var z = getSlideZoom(i);
            return m === 'native' || m === 'smartcrop' || z > 100;
        });
        if (needsDims) {
            var dimPromises = images.map(function(img) {
                return getImageDimensions(img.dataUrl);
            });
            allDims = await Promise.all(dimPromises);
        }

        // Track slide durations for post-processing
        const slideDurations = [];

        // Add title slide if present
        if (titleSlide) {
            const titlePptxSlide = pres.addSlide();

            // Title slide always uses cover sizing
            titlePptxSlide.addImage({
                data: titleSlide.dataUrl,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%',
                sizing: { type: 'cover', w: '100%', h: '100%' }
            });

            // Add notes if present
            if (titleSlide.notes) {
                titlePptxSlide.addNotes(titleSlide.notes);
            }

            // Title slide: click to advance only (no auto-advance)
            slideDurations.push(null);
        }

        // Add each slide with per-slide display-mode-aware sizing
        images.forEach((img, index) => {
            var slideMode = getSlideDisplayMode(index);
            const slide = pres.addSlide();

            // Set black background for letterbox mode
            if (slideMode === 'letterbox') {
                slide.background = { fill: '000000' };
            }

            var fp = getFocalPoint(index);
            var dims = allDims[index] || { width: 0, height: 0 };
            var slideZoom = getSlideZoom(index);
            var imgOpts = getPptxImageOptions(img.dataUrl, slideMode, fp, dims, slideW, slideH, slideZoom);
            slide.addImage(imgOpts);

            // Add speaker notes if present
            if (img.notes) {
                slide.addNotes(img.notes);
            }

            // Track duration for post-processing (in milliseconds)
            const duration = img.duration || slideDuration;
            slideDurations.push(duration * 1000);
        });

        try {
            // Generate PPTX as blob
            const blob = await pres.write({ outputType: 'blob' });

            // Post-process to add auto-advance timing
            const modifiedBlob = await addSlideTimingToPptx(blob, slideDurations);

            // Download the modified file
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `pechakucha-${timestamp}.pptx`;
            const url = URL.createObjectURL(modifiedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('PowerPoint export failed:', err);
            alert('Failed to export PowerPoint file. Please try again.');
        }
    }

    // Post-process PPTX blob to add auto-advance timing (advTm) to slides
    // PPTX files are ZIP archives. We extract slide XML files, add the advTm
    // attribute to <p:transition> elements, and repackage.
    async function addSlideTimingToPptx(blob, slideDurations) {
        // JSZip is bundled with PptxGenJS
        const zip = await JSZip.loadAsync(blob);

        // Process each slide
        for (let i = 0; i < slideDurations.length; i++) {
            const slideNum = i + 1;
            const slidePath = `ppt/slides/slide${slideNum}.xml`;
            const slideXml = await zip.file(slidePath)?.async('string');

            if (!slideXml) continue;

            const durationMs = slideDurations[i];
            let modifiedXml;

            if (durationMs === null) {
                // Title slide: click to advance only, no auto-advance
                // Ensure advClick="1" and no advTm
                if (slideXml.includes('<p:transition')) {
                    // Modify existing transition
                    modifiedXml = slideXml.replace(
                        /<p:transition([^>]*)>/,
                        (match, attrs) => {
                            // Remove any existing advTm
                            attrs = attrs.replace(/\s*advTm="[^"]*"/g, '');
                            // Ensure advClick is present
                            if (!attrs.includes('advClick')) {
                                attrs += ' advClick="1"';
                            }
                            return `<p:transition${attrs}>`;
                        }
                    );
                } else {
                    // Add transition element before closing </p:cSld>
                    modifiedXml = slideXml.replace(
                        '</p:cSld>',
                        '</p:cSld><p:transition advClick="1"/>'
                    );
                }
            } else {
                // Content slide: auto-advance after specified duration
                if (slideXml.includes('<p:transition')) {
                    // Modify existing transition to add advTm
                    modifiedXml = slideXml.replace(
                        /<p:transition([^>]*)>/,
                        (match, attrs) => {
                            // Remove any existing advTm to avoid duplicates
                            attrs = attrs.replace(/\s*advTm="[^"]*"/g, '');
                            // Add advTm attribute
                            return `<p:transition${attrs} advTm="${durationMs}">`;
                        }
                    );
                } else {
                    // Add transition element with advTm before closing </p:cSld>
                    modifiedXml = slideXml.replace(
                        '</p:cSld>',
                        `</p:cSld><p:transition advTm="${durationMs}"/>`
                    );
                }
            }

            // Update the file in the ZIP
            zip.file(slidePath, modifiedXml);
        }

        // Generate the modified PPTX blob
        return await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        });
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
                displayModeSelect.value = displayMode;

                // Apply timer overlay preference (default to false for backward compatibility)
                timerTogglePractice.checked = config.settings?.showTimerOverlay || false;

                // Apply notes panel preference (default to false for backward compatibility)
                notesTogglePractice.checked = config.settings?.showNotesPanel || false;

                // Apply audio warnings preference (default to false for backward compatibility)
                audioTogglePractice.checked = config.settings?.enableAudioWarnings || false;
                audioTogglePresenter.checked = config.settings?.enableAudioWarnings || false;

                // Apply presentation mode preference (default to practice for backward compatibility)
                const presentationMode = config.settings?.presentationMode || 'practice';
                document.getElementById('mode-practice').checked = presentationMode === 'practice';
                modePresentRadio.checked = presentationMode === 'present';

                // Apply title slide
                titleSlide = config.titleSlide || null;

                // Apply slides (ensure each has duration and displayMode for backward compatibility)
                images = (config.slides || []).map(slide => ({
                    ...slide,
                    duration: slide.duration || null,
                    displayMode: slide.displayMode || null,
                    zoom: slide.zoom || null
                }));

                // Show preview and update button labels
                updateTitleSlideUI();
                updateStartButtonLabels();
                showPreview();
            } catch (err) {
                if (typeof notify === 'function') {
                    notify('Invalid configuration file: ' + err.message, 'error');
                }
            }
        };
        reader.readAsText(file);
    }

    // Pending start index for practice mode (used after ready overlay)
    let pendingStartIndex = 0;

    // Start slideshow from a specific index (shows ready overlay first)
    function startSlideshowFrom(startIndex) {
        if (images.length === 0) return;

        // Check if external display is selected
        if (modePresentRadio.checked) {
            startExternalPresentation(startIndex);
            return;
        }

        hideUndoToast();
        pendingStartIndex = startIndex;
        showPracticeReadyOverlay(startIndex);
    }

    // Show the practice ready overlay
    function showPracticeReadyOverlay(startIndex) {
        previewSection.hidden = true;
        slideshowSection.hidden = false;
        completeSection.hidden = true;

        // Show ready overlay
        practiceReadyOverlay.hidden = false;

        // Clear any previous background image
        practiceReadyBackground.innerHTML = '';

        // Show title slide or first slide as background
        const backgroundImage = titleSlide ? titleSlide.dataUrl : images[startIndex].dataUrl;
        const img = document.createElement('img');
        img.src = backgroundImage;
        img.alt = 'Preview';
        practiceReadyBackground.appendChild(img);

        // Update slide count message
        const totalSlides = images.length;
        let message = '';
        if (startIndex === 0) {
            message = `${totalSlides} slides`;
        } else {
            message = `Starting from slide ${startIndex + 1} of ${totalSlides}`;
        }
        if (titleSlide) {
            message += ' (with title slide)';
        }
        practiceSlideCount.textContent = message;

        // Initialize controls bar display
        slideCounter.textContent = `${startIndex + 1} / ${totalSlides}`;
        pauseIndicator.hidden = true;
        progressFill.style.width = '0%';
        slideTimerDisplay.textContent = getSlideDuration(startIndex);
        elapsedTimeDisplay.textContent = '0:00';
        totalTimeDisplay.textContent = formatTime(calculateTotalTime());

        // Apply image display mode for the starting slide
        applyDisplayMode(startIndex);
    }

    // Begin practice presentation (called when user clicks Start on ready overlay)
    function beginPracticePresentation() {
        practiceReadyOverlay.hidden = true;

        currentIndex = pendingStartIndex;
        isPaused = false;
        pausedTimeRemaining = 0;
        pausedElapsedOnSlide = 0;
        presentationStartTime = Date.now();
        pauseIndicator.hidden = true;

        // Timer overlay: respect user's checkbox state (preserve their preference)
        timerOverlay.hidden = !timerTogglePractice.checked;

        // Notes panel: respect user's checkbox state
        practiceNotesPanel.hidden = !notesTogglePractice.checked;

        // Initialize elapsed/total time display
        elapsedTimeDisplay.textContent = '0:00';
        totalTimeDisplay.textContent = formatTime(calculateTotalTime());

        showSlide(pendingStartIndex);
    }

    // Show lightbox with image preview
    function showLightbox(index) {
        // Store current focus for restoration
        lightboxPreviousFocus = document.activeElement;

        lightboxImage.src = images[index].dataUrl;
        lightboxImage.alt = `Slide ${index + 1} preview`;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';

        // Move focus to close button for keyboard accessibility
        lightboxClose.focus();
    }

    // Hide lightbox
    function hideLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';

        // Restore focus to the element that opened the lightbox
        if (lightboxPreviousFocus && typeof lightboxPreviousFocus.focus === 'function') {
            lightboxPreviousFocus.focus();
            lightboxPreviousFocus = null;
        }
    }

    // Start the slideshow (shows ready overlay first)
    function startSlideshow() {
        if (images.length === 0) return;

        // Check if external display is selected
        if (modePresentRadio.checked) {
            startExternalPresentation(0);
            return;
        }

        hideUndoToast();
        pendingStartIndex = 0;
        showPracticeReadyOverlay(0);
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

        // Apply display mode for this slide (resets and re-applies per-slide)
        applyDisplayMode(index);

        // Update practice mode notes panel
        practiceNotesText.value = images[index].notes || '';

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
            resetAudioWarnings();
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

    // Apply time warning classes to an element based on remaining seconds
    function applyTimeWarningClass(element, remainingSeconds) {
        // Remove all warning classes first
        element.classList.remove('warning', 'warning-yellow', 'warning-red', 'warning-critical');

        // Apply appropriate warning class
        if (remainingSeconds <= 1) {
            element.classList.add('warning-critical');
        } else if (remainingSeconds <= 3) {
            element.classList.add('warning-red');
        } else if (remainingSeconds <= 5) {
            element.classList.add('warning-yellow');
        }
    }

    // Play an audio beep for time warnings
    function playBeep(count = 1) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const playOneBeep = (delay = 0) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 880; // A5 note
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.1);

            oscillator.start(audioContext.currentTime + delay);
            oscillator.stop(audioContext.currentTime + delay + 0.1);
        };

        for (let i = 0; i < count; i++) {
            playOneBeep(i * 0.15); // 150ms between beeps
        }
    }

    // Check and play audio warnings based on remaining seconds
    function checkAudioWarnings(remainingSeconds, isPresenterMode = false) {
        const audioEnabled = isPresenterMode ? audioTogglePresenter.checked : audioTogglePractice.checked;
        if (!audioEnabled) return;

        // Only beep once per second, and only at 5s and 3s marks
        if (remainingSeconds === lastBeepSecond) return;

        if (remainingSeconds === 5) {
            playBeep(1); // Single beep at 5 seconds
            lastBeepSecond = 5;
        } else if (remainingSeconds === 3) {
            playBeep(2); // Double beep at 3 seconds
            lastBeepSecond = 3;
        }
    }

    // Reset audio warning state for new slide
    function resetAudioWarnings() {
        lastBeepSecond = null;
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
            applyTimeWarningClass(timerOverlayValue, remainingSeconds);
        }

        // Check and play audio warnings (practice mode)
        checkAudioWarnings(remainingSeconds, false);

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
            if (getSlideDisplayMode(currentIndex) === 'kenburns') {
                currentSlide.style.animationPlayState = 'running';
            }
            startSlideTimer();
        } else {
            // Pause
            clearTimers();
            isPaused = true;
            pauseIndicator.hidden = false;
            if (getSlideDisplayMode(currentIndex) === 'kenburns') {
                currentSlide.style.animationPlayState = 'paused';
            }

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
        practiceReadyOverlay.hidden = true;
        slideshowSection.hidden = true;
        previewSection.hidden = false;
    }

    // Apply image display mode to slide containers
    // Optional index parameter for per-slide mode resolution
    function applyDisplayMode(index) {
        var effectiveIndex = (index !== undefined) ? index : currentIndex;
        const mode = getSlideDisplayMode(effectiveIndex);
        const container = currentSlide.parentElement;

        // Reset all mode-specific styles
        currentSlide.style.objectFit = '';
        currentSlide.style.objectPosition = '';
        currentSlide.style.width = '100%';
        currentSlide.style.height = '100%';
        currentSlide.style.maxWidth = '';
        currentSlide.style.maxHeight = '';
        currentSlide.style.transform = '';
        currentSlide.classList.remove('pk-kenburns-active');
        currentSlide.style.animationDuration = '';
        currentSlide.style.transformOrigin = '';
        currentSlide.style.animationPlayState = '';
        currentSlide.style.removeProperty('--pk-zoom');
        container.style.background = '';

        var zoom = getSlideZoom(effectiveIndex);

        if (mode === 'native') {
            currentSlide.style.objectFit = 'none';
            currentSlide.style.width = 'auto';
            currentSlide.style.height = 'auto';
            currentSlide.style.maxWidth = '100%';
            currentSlide.style.maxHeight = '100%';
        } else if (mode === 'letterbox') {
            currentSlide.style.objectFit = 'contain';
            container.style.background = '#000';
        } else if (mode === 'fill') {
            currentSlide.style.objectFit = 'cover';
            if (zoom !== 100) currentSlide.style.transform = 'scale(' + (zoom / 100) + ')';
        } else if (mode === 'smartcrop') {
            currentSlide.style.objectFit = 'cover';
            var fp = getFocalPoint(effectiveIndex);
            currentSlide.style.objectPosition = fp.x + '% ' + fp.y + '%';
            if (zoom !== 100) currentSlide.style.transform = 'scale(' + (zoom / 100) + ')';
        } else if (mode === 'kenburns') {
            currentSlide.style.objectFit = 'cover';
            if (zoom !== 100) currentSlide.style.setProperty('--pk-zoom', zoom / 100);
            applyKenBurns(currentSlide, getSlideDuration(effectiveIndex));
        } else {
            // fit (default)
            currentSlide.style.objectFit = 'contain';
        }
    }

    // Get focal point for a slide (defaults to center)
    function getFocalPoint(index) {
        if (index >= 0 && index < images.length && images[index].focalPoint) {
            return images[index].focalPoint;
        }
        return { x: 50, y: 50 };
    }

    // Get zoom level for a slide (defaults to 100, meaning no zoom)
    function getSlideZoom(index) {
        if (index >= 0 && index < images.length && images[index].zoom) {
            return images[index].zoom;
        }
        return 100;
    }

    // Apply Ken Burns animation to an image element
    function applyKenBurns(img, durationSeconds) {
        // Pick a random origin different from the last one
        var originIndex;
        do {
            originIndex = Math.floor(Math.random() * kenBurnsOrigins.length);
        } while (originIndex === lastKenBurnsOrigin && kenBurnsOrigins.length > 1);
        lastKenBurnsOrigin = originIndex;

        img.classList.remove('pk-kenburns-active');
        // Force reflow to restart animation
        void img.offsetWidth;
        img.style.transformOrigin = kenBurnsOrigins[originIndex];
        img.style.animationDuration = durationSeconds + 's';
        img.classList.add('pk-kenburns-active');
        if (isPaused) {
            img.style.animationPlayState = 'paused';
        }
        return kenBurnsOrigins[originIndex];
    }

    // Get current global display mode value
    function getDisplayMode() {
        return displayModeSelect.value;
    }

    // Get effective display mode for a specific slide (per-slide override or global default)
    function getSlideDisplayMode(index) {
        var slide = images[index];
        return (slide && slide.displayMode) ? slide.displayMode : displayModeSelect.value;
    }

    // End slideshow and show completion
    function endSlideshow() {
        clearTimers();
        slideshowSection.hidden = true;
        completeSection.hidden = false;

        // Calculate stats using per-slide durations
        const totalSlides = images.length;
        const totalSeconds = calculateTotalTime();

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

        pageHeader.hidden = false;
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
            if (typeof notify === 'function') {
                notify('Unable to open presentation window. Please check your popup blocker settings.', 'error');
            }
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
            let classes = 'pk-presenter-filmstrip-thumb';
            if (img.duration) classes += ' has-custom-duration';
            if (img.displayMode) classes += ' has-custom-display-mode';
            thumb.className = classes;
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

        const wasPaused = isPaused;

        // Clear current timer
        clearTimers();

        // Adjust presentation start time for elapsed display
        presentationStartTime = Date.now() - getElapsedTimeBeforeSlide(index);
        currentSlideDuration = getSlideDuration(index) * 1000;
        pausedTimeRemaining = currentSlideDuration;

        // Update current index and show slide
        currentIndex = index;
        showExternalSlide(index);
        updateFilmstripState();

        // Restart timer if presentation is running (not waiting to start)
        if (presenterStartBtn.hidden) {
            // Only start timer if we weren't paused
            if (!wasPaused) {
                isPaused = false;
                pausedTimeRemaining = 0;
                presenterPauseBtn.textContent = 'Pause';
                startExternalSlideTimer();
            } else {
                // Stay paused but update the display
                isPaused = true;
                presenterPauseBtn.textContent = 'Resume';
                presenterTime.textContent = formatTime(Math.ceil(currentSlideDuration / 1000));
                presenterProgressFill.style.width = '0%';
            }
        }
        updatePresenterNavArrows();
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
        }, window.location.origin);

        // Render the filmstrip
        renderPresenterFilmstrip();

        // Show starting slide in presenter view (but don't start timer yet)
        showExternalSlide(currentIndex);
        // Update presenter view to show "waiting to start" state
        presenterTime.textContent = formatTime(slideDuration);
        // Show start button, hide nav group
        presenterStartBtn.hidden = false;
        presenterNavGroup.hidden = true;
    }

    // Begin the slideshow (called when user clicks Start in main window)
    function beginExternalSlideshow() {
        // Send start command to presentation window
        if (presentationWindow && !presentationWindow.closed) {
            presentationWindow.postMessage({ type: 'start' }, window.location.origin);
        }

        // Hide start button, show nav group
        presenterStartBtn.hidden = true;
        presenterNavGroup.hidden = false;
        updatePresenterNavArrows();

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
            var mode = getSlideDisplayMode(index);
            var msg = {
                type: 'showSlide',
                index: index,
                timeRemaining: getSlideDuration(index) * 1000,
                displayMode: mode,
                zoom: getSlideZoom(index)
            };
            // Add mode-specific data
            if (mode === 'kenburns') {
                // Pick a Ken Burns origin and send it so both views match
                var originIndex;
                do {
                    originIndex = Math.floor(Math.random() * kenBurnsOrigins.length);
                } while (originIndex === lastKenBurnsOrigin && kenBurnsOrigins.length > 1);
                lastKenBurnsOrigin = originIndex;
                msg.kenBurnsOrigin = kenBurnsOrigins[originIndex];
            } else if (mode === 'smartcrop') {
                msg.focalPoint = getFocalPoint(index);
            }
            presentationWindow.postMessage(msg, window.location.origin);
        }
    }

    // Start timer for external presentation
    function startExternalSlideTimer() {
        clearTimers();

        slideStartTime = Date.now();
        const isResuming = pausedTimeRemaining > 0;
        // Use pausedTimeRemaining if we have it, otherwise per-slide duration
        currentSlideDuration = isResuming ? pausedTimeRemaining : getSlideDuration(currentIndex) * 1000;

        // Reset audio warnings for new slides (not when resuming)
        if (!isResuming) {
            resetAudioWarnings();
        }

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

        // Apply traffic light warning colors
        applyTimeWarningClass(presenterTime, remainingSeconds);

        // Check and play audio warnings (presenter mode)
        checkAudioWarnings(remainingSeconds, true);

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
            updatePresenterNavArrows();
        }
    }

    // Toggle pause in external presentation
    function toggleExternalPause() {
        if (isPaused) {
            // Resume
            isPaused = false;
            presenterPauseBtn.textContent = 'Pause';

            if (presentationWindow && !presentationWindow.closed) {
                presentationWindow.postMessage({ type: 'resume' }, window.location.origin);
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
                presentationWindow.postMessage({ type: 'pause' }, window.location.origin);
            }
        }
    }

    // Navigate to next slide in external presentation (manual, preserves pause state)
    function goToNextExternalSlide() {
        if (currentIndex < images.length - 1) {
            const wasPaused = isPaused;
            clearTimers();

            const nextIndex = currentIndex + 1;

            // Adjust presentation start time for elapsed display
            presentationStartTime = Date.now() - getElapsedTimeBeforeSlide(nextIndex);
            currentSlideDuration = getSlideDuration(nextIndex) * 1000;
            pausedTimeRemaining = currentSlideDuration;

            showExternalSlide(nextIndex);

            // Only start timer if we weren't paused
            if (!wasPaused) {
                isPaused = false;
                pausedTimeRemaining = 0;
                presenterPauseBtn.textContent = 'Pause';
                startExternalSlideTimer();
            } else {
                // Stay paused but update the display
                isPaused = true;
                presenterPauseBtn.textContent = 'Resume';
                presenterTime.textContent = formatTime(Math.ceil(currentSlideDuration / 1000));
                presenterProgressFill.style.width = '0%';
            }
            updatePresenterNavArrows();
        }
    }

    // Navigate to previous slide in external presentation
    function goToPreviousExternalSlide() {
        if (currentIndex > 0) {
            const wasPaused = isPaused;
            clearTimers();

            // Adjust presentation start time for elapsed display
            presentationStartTime = Date.now() - getElapsedTimeBeforeSlide(currentIndex - 1);
            currentSlideDuration = getSlideDuration(currentIndex - 1) * 1000;
            pausedTimeRemaining = currentSlideDuration; // Full slide duration for new slide

            showExternalSlide(currentIndex - 1);

            // Only start timer if we weren't paused
            if (!wasPaused) {
                isPaused = false;
                pausedTimeRemaining = 0;
                presenterPauseBtn.textContent = 'Pause';
                startExternalSlideTimer();
            } else {
                // Stay paused but update the display
                isPaused = true;
                presenterPauseBtn.textContent = 'Resume';
                presenterTime.textContent = formatTime(Math.ceil(currentSlideDuration / 1000));
                presenterProgressFill.style.width = '0%';
            }
            updatePresenterNavArrows();
        }
    }

    // Update presenter navigation arrow states
    function updatePresenterNavArrows() {
        presenterPrevBtn.disabled = currentIndex === 0;
        presenterNextBtn.disabled = currentIndex === images.length - 1;
    }

    // Show completion screen
    function showCompletion() {
        presenterSection.hidden = true;
        completeSection.hidden = false;

        // Calculate stats using per-slide durations
        const totalSlides = images.length;
        const totalSeconds = calculateTotalTime();

        finalSlideCount.textContent = totalSlides;
        finalDuration.textContent = formatTime(totalSeconds);
    }

    // End external presentation
    function endExternalPresentation() {
        clearTimers();
        stopWindowCheck();

        window.removeEventListener('message', handlePresentationMessage);

        if (presentationWindow && !presentationWindow.closed) {
            presentationWindow.postMessage({ type: 'end' }, window.location.origin);
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
    exportPptxBtn.addEventListener('click', exportPowerPoint);
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
    presenterPrevBtn.addEventListener('click', goToPreviousExternalSlide);
    presenterNextBtn.addEventListener('click', goToNextExternalSlide);

    // Lightbox events - close on any click
    lightbox.addEventListener('click', hideLightbox);
    lightboxClose.addEventListener('click', hideLightbox);

    // Focus trap for lightbox - keep Tab within the lightbox
    lightbox.addEventListener('keydown', (e) => {
        if (e.code !== 'Tab') return;

        // Since the close button is the only focusable element in the lightbox,
        // prevent Tab from leaving the lightbox
        e.preventDefault();
        lightboxClose.focus();
    });

    // Notes panel events
    notesCloseBtn.addEventListener('click', () => {
        saveCurrentNotes();
        deselectThumbnail();
    });
    notesInput.addEventListener('input', saveCurrentNotes);
    notesInput.addEventListener('blur', saveCurrentNotes);

    // Per-slide display mode override
    slideDisplayModeOverride.addEventListener('change', () => {
        saveCurrentNotes();
        if (selectedIndex !== null) {
            updateZoomVisibility(selectedIndex);
            updateDisplayModePreview(selectedIndex);
        }
    });

    // Per-slide zoom
    slideZoomInput.addEventListener('input', () => {
        slideZoomValue.textContent = slideZoomInput.value + '%';
        saveCurrentNotes();
        if (selectedIndex !== null) {
            updateDisplayModePreview(selectedIndex);
        }
    });

    slideZoomReset.addEventListener('click', () => {
        slideZoomInput.value = 100;
        slideZoomValue.textContent = '100%';
        saveCurrentNotes();
        if (selectedIndex !== null) {
            updateDisplayModePreview(selectedIndex);
        }
    });

    // Practice mode notes input (editable during practice)
    practiceNotesText.addEventListener('input', () => {
        if (currentIndex >= 0 && currentIndex < images.length) {
            images[currentIndex].notes = practiceNotesText.value;
        }
    });

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

    // Practice mode start button (on ready overlay)
    practiceStartBtn.addEventListener('click', beginPracticePresentation);

    // Timer toggle in practice mode controls
    timerTogglePractice.addEventListener('change', () => {
        timerOverlay.hidden = !timerTogglePractice.checked;
    });

    // Notes toggle in practice mode controls
    notesTogglePractice.addEventListener('change', () => {
        practiceNotesPanel.hidden = !notesTogglePractice.checked;
    });

    // Presentation mode toggle - update button labels when mode changes
    modePracticeRadio.addEventListener('change', () => {
        updateStartButtonLabels();
        updateStartFromButton();
    });
    modePresentRadio.addEventListener('change', () => {
        updateStartButtonLabels();
        updateStartFromButton();
    });

    // Global display mode change - update thumbnails, per-slide dropdown label, and preview
    displayModeSelect.addEventListener('change', () => {
        updateDefaultDisplayModeLabel();
        // Update all thumbnails that use the global default (no per-slide override)
        var allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
        var globalMode = displayModeSelect.value;
        images.forEach((img, i) => {
            if (!img.displayMode && allThumbs[i]) {
                allThumbs[i].setAttribute('data-mode', globalMode);
                var thumbImg = allThumbs[i].querySelector('img');
                if (thumbImg) thumbImg.style.objectPosition = '';
            }
        });
        if (selectedIndex !== null) {
            updateZoomVisibility(selectedIndex);
            updateDisplayModePreview(selectedIndex);
        }
    });

    // Focal point click handler (only active when preview is in smartcrop mode)
    displayPreviewFrame.addEventListener('click', (e) => {
        if (selectedIndex === null || selectedIndex >= images.length) return;
        if (displayPreviewFrame.getAttribute('data-mode') !== 'smartcrop') return;
        var rect = displayPreviewImg.getBoundingClientRect();
        var x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        var y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));
        images[selectedIndex].focalPoint = { x: x, y: y };
        focalPointMarker.style.left = x + '%';
        focalPointMarker.style.top = y + '%';
        displayPreviewImg.style.objectPosition = x + '% ' + y + '%';
        // Update thumbnail focal point
        var allThumbs = thumbnails.querySelectorAll('.pk-thumbnail');
        if (allThumbs[selectedIndex]) {
            var thumbImg = allThumbs[selectedIndex].querySelector('img');
            if (thumbImg) thumbImg.style.objectPosition = x + '% ' + y + '%';
        }
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
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        // Don't interfere with text navigation
                        if (isTyping) return;
                        e.preventDefault();
                        goToPreviousExternalSlide();
                        return;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        // Don't interfere with text navigation
                        if (isTyping) return;
                        e.preventDefault();
                        goToNextExternalSlide();
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

        // Handle practice ready overlay
        if (!practiceReadyOverlay.hidden) {
            if (e.code === 'Space') {
                e.preventDefault();
                beginPracticePresentation();
                return;
            } else if (e.code === 'Escape') {
                e.preventDefault();
                exitSlideshow();
                return;
            }
            return; // Don't process other keys when on ready overlay
        }

        if (e.code === 'Escape') {
            e.preventDefault();
            exitSlideshow();
        } else if (isTyping) {
            // Don't intercept keys when typing in practice notes
            return;
        } else if (e.code === 'Space') {
            e.preventDefault();
            togglePause();
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
        if (!slideshowSection.hidden && e.code === 'Space' &&
            document.activeElement?.tagName !== 'TEXTAREA') {
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

    // Initialize button labels based on default mode selection
    updateStartButtonLabels();

    // ========================================
    // Tooltip System
    // ========================================

    function initTooltips() {
        var tooltipEl = document.createElement('div');
        tooltipEl.className = 'global-tooltip';
        tooltipEl.style.cssText = 'position:fixed;z-index:10000;background:var(--color-card-bg);border:1px solid var(--color-border);border-radius:8px;padding:12px;box-shadow:0 4px 20px rgba(0,0,0,0.25);font-size:0.8rem;line-height:1.5;color:var(--color-text);max-width:280px;opacity:0;visibility:hidden;transition:opacity 0.15s,visibility 0.15s;pointer-events:none;';
        document.body.appendChild(tooltipEl);

        var triggers = document.querySelectorAll('.info-trigger');

        triggers.forEach(function(trigger) {
            var content = trigger.querySelector('.info-tooltip');
            if (!content) return;

            function showTooltip() {
                tooltipEl.innerHTML = content.innerHTML;
                tooltipEl.style.opacity = '1';
                tooltipEl.style.visibility = 'visible';

                var rect = trigger.getBoundingClientRect();
                var tooltipRect = tooltipEl.getBoundingClientRect();
                var margin = 8;

                var top = rect.bottom + margin;
                var left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

                if (left < margin) left = margin;
                if (left + tooltipRect.width > window.innerWidth - margin) {
                    left = window.innerWidth - tooltipRect.width - margin;
                }

                tooltipEl.style.top = top + 'px';
                tooltipEl.style.left = left + 'px';
            }

            function hideTooltip() {
                tooltipEl.style.opacity = '0';
                tooltipEl.style.visibility = 'hidden';
            }

            trigger.addEventListener('mouseenter', showTooltip);
            trigger.addEventListener('mouseleave', hideTooltip);
            trigger.addEventListener('focus', showTooltip);
            trigger.addEventListener('blur', hideTooltip);
        });
    }

    initTooltips();

})();
