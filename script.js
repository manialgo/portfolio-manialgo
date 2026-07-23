// --- 1. THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
});

// --- 2. SUDOKU HUMAN SOLVER ---
const sudokuStart = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],
    
    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],
    
    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
];

const solvePath = [
    {r:0, c:2, v:4}, {r:0, c:3, v:6}, {r:0, c:5, v:8}, {r:0, c:6, v:9}, {r:0, c:7, v:1}, {r:0, c:8, v:2},
    {r:1, c:1, v:7}, {r:1, c:2, v:2}, {r:1, c:6, v:3}, {r:1, c:7, v:4}, {r:1, c:8, v:8},
    {r:2, c:0, v:1}, {r:2, c:3, v:3}, {r:2, c:4, v:4}, {r:2, c:5, v:2}, {r:2, c:6, v:5}, {r:2, c:8, v:7},
    {r:3, c:1, v:5}, {r:3, c:2, v:9}, {r:3, c:3, v:7}, {r:4, c:1, v:2}, {r:4, c:2, v:6}
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