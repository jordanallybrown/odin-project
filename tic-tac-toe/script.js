'use strict';

// Modules - immediately invoked functions
const Gameboard = (() => {
    const gridSize = 9;
    const gameboard = Array(gridSize).fill(null);
    
    const markBoard = (position, symbol) => {
        if (isOpenPosition(position) && isValidPosition(position)) {
            gameboard[position] = symbol;
        }
    }

    const isValidPosition = (position) => {
        return (position >= 0 && position <= 9)
    }

    const isOpenPosition = (position) => {
        return gameboard[position] === null;
    }

    const clearBoard = () => {
        gameboard = Array(gridSize).fill(null);
    }

    /**
     * Returns an object detailing if there is a winner, and if so, their symbol. E.g.
     * In the case of a winner, returns {isWinner: true, symbol: 'x'}
     * No winner, returns {isWinner: false}
     * @returns Object
     */
    const checkWinner = () => {
        const isSymbolMatch = (x, y, z) => {
            return (gameboard[x] === gameboard[y] && gameboard[y] === gameboard[z] && gameboard[x] !== null)
        }
        
        // simple 3x3 so pre-calc possible winning positions
        const allWinningPositions = [
            // horizontal wins
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // vertical wins
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonal wins
            [0, 4, 8],
            [2, 4, 6]
        ]
        // Think about what we need to find (instead of breaking out of loop)
        // contains the elements e.g. [0, 1, 2] that first match condition
        const winningPosition = allWinningPositions.find(positions => isSymbolMatch(...positions))

        return (winningPosition ? 
            {isWinner: true, symbol: gameboard[winningPosition[0]]} 
            : {isWinner: false})
      
    }

    const display = () => {
        console.log(gameboard)
    }

    return {markBoard, clearBoard, checkWinner, display}

})();

// Small console test cases
// Print board
Gameboard.display();
// Make winning marks
Gameboard.markBoard(0, 'x');
Gameboard.markBoard(1, 'x');
Gameboard.markBoard(2, 'x');
Gameboard.display();
// Check for winner
console.log(Gameboard.checkWinner());
// Make invalid and valid marks, show board
Gameboard.markBoard(10, 'x');
Gameboard.markBoard(-1, 'x');
Gameboard.markBoard(0, 'o');
Gameboard.markBoard(3, 'o');
Gameboard.display();
