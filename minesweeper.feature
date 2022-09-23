Feature: Minesweeper App

    To define the board data will use:

    "o" No mine

    "*" Mine

    To define the board display will use:

    "." covered cell

    "!" Cell tagged as suspected cell by the user

    "?" Cell tagged as questionable cell by the user

    "x" Cell incorrectly tagged as suspected cell by the user

    "0" Clean cell without adjacent mines

    "1" Clean cell with 1 adjacent mine

    "2" Clean cell with 2 adjacent mines

    "3" Clean cell with 3 adjacent mines

    "4" Clean cell with 4 adjacent mines

    "5" Clean cell with 5 adjacent mines

    "6" Clean cell with 6 adjacent mines

    "7" Clean cell with 7 adjacent mines

    "8" Clean cell with 8 adjacent mines

    "1-1" means, row 1 col 1

    Background: App opened.
        Given a user opens the app


    Scenario: uncover a mined cell is game over
        Given the user loads the following Mock Data: "*o"
        When a user uncover the cell: "1-1"
        Then is game over

    Scenario: all cells are covered on game load
        Then all cells should be covered

@manual
    Scenario: Game over > the timer should stop
        Given the user loads the following Mock Data: "*o"
        And a user uncover the cell: "1-2"
        And the user wait for 3 seconds
        When a user uncover the cell: "1-1"
        Then the timer should stop

    Scenario: Game over > all cells should be disabled
        Given the user loads the following Mock Data: "**0"
        When the user uncover the cell: "1-1"
        Then all cells should be disabled

    Scenario Outline: Choose difficulty
        When a user click on "<wantedDifficulty>"
        Then difficulty should be "<wantedDifficulty>"
        And the app should restore to "<wantedDifficulty>" default state

        Examples:
            | wantedDifficulty |
            | easy             |
            | meddium          |
            | hard             |

    Scenario Outline: Default state in each difficulty
        When difficulty is "<currentDifficulty>"
        Then posible remining mines should be "<posibleRemainingMines>"
        And map width should be "<mapWidth>"
        And map height should be "<mapHeight>"
        And timer should be null

        Examples:
            | currentDifficulty | posibleRemainingMines   | mapWidth | mapHeight |
            | easy              | 10                      | 8        | 8         |
            | meddium           | 40                      | 16       | 16        |
            | hard              | 99                      | 30       | 16        |


    Scenario: Reset button
        When a user press reset button
        Then the app should restore to default state

    Scenario: Timer start > uncovering a cell
        Given the user loads the following Mock Data: "o*o"
        When a user uncover the cell: "11"
        Then timer should start on: "0"

    Scenario: Timer start > tagging a cell as suspected
        Given the user loads the following Mock Data: "o*o"
        When a user tag the cell: "11" as suspected
        Then timer should start on: "0"

    Scenario: Timer start > tagging a cell as questionable
        Given the user loads the following display Mock Data: "..."
        When a user tag the cell: "11" as questionable
        Then timer should start on: "0"
        And timer should increase by "1" for each second

    Scenario: Timer stop > game over
        Given the user loads the following display Mock Data: "0.."
        And the user loads the following Mock Data: "o*o"
        And timer count is: "2"
        When a user uncover the cell: "12"
        Then timer should stop at: "2"

    Scenario: Timer stop > game win
        Given the user loads the following display Mock Data: "0.."
        And the user loads the following Mock Data: "o*o"
        And timer count is: "2"
        When a user uncover the cell: "13"
        Then timer should stop at: "2"

    Scenario: Tagging > suspected cell
        Given the user loads the following display Mock Data: "..."
        When a user tag the cell: "11" as suspected
        Then board display should be: "!.."

    Scenario: Tagging > questionable cell
        Given the user loads the following display Mock Data: "..."
        When a user tag the cell: "11" as questionable
        Then board display should be: "?.."

    Scenario: Untagging > suspected cell
        Given the user loads the following display Mock Data: "!.."
        When a user untag the cell: "11"
        Then board display should be: "..."

    Scenario: Untagging > questionable cell
        Given the user loads the following display Mock Data: "?.."
        When a user untag the cell: "11"
        Then board display should be: "..."

    Scenario: Game over > the not tagged as suspected cells with mine should be uncovered 
        Given the user loads the following Mock Data: "*o-**"
        When a user uncover the cell: "1-1"
        Then board display should be: "*.-**"
        
    Scenario: Game over > the correctly tagged cells as suspected shouldn't be uncovered
        Given the user loads the following Mock Data: "**0-*0*"
        And the user tag as suspected the cell: "1-1"
        And the user tag as suspected the cell: "2-1"
        When the user uncover the cell: "1-2"
        Then board display should be: "!*.-!.*"

    Scenario: Game over > the wrongly tagged cells as suspected should be uncovered
        Given the user loads the following Mock Data: "**0-*0*"

    Scenario: Game over > value that will show the cells tagged incorrectly as suspected at game over
        Given the user loads the following display Mock Data: "!.!"
        And the user loads the following Mock Data: "o**"
        When a user uncover the cell: "12"
        Then board display should be: "x*!"

    Scenario: Game win > uncovering all cells with no mine and without tagging any mined cell as suspected
        Given the user loads the following display Mock Data: "0.."
        And the user loads the following Mock Data: "o*o"
        When a user uncover the cell: "13"
        Then timer should stop
        And board display should be: "0!0"

    Scenario:Mine counter > decrease posible remaining mines counter
        Given the user loads the following display Mock Data: "..."
        And board have "1" mines
        And posible remaining mines is: "1"
        When a user tag the cell: "11" as suspected cell
        Then posible remaining mines should be: "0"

    Scenario: Mine counter > increase posible remaining mines counter changing from suspected tag to questionable tag
        Given the user loads the following display Mock Data: "!.."
        And board have "1" mines
        And posible remaining mines is: "0"
        When a user tag the cell: "11" as questionable
        Then posible remaining mines should be: "1"

    Scenario: Mine counter > increase posible remaining mines counter untagging a cell tagged as suspeted
        Given the user loads the following display Mock Data: "!.."
        And board have "1" mines
        And posible remaining mines is: "0"
        When a user untag the cell: "11"
        Then posible remaining mines should be: "1"

    Scenario: Mine counter > posible remaining mines counter shuldn't change untagging a cell tagged as questionable
        Given the user loads the following display Mock Data: "?.."
        And board have "1" mines
        And posible remaining mines is: "1"
        When a user untag the cell: "11"
        Then posible remaining mines should be: "1"

    Scenario: Mine counter > Increase mine counter uncovering a cell tagged as suspected
        Given the user loads the following display Mock Data: "!.."
        And the user loads the following Mock Data: "o*o"
        And board have "1" mines
        And posible remaining mines is: "0"
        When a user uncover the cell: "11"
        Then posible remaining mines should be: "1"

    Scenario: Uncover a cell
        Given the user loads the following display Mock Data: "..."
        And the user loads the following Mock Data: "o*o"
        When a user uncover the cell: "11"
        Then board display should be: "1.."
        And the cell: "11" should be disabled

    Scenario: trying to uncover an uncovered cell
        Given the user loads the following display Mock Data: "1.."
        And the user loads the following Mock Data: "o*o"
        When a user uncover the cell: "11"
        Then the app should do nothing

    Scenario: trying to tag as suspected an uncovered cell
        Given the user loads the following display Mock Data: "1.."
        And the user loads the following Mock Data: "o*o"
        When a user tag the cell: "11" as suspected
        Then the app should do nothing

    Scenario: trying to tag as questionable an uncovered cell
        Given the user loads the following display Mock Data: "1.."
        And the user loads the following Mock Data: "o*o"
        When a user tag the cell: "11" as questionable
        Then the app should do nothing

    Scenario Outline: Uncover not mined cell > the cell shows the number of adjacent mines
        Given the user loads the following Mock Data: "<boardData>"
        When a user uncover the cell: "<cellToUncover>"
        Then the cell "<cellToUncover>" should show: "<adjacentMineCount>" 


        Examples:
            | boardData   | cellToUncover  | count |
            | o**-ooo-ooo | 1-1            | 1     |
            | ***-ooo-ooo | 2-3            | 2     |
            | oo*-o*o-o*o | 2-3            | 3     |
            | **o-o*o-*oo | 2-1            | 4     |
            | oo*-***-*o* | 3-2            | 5     |
            | *o*-*o*-*o* | 2-2            | 6     |
            | ***-*o*-*o* | 2-2            | 7     |
            | ***-*o*-*** | 2-2            | 8     |
            
    Scenario Outline: Uncover not mined cell > cell empty > cell without adjacent mines

    Scenario Outline: Uncover empty cell > Uncover the adjacent cells
        Given the user loads the following Mock Data: "<boardData>"
        When a user uncover the cell: "11"
        And the cell: "11" don't have mine
        And the cell: "11" don't have adjacent mines
        Then the board display should be: "<newBoardDisplay>"

        Examples:
            | boardDisplay | boardData   | newBoardDisplay |
            | ...-...-...  | oo*-ooo-ooo | 01.-011-000     |
            | ...-...-...  | oo*-oo*-ooo | 02.-02.-01.     |

            SCENARIO? Adjacent mines revealed > If is empty, reveal
