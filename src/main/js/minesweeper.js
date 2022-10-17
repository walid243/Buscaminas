var boardData;
var totalMines;
var coveredCells;
var timerInterval;

startGame();

function startGame() {
  boardData = setBoardData();
  totalMines = getMinesCount();
  coveredCells = getCoveredCellsCount();
  setCellsValue();
  createBoard();
  getMineCounterValue();
  addEvent();
}

function setMockData(cellsData) {
  let matrix = [];
  let row;
  for (let i = 0; i < cellsData.length; i++) {
    row = [];
    for (let j = 0; j < cellsData[i].length; j++) {
      row.push({
        id: i + 1 + "-" + (j + 1),
        value: "",
        isMine: cellsData[i][j] === "*",
        isCovered: true,
        isFlagged: false,
        isQuestionMarked: false,
      });
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
            row.push(setCellObject(i + 1, j + 1, true, "*"));
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
    dataMatrix = setMockData(mockData);
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

  let timer = document.createElement("td");
  timer.setAttribute("id", "timer");
  timer.setAttribute("data-testid", "timer");
  timer.setAttribute("started", "false");

  headRow.append(counter, reset, timer);
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
  cell.setAttribute("id",cellId);
  cell.setAttribute("data-testid", rowNum + "-" + id);
  cell.classList.add("cell", "covered");
  return cell;
}

function uncoverCell(cellId, cellData) {
  let cell = document.getElementById(cellId);
  console.log(cell);
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  cell.setAttribute("disabled", true);
  cell.textContent = cellData.value == 0 ? " " : cellData.value;
  cellData.isCovered = false;
  if (cellData.value == 0) {
    uncoverNeighbours(cell.getAttribute("id"));
  }
  updateCoveredCells();
}

function getCellData(id) {
  let cellPosition = getCellId(id);
  let row = cellPosition[0] - 1;
  let col = cellPosition[1] - 1;
  return boardData[row][col];
}
function addEvent() {
  clickEvent();
}

function clickEvent() {
  let elements = document.getElementsByClassName("cell");
  let cellData;
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", function (Event) {
      cellData = getCellData(this.getAttribute("id"));
      startTimer();
      if (cellData.isCovered) {
      switch (Event.button) {
        case 0:
            if (cellData.isFlagged) {
              increaseMineCounterValue();
              updateCellData(cellData, "isFlagged", false);
            }
          uncoverCell(this.getAttribute("id"), cellData);
          if (isMined(cellData)) {
            gameOver();
          } else if (coveredCells == totalMines) {
            win();
          }
          break;

        case 1:
          if (cellData.isQuestionMarked) {
            setCellTag(this, " ");
            updateCellData(cellData, "isQuestionMarked", false);
          } else {
            if (cellData.isFlagged) {
              increaseMineCounterValue();
              updateCellData(cellData, "isFlagged", false);
            }
            setCellTag(this, "?");
            updateCellData(cellData, "isQuestionMarked", true);
          }
          console.log(cellData);
          break;
        case 2:
          if (cellData.isQuestionMarked) {
            updateCellData(cellData, "isQuestionMarked", false);
          }
          if (cellData.isFlagged) {
            setCellTag(this, " ");
            increaseMineCounterValue();
            updateCellData(cellData, "isFlagged", false);
          } else {
            setCellTag(this, "!");
            decreaseMineCounterValue();
            updateCellData(cellData, "isFlagged", true);
          }
          console.log(cellData);
          break;
      }
    }
    });
    elements[i].addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  }
}

function updateCellData(cellData, property, value) {
  cellData[property] = value;
}

function gameOver() {
  let board = document.getElementById("board");
  board.setAttribute("gameover", true);
  stopTimer();
  uncoverMines();
  disableAllCells();
}

function isMined(cell) {
  return cell.isMine
}
function isFlagged(cellData) {
  return cellData.isFlagged;
}

function setCellTag(cell, tag) {
  cell.textContent = tag;
}


