Feature: Minesweeper App.
@manual
Scenario: App launch.
Given a user wants to launch the App.
When a user search the App URL in a browser.
And browser loads the page
Then the App should load
And the difficulty should be "easy"

Background: App opened
Given a user have the App open
And the App loaded

Scenario Outline: Choose difficulty
When a user click on "wantedDifficulty"
Then difficulty should be "wantedDifficulty"

Examples:
    | wantedDifficulty |
    | easy             |
    | meddium          |
    | hard             |



Scenario Outline: Default state in each difficulty
When difficulty is "currentDifficulty"
Then total mines should be "totalMines"
And map width should be "mapWidth"
And map height should be "mapHeight"
And all squares should be covered
And timer should be null

Examples:
    | currentDifficulty | totalMines | mapWidth | mapHeight |
    | easy              | 10        | 8        | 8         |
    | meddium           | 40        | 16       | 16        |
    | hard              | 99        | 30       | 16        |


Scenario: Reset button
When a user click on "resetButton" 
Then the App should restore to default state

Scenario: Timer start with left click
Given all squares are covered
And timer is null
When a user press "left click" button on square
Then timer should start on "0"
And square should uncover


Scenario: Timer start with right click
Given all squares are covered
And timer is null
When a user press "right click" button on square
Then timer should start on "0"

Scenario: Marking a suspected square
When a user press "right click" button on a covered square
Then square should be marked with "!"

Scenario: Marking a questionable square
Given there is a square marked with "!"
When a user press "right click" button on a covered square marked with "!"
Then square should be marked with "?"

Scenario: Unmarking a square
Given there is a square marked with "?"
When a user press "right click" button on a covered square marked with "?"
Then square should not have a mark

Scenario: Decrease mine counter
Given the App is in easy difficulty
And totalMines are "10"
When a user mark square as suspected square
Then totalMines should be "9"

Scenario: Increase mine counter changing mark
Given the App is in easy difficulty
And there is a square marked with "!"
And totalMines are "9"
When a user press "right click" button on a covered square marked with "!"
Then totalMines should be "10"

Scenario: Increase mine counter uncovering a square marked as suspected
Given the App is in easy difficulty
And there is a square marked with "!"
And totalMines are "9"
When a user press "left click" button on a covered square marked with "!"
Then square should uncover
And if it don't have a mine totalMines should be "10"

Scenario: Uncover a square
When a user press "left click" button on a covered square
Then square should uncover
And square should be disabled

Scenario: Clicking on an uncovered square
Given there is a square uncovered
When a user press "left click" button on an uncovered square
Then the App should do nothing

Scenario: Uncovered not mined square value
When a user uncover a square
And the square don't have mine
Then the App should show the number of mines one square around this.
