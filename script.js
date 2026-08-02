// --- 1. THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');

    const sidebarLogoImg = document.getElementById('sidebar-logo-img');
    const splashBird = document.getElementById('splash-bird');

    if (document.body.classList.contains('light-theme')) {
        if (sidebarLogoImg) sidebarLogoImg.src = 'ref/portfolio-logo-light.png';
        if (splashBird) splashBird.src = 'ref/portfolio-logo-light.png';
    } else {
        if (sidebarLogoImg) sidebarLogoImg.src = 'ref/portfolio-logo-dark.png';
        if (splashBird) splashBird.src = 'ref/portfolio-logo-dark.png';
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
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');
    const splashBird = document.getElementById('splash-bird');
    const sidebarLogoImg = document.getElementById('sidebar-logo-img');
    const introDp = document.getElementById('intro-dp');

    if (!splashVideo) {
        if (sidebarLogoImg) sidebarLogoImg.classList.add('visible');
        if (introDp) introDp.classList.add('visible');
        const introCard = document.getElementById('intro-profile-card');
        if (introCard) introCard.classList.add('visible');
        return;
    }

    let hasMigrated = false;
    const handleVideoEnd = () => {
        if (hasMigrated) return;
        hasMigrated = true;

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

            // Safe fallback if target width is 0
            const scale = (targetRect.width && birdRect.width) ? (targetRect.width / birdRect.width) : 1;
            const deltaX = targetCenterX - birdCenterX;
            const deltaY = targetCenterY - birdCenterY;

            // Start migration — CSS will fade out the entire splash screen
            splashScreen.classList.add('migrating');

            // Move the splash bird to the sidebar position by appending the delta to its existing translate(-50%, -50%)
            splashBird.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(${scale})`;

            // Fade in DP and profile card
            introDp.classList.add('visible');
            const introCard = document.getElementById('intro-profile-card');
            if (introCard) introCard.classList.add('visible');

            // Show the sidebar logo immediately
            sidebarLogoImg.classList.add('visible');

            // After the CSS opacity fade-out finishes (0.8s), fully remove the splash screen from DOM flow
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 900);

        }, 300); // Small delay to let opacity transition finish
    };

    // Handle video end
    if (splashVideo.ended) {
        handleVideoEnd();
    } else {
        splashVideo.addEventListener('ended', handleVideoEnd);
        // Fallback for browsers/devices where the 'ended' event doesn't fire reliably
        splashVideo.addEventListener('timeupdate', () => {
            if (splashVideo.duration && splashVideo.currentTime >= splashVideo.duration - 0.1) {
                handleVideoEnd();
            }
        });

        // Bulletproof fallbacks:
        // 1. Fallback based on actual remaining time (duration - currentTime) so it fires
        //    at the true end of the video even if metadata loads mid-playback.
        splashVideo.addEventListener('loadedmetadata', () => {
            const remaining = (splashVideo.duration - splashVideo.currentTime) * 1000;
            setTimeout(() => {
                if (!hasMigrated) handleVideoEnd();
            }, remaining + 300);
        });
        // 2. Hard fallback timer only triggers if nothing else has fired (e.g. 12 seconds)
        setTimeout(() => {
            if (!hasMigrated) handleVideoEnd();
        }, 12000);
    }

    // Allow user to click anywhere on the splash screen to skip it
    splashScreen.addEventListener('click', handleVideoEnd);

    // Fallback if video fails to play/load
    splashVideo.addEventListener('error', handleVideoEnd);
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
                    // All values in 85-90% band; suggestedMax:92 pushes them to the outer edge
                    data: [90, 86, 88, 85, 90, 87],
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    borderColor: 'rgba(212, 175, 55, 1)',
                    pointBackgroundColor: 'rgba(212, 175, 55, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(212, 175, 55, 1)',
                    borderWidth: 2,
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    pointBorderWidth: 2,
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
                            suggestedMin: 0,
                            suggestedMax: 92,
                            stepSize: 20
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

// --- 9. CERTIFICATION OPTION WHEEL ---
const certData = {
    "Coursera": {
        items: [
            { name: "Excel Basics", path: "ref/certificates/coursera/excel.pdf" }
        ]
    },
    "HackerRank": {
        items: [
            { name: "Java Basic", path: "ref/certificates/hackerrank/java_basic-certificate.pdf" },
            { name: "SQL Basic", path: "ref/certificates/hackerrank/sql_basic-certificate.pdf" }
        ]
    },
    "NPTEL": {
        subfolders: {
            "Jan-Apr 2025": [
                { name: "Marklist", path: "ref/certificates/nptel/Jan-Apr-2025/Jan-Apr-2025-Marklist.pdf" },
                { name: "Principles of Signals and Systems", path: "ref/certificates/nptel/Jan-Apr-2025/Principles-of-Signals-and-Systems.pdf" }
            ],
            "Jan-Apr 2026": [
                { name: "Intro to Embedded System Design", path: "ref/certificates/nptel/Jan-Apr-2026/Introduction-to-Embedded-System-Design.pdf" },
                { name: "Marklist", path: "ref/certificates/nptel/Jan-Apr-2026/Jan-Apr-2026-Marklist.pdf" },
                { name: "Literature and Life", path: "ref/certificates/nptel/Jan-Apr-2026/Literature-and-Life.pdf" },
                { name: "Problem Solving in C", path: "ref/certificates/nptel/Jan-Apr-2026/Problem-Solving-Through-In-C.pdf" }
            ],
            "Jan-Feb 2025": [
                { name: "Fundamental Algorithms", path: "ref/certificates/nptel/Jan-Feb-2025/Fundamental-Algorithms-Design-and-Analysis.pdf" },
                { name: "Marklist", path: "ref/certificates/nptel/Jan-Feb-2025/Jan-Feb-2025-Marklist.pdf" }
            ],
            "Jul-Oct 2025": [
                { name: "Basic Electrical Circuits", path: "ref/certificates/nptel/Jul-Oct-2025/Basic-Electrical-Circuits.pdf" },
                { name: "Marklist", path: "ref/certificates/nptel/Jul-Oct-2025/Jul-Oct-2025-Marklist.pdf" },
                { name: "Problem Solving in C", path: "ref/certificates/nptel/Jul-Oct-2025/Problem-Solving-through-Programming-in-C.pdf" }
            ],
            "July-Oct 2024": [
                { name: "Analog Communication", path: "ref/certificates/nptel/July-Oct-2024/Analog Communication.pdf" },
                { name: "Marklist", path: "ref/certificates/nptel/July-Oct-2024/July-Oct-2024-Marklist.pdf" }
            ]
        }
    },
    "Presentation": {
        items: [
            { name: "Presentation CTK", path: "ref/certificates/presentation/presentaion-ctk-manikandan-m.pdf" },
            { name: "Presentation JSR", path: "ref/certificates/presentation/presentaion-jsr-manikandan-m.jpg" },
            { name: "Presentation KPR", path: "ref/certificates/presentation/presentaion-kpr-manikandan-m.jpg" }
        ]
    },
    "School": {
        items: [
            { name: "Aryabhatta", path: "ref/certificates/school/Aryabhatta.jpg" },
            { name: "Chess", path: "ref/certificates/school/Chess.jpg" },
            { name: "Kho-Kho", path: "ref/certificates/school/Kho-Kho.jpg" },
            { name: "Speech", path: "ref/certificates/school/Speech.jpg" }
        ]
    },
    "TCS-iON": {
        subfolders: {
            "Career Edge": [{ name: "Young Professional", path: "ref/certificates/TCS-iON/Career-Edge-Young-Professional/MANIKANDAN_M_4706769.jpg" }],
            "Soft Skills": [{ name: "Intro to Soft Skills", path: "ref/certificates/TCS-iON/Introduction-to-Soft-Skills/MANIKANDAN_M_4874057.pdf" }],
            "Presentation": [{ name: "Presentation Skills", path: "ref/certificates/TCS-iON/Presentation-Skills/MANIKANDAN_M_4815899.pdf" }]
        }
    },
    "Tenzorx": {
        items: [
            { name: "Tenzorx", path: "ref/certificates/Tenzorx/Tenzorx-17612.jpg" }
        ]
    },
    "Zekatix": {
        items: [
            { name: "Zekatix", path: "ref/certificates/Zekatix/1709996188666-certificate.png" }
        ]
    }
};

const certWheel = document.getElementById('cert-wheel');
const certContentArea = document.getElementById('cert-content-area');
const certCenterText = document.getElementById('cert-center-text');
const categories = Object.keys(certData);

// Fixed positions (% of container) for 8 items inside an equilateral triangle
// Triangle vertices: top-center, bottom-left, bottom-right
const trianglePositions = [
    // Row 1 — apex (1 item)
    { x: 50, y: 14 },  // Coursera
    // Row 2 — upper band (2 items)
    { x: 36, y: 35 },  // HackerRank
    { x: 64, y: 35 },  // NPTEL
    // Row 3 — mid band (3 items)
    { x: 27, y: 57 },  // Presentation
    { x: 50, y: 57 },  // School
    { x: 73, y: 57 },  // TCS-iON
    // Row 4 — lower band (2 items)
    { x: 37, y: 79 },  // Tenzorx
    { x: 63, y: 79 },  // Zekatix
];

function renderCertCards(items) {
    return items.map(item => `
        <div class="cert-card">
            <h4>${item.name}</h4>
            <a href="${item.path}" target="_blank" class="social-icon">View Certificate</a>
        </div>
    `).join('');
}

function handleCategoryClick(index, cat) {
    // Highlight selected item, de-highlight others
    certWheel.querySelectorAll('.cert-item').forEach(el => el.classList.remove('active'));
    certWheel.querySelectorAll('.cert-item')[index].classList.add('active');

    // Update center label
    certCenterText.innerHTML = cat;

    // Fade out old content
    certContentArea.classList.remove('visible');

    setTimeout(() => {
        const data = certData[cat];
        let contentHTML = '';

        if (data.subfolders) {
            const subfolderNames = Object.keys(data.subfolders);
            contentHTML += `<div class="cert-sub-folder-grid">`;
            subfolderNames.forEach((sf, i) => {
                contentHTML += `<button class="cert-sub-btn ${i === 0 ? 'active' : ''}" data-sub="${sf}">${sf}</button>`;
            });
            contentHTML += `</div>`;

            contentHTML += `<div class="cert-cards-grid" id="cert-cards-container">`;
            contentHTML += renderCertCards(data.subfolders[subfolderNames[0]]);
            contentHTML += `</div>`;
        } else if (data.items) {
            contentHTML += `<div class="cert-cards-grid">`;
            contentHTML += renderCertCards(data.items);
            contentHTML += `</div>`;
        }

        certContentArea.innerHTML = contentHTML;
        certContentArea.classList.add('visible');

        // Add listeners to subfolder buttons
        if (data.subfolders) {
            const buttons = certContentArea.querySelectorAll('.cert-sub-btn');
            const cardsContainer = certContentArea.querySelector('#cert-cards-container');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    cardsContainer.innerHTML = renderCertCards(data.subfolders[btn.getAttribute('data-sub')]);
                });
            });
        }
    }, 400); // Wait for wheel rotation and fade out
}

// Initialize triangle
if (certWheel) {
    categories.forEach((cat, i) => {
        const pos = trianglePositions[i] || { x: 50, y: 50 };

        const item = document.createElement('div');
        item.classList.add('cert-item');
        // Position absolutely inside the triangle container
        item.style.left = `${pos.x}%`;
        item.style.top = `${pos.y}%`;

        const label = document.createElement('span');
        label.classList.add('cert-label');
        label.textContent = cat;

        item.appendChild(label);

        item.addEventListener('click', () => handleCategoryClick(i, cat));
        certWheel.appendChild(item);
    });
}

