const mockData = new URLSearchParams(window.location.search).get("mockData");

// createBoard()
moakBoard();
function moakBoard() {
  let data = mockData.split("-");
  let board = document.createElement("table");
  board.setAttribute("id", "board");
  let row;
  let cell;
  let k = 1;
  for (let i = 0; i < data.length; i++) {
    row = document.createElement("tr");
    row.setAttribute("id", i + 1);
    for (let j = 0; j < data[i].length; j++) {
      console.log(data[i][j]);
      cell = document.createElement("td");
      cell.classList.add("covered");
      cell.setAttribute("id", i + 1 + "-" + (j + 1));
      cell.innerText = data[i][j];
      row.appendChild(cell);
      k++;
    }
    board.appendChild(row);
  }
  document.body.appendChild(board);
}
// function coverCells() {
//   let board = document.getElementById("board");
//   board.childNodes.forEach(row => row.childNodes.forEach(cell => cell.classList.add("covered")));
// }

function createBoard() {
  console.log(mockData);
  let body = document.body;
  let board = document.createElement("table");
  board.setAttribute("id", "board");
  let row;
  let cell;
  let k = 1;
  for (let i = 1; i <= 8; i++) {
    row = document.createElement("tr");
    row.setAttribute("id", i);
    for (let j = 1; j <= 8; j++) {
      cell = document.createElement("td");
      cell.setAttribute("id", i + "-" + j);
      cell.innerText = k;
      // data[ij] = boardData[k];
      row.appendChild(cell);
      k++;
    }
    board.appendChild(row);
  }
  body.appendChild(board);
}
