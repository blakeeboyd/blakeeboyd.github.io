/**
 * PechaKucha Player
 * A web-based presentation player with automatic slide timing
 */

(function() {
    'use strict';

    // State
    let images = [];           // Array of { name, dataUrl }
    let currentIndex = 0;
    let slideTimer = null;
    let progressTimer = null;
    let slideStartTime = null;
    let isPaused = false;
    let pausedTimeRemaining = 0;
    let presentationStartTime = null;
    let draggedIndex = null;   // For drag-and-drop reordering
    let insertPosition = null; // 'before' or 'after' relative to hovered thumbnail
    let insertIndicator = null; // Floating indicator element
    let hoveredIndex = null;   // Currently hovered thumbnail index
    let selectedIndex = null;  // Currently selected thumbnail index
    let undoStack = [];        // Stack of deleted images for undo
    let toastTimer = null;     // Timer for auto-hiding toast

    // Settings (will be read from inputs)
    let slideDuration = 20;    // Seconds per slide
    let targetSlideCount = 20; // Target number of slides

    // DOM Elements
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const slideshowSection = document.getElementById('slideshow-section');
    const completeSection = document.getElementById('complete-section');

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const slideDurationInput = document.getElementById('slide-duration');
    const targetSlidesInput = document.getElementById('target-slides');

    const slideNotice = document.getElementById('slide-notice');
    const thumbnails = document.getElementById('thumbnails');
    const startBtn = document.getElementById('start-btn');
    const startFromBtn = document.getElementById('start-from-btn');
    const resetBtn = document.getElementById('reset-btn');

    const currentSlide = document.getElementById('current-slide');
    const slideCounter = document.getElementById('slide-counter');
    const progressFill = document.getElementById('progress-fill');
    const timeRemaining = document.getElementById('time-remaining');
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

    // Handle file selection (initial upload, replaces images array)
    function handleFiles(fileList) {
        const imageFiles = Array.from(fileList).filter(file =>
            file.type.startsWith('image/')
        );

        if (imageFiles.length === 0) {
            return;
        }

        // Read settings
        slideDuration = parseInt(slideDurationInput.value, 10) || 20;
        targetSlideCount = parseInt(targetSlidesInput.value, 10) || 20;

        // Process each file
        images = [];
        let loaded = 0;

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                images.push({
                    name: file.name,
                    dataUrl: e.target.result
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
                    dataUrl: e.target.result
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
        const target = targetSlideCount;
        if (count === target) {
            slideNotice.textContent = `${count} slides ready`;
            slideNotice.classList.remove('warning');
        } else if (count < target) {
            slideNotice.textContent = `${count} of ${target} slides (${target - count} fewer than target)`;
            slideNotice.classList.add('warning');
        } else {
            slideNotice.textContent = `${count} of ${target} slides (${count - target} more than target)`;
            slideNotice.classList.add('warning');
        }

        // Render thumbnails
        thumbnails.innerHTML = '';

        images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'pk-thumbnail';
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

        if (!thumb.classList.contains('pk-thumbnail') || thumb.classList.contains('dragging')) {
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
        undoStack.push({ image: deletedImage, index: index });

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

    // Undo the last delete
    function undoDelete() {
        if (undoStack.length === 0) return;

        hideUndoToast();

        const lastDeleted = undoStack.pop();
        // Insert back at original position, or at end if that position no longer exists
        const insertIndex = Math.min(lastDeleted.index, images.length);
        images.splice(insertIndex, 0, lastDeleted.image);

        // Adjust selection if needed
        if (selectedIndex !== null && insertIndex <= selectedIndex) {
            selectedIndex++;
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
        } else {
            // Remove previous selection
            if (selectedIndex !== null && allThumbs[selectedIndex]) {
                allThumbs[selectedIndex].classList.remove('selected');
            }
            // Add new selection
            allThumbs[index].classList.add('selected');
            selectedIndex = index;
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

    // Start slideshow from a specific index
    function startSlideshowFrom(startIndex) {
        if (images.length === 0) return;

        hideUndoToast();

        // Read settings again in case they changed
        slideDuration = parseInt(slideDurationInput.value, 10) || 20;

        currentIndex = startIndex;
        isPaused = false;
        presentationStartTime = Date.now();

        previewSection.hidden = true;
        slideshowSection.hidden = false;
        completeSection.hidden = true;
        pauseIndicator.hidden = true;

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

        hideUndoToast();

        // Read settings again in case they changed
        slideDuration = parseInt(slideDurationInput.value, 10) || 20;

        currentIndex = 0;
        isPaused = false;
        presentationStartTime = Date.now();

        previewSection.hidden = true;
        slideshowSection.hidden = false;
        completeSection.hidden = true;
        pauseIndicator.hidden = true;

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

        updateTotalTimeRemaining();
        startSlideTimer();
    }

    // Start timer for current slide
    function startSlideTimer() {
        clearTimers();

        slideStartTime = Date.now();
        const duration = isPaused ? pausedTimeRemaining : slideDuration * 1000;

        // Set timeout for slide advance
        slideTimer = setTimeout(() => {
            advanceSlide();
        }, duration);

        // Start progress animation
        updateProgress();
    }

    // Update progress bar
    function updateProgress() {
        const elapsed = Date.now() - slideStartTime;
        const duration = isPaused ? pausedTimeRemaining : slideDuration * 1000;
        const progress = Math.min(elapsed / duration, 1);

        progressFill.style.width = `${progress * 100}%`;

        if (!isPaused && progress < 1) {
            progressTimer = requestAnimationFrame(updateProgress);
        }
    }

    // Update total time remaining display
    function updateTotalTimeRemaining() {
        const slidesLeft = images.length - currentIndex;
        const totalSecondsLeft = slidesLeft * slideDuration;
        timeRemaining.textContent = formatTime(totalSecondsLeft);
    }

    // Advance to next slide
    function advanceSlide() {
        clearTimers();
        isPaused = false;
        pausedTimeRemaining = 0;
        showSlide(currentIndex + 1);
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

            // Calculate remaining time
            const elapsed = Date.now() - slideStartTime;
            const fullDuration = slideDuration * 1000;
            pausedTimeRemaining = Math.max(fullDuration - elapsed, 0);
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

    // Exit slideshow and return to preview
    function exitSlideshow() {
        clearTimers();
        isPaused = false;
        slideshowSection.hidden = true;
        previewSection.hidden = false;
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
        images = [];
        currentIndex = 0;
        isPaused = false;
        selectedIndex = null;
        undoStack = [];

        uploadSection.hidden = false;
        previewSection.hidden = true;
        slideshowSection.hidden = true;
        completeSection.hidden = true;

        thumbnails.innerHTML = '';
        fileInput.value = '';
        startFromBtn.hidden = true;
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

    // Lightbox events - close on any click
    lightbox.addEventListener('click', hideLightbox);
    lightboxClose.addEventListener('click', hideLightbox);

    // Toast undo button
    toastUndoBtn.addEventListener('click', undoDelete);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
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

        // Only handle slideshow controls when slideshow is visible
        if (slideshowSection.hidden) return;

        if (e.code === 'Space') {
            e.preventDefault();
            togglePause();
        } else if (e.code === 'Escape') {
            e.preventDefault();
            exitSlideshow();
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
    setupDragToAdjust(slideDurationInput);
    setupDragToAdjust(targetSlidesInput);

})();
