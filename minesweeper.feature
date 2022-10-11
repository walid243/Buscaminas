Feature: Minesweeper App

    To define the board data will use:

    "o" No mine

    "*" Mine

    "-" new row
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

    Background: App opened
        Given the user opens the app

    @done
    Scenario: All cells are covered on game load
        Then all cells should be covered
        
    @done
    Scenario: Uncover a mined cell is game over
        Given the user loads the following Mock Data: "o*o"
        When the user uncover the cell: "1-2"
        Then is game over
    
    @done
    Scenario: Disable a cell > An uncovered cell should be disabled
        Given the user loads the following Mock Data: "o*o"
        When the user uncover the cell: "1-1"
        Then the cell: "1-1" should be disabled

    @done
    Scenario: Tagging > A user can tag as mined a cell when suspects that the cell contains a mine. Adding the mined symbol
        When the user tag the cell: "1-1" as suspected
        Then the cell: "1-1" should show the following symbol: "!"


    @done
    Scenario: Tagging > A user can tag as posible mined cell when he is not shure if it is mined. Adding the posible mine symbol
        When the user tag the cell: "1-1" as questionable
        Then the cell: "1-1" should show the following symbol: "?"

    
    @done
    Scenario: Untagging > The user can untag a suspected cell when he is sure that the cell it's not mined
        Given the user tagged the cell: "1-1" as suspected
        When the user untag the suspected cell: "1-1"
        Then the cell: "1-1" should not show any symbol
    
    @done
    Scenario: Untagging > The user can untag a questionable cell when he is sure that the cell it's not mined
        Given the user tagged the cell: "1-1" as questionable
        When the user untag the questionable cell: "1-1"
        Then the cell: "1-1" should not show any symbol

    @done
    Scenario: Game over > The cells with mine not tagged as suspected should be uncovered at game over
        Given the user loads the following Mock Data: "**o-*o*"
        When the user uncover the cell: "1-1"
        Then board display should be: "**.-*.*"
    
    @done
    Scenario: Game over > The cells with mine correctly tagged as suspected should not uncover at game over
        Given the user loads the following Mock Data: "**o-*o*"
        And the user tagged the cell: "1-1" as suspected
        And the user tagged the cell: "2-1" as suspected
        When the user uncover the cell: "1-2"
        Then board display should be: "!*.-!.*"

    @done
    Scenario: Game over > The cells with no mine tagged as suspected should show the incorrectly tagged cell value at game over
        Given the user loads the following Mock Data: "**o-*o*"
        And the user tagged the cell: "1-3" as suspected
        When the user uncover the cell: "1-2"
        Then board display should be: "**x-*.*"

    @done
    Scenario: Game over > When is game over all cells should be disabled
        Given the user loads the following Mock Data: "**0"
        When the user uncover the cell: "1-1"
        Then all cells should be disabled
    
    @done
    Scenario: Game win > When the user uncover all cells without mine the game should end
        Given the user loads the following Mock Data: "o*o"
        And the user uncovered the cell: "1-1"
        When the user uncover the cell: "1-3"
        Then all cells should be disabled

    @done
    Scenario: Game win > When the user win uncovering all cells with no mine and without tagging any mined cell as suspected then the mined cells should be tagged as suspected
        Given the user loads the following Mock Data: "o*o"
        And the user uncovered the cell: "1-1"
        When the user uncover the cell: "1-3"
        Then board display should be: "1!1"

    @done
    Scenario: Timer > The timer default state should be empty
        Then timer should be empty

    @done
    Scenario: Timer > When the users first move is uncover a cell then the timer should start with value 0
        When the user uncover the cell: "1-1"
        Then timer should display: "0"

    @done
    Scenario: Timer > When the users first move is tag a cell as suspected then the timer should start with value 0
        When the user tag the cell: "1-1" as suspected
        Then timer should display: "0"

    @this
    Scenario: Timer > When the users first move is tag a cell as questionable then the timer should start with value 0
        When the user tag the cell: "1-1" as questionable
        Then timer should display: "0"

    @manual
    Scenario: Timer > When the user uncover a cell, after 2 seconds from timer start the timer display value should be 2
        Given the user loads the following Mock Data: "o*o"
        When the user uncover the cell: "1-1"
        Then after 2 seconds await the timer should display "2"

    @manual
    Scenario: Timer > When the user tag a cell as suspected, after 2 seconds from timer start the timer display value should be 2
        When the user tag the cell: "1-1" as suspected
        Then after 2 seconds await the timer should display "2"

    @manual
    Scenario: Timer > When the user tag a cell as questionable, after 2 seconds from timer start the timer display value should be 2
        When the user tag the cell: "1-1" as questionable
        Then after 2 seconds await the timer should display "2"

    @manual
    Scenario: Timer > Timer should stop at game over
        Given the user loads the following Mock Data: "o*o"
        When the user uncover the cell: "1-2"
        Then after 2 seconds await the timer should display "0"

    @manual
    Scenario: Timer > Timer should stop at game win
        Given the user loads the following Mock Data: "o*o"
        And the user uncovered the cell: "1-3"
        And the app await 2 seconds
        When the user uncover the cell: "1-1"
        Then after 2 seconds await the timer should display "2"

    Scenario:Mine counter > The mine counter should decrease by 1 for every cell tagged as suspected
        Given mine counter display: "10"
        When the user tagged the cell: "1-1" as suspected
        Then mine conter should display: "9"

    Scenario:Mine counter > The mine counter can have negative values if the user tag as suspected more cells than mines on board
        Given the user tagged the cell: "1-1" as suspected
        And mine counter display: "0"
        When the user tag the cell: "1-2" as suspected cell
        Then mine counter should display: "-1"

    Scenario: Mine counter > The mine counter should increase when the user change a cell tag from suspected to questionable
        Given the user tagged the cell: "1-1" as suspected
        And mine counter display: "0"
        When the user tag the cell: "1-1" as questionable
        Then mine counter should display: "1"

    Scenario: Mine counter > The mine counter should increase when the user untag a suspected cell
        Given the user tagged the cell: "1-1" as suspected
        And mine counter display: "0"
        When the user untag the cell: "1-1"
        Then mine counter should display: "1"

    Scenario: Mine counter > The mine counter should not change when the user untag a cell tagged as questionable
        Given the user loads the following Mock Data: "o*o"
        And the user tagged the cell: "1-1" as questionable
        And mine counter display: "1"
        When the user untag the cell: "1-1"
        Then mine counter should display: "1"

    Scenario: Mine counter > The mine counter should increase when the user uncover a incorrectly tagged cell as suspected
        Given the user tagged the cell: "1-1" as suspected
        And mine counter display: "0"
        When the user uncover the cell: "1-1"
        Then mine counter should display: "1"

    Scenario: Default state
        Then board width should be "8"
        And board height should be "8"
        And mine counter should display "10"
        And timer should be empty
        And all cells should be covered

    Scenario: Reset > When the user uses the reset then the app should restore to default state
        Given the user loads the following Mock Data: "o*o"
        And the user tagged the cell: "1-1"
        And the user uncovered the cell: "1-3"
        When the user uses the reset
        Then the app should restore to default state

    Scenario Outline: Uncover not mined cell > If it has adjacent mines then the cell should display the count of adjacent mines to it
        Given the user loads the following Mock Data: "<boardData>"
        When the user uncover the cell: "2-2"
        Then the cell "2-2" should show: "<AdjacentMinesCount>"

        Examples:
            | boardData   | AdjacentMinesCount |
            | o*o-ooo-ooo | 1                  |
            | **o-ooo-ooo | 2                  |
            | ***-ooo-ooo | 3                  |
            | ***-*oo-ooo | 4                  |
            | ***-*o*-ooo | 5                  |
            | ***-*o*-*oo | 6                  |
            | ***-*o*-**o | 7                  |
            | ***-*o*-*** | 8                  |

    Scenario: Uncover not mined cell and without adjacent mines > cell empty
        Given the user loads the following Mock Data: "ooo-ooo-ooo-***"
        When the user uncover the cell: "2-2"
        Then the cell "2-2" should be empty

    Scenario: Uncover a cell empty > uncover the adjacent cells
        Given the user loads the following Mock Data: 
        """
        ooo
        ooo
        ooo
        ***
        """
        When the user uncover the cell: "2-2"
        Then the board display should be: 
        """
        000
        000
        232
        ...
        """

    Scenario: Uncover empty cell > When an empty cell is uncovered by a neighbour cell then uncover all adjacent cells to it
        Given the user loads the following Mock Data: 
        """
        ooo
        ooo
        oo*
        """
        When the user uncover the cell: "1-1"
        Then the app should uncover all adjacent cells to "1-2"
        And the app should uncover all adjacent cells to "2-1"
        And the app should uncover all adjacent cells to "2-1"
        And the board display should be: 
        """
        000
        011
        01.
        """

    Scenario: Disabling cell > when a cell is uncovered by another cell that cell should be disabled
        Given the user loads the following Mock Data: "ooo-oo*-ooo"
        When the user uncovered the cell: "1-1"
        Then the app should disable all cells uncovered by the cell: "1-1"

    Scenario: Mouse > How to uncover a cell with mouse
        Given the user loads the following Mock Data: "o*o"
        When the user uses mouse "leftClick" button on the cell: "1-1"
        Then the cell "1-1" should be uncovered

    Scenario: Mouse > How to tag a cell as suspected with mouse
        When the user uses mouse "rightClick" button on the cell: "1-1"
        Then the cell "1-1" should be tagged as suspected

    Scenario: Mouse > How to tag a cell as questionable with mouse
        Given the user uses mouse "rightClick" button on the cell: "1-1"
        When the user uses mouse "rightClick" button on cell "1-1"
        Then the cell "1-1" should be tagged as questionable

    Scenario: Mouse > How to untag a cell with mouse
        Given the user uses mouse "rightClick" button on the cell: "1-1"
        And the user uses mouse "rightClick" button on the cell: "1-1"
        When the user uses mouse "rightClick" button on cell "1-1"
        Then the cell "1-1" should be untagged