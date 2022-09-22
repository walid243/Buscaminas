/* eslint-disable no-undef */
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

var url = 'http://127.0.0.1:5500/src/main/html/minesweeper.html';
// const url='https://walid243.github.io/minesweeper_app/src/main/html/minesweeper.html';

// async function buttonClick(buttonId) {
// 	await page.click(`[data-testid="${buttonId}"]`, { force: true });
// }

// async function serialForEach(array, cb) {
// 	return array.reduce((promise, data) => promise.then(() => cb(data)), Promise.resolve());
// }

// async function writeNumber(strNumber) {
// 	let isNegative = false;
// 	const digits = strNumber.split('');
// 	await serialForEach(digits, async (digit) => {
// 		if (digit === '-') {
// 			isNegative = true;
// 		} else {
// 			await buttonClick(digit);
// 		}
// 	});
// 	if (isNegative) {
// 		await buttonClick('+-');
// 	}
// }

// async function keyPress(keyId) {
// 	await page.keyboard.press(keyId, { force: true });
// }
const secretData = new Object
var live = true
var boardWidth
var boardHeight
 async function mapBoardSize(boardSize){
	console.log(boardSize);
	let cellsCount = (boardSize.match('.') || []).lenght
	let rowsCount = (boardSize.match('-') || []).lenght + 1
	boardWidth = cellsCount/rowsCount
	boardHeight = rowsCount
	return(url+"?boardWidth="+boardWidth+"&boardHeight="+boardHeight)

 }
 async function mapBoardData(boardData){
	secretData = createBoard(boardData)
 }
 function createBoard(boardData){
	let obURL = new URL(url)
	let width = obURL.searchParams.get("boardWidth")? obURL.searchParams.get("boardWidth"): 8
	console.log(width);
	let height = obURL.searchParams.get("boardHeight")? obURL.searchParams.get("boardHeight"): 8
	console.log(height);
	let body = page.locator(body)
	let board = page.createElement("table")
	let data = new Object
	board.setAttribute("id", "board")
	let row
	let cell
	let k = 0
	for (let i=0 ; i<height ; i++){
		row = document.createElement("tr")
		row.setAttribute("id", i)
		for (let j=0 ; j<width ; j++ ){
			cell = document.createElement("td")
			cell.setAttribute("id", ij)
			cell.innerText(boardData[k])
			data[ij] = boardData[k]
			row.appendChild(cell)
			k++
		}
		board.appendChild(row)
	}
	document.body.appendChild(board)
	return data
 }
 function checkCell(position){
	if (secretData[position] == "*"){
		live = false
		return true
	} else{
		return false
	}
 }
 Given('a user opens the app', async () => {
 	await page.goto(url);
 });

 Given('board display is: {string}', async (string) => {
	console.log(string)
	url = await mapBoardSize(string)
	await page.goto(url)
 })
 Given('board data is: {string}', async (string) => {
	console.log(string)
	await mapBoardData(string)
 })
 When('a user uncover the cell: {string}', async (string) => {
	checkCell(string)
 })
 Then('the game should end', async () => {
	expect(live).toBe(false)
 })
 Then('is game over')
 Then('timer should stop')
 Then('the app should uncover all mined cells that are not tagged as suspected')
 Then('the app should uncover all cell tagged as suspected with no mine')
 Then('the app should disable all cells')
 Then('board display should be: {string}')
 When('a user click on {string}')
 Then('difficulty should be {string}')
 Then('the app should restore to {string} default state')
 When('difficulty is {string}')
 Then('total mines should be {string}')
 Then('map width should be {string}')
 Then('map height should be {string}')
 Then('all cells should be covered')
 Then('timer should be null')
 When('a user press reset button')
 Then('the app should restore to default state')
 Then('timer should start on: {string}')
 When('a user tag the cell: {string} as suspected')
 When('a user tag the cell: {string} as questionable')
 Then('timer should increase by {string} for each second')
 Given('timer count is: {string}')
 When('a user untag the cell: {string}')
Given('board have {string} mines')
Given('posible remaining mines is: {string}')
Then('posible remaining mines should be: {string}')
Then('the cell: {string} should be disabled')
Then('the app should do nothing')
When('the cell: {string} don\'t have mine')
Then('the app should check all the adjacent cells')
When('the cell: {string} don\'t have adjacent mines')

// Then('the display should show the following value: {string}', async (string) => {
// 	//const display = await page.locator('data-testid=display').innerText();
// 	const display = await page.locator('data-testid=display').inputValue();
// 	expect(display).toBe(string);
// });

// Given('the display shows the following value: {string}', async (string) => {
// 	await buttonClick('C');
// 	await writeNumber(string);
// });

// When('the user presses the {string} button', async (string) => {
// 	await buttonClick(string);
// });

// When('the user presses the {string} key', async (string) => {
// 	await keyPress(string);
// });

// When('the user writes the number: {string}', async (string) => {
// 	await writeNumber(string);
// });

// Then('the {string} button should be disabled', async (string) => {
// 	const locator = page.locator(`[data-testid="${string}"]`);
// 	await expect(locator).toBeDisabled();
// });

// Then('the {string} button should be enabled', async (string) => {
// 	const locator = page.locator(`[data-testid="${string}"]`);
// 	await expect(locator).toBeEnabled();
// });
