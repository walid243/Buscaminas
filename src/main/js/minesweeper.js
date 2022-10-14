const boardData = getBoardData();
const totalMines = getMinesCount();
var coveredCells = getCoveredCellsCount();
var timerInterval;

startGame();

function startGame(){
  createBoard();
  getMineCounterValue();
  addEvent();
}
function getLiveStatus() {
  document.getElementById("board").value = live;
  return live;
}

function getBoardData() {
  if (hasMockParam()) {
    let mockParam = new URLSearchParams(window.location.search).get("mockData");
    return mockParam.split("-");
  } else {
    return null;
  }
}

function hasMockParam() {
  return new URLSearchParams(window.location.search).has("mockData")
    ? true
    : false;
}

function createBoard() {
  let height = boardData != null ? boardData.length : 8;
  let width;
  let board = document.createElement("table");
  board.setAttribute("id", "board");
  board.setAttribute("data-testid", "board");
  board.appendChild(createHeadRow());
  for (let i = 1; i <= height; i++) {
    width = boardData != null ? boardData[i - 1].length : 8;
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
  timer.setAttribute("started", "false")

  headRow.append(counter, reset, timer);
  return headRow;
}


function createRow(rowNum, width) {
  let row = document.createElement("tr");
  row.setAttribute("id", "row-"+rowNum);
  for (let j = 1; j <= width; j++) {
    row.appendChild(createCell(j, rowNum));
  }

  return row;
}

function createCell(id, rowNum) {
  let cell = document.createElement("td");
  cell.setAttribute("id", rowNum + "-" + id);
  cell.setAttribute("data-testid", rowNum + "-" + id);
  cell.classList.add("cell", "covered");
  cell.textContent = " ";
  return cell;
}

function uncoverCell(id) {
  let cell = document.getElementById(id);
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  cell.setAttribute("disabled", true);
  setCellValue(cell.getAttribute("id"));
  if (cell.textContent == " ") {
    uncoverNeighbours(cell.getAttribute("id"));
  }
  updateCoveredCells();
}
function addEvent() {
  addClickEvent();
}

function addClickEvent() {
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", function (Event) {
      startTimer();
      switch (Event.button) {
        case 0:
          if (this.textContent == "!") {
            increaseMineCounterValue();
          }
          uncoverCell(this.getAttribute("id"));
          if (isMined(this.textContent)) {
            gameOver();
          } else if (coveredCells == totalMines) {
            win();
          }
          break;

        case 1:
          if (this.textContent == "?") {
            untag(this.getAttribute("id"));
          } else {
            if (this.textContent == "!") {
              increaseMineCounterValue();
            }
            tagAsQuestionable(this.getAttribute("id"));
          }
          break;
        case 2:
          if (this.textContent == "!") {
            untag(this.getAttribute("id"));
            increaseMineCounterValue();
          } else {
            tagAsSuspected(this.getAttribute("id"));
            decreaseMineCounterValue();
          }
          break;
      }
    });
    elements[i].addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  }
}

function gameOver() {
  let board = document.getElementById("board");
  board.setAttribute("gameover", true);
  stopTimer();
  uncoverMines();
  disableAllCells();
}

function isMined(value) {
  return value == "*";
}
function isSuspected(value) {
  return value == "!";
}

function tagAsSuspected(cellId) {
  let cell = document.getElementById(cellId);
  cell.textContent = "!";
}

function tagAsQuestionable(cellId) {
  let cell = document.getElementById(cellId);
  cell.textContent = "?";
}
function untag(cellId) {
  let cell = document.getElementById(cellId);
  cell.textContent = " ";
}

function uncoverMines() {
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
    if (!isMined(boardData[row][col]) && elements[i].textContent == "!") {
      uncorectlyTaggedCell(elementId);
    }
    if (isMined(boardData[row][col]) && elements[i].textContent != "!") {
      uncoverCell(elementId);
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
    if (
      elements[i].classList.contains("covered")
    ) {
      count++;
    }
  }
  return count;
}

function updateCoveredCells() {
  coveredCells = getCoveredCellsCount();
}

function setCellValue(cellId) {
  let idPart = getCellId(cellId);
  let row = parseInt(idPart[0]) - 1;
  let col = parseInt(idPart[1]) - 1;
  if (isMined(boardData[row][col])) {
    setCellAsMined(cellId);
  } else {
    setNotMinedCellValue(cellId, getAdjacentMinesCount(row, col));
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
  return adjacentMinesCount == 0 ? " " : adjacentMinesCount;
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

function resetGame(){
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
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      cellToUncover = (i + 1) + "-" + (j + 1);
      if (isValidPosition(i, j) && isCellCovered(cellToUncover)) {
        if (getAdjacentMinesCount(i, j) == " ") {
          uncoverCell(cellToUncover);
          uncoverNeighbours(cellToUncover);
        } else {
          uncoverCell(cellToUncover);
        }
      }
    }
  }
}