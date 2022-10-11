const boardData = getBoardData();
const totalMines = getMinesCount();
var coveredCells = getCoveredCellsCount();

createBoard();
addEvent();
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
  let board = document.getElementById("board");
  for (let i = 1; i <= height; i++) {
    width = boardData != null ? boardData[i - 1].length : 8;
    board.appendChild(createRow(i, width));
  }
}

function createRow(id, width) {
  let row = document.createElement("tr");
  row.setAttribute("id", id);
  for (let j = 1; j <= width; j++) {
    row.appendChild(createCell(j, id));
  }

  return row;
}

function createCell(id, rowId) {
  let cell = document.createElement("td");
  cell.setAttribute("id", rowId + "-" + id);
  cell.setAttribute("data-testid", rowId + "-" + id);
  cell.classList.add("cell", "covered");
  cell.innerText = " ";
  return cell;
}

function uncoverCell(id) {
  let cell = document.getElementById(id);
  let idPart = getCellId(id);
  let row = parseInt(idPart[0]) - 1;
  let col = parseInt(idPart[1]) - 1;
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  cell.setAttribute("disabled", true);
  cell.innerText = boardData != null ? boardData[row][col] : " ";
  updateCoveredCells();
}
function addEvent() {
  addClickEvent();
}
// function addClickEvent(){
//   let elements = document.getElementsByClassName("cell");
//   console.log("si");
//   for (let i = 0; i < elements.length; i++) {
//     elements[i].addEventListener("click", function(){
//       uncoverCell(this.getAttribute("id"));
//     });
//   }
// }
function addClickEvent() {
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", function (Event) {
      switch (Event.button) {
        case 0:
          uncoverCell(this.getAttribute("id"));
          if (isMined(this.innerText)) {
            gameOver();
          } else if (coveredCells == totalMines) {
            win();
          }
          break;

        case 1:
          if (this.innerText == "?") {
            untag(this.getAttribute("id"));
          } else {
            tagAsQuestionable(this.getAttribute("id"));
          }
          break;
        case 2:
          if (this.innerText == "!") {
            untag(this.getAttribute("id"));
          } else {
            tagAsSuspected(this.getAttribute("id"));
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
  uncoverMines()
  disableAllCells();
}

function isMined(value) {
  return value == "*";
}

function tagAsSuspected(cellId) {
  let cell = document.getElementById(cellId);
  cell.innerText = "!";
}

function tagAsQuestionable(cellId) {
  let cell = document.getElementById(cellId);
  cell.innerText = "?";
}
function untag(cellId) {
  let cell = document.getElementById(cellId);
  cell.textContent = " ";
}

function uncoverMines() {
  let elements = document.getElementsByClassName("cell");
  let elementId
  let idPart
  let row
  let col
  for (let i = 0; i < elements.length; i++) {
    elementId = elements[i].getAttribute("id")
    idPart = getCellId(elementId);
    row = parseInt(idPart[0]) - 1;
    col = parseInt(idPart[1]) - 1;
    if (!isMined(boardData[row][col]) && elements[i].innerText == "!") {
    uncorectlyTaggedCell(elementId);
    }
    if (isMined(boardData[row][col]) && elements[i].innerText != "!") {
      uncoverCell(elementId);
    }
  }
}

function getCellId(id){
  return id.split("-");
}

function uncorectlyTaggedCell(cellId){
  let cell = document.getElementById(cellId);
  cell.classList.add("incorrectly-tagged");
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  cell.innerText = "x";
}

function disableAllCells(){
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].setAttribute("disabled", true);
  }
}
function win(){
  let board = document.getElementById("board");
  board.setAttribute("win", true);
  disableAllCells();
  autoTagMines();
}

function autoTagMines(){
  let elements = document.getElementsByClassName("cell");
  let elementId
  let idPart
  let row
  let col
  for (let i = 0; i < elements.length; i++) {
    elementId = elements[i].getAttribute("id")
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

function getCoveredCellsCount(){
  let count = 0;
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].classList.contains("covered") && elements[i].innerText != "!") {
      count++;
    }
  }
  return count;
}

function updateCoveredCells(){
  coveredCells = getCoveredCellsCount();
}