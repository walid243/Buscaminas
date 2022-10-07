/* eslint-disable no-undef */
const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

var url = "http://127.0.0.1:5500/src/main/html/minesweeper.html";
// const url='https://walid243.github.io/minesweeper_app/src/main/html/minesweeper.html';


async function uncoverCell(cellId) {
  await page.locator(`[data-testid="${cellId}"]`).click({ button: 'left'});
}
async function tagAsSuspected(cellId) {
  await page.locator(`[data-testid="${cellId}"]`).click({ button: 'right'});
}
async function tagAsQuestionable(cellId) {
  await page.locator(`[data-testid="${cellId}"]`).click({ button: 'middle'});
}

Given("the user opens the app", async () => {
  await page.goto(url);
});

Given("the user loads the following Mock Data: {string}", async (mockData) => {
  url += "?mockData=" + mockData
  await page.goto(url);
});
Given("the user tagged the cell: {string} as suspected" , async (cellId) => {
  await tagAsSuspected(cellId);
});
Given("the user tagged the cell: {string} as questionable", async (cellId) => {
  await tagAsQuestionable(cellId);
});
// Given("the user uncovered the cell: {string}")
// Given("difficulty is {string}");
// Given("board have {string} mines");
// Given("posible remaining mines is: {string}");
// Given("the app uncovered all adjacent cells");
When("the user uncover the cell: {string}", async (cellId) => {
  await uncoverCell(cellId);
});
// When("the cell: {string} don't have adjacent mines");
// When("the user press on {string}");
// When("the user press reset button");
// When("the app found the empty cell: {string} uncovered by {string}")
// When ("the app uncover all adjacent cells")
When("the user tag the cell: {string} as suspected", async (cellId) => {
  await tagAsSuspected(cellId);
});
When("the user tag the cell: {string} as questionable", async (cellId) => {
  await tagAsQuestionable(cellId);
});
// When("timer count is: {string}");
// When("the user untag the cell: {string}");
// When("the cell: {string} don't have mine");
// Then("the game should end", async () => {
//   expect(live).toBe(false);
// });
Then("is game over", async () => {
   let text = await page.locator("text=*").innerText();
    expect(text).toBe("*")
});
// Then("timer should stop");
// Then ("the app sould uncover all adjacent cells")
// Then ("the app sould uncover all adjacent cells to {string}")
// Then("the app should uncover all mined cells that are not tagged as suspected");
// Then("the app should uncover all cell tagged as suspected with no mine");
// Then("the app should disable all cells");
// Then("board display should be: {string}");
// Then("difficulty should be {string}");
// Then("the app should restore to {string} default state");
// Then("posible remining mines should be {string}");
// Then("board width should be {string}");
// Then("board height should be {string}");
// Then("all cells should be covered");
// Then("timer should be null");
// Then("the app should restore to default state");
// Then("timer should start on: {string}");
// Then("timer should increase by {string} for each second");
// Then("posible remaining mines should be: {string}");
Then("the cell: {string} should be disabled", async (cellId) => {
  let locator = await page.locator(`[data-testid="${cellId}"]`);
  let cellAvailability = await locator.getAttribute("disabled")
  console.log(cellAvailability);
  expect(cellAvailability).toBe("true");
});
// Then("all cells should be disabled");
// Then("the app should do nothing");
// Then("the app should check all the adjacent cells");
Then("the cell: {string} should show the following symbol: {string}" , async (cellId, symbol) => {
  let locator = await page.locator(`[data-testid="${cellId}"]`);
  let cellSymbol = await locator.innerText();
  expect(cellSymbol).toBe(symbol);
});
