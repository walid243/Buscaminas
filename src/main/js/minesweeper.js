const timer = {
  isRunning: false,
  timerId: null,
  value: 0,
  interval: 1000,
  start: function () {
    this.isRunning = true;
    this.timerId = setInterval(() => {
      this.value++;
      updateTimerValue();
    }, this.interval);
  },
  stop: function () {
    console.log(this.timerId);
    clearInterval(this.timerId);
    this.isRunning = false;
  },
  reset: function () {
    this.value = 0;
    this.stop();
  },
};
const mineCounter = {
  totalMines: 0,
  value: 0,
  setTotalMines: function (totalMines) {
    this.totalMines = totalMines;
    },
  setValue: function (newValue) {
    this.value = newValue;
  },
  getTotalMines: function () {
    return this.totalMines;
    },
  getValue: function () {
    return this.value;
  },
  decrement: function () {
    this.value--;
  },
  increment: function () {
    this.value++;
  }
};
const mineValue = "*";
var boardData;
var coveredCells;
startGame();

function startGame() {
  boardData = setBoardData();
  coveredCells = getCoveredCellsCount();
  setDataCellsValue();
  mineCounter.setTotalMines(getMinesCount());
  mineCounter.setValue(mineCounter.getTotalMines());
  console.log(mineCounter);
  createBoard();
  setMineCounterValue();
  addEvent();
}

function getMockData(cellsData) {
  let matrix = [];
  let row;
  for (let i = 0; i < cellsData.length; i++) {
    row = [];
    for (let j = 0; j < cellsData[i].length; j++) {
      if (cellsData[i][j] == mineValue) {
        row.push(setCellObject(i + 1, j + 1, true, mineValue));
      } else {
        row.push(setCellObject(i + 1, j + 1, false));
      }
    }
    matrix.push(row);
  }
  return matrix;
}

function getRandomBoardData() {
  let dataMatrix;
  let row;
  let height = 8;
  let width = 8;
  let totalMines = 10;
  let mines;
  while (true) {
    mines = 0;
    dataMatrix = [];
    for (let i = 0; i < height; i++) {
      row = [];
      for (let j = 0; j < width; j++) {
        if (mines < totalMines) {
          if (Math.random() < 0.2) {
            row.push(setCellObject(i + 1, j + 1, true, mineValue));
            mines++;
          } else {
            row.push(setCellObject(i + 1, j + 1, false));
          }
        } else {
          row.push(setCellObject(i + 1, j + 1, false));
        }
      }
      dataMatrix.push(row);
    }
    if (mines == totalMines) {
      console.log(dataMatrix);
      return dataMatrix;
    }
  }
}

function setCellObject(row, col, isMined, value = null) {
  let cell = {
    id: row + "-" + col,
    value: value,
    isMine: isMined,
    isCovered: true,
    isFlagged: false,
    isQuestionMarked: false,
  };
  return cell;
}
function setBoardData() {
  let dataMatrix;
  if (hasMockParam()) {
    let mockParam = new URLSearchParams(window.location.search).get("mockData");
    let mockData = mockParam.split("-");
    dataMatrix = getMockData(mockData);
  } else {
    dataMatrix = getRandomBoardData();
  }
  return dataMatrix;
}

function hasMockParam() {
  return new URLSearchParams(window.location.search).has("mockData")
    ? true
    : false;
}

function createBoard() {
  let height = boardData.length;
  let width;
  let board = document.createElement("table");
  board.setAttribute("id", "board");
  board.setAttribute("data-testid", "board");
  board.appendChild(createHeadRow());
  for (let i = 1; i <= height; i++) {
    width = boardData[i - 1].length;
    board.appendChild(createRow(i, width));
  }
  document.body.appendChild(board);
}

function createHeadRow() {
  let headRow = document.createElement("tr");
  headRow.setAttribute("id", "row-0");
  headRow.setAttribute("data-testid", "row-0");

  let counter = document.createElement("td");
  counter.setAttribute("id", "counter");
  counter.setAttribute("data-testid", "counter");

  let reset = document.createElement("td");
  reset.setAttribute("id", "reset");
  reset.setAttribute("data-testid", "reset");
  reset.addEventListener("click", function () {
    resetGame();
  });

  let timerElement = document.createElement("td");
  timerElement.setAttribute("id", "timer");
  timerElement.setAttribute("data-testid", "timer");

  headRow.append(counter, reset, timerElement);
  return headRow;
}

