// Simple obfuscation so hexcodes aren't directly in the source code
const clues = [
    {
        id: 1,
        title: "Memory Fragment 01",
        text: "While repairing a damaged memory, Sam finds a torn page.\n\nMost of the page has faded away.\n\nOne side shows a lone figure standing before a gate.\n\nThe other side tells a story that begins among the stars and ends in a battle.\n\nThe strange part is that the figure and the battle seem connected, as if the same name was written twice in different places.\n\nSam feels he has seen this memory before.\n\nWhat is he looking at??",
        target: "I0ExM0YyQg==", // base64 for #A13F2B (Mars)
        found: false
    },
    {
        id: 2,
        title: "Memory Fragment 02",
        text: "One memory fragment appears larger than the rest.\n\nIts surface is restless, marked by a storm that has survived longer than generations of people.\n\nMany worlds surround it, yet it remains the giant among them.\n\nWhen Sam looks toward it, he feels as though it guards the path ahead.\n\nThe glitch has erased its name, but not its presence.\n\nWhich marker is it?",
        target: "I0U4QzE4QQ==", // base64 for #E8C18A (Jupiter)
        found: false
    },
    {
        id: 3,
        title: "Memory Fragment 03",
        text: "A memory fragment appears as an old road sign.\n\nThe left side contains a machine from Sam's childhood.\n\nAnd also  contains a trail of scattered words.\n\nThe trail starts with something counted, passes someone who never stays in one place, and finishes beside a person's body.\n\nThe machine and the final clue seem to mirror each other in a way Sam can't explain.\n\nWhat memory is trying to form?",
        target: "I0YyRDQ4Qw==", // base64 for #F2D48C (Saturn)
        found: false
    },
    {
        id: 4,
        title: "Memory Fragment 04",
        text: "As the system glitches, a lighthouse appears on a distant shore.\n\nNearby, fragments of a forgotten message drift through the air.\n\nThe message begins with many voices together, grows brighter as it continues, and finally points somewhere.\n\nThe lighthouse seems to recognise that final direction.\n\nSam remembers only one thing:\n\n\"If you find the direction, you'll find the memory.\"\n\nWhat is it?",
        target: "I0FEQjdGRg==", // base64 for #ADB7FF (Polaris)
        found: false
    },
    {
        id: 5,
        title: "Memory Fragment 05",
        text: "Among the stars floats something that does not belong.\n\nIt has never burned like a star, nor wandered like a planet.\n\nIt was created far from this place, yet it spends its life watching from above.\n\nSam remembers that it was built not to travel, but to remember.\n\nWhile everything else here is part of the universe, this object is part of a story written by human hands.\n\nWhich marker is it?",
        target: "IzREQTZGRg==", // base64 for #4DA6FF (Satellite Wing)
        found: false
    }
];

let activeModalIndex = null;

// Dual Theme Transition Logic
const btnEnter = document.getElementById('btn-enter');
const entryView = document.getElementById('entry-view');
const planetariumView = document.getElementById('planetarium-view');
const grainOverlay = document.getElementById('grain-overlay');
const starfieldBg = document.getElementById('starfield-bg');

btnEnter.addEventListener('click', () => {
    // 1. Fade out the entry view
    entryView.classList.add('opacity-0');
    
    // 2. Wait for fade out, then transition body and backgrounds
    setTimeout(() => {
        entryView.classList.add('hidden');
        
        // Change theme on body
        document.body.classList.remove('theme-sandy');
        document.body.classList.add('theme-dark');
        
        // Hide grain, show starfield
        grainOverlay.classList.add('opacity-0');
        starfieldBg.classList.remove('hidden');
        
        // 3. Fade in planetarium view
        setTimeout(() => {
            planetariumView.classList.remove('hidden');
        }, 500); // give the background time to start transitioning
        
    }, 1000);
});

// DOM Elements
const riddleText = document.getElementById('riddle-text');
const currentClueLabel = document.getElementById('current-clue-label');
const btnNextClue = document.getElementById('btn-next-clue');
const clueTab = document.getElementById('clue-tab');
const part1Layout = document.getElementById('part1-layout');