function uncoverMines() {
  let cells = document.getElementsByClassName("cell");
  let cellData;
  let cellId;
  let idPart;
  let row;
  let col;
  for (let i = 0; i < cells.length; i++) {
    cellId = cells[i].getAttribute("id");
    cellData = getCellData(cellId);
    idPart = getCellId(cellId);
    row = parseInt(idPart[0]) - 1;
    col = parseInt(idPart[1]) - 1;
    if (!isMined(cellData) && isFlagged(cellData)) {
      uncorectlyTaggedCell(cellId);
    }
    if (isMined(cellData) && !isFlagged(cellData)) {
      uncoverCell(cellId, cellData);
    }
  }
}

function getCellId(id) {
  return id.split("-");
}

function uncorectlyTaggedCell(cellId) {
  let cell = document.getElementById(cellId);
  cell.classList.add("incorrectly-tagged");
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  cell.textContent = "x";
}

function disableAllCells() {
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].setAttribute("disabled", true);
  }
}
function win() {
  let board = document.getElementById("board");
  board.setAttribute("win", true);
  stopTimer();
  disableAllCells();
  autoTagMines();
}

function autoTagMines() {
  let elements = document.getElementsByClassName("cell");
  let elementId;
  let idPart;
  let row;
  let col;
  for (let i = 0; i < elements.length; i++) {
    elementId = elements[i].getAttribute("id");
    idPart = getCellId(elementId);
    row = parseInt(idPart[0]) - 1;
    col = parseInt(idPart[1]) - 1;
    if (isMined(boardData[row][col])) {
      tagAsSuspected(elementId);
    }
  }
}

function getMinesCount() {
  let count = 0;
  if (boardData != null) {
    for (let i = 0; i < boardData.length; i++) {
      for (let j = 0; j < boardData[i].length; j++) {
        if (isMined(boardData[i][j])) {
          count++;
        }
      }
    }
  } else {
    count = 10;
  }
  return count;
}

function getCoveredCellsCount() {
  let count = 0;
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].classList.contains("covered")) {
      count++;
    }
  }
  return count;
}

function updateCoveredCells() {
  coveredCells = getCoveredCellsCount();
}

function setCellsValue() {
  for (let i = 0; i < boardData.length; i++) {
    for (let j = 0; j < boardData[i].length; j++) {
      if (!boardData[i][j].isMine){
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

function setCellAsMined(cellId) {
  let cell = document.getElementById(cellId);
  cell.textContent = "*";
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

function setNotMinedCellValue(cellId, value) {
  let cell = document.getElementById(cellId);
  cell.textContent = value;
}

function setTimer(timer) {
  timer.textContent = "0";
  timer.setAttribute("started", "true");
}

function startTimer() {
  let timer = document.getElementById("timer");
  if (timer.getAttribute("started") == "false") {
    setTimer(timer);
    timerInterval = setInterval(() => {
      timer.textContent = parseInt(timer.textContent) + 1;
    }, 1000);
  }
}

function stopTimer() {
  let timer = document.getElementById("timer");
  clearInterval(timerInterval);
  timer.setAttribute("started", "false");
}

function getMineCounterValue() {
  let counter = document.getElementById("counter");
  counter.textContent = getMinesCount();
}

function decreaseMineCounterValue() {
  let counter = document.getElementById("counter");
  counter.textContent = parseInt(counter.textContent) - 1;
}

function increaseMineCounterValue() {
  let counter = document.getElementById("counter");
  counter.textContent = parseInt(counter.textContent) + 1;
}

function resetGame() {
  document.body.removeChild(document.getElementById("board"));
  startGame();
}

function isCellCovered(cellId) {
  return document.getElementById(cellId).classList.contains("covered");
}

function uncoverNeighbours(cellId) {
  let idPart = getCellId(cellId);
  let row = parseInt(idPart[0]) - 1;
  let col = parseInt(idPart[1]) - 1;
  let cellToUncover;
  let cellData;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      cellToUncover = i + 1 + "-" + (j + 1);
      if (isValidPosition(i, j) && isCellCovered(cellToUncover)) {
      cellData = getCellData(cellToUncover);
        if (getAdjacentMinesCount(i, j) == " ") {
          uncoverCell(cellToUncover, cellData);
          uncoverNeighbours(cellToUncover);
        } else {
          uncoverCell(cellToUncover, cellData);
        }
      }
    }
  }
}