function createRow(rowNum, width) {
  let row = document.createElement("tr");
  row.setAttribute("id", "row-" + rowNum);
  for (let j = 1; j <= width; j++) {
    row.appendChild(createCell(j, rowNum));
  }

  return row;
}

function createCell(id, rowNum) {
  let cell = document.createElement("td");
  let cellId = rowNum + "-" + id;
  cell.setAttribute("id", cellId);
  cell.setAttribute("data-testid", rowNum + "-" + id);
  cell.classList.add("cell", "covered");
  cell.textContent = " ";
  return cell;
}

function uncoverCell(cellId, cellData) {
  let cell = document.getElementById(cellId);
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  disableCell(cellId);
  setCellValue(cell, cellData);
  updateCellData(cellData, "isCovered", false);
  console.log(cellData);
  if (cellData.value == 0) {
    uncoverNeighbours(cell.getAttribute("id"));
  }
  updateCoveredCells();
}

function disableCell(cellId) {
  document.getElementById(cellId).setAttribute("disabled", true);
  removeMouseDownEvent(cellId);
}

function setCellValue(cell, cellData) {
  cell.textContent = cellData.value == 0 ? " " : cellData.value;
}

function getCellData(id) {
  let cellPosition = getCellPosition(id);
  let row = cellPosition[0] - 1;
  let col = cellPosition[1] - 1;
  return boardData[row][col];
}

function addEvent() {
  cellEvents();
}

function removeMouseDownEvent(cellId) {
  let cell = document.getElementById(cellId);
  cell.removeEventListener("mousedown", clickHandler);
}

function cellEvents() {
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", clickHandler);
    elements[i].addEventListener("contextmenu", function (Event) {
      Event.preventDefault();
    });
  }
}
function clickHandler(Event) {
  interactWithCell(Event);
}
function interactWithCell(Event) {
  let cell = Event.target;
  let cellId = cell.getAttribute("id");
  let cellData = getCellData(cellId);
  if (!timer.isRunning) {
    setTimerVelue();
    timer.start();
  }
  switch (Event.button) {
    case 0:
      if (cellData.isFlagged) {
        increaseMineCounterValue();
        updateCellData(cellData, "isFlagged", false);
      }
      uncoverCell(cellId, cellData);
      if (isMined(cellData)) {
        gameOver();
      } else if (coveredCells == mineCounter.totalMines) {
        win();
      }
      break;

    case 1:
      if (cellData.isQuestionMarked) {
        untagCell(cell);
        updateCellData(cellData, "isQuestionMarked", false);
      } else {
        if (cellData.isFlagged) {
          increaseMineCounterValue();
          updateCellData(cellData, "isFlagged", false);
        }
        setCellTag(cell, "?");
        updateCellData(cellData, "isQuestionMarked", true);
      }
      break;
    case 2:
      if (cellData.isQuestionMarked) {
        updateCellData(cellData, "isQuestionMarked", false);
      }
      if (cellData.isFlagged) {
        untagCell(cell);
        increaseMineCounterValue();
        updateCellData(cellData, "isFlagged", false);
      } else {
        setCellTag(cell, "!");
        decreaseMineCounterValue();
        updateCellData(cellData, "isFlagged", true);
      }
      break;
  }
}

function updateCellData(cellData, property, value) {
  cellData[property] = value;

  if (!cellData.isCovered) {
    cellData.isFlagged = false;
    cellData.isQuestionMarked = false;
  }
  if (cellData.isFlagged) {
    cellData.isCovered = true;
    cellData.isQuestionMarked = false;
  }
  if (cellData.isQuestionMarked) {
    cellData.isCovered = true;
    cellData.isFlagged = false;
  }
}