// Part 2 DOM Elements
const part2View = document.getElementById('part2-view');
const filterBtns = document.querySelectorAll('.filter-btn');
const currentFiltersSpan = document.getElementById('current-filters');
const filterFeedback = document.getElementById('filter-feedback');
const imageTintOverlay = document.getElementById('image-tint-overlay');
const hiddenNumbers = document.getElementById('hidden-numbers');
const notebookPanel = document.getElementById('notebook-panel');
const extractionWorkspace = document.getElementById('extraction-workspace');
const finalPart2Password = document.getElementById('final-part2-password');
const btnRevealMessage = document.getElementById('btn-reveal-message');

let activeFilters = [];
let currentClueIndex = 0;

const dragDropView = document.getElementById('drag-drop-view');
const draggables = document.querySelectorAll('.draggable-item');
const dropZones = document.querySelectorAll('.drop-zone');
const dragSourceContainer = document.getElementById('drag-source-container');
const btnVerifySequence = document.getElementById('btn-verify-sequence');
const sequenceFeedback = document.getElementById('sequence-feedback');

function updateUI() {
    const clue = clues[currentClueIndex];
    riddleText.innerText = clue.text;
    if (currentClueLabel) {
        currentClueLabel.innerText = clue.title.toUpperCase();
    }
    
    // Update tab styling
    document.querySelectorAll('.memory-tab-btn').forEach((btn, idx) => {
        if (idx === currentClueIndex) {
            btn.classList.add('selected');
            btn.style.borderColor = '#00ffaa';
            btn.style.color = '#00ffaa';
        } else {
            btn.classList.remove('selected');
            btn.style.borderColor = '';
            btn.style.color = '';
        }
    });
}

// Tab Click Logic
document.querySelectorAll('.memory-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentClueIndex = parseInt(btn.getAttribute('data-index'));
        updateUI();
    });
});

document.getElementById('btn-scroll-down').addEventListener('click', () => {
    // Scroll down to the Drag and Drop section
    dragDropView.scrollIntoView({ behavior: 'smooth' });
});

// --- Drag and Drop Logic ---

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
        draggable.classList.add('dragging');
        e.dataTransfer.setData('text/plain', draggable.id);
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // allow drop
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        
        // If zone already has an item, move it back to source container
        if (zone.children.length > 0) {
            dragSourceContainer.appendChild(zone.children[0]);
        }
        
        zone.appendChild(draggable);
    });
});

// Allow dropping back into the source container
dragSourceContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});
dragSourceContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    dragSourceContainer.appendChild(draggable);
});

btnVerifySequence.addEventListener('click', async () => {
    let order = [];
    for (let i = 0; i < dropZones.length; i++) {
        const zone = dropZones[i];
        if (zone.children.length === 0) {
            order.push(null);
        } else {
            order.push(zone.children[0].id);
        }
    }
    
    try {
        const res = await fetch('/api/verify-celestial-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order })
        });
        const data = await res.json();
        
        if (!data.success) {
            sequenceFeedback.innerText = "Something feels out of place.";
            sequenceFeedback.style.color = "#ff3366";
        } else {
            sequenceFeedback.innerText = "Memory Sequence Restored";
            sequenceFeedback.style.color = "#00ffaa";
            
            // Transition to Part 2
            setTimeout(() => {
                part1Layout.classList.add('hidden');
                part2View.classList.remove('hidden');
                
                // Move image wrapper to part2View
                const imageWrapper = document.getElementById('planetarium-image-wrapper');
                part2View.insertBefore(imageWrapper, part2View.firstChild);
            }, 1000);
        }
    } catch (err) {
        sequenceFeedback.innerText = "Network Error.";
        sequenceFeedback.style.color = "#ff3366";
    }
});

document.getElementById('btn-back-from-part2').addEventListener('click', () => {
    // Transition back to Part 1 (which includes Drag and Drop now)
    part2View.classList.add('hidden');
    part1Layout.classList.remove('hidden');
    
    // Move image wrapper back to part1 just in case they went to part 2 and came back
    const imageWrapper = document.getElementById('planetarium-image-wrapper');
    document.querySelector('.image-section').appendChild(imageWrapper);
    
    // Smoothly scroll to drag-drop view to continue from where they left off
    dragDropView.scrollIntoView({ behavior: 'smooth' });
});

// Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        
        // Toggle filter selection
        if (activeFilters.includes(color)) {
            activeFilters = activeFilters.filter(f => f !== color);
            btn.classList.remove('selected');
        } else {
            if (activeFilters.length >= 3) {
                // remove oldest
                const removedColor = activeFilters.shift();
                document.querySelector(`.filter-btn[data-color="${removedColor}"]`).classList.remove('selected');
            }
            activeFilters.push(color);
            btn.classList.add('selected');
        }
        
        updatePart2UI();
    });
});

function updatePart2UI() {
    // Reset classes
    imageTintOverlay.className = '';
    hiddenNumbers.classList.remove('revealed');
    notebookPanel.classList.add('hidden');
    extractionWorkspace.classList.add('hidden');
    
    currentFiltersSpan.innerText = activeFilters.length === 0 ? "None" : activeFilters.join(' + ');
    currentFiltersSpan.style.color = activeFilters.length > 0 ? "#4da6ff" : "#fff";

    if (activeFilters.length === 0) {
        filterFeedback.innerText = "Nothing unusual appears.";
    } else if (activeFilters.length === 1 && activeFilters[0] === 'Red') {
        imageTintOverlay.classList.add('tint-red');
        filterFeedback.innerText = "Something seems hidden beneath the surface...";
    } else if (activeFilters.length === 2 && activeFilters[0] === 'Red' && activeFilters[1] === 'Blue') {
        imageTintOverlay.classList.add('tint-blue');
        filterFeedback.innerText = "The markings begin to appear. One more lens is needed...";
    } else if (activeFilters.length === 3 && activeFilters[0] === 'Red' && activeFilters[1] === 'Blue' && activeFilters[2] === 'Green') {
        imageTintOverlay.classList.add('tint-green');
        filterFeedback.innerText = "The secrets have been fully revealed.";
        hiddenNumbers.classList.add('revealed');
        
        // Show notebook and extraction
        notebookPanel.classList.remove('hidden');
        extractionWorkspace.classList.remove('hidden');
        
        // Get elements
        const nb = document.getElementById('notebook-book');
        const cover = document.getElementById('nb-cover');
        const titlePage = document.getElementById('nb-title-page');
        
        // Reset to closed state
        nb.classList.remove('nb-animate-in');
        cover.classList.remove('nb-cover-opening');
        cover.style.display = '';
        titlePage.classList.remove('nb-title-turning');
        titlePage.style.display = '';
        
        // Force reflow
        void nb.offsetWidth;
        
        // STEP 1: Slide the closed notebook into view
        nb.classList.add('nb-animate-in');
        
        // STEP 2: Click the cover to open it
        cover.onclick = function() {
            cover.classList.add('nb-cover-opening');
            // After animation, hide it completely
            setTimeout(function() {
                cover.style.display = 'none';
            }, 1100);
        };
        
        // STEP 3: Click "Next Page" on title page to turn it
        const btnNext = document.getElementById('btn-next-page');
        if (btnNext) {
            btnNext.onclick = function() {
                titlePage.classList.add('nb-title-turning');
                // After animation, hide it completely
                setTimeout(function() {
                    titlePage.style.display = 'none';
                }, 900);
            };
        }
        
    } else if (activeFilters.length === 3) {
        // Wrong 3-color sequence
        filterFeedback.innerText = "Incorrect sequence. The lenses shatter... Resetting.";
        setTimeout(() => {
            activeFilters = [];
            filterBtns.forEach(b => b.classList.remove('selected'));
            updatePart2UI();
        }, 1200);
    } else {
        // Only trigger on Red/Yellow if we wanted to map them, 
        // but now we just use Red->Blue->Green. Any other filter does nothing specific.
        if(activeFilters[0] === 'Blue') imageTintOverlay.classList.add('tint-blue');
        if(activeFilters[0] === 'Yellow') imageTintOverlay.classList.add('tint-yellow');
        filterFeedback.innerText = "The filter changes the light, but reveals no secrets.";
    }
}

