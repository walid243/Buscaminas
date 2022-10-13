/* eslint-disable no-undef */
const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

var url = "http://127.0.0.1:5500/src/main/html/minesweeper.html";
// const url='https://walid243.github.io/minesweeper_app/src/main/html/minesweeper.html';
const defaultMines = 10;

async function getTotalCells(){
  return await page.locator("td.cell").count();
}


function getExpectedDisplay(boardDisplay) {
  let splitedDisplay;
  let expectedDisplay;

  if (boardDisplay.includes("-")) {
    splitedDisplay = boardDisplay.split("-");
      expectedDisplay = splitedDisplay[0];
      for (let i = 1; i < splitedDisplay.length; i++) {
        expectedDisplay = expectedDisplay.concat(splitedDisplay[i])
      }
      expectedDisplay = expectedDisplay.replace(/0/g, " ");
      expectedDisplay = expectedDisplay.replace(/\./g, " ");
  } else {
    expectedDisplay = boardDisplay;
  }
  return expectedDisplay;
}
async function leftClickOnCell(cellId) {
  await page.locator(`[data-testid="${cellId}"]`).click({ button: "left" });
}
async function rightClickOnCell(cellId) {
  await page.locator(`[data-testid="${cellId}"]`).click({ button: "right" });
}
async function middleClickOnCell(cellId) {
  await page.locator(`[data-testid="${cellId}"]`).click({ button: "middle" });
}

async function checkRowsCount (expectedCount) {
  let rowCount = await page.locator("table > tr").count();
  expect(rowCount).toBe(expectedCount);
}

async function checkCellsCount(expectedCellsCount) {
  let cellCount = await page.locator("td.cell").count();
  expect(cellCount).toBe(expectedCellsCount);
}

async function checkMineCounter(expectedDisplay) {
  let counterDisplay = await page.locator("data-testid=counter").innerText();
  expect(counterDisplay).toBe(expectedDisplay);
}

async function checkTimer(expectedValue) {
  let timer = await page.locator("data-testid=timer").innerText();
  expect(timer).toBe(expectedValue);
}

async function checkCoveredCells (totalCells) {
  let coveredCells = await page.locator("td.covered").count();
  expect(coveredCells).toBe(totalCells);
}

Given("the user opens the app", async () => {
  await page.goto(url);
});

Given("the user loads the following Mock Data: {string}", async (mockData) => {
  let mockUrl = url + "?mockData=" + mockData;
  await page.goto(mockUrl);
});
Given("the user tagged the cell: {string} as suspected", async (cellId) => {
  await rightClickOnCell(cellId);
});
Given("the user tagged the cell: {string} as questionable", async (cellId) => {
  await middleClickOnCell(cellId);
});
Given("the user uncovered the cell: {string}", async (cellId) => {
  await leftClickOnCell(cellId);
});
// Given("difficulty is {string}");
// Given("board have {string} mines");
Given("mine counter display: {string}", async (expectedDisplay) => {
  await checkMineCounter(expectedDisplay);
});
// Given("the app uncovered all adjacent cells");
When("the user uncover the cell: {string}", async (cellId) => {
  await leftClickOnCell(cellId);
});
// When("the cell: {string} don't have adjacent mines");
// When("the user press on {string}");
When("the user uses the reset", async () => {
  await page.locator("data-testid=reset").click();
});
// When("the app found the empty cell: {string} uncovered by {string}")
// When ("the app uncover all adjacent cells")
When("the user tag the cell: {string} as suspected", async (cellId) => {
  await rightClickOnCell(cellId);
});
When("the user tag the cell: {string} as questionable", async (cellId) => {
  await middleClickOnCell(cellId);
});
// When("timer count is: {string}");
When("the user untag the suspected cell: {string}", async (cellId) => {
  await rightClickOnCell(cellId);
});
When("the user untag the questionable cell: {string}", async (cellId) => {
  await middleClickOnCell(cellId);
});
// When("the cell: {string} don't have mine");
// Then("the game should end", async () => {
//   expect(live).toBe(false);
// });
Then("is game over", async () => {
  let text = await page.locator("text=*").innerText();
  expect(text).toBe("*");
});
// Then("timer should stop");
// Then ("the app sould uncover all adjacent cells")
// Then ("the app sould uncover all adjacent cells to {string}")
// Then("the app should uncover all mined cells that are not tagged as suspected");
// Then("the app should uncover all cell tagged as suspected with no mine");

Then("board display should be: {string}", async (boardDisplay) => {
  let display = await page.locator("td.cell").allTextContents();
  let coincidences = 0;
  let expectedDisplay = getExpectedDisplay(boardDisplay);
  for (let i = 0; i < expectedDisplay.length; i++) {
    if (expectedDisplay[i] === display[i]) {
      coincidences++;
    } else {
      break;
    }
  }
  expect(coincidences).toBe(expectedDisplay.length);
});
// Then("difficulty should be {string}");
Then("the app should restore to default state", async () => {
  await checkRowsCount(9);
  await checkCellsCount(await getTotalCells());
  await checkMineCounter(defaultMines.toString());
  await checkTimer("");
  await checkCoveredCells(await getTotalCells());

});
// Then("posible remining mines should be {string}");

Then("board should have {int} rows", async (rows) => {
  await checkRowsCount(rows);
});

Then("board should have {int} cells", async (cells) => {
  await checkCellsCount(cells);
});

Then("all cells should be covered", async () => {
  await checkCoveredCells(await getTotalCells());
});
Then("timer should be empty", async () => {
  await checkTimer("");
});
// Then("the app should restore to default state");
Then("timer should display: {string}", async (value) => {
  await checkTimer(value);
});
// Then("timer should increase by {string} for each second");
Then("mine counter should display: {string}", async (expectedValue) => {
  await checkMineCounter(expectedValue);
});
Then("the cell: {string} should be disabled", async (cellId) => {
  let locator = await page.locator(`[data-testid="${cellId}"]`);
  let isCellDisabled = await locator.getAttribute("disabled");
  expect(isCellDisabled).toBe("true");
});
Then("all cells should be disabled", async () => {
  let disabledCellsCount = await page.locator("td.cell[disabled=\"true\"]").count();
  expect(disabledCellsCount).toBe(await getTotalCells());
});
// Then("the app should do nothing");
// Then("the app should check all the adjacent cells");
Then(
  "the cell: {string} should show the following symbol: {string}",
  async (cellId, symbol) => {
    let locator = await page.locator(`[data-testid="${cellId}"]`);
    let cellSymbol = await locator.innerText();
    expect(cellSymbol).toBe(symbol);
  }
);
Then("the cell: {string} should not show any symbol", async (cellId) => {
  let locator = await page.locator(`[data-testid="${cellId}"]`);
  let cellSymbol = await locator.textContent();
  expect(cellSymbol).toBe(" ");
});