function gameOver() {
  let board = document.getElementById("board");
  board.setAttribute("gameover", true);
  timer.stop();
  uncoverMines();
  disableAllCells();
}

function isMined(cell) {
  return cell.isMine;
}

function isFlagged(cellData) {
  return cellData.isFlagged;
}

function setCellTag(cell, tag) {
  cell.textContent = tag;
}

function untagCell(cell) {
  cell.textContent = " ";
}

function uncoverMines() {
  let cells = document.getElementsByClassName("cell");
  let cellData;
  let cellId;
  for (let i = 0; i < cells.length; i++) {
    cellId = cells[i].getAttribute("id");
    cellData = getCellData(cellId);
    if (cellData.isCovered) {
      if (!isMined(cellData) && isFlagged(cellData)) {
        uncorectlyTaggedCell(cellId);
      } else if (isMined(cellData) && !isFlagged(cellData)) {
        uncoverCell(cellId, cellData);
      }
    }
  }
}

function getCellPosition(id) {
  return id.split("-");
}

function uncorectlyTaggedCell(cellId) {
  let cell = document.getElementById(cellId);
  cell.classList.add("incorrectly-tagged");
  uncoverCell(cellId, getCellData(cellId));
  cell.textContent = "x";
}

function disableAllCells() {
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    disableCell(elements[i].getAttribute("id"));
  }
}

function win() {
  let board = document.getElementById("board");
  board.setAttribute("win", true);
  timer.stop();
  disableAllCells();
  autoTagMines();
}

function autoTagMines() {
  let elements = document.getElementsByClassName("cell");
  let elementId;
  let cellData;
  for (let i = 0; i < elements.length; i++) {
    elementId = elements[i].getAttribute("id");
    cellData = getCellData(elementId);
    if (isMined(cellData) && !isFlagged(cellData)) {
      setCellTag(elements[i], "!");
      updateCellData(cellData, "isFlagged", true);
    }
  }
}

function getMinesCount() {
  let count = 0;
  boardData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        count++;
      }
    });
  });
  return count;
}

function getCoveredCellsCount() {
  let count = 0;
  boardData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isCovered) {
        count++;
      }
    });
  });
  return count;
}

function updateCoveredCells() {
  coveredCells = getCoveredCellsCount();
}

function setDataCellsValue() {
  for (let i = 0; i < boardData.length; i++) {
    for (let j = 0; j < boardData[i].length; j++) {
      if (!boardData[i][j].isMine) {
        boardData[i][j].value = getAdjacentMinesCount(i, j);
      }
    }
  }
}

function isValidPosition(currentRow, currentCol) {
  return (
    currentRow >= 0 &&
    currentRow < boardData.length &&
    currentCol >= 0 &&
    currentCol < boardData[currentRow].length
  );
}

function getAdjacentMinesCount(row, col) {
  let adjacentMinesCount = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (isValidPosition(i, j)) {
        if (isMined(boardData[i][j])) {
          adjacentMinesCount++;
        }
      }
    }
  }
  return adjacentMinesCount;
}

function setMineCounterValue() {
  let counter = document.getElementById("counter");
  counter.textContent = mineCounter.getValue();
}


function increaseMineCounterValue() {
  mineCounter.increment();
  setMineCounterValue();
}

function decreaseMineCounterValue() {
  mineCounter.decrement();
  setMineCounterValue();
}



function resetGame() {
  document.body.removeChild(document.getElementById("board"));
  timer.reset();
  startGame();
}

function uncoverNeighbours(cellId) {
  let idPart = getCellPosition(cellId);
  let row = parseInt(idPart[0]) - 1;
  let col = parseInt(idPart[1]) - 1;
  let cellToUncover;
  let cellData;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      cellToUncover = i + 1 + "-" + (j + 1);
      if (isValidPosition(i, j)) {
        cellData = getCellData(cellToUncover);
        if (cellData.isCovered) {
          uncoverCell(cellToUncover, cellData);
        }
      }
    }
  }
}
function setTimerVelue() {
  document.getElementById("timer").textContent = timer.value;
}

function updateTimerValue() {
  document.getElementById("timer").textContent = timer.value;
}