// Extraction Workspace Logic
finalPart2Password.addEventListener('input', () => {
    const val = finalPart2Password.value.trim();
    if (val.length > 0) {
        btnRevealMessage.removeAttribute('disabled');
        btnRevealMessage.style.borderColor = '#00ffaa';
        btnRevealMessage.style.color = '#00ffaa';
    } else {
        btnRevealMessage.setAttribute('disabled', 'true');
        btnRevealMessage.style.borderColor = '';
        btnRevealMessage.style.color = '';
    }
});

btnRevealMessage.addEventListener('click', async () => {
    const pwd = finalPart2Password.value.trim().toUpperCase();
    
    try {
        const res = await fetch('/api/verify-planetarium', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pwd })
        });
        const data = await res.json();
        
        if (data.success) {
            // Show success message
        const msg = document.createElement('div');
        msg.style.position = 'fixed';
        msg.style.top = '0'; msg.style.left = '0'; msg.style.width = '100%'; msg.style.height = '100%';
        msg.style.background = 'rgba(0,0,0,0.9)';
        msg.style.zIndex = '9999';
        msg.style.display = 'flex';
        msg.style.flexDirection = 'column';
        msg.style.justifyContent = 'center';
        msg.style.alignItems = 'center';
        msg.style.color = '#00ffaa';
        msg.style.fontFamily = "'Space Mono', monospace";
        msg.style.textAlign = 'center';
        msg.style.padding = '2rem';
        
        msg.innerHTML = `
            <div style="max-width: 600px; text-align: center; margin-bottom: 2rem; color: #e0e5ff; line-height: 1.6;">
                <p>The guide smiled as the lights faded.</p>
                <p>"Most people leave the planetarium remembering the stars."</p>
                <p>"We left remembering the moments."</p>
                <p>The colours are no longer hidden.<br>
                The identities have been recovered.<br>
                And with them, a forgotten piece of the past.</p>
                <p>But this memory was only a single stop along the journey.<br>
                The moments that shaped the story still lie ahead.<br>
                Follow them in the order they were lived.</p>
            </div>
            <button id="btn-final-close" class="cyber-btn">PROCEED</button>
        `;
        
        document.body.appendChild(msg);
        
        document.getElementById('btn-final-close').addEventListener('click', () => {
            msg.innerHTML = `
                <h2 class="orbitron-text" style="font-size: 2rem; color: #00ffaa; letter-spacing: 0.2em;">LOADING NEXT MEMORY...</h2>
            `;
            
            setTimeout(() => {
                document.body.classList.add('glitch-flash');
                msg.innerHTML = `
                    <h2 class="orbitron-text glitch-text" data-text="SYSTEM FAILURE" style="font-size: 4rem; color: #ff3366; font-weight: bold; margin: 0;">SYSTEM FAILURE</h2>
                    <h2 class="orbitron-text glitch-text" data-text="MEMORY CORRUPTED" style="font-size: 2.5rem; color: #ff3366; margin-top: 1rem;">MEMORY CORRUPTED</h2>
                `;
            }, 3000);
        });
    } else {
        // Incorrect password visual feedback
        finalPart2Password.style.borderColor = '#ff4d4d';
        finalPart2Password.style.color = '#ff4d4d';
        
        // Optional shake animation could go here
        
        setTimeout(() => {
            finalPart2Password.style.borderColor = '';
            finalPart2Password.style.color = '';
        }, 1000);
    }
    } catch (err) {
        finalPart2Password.value = "NETWORK ERROR";
    }
});

// Initialize
updateUI();
