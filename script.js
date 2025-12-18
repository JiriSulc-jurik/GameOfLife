let rows = 15;
let cols = 15;
let playing = false;

let timer;
let reproductionTime = 500;

let grid = new Array(rows);
let nextGrid = new Array(rows);

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
    updateView();
    updateStats();
});

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        console.error("Problem: no div for the grid table!");
    }

    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];

    if (grid[row][col] === 1) {
        grid[row][col] = 0;
        this.setAttribute("class", "dead");
    } else {
        grid[row][col] = 1;
        this.setAttribute("class", "live");
    }

    updateStats();
}

function setupControlButtons() {
    let startButton = document.querySelector('#start');
    let clearButton = document.querySelector('#clear');
    let rButton = document.querySelector('#random');

    startButton.onclick = () => {
        if (playing) {
            playing = false;
            startButton.innerHTML = 'pokračovat';
        } else {
            playing = true;
            startButton.innerHTML = 'pauza';
            play();
        }
    };

    clearButton.onclick = () => {
        playing = false;
        startButton.innerHTML = "start";
        resetGrids();
        updateView();
        updateStats();
    };

    rButton.onclick = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.floor(Math.random() * 2);
            }
        }
        updateView();
        updateStats();
    };
}

function play() {
    computeNextGen();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
    updateStats();
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "_" + j);
            if (grid[i][j] === 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);

    if (grid[row][col] === 1) {
        if (numNeighbors < 2) nextGrid[row][col] = 0;
        else if (numNeighbors === 2 || numNeighbors === 3) nextGrid[row][col] = 1;
        else nextGrid[row][col] = 0;
    } else {
        if (numNeighbors === 3) nextGrid[row][col] = 1;
    }
}

function countNeighbors(row, col) {
    let count = 0;

    if (row - 1 >= 0 && grid[row - 1][col] === 1) count++;
    if (row - 1 >= 0 && col - 1 >= 0 && grid[row - 1][col - 1] === 1) count++;
    if (row - 1 >= 0 && col + 1 < cols && grid[row - 1][col + 1] === 1) count++;

    if (col - 1 >= 0 && grid[row][col - 1] === 1) count++;
    if (col + 1 < cols && grid[row][col + 1] === 1) count++;

    if (row + 1 < rows && grid[row + 1][col] === 1) count++;
    if (row + 1 < rows && col - 1 >= 0 && grid[row + 1][col - 1] === 1) count++;
    if (row + 1 < rows && col + 1 < cols && grid[row + 1][col + 1] === 1) count++;

    return count;
}

function updateStats() {
    let live = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) live++;
        }
    }

    let dead = rows * cols - live;

    document.getElementById("liveCount").textContent = live;
    document.getElementById("deadCount").textContent = dead;
}
