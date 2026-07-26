// --- 1. THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
    
    const sidebarLogoImg = document.getElementById('sidebar-logo-img');
    const splashBird = document.getElementById('splash-bird');
    
    if (document.body.classList.contains('light-theme')) {
        if(sidebarLogoImg) sidebarLogoImg.src = 'ref/portfolio-logo-light.png';
        if(splashBird) splashBird.src = 'ref/portfolio-logo-light.png';
    } else {
        if(sidebarLogoImg) sidebarLogoImg.src = 'ref/portfolio-logo-dark.png';
        if(splashBird) splashBird.src = 'ref/portfolio-logo-dark.png';
    }
});

// --- 2. SUDOKU HUMAN SOLVER ---
const sudokuStart = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],

    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],

    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const solvePath = [
    { r: 0, c: 2, v: 4 }, { r: 0, c: 3, v: 6 }, { r: 0, c: 5, v: 8 }, { r: 0, c: 6, v: 9 }, { r: 0, c: 7, v: 1 }, { r: 0, c: 8, v: 2 },
    { r: 1, c: 1, v: 7 }, { r: 1, c: 2, v: 2 }, { r: 1, c: 6, v: 3 }, { r: 1, c: 7, v: 4 }, { r: 1, c: 8, v: 8 },
    { r: 2, c: 0, v: 1 }, { r: 2, c: 3, v: 3 }, { r: 2, c: 4, v: 4 }, { r: 2, c: 5, v: 2 }, { r: 2, c: 6, v: 5 }, { r: 2, c: 8, v: 7 },
    { r: 3, c: 1, v: 5 }, { r: 3, c: 2, v: 9 }, { r: 3, c: 3, v: 7 }, { r: 4, c: 1, v: 2 }, { r: 4, c: 2, v: 6 }
];

const sudokuContainer = document.getElementById('sudoku-container');
const cellElements = [];

for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.classList.add('sudoku-cell');

        if (sudokuStart[r][c] !== 0) {
            cell.textContent = sudokuStart[r][c];
        } else {
            const stepIndex = solvePath.findIndex(step => step.r === r && step.c === c);
            if (stepIndex !== -1) {
                const span = document.createElement('span');
                span.classList.add('solved-num');
                span.textContent = solvePath[stepIndex].v;
                cellElements[stepIndex] = span;
                cell.appendChild(span);
            }
        }
        sudokuContainer.appendChild(cell);
    }
}

// --- 3. 3D OBJECT LOGIC ---
const polyLeft = document.getElementById('poly-left');
const polyRight = document.getElementById('poly-right');
let currentSides = 0;

function buildPrism(element, sides) {
    element.innerHTML = '';
    const faceWidth = 100;
    const translateZ = (faceWidth / 2) / Math.tan(Math.PI / sides);

    for (let i = 0; i < sides; i++) {
        const face = document.createElement('div');
        face.classList.add('face');
        const rotY = i * (360 / sides);
        face.style.transform = `rotateY(${rotY}deg) translateZ(${translateZ}px)`;
        element.appendChild(face);
    }
}

// --- 4. SCROLL EVENT LISTENER ---
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(1, Math.max(0, scrollTop / maxScroll));

    // A. Sudoku Progress
    const currentStep = Math.floor(scrollPercent * solvePath.length);
    cellElements.forEach((span, index) => {
        if (!span) return;
        if (index < currentStep) {
            span.classList.add('visible');
        } else {
            span.classList.remove('visible');
        }
    });

    // B. Calculate Prism Complexity (4 to 7 sides)
    let requiredSides = Math.floor(scrollPercent * 4) + 4;
    if (requiredSides > 7) requiredSides = 7;

    if (requiredSides !== currentSides) {
        buildPrism(polyLeft, requiredSides);
        buildPrism(polyRight, requiredSides);
        currentSides = requiredSides;
    }

    // C. Asynchronous True 3D Rotations
    const rotXLeft = scrollPercent * 360;
    const rotYLeft = scrollPercent * 720;

    const rotXRight = scrollPercent * -720;
    const rotYRight = scrollPercent * -360;

    polyLeft.style.transform = `rotateX(${rotXLeft}deg) rotateY(${rotYLeft}deg)`;
    polyRight.style.transform = `rotateX(${rotXRight}deg) rotateY(${rotYRight}deg)`;
});

// Initialize first prism state (Cube)
buildPrism(polyLeft, 4);
buildPrism(polyRight, 4);
currentSides = 4;


// --- 5. SEARCH/FILTER LOGIC FOR PROFILES ---
const filterInput = document.getElementById('filter-input');
const profileCards = document.querySelectorAll('.profile-card');

if (filterInput) {
    filterInput.addEventListener('input', () => {
        const query = filterInput.value.toLowerCase().trim();

        profileCards.forEach(card => {
            const searchData = card.getAttribute('data-search');
            if (searchData.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// --- 6. SPLASH SCREEN & MIGRATION ---
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');
    const splashBird = document.getElementById('splash-bird');
    const sidebarLogoImg = document.getElementById('sidebar-logo-img');
    const introDp = document.getElementById('intro-dp');

    if (!splashVideo) return;

    // Handle video end
    splashVideo.addEventListener('ended', () => {
        // Crossfade video to PNG (so it acts as a seamless handover)
        splashVideo.style.opacity = '0';
        splashBird.style.opacity = '1';

        setTimeout(() => {
            // Calculate target position and scale for the bird
            const birdRect = splashBird.getBoundingClientRect();
            const targetRect = sidebarLogoImg.getBoundingClientRect();

            // The bird is absolutely positioned at top 50%, left 50%.
            // We need to calculate the difference between the target center and bird center.
            const birdCenterX = birdRect.left + birdRect.width / 2;
            const birdCenterY = birdRect.top + birdRect.height / 2;
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;

            const deltaX = targetCenterX - birdCenterX;
            const deltaY = targetCenterY - birdCenterY;
            const scale = targetRect.width / birdRect.width;

            // Start migration
            splashScreen.classList.add('migrating');
            
            // Move the splash bird to the sidebar position by appending the delta to its existing translate(-50%, -50%)
            splashBird.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(${scale})`;
            
            // Fade in DP
            introDp.classList.add('visible');

            // After migration finishes (1.5s transition), hide splash and show actual sidebar logo
            setTimeout(() => {
                splashScreen.style.display = 'none';
                sidebarLogoImg.classList.add('visible');
            }, 1500); // 1.5s transition

        }, 300); // Small delay to let opacity transition finish
    });

    // Fallback if video fails to play/load
    splashVideo.addEventListener('error', () => {
        splashScreen.style.display = 'none';
        sidebarLogoImg.classList.add('visible');
        introDp.classList.add('visible');
    });
});
