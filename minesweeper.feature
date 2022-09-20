Feature: Minesweeper App
   
  To define the board data will use:

    "o" No mine

    "*" Mine



  To define the board display will use:

    "." covered cell

    "!" Cell tagged as mined cell by the user

    "?" Cell tagged as inconclusive cell by the user

    "x" Cell wrongly tagged as mined cell by the user

    "0" Clean cell without adjacent mines

    "1" Clean cell with 1 adjacent mine

    "2" Clean cell with 2 adjacent mines

    "3" Clean cell with 3 adjacent mines

    "4" Clean cell with 4 adjacent mines

    "5" Clean cell with 5 adjacent mines

    "6" Clean cell with 6 adjacent mines

    "7" Clean cell with 7 adjacent mines

    "8" Clean cell with 8 adjacent mines

    Background: App opened.
        Given a user opens the App
    
    @este
    Scenario Outline: uncover a mined cell is game over
        Given board size is: ".."
        And board data is: "*o"
        When a user uncover a mined cell : "00"
        Then the game should end  

        Examples:
            | boardSize | boardData |
            | ..        | *o        |

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
        And all cells should be covered
        And timer should be null

        Examples:
            | currentDifficulty | totalMines | mapWidth | mapHeight |
            | easy              | 10         | 8        | 8         |
            | meddium           | 40         | 16       | 16        |
            | hard              | 99         | 30       | 16        |


    Scenario: Reset button
        When a user click on "resetButton"
        Then the App should restore to default state

    Scenario Outline: Timer start
        Given all cells are covered
        And timer is null
        When a user press "mouseClick" button on cell
        Then timer should start on "0"

        Examples:
            | mouseClick  |
            | left click  |
            | right click |


    Scenario: Marking a suspected cell
        When a user press "right click" button on a covered cell
        Then cell should be marked with "!"

    Scenario: Marking a questionable cell
        Given there is a cell marked with "!"
        When a user press "right click" button on a covered cell marked with "!"
        Then cell should be marked with "?"

    Scenario: Unmarking a cell
        Given there is a cell marked with "?"
        When a user press "right click" button on a covered cell marked with "?"
        Then cell should not have a mark

    Scenario: Decrease mine counter
        Given the App is in easy difficulty
        And totalMines are "10"
        When a user mark cell as suspected cell
        Then totalMines should be "9"

    Scenario: Increase mine counter changing mark
        Given the App is in easy difficulty
        And there is a cell marked with "!"
        And totalMines are "9"
        When a user press "right click" button on a covered cell marked with "!"
        Then totalMines should be "10"

    Scenario: Increase mine counter uncovering a cell marked as suspected
        Given the App is in easy difficulty
        And there is a cell marked with "!"
        And totalMines are "9"
        When a user press "left click" button on a covered cell marked with "!"
        Then cell should uncover
        And if it don't have a mine totalMines should be "10"

    Scenario: Uncover a cell
        When a user press "left click" button on a covered cell
        Then cell should uncover
        And cell should be disabled

    Scenario: Clicking on an uncovered cell
        Given there is a cell uncovered
        When a user press "left click" button on an uncovered cell
        Then the App should do nothing

    Scenario: Uncover not mined cell
        When a user uncover a cell
        And the cell don't have mine
        Then the App should show the number of mines one cell around this.

    Scenario: Uncover empty adjacent cells
        When a user uncover a cell
        And the cell don't have mine
        And not adjacent mines
        Then the App should uncover all adjacent covered cells
        And if the another uncovered cell has not adjacent mines the App should uncover all adjacent cells
        And repeat it until uncover all cells with no adjacent mines

