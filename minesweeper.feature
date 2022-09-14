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
    | currentDifficulty | totalMine | mapWidth | mapHeight |
    | easy              | 10        | 8        | 8         |
    | meddium           | 40        | 16       | 16        |
    | hard              | 99        | 30       | 16        |


Scenario: Reset button
When a user click on "resetButton" 
Then the App should restore to default state

Scenario: First click on any square
Given all squares are covered
And timer is null
When a user press "left click" button on square
Then  should uncover
And timer should start on "0"


Scenario: 
