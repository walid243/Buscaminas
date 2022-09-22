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

    Background: App opened.
        Given a user opens the app

    @este
    Scenario: uncover a mined cell is game over
        Given board display is: ".."
        And board data is: "*o"
        When a user uncover the cell: "11"
        Then is game over

    Scenario: Game over
        Given board display is: "...-!.!"
        And board data is: "o*o-o**"
        When a user uncover the cell: "12"
        Then the timer should stop
        And the app should uncover all mined cells that are not tagged as suspected
        And the app should uncover all cell tagged as suspected with no mine
        And the app should disable all cells
        And board display should be: ".*.-x*!"

    Scenario: game win uncovering all cells with no mine and without tagging any mined cell as suspected
        Given board display is: "0.."
        And board data is: "o*o"
        When a user uncover the cell: "13"
        Then timer should stop
        And board display should be: "0!0"

    Scenario: Value that will show the cells tagged incorrectly as suspected at game over
        Given board display is: "!.!"
        And board data is: "o**"
        When a user uncover the cell: "12"
        Then board display should be: "x*!"

    Scenario Outline: Choose difficulty
        When a user click on "wantedDifficulty"
        Then difficulty should be "wantedDifficulty"
        And the app should restore to "wantedDifficulty" default state

        Examples:
            | wantedDifficulty |
            | easy             |
            | meddium          |
            | hard             |

    Scenario Outline: Default state in each difficulty
        When difficulty is "currentDifficulty"
        Then total mines should be "posible remaining mines"
        And map width should be "mapWidth"
        And map height should be "mapHeight"
        And all cells should be covered
        And timer should be null

        Examples:
            | currentDifficulty | posible remaining mines | mapWidth | mapHeight |
            | easy              | 10                      | 8        | 8         |
            | meddium           | 40                      | 16       | 16        |
            | hard              | 99                      | 30       | 16        |

    Scenario: Reset button
        When a user press reset button
        Then the app should restore to default state

    Scenario: Timer start uncovering a cell
        Given board display is: "..."
        And board data is: "o*o"
        When a user uncover the cell: "11"
        Then timer should start on: "0"

    Scenario: Timer start tagging a cell as suspected
        Given board display is: "..."
        When a user tag the cell: "11" as suspected
        Then timer should start on: "0"

    Scenario: Timer start tagging a cell as questionable
        Given board display is: "..."
        When a user tag the cell: "11" as questionable
        Then timer should start on: "0"
        And timer should increase by "1" for each second

    Scenario: Timer stop on game over
        Given board display is: "0.."
        And board data is: "o*o"
        And timer count is: "2"
        When a user uncover the cell: "12"
        Then timer should stop at: "2"

    Scenario: Timer stop on game win
        Given board display is: "0.."
        And board data is: "o*o"
        And timer count is: "2"
        When a user uncover the cell: "13"
        Then timer should stop at: "2"

    Scenario: Tagging a suspected cell
        Given board display is: "..."
        When a user tag the cell: "11" as suspected
        Then board display should be: "!.."

    Scenario: Tagging a questionable cell
        Given board display is: "..."
        When a user tag the cell: "11" as questionable
        Then board display should be: "?.."

    Scenario: Untagging a suspected cell
        Given board display is: "!.."
        When a user untag the cell: "11"
        Then board display should be: "..."

    Scenario: Untagging a questionable cell
        Given board display is: "?.."
        When a user untag the cell: "11"
        Then board display should be: "..."

    Scenario: Decrease posible remaining mines counter
        Given board display is: "..."
        And board have "1" mines
        And posible remaining mines is: "1"
        When a user tag the cell: "11" as suspected cell
        Then posible remaining mines should be: "0"

    Scenario: Increase posible remaining mines counter changing from suspected tag to questionable tag
        Given board display is: "!.."
        And board have "1" mines
        And posible remaining mines is: "0"
        When a user tag the cell: "11" as questionable
        Then posible remaining mines should be: "1"

    Scenario: Increase posible remaining mines counter untagging a cell tagged as suspeted
        Given board display is: "!.."
        And board have "1" mines
        And posible remaining mines is: "0"
        When a user untag the cell: "11"
        Then posible remaining mines should be: "1"

    Scenario: posible remaining mines counter shuldn't change untagging a cell tagged as questionable
        Given board display is: "?.."
        And board have "1" mines
        And posible remaining mines is: "1"
        When a user untag the cell: "11"
        Then posible remaining mines should be: "1"

    Scenario: Increase mine counter uncovering a cell tagged as suspected
        Given board display is: "!.."
        And board data is: "o*o"
        And board have "1" mines
        And posible remaining mines is: "0"
        When a user uncover the cell: "11"
        Then posible remaining mines should be: "1"

    Scenario: Uncover a cell
        Given board display is: "..."
        And board data is: "o*o"
        When a user uncover the cell: "11"
        Then board display should be: "1.."
        And the cell: "11" should be disabled

    Scenario: trying to uncover an uncovered cell
        Given board display is: "1.."
        And board data is: "o*o"
        When a user uncover the cell: "11"
        Then the app should do nothing

    Scenario: trying to tag as suspected an uncovered cell
        Given board display is: "1.."
        And board data is: "o*o"
        When a user tag the cell: "11" as suspected
        Then the app should do nothing

    Scenario: trying to tag as questionable an uncovered cell
        Given board display is: "1.."
        And board data is: "o*o"
        When a user tag the cell: "11" as questionable
        Then the app should do nothing

    Scenario Outline: Uncover not mined cell
        Given board display is: "boardDisplay"
        And board data is: "boardData"
        When a user uncover the cell: "cellToUncover"
        And the cell: "cellToUncover" don't have mine
        Then the app should check all the adjacent cells
        And the board display should be: "newBoardDisplay"

        Examples:
            | boardDisplay | boardData   | cellToUncover | newBoardDisplay |
            | ...-...-...  | o**-ooo-ooo | 11            | 1..-...-...     |
            | ...-...-...  | ***-ooo-ooo | 23            | ...-..2-...     |
            | ...-...-...  | oo*-o*o-o*o | 23            | ...-..3-...     |
            | ...-...-...  | **o-o*o-*oo | 21            | ...-4..-...     |
            | ...-...-...  | oo*-***-*o* | 32            | ...-...-.5.     |
            | ...-...-...  | *o*-*o*-*o* | 22            | ...-.6.-...     |
            | ...-...-...  | ***-*o*-*o* | 22            | ...-.7.-...     |
            | ...-...-...  | ***-*o*-*** | 22            | ...-.8.-...     |

    Scenario Outline: Uncover adjacent cells to an empty cell
        Given board display is: "boardDisplay"
        And board data is: "boardData"
        When a user uncover the cell: "11"
        And the cell: "11" don't have mine
        And the cell: "11" don't have adjacent mines
        Then the board display should be: "newBoardDisplay"

        Examples:
            | boardDisplay | boardData   | newBoardDisplay |
            | ...-...-...  | oo*-ooo-ooo | 01.-011-000     |
            | ...-...-...  | oo*-oo*-ooo | 02.-02.-01.     |
