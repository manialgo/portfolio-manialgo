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
            
            // Fade in DP and profile card
            introDp.classList.add('visible');
            const introCard = document.getElementById('intro-profile-card');
            if (introCard) introCard.classList.add('visible');

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

// --- 7. CARD SWAP LOGIC (FOR EXPERIENCE & PROJECTS) ---
const swapContainers = document.querySelectorAll('.card-swap-container');

swapContainers.forEach(container => {
    const swapCards = Array.from(container.querySelectorAll('.swap-card'));
    
    swapCards.forEach((card, index) => {
        if (index === 0) card.classList.add('front');
        else if (index === 1) card.classList.add('middle');
        else card.classList.add('back');
        
        card.addEventListener('click', () => {
            if (card.classList.contains('front')) {
                cycleDeck(container, swapCards);
            } else {
                bringToFront(container, card);
            }
        });
    });
});

function bringToFront(container, clickedCard) {
    const frontCard = container.querySelector('.swap-card.front');
    if (!frontCard) return;

    if (clickedCard.classList.contains('middle')) {
        frontCard.classList.replace('front', 'middle');
        clickedCard.classList.replace('middle', 'front');
    } else if (clickedCard.classList.contains('back')) {
        frontCard.classList.replace('front', 'back');
        clickedCard.classList.replace('back', 'front');
    }
}

function cycleDeck(container, cards) {
    let frontIdx = cards.findIndex(c => c.classList.contains('front'));
    
    cards.forEach(c => {
        c.classList.remove('front', 'middle', 'back');
    });
    
    const nextFrontIdx = (frontIdx + 1) % cards.length;
    const nextMiddleIdx = (frontIdx + 2) % cards.length;
    
    cards.forEach((c, idx) => {
        if (idx === nextFrontIdx) {
            c.classList.add('front');
        } else if (idx === nextMiddleIdx) {
            c.classList.add('middle');
        } else {
            c.classList.add('back');
        }
    });
}

// --- 8. COMPETENCIES RADAR CHART ---
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('competenciesChart');
    if (ctx) {
        const isLight = document.body.classList.contains('light-theme');
        const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        const pointLabelColor = isLight ? '#333' : '#eee';
        
        const competenciesChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['C Programming', 'Java', 'VS Code', 'Git/GitHub', 'Problem Solving', 'Leadership'],
                datasets: [{
                    label: 'Proficiency',
                    data: [90, 85, 95, 80, 95, 85],
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    borderColor: 'rgba(212, 175, 55, 1)',
                    pointBackgroundColor: 'rgba(212, 175, 55, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(212, 175, 55, 1)',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: {
                            color: pointLabelColor,
                            font: {
                                family: "'Atkinson Hyperlegible Mono', monospace",
                                size: 11
                            }
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 100
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { family: "'Overpass Mono', monospace" },
                        bodyFont: { family: "'Overpass Mono', monospace" }
                    }
                }
            }
        });

        // Update colors when theme changes
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                // Read the state after the original event listener fires (assuming this fires after or just check the DOM)
                setTimeout(() => {
                    const light = document.body.classList.contains('light-theme');
                    competenciesChart.options.scales.r.angleLines.color = light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
                    competenciesChart.options.scales.r.grid.color = light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
                    competenciesChart.options.scales.r.pointLabels.color = light ? '#333' : '#eee';
                    competenciesChart.update();
                }, 10);
            });
        }
    }
});

