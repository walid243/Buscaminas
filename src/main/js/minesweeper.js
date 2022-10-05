const boardData = getBoardData();

var live = true;
createBoard();
addEvent();
function getLiveStatus(){
  document.getElementById("board").value = live
  return live;
}

function getBoardData() {
  if (hasMockParam()){
   let mockParam = new URLSearchParams(window.location.search).get('mockData')
    return mockParam.split('-')
  }  
  else {
    return null;
  }
}

function hasMockParam(){
  return new URLSearchParams(window.location.search).has('mockData') ?  true : false;
}

function createBoard() {

  let height = boardData.length;
  let width
  let board = document.getElementById('board');
  for (let i = 1; i <= height; i++) {
    width = boardData[i-1].length;
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
  return cell;
}

function uncoverCell(id){
  let cell = document.getElementById(id);
  let idPart = id.split("-")
  let row = parseInt(idPart[0])-1
  let col = parseInt(idPart[1])-1
  cell.classList.remove("covered");
  cell.classList.add("uncovered");
  cell.setAttribute("disabled", true);
  cell.innerText = boardData[row][col];
}

function addEvent(){
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function(){
      uncoverCell(this.getAttribute("id"));
    });
  }
}

function gameOver(){
  let board = document.getElementById("board");
  board.setAttribute("gameover", true);
}

function isMined(value){
  return value == "*"
}