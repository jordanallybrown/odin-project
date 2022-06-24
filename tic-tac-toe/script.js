'use strict';

// Modules - immediately invoked functions
const Gameboard = (() => {
    const gridSize = 9;
    let gameboard;
    
    const getBoard = () => {
        return gameboard;
    }
    const getGridSize = () => gridSize;

    const markBoard = (position, symbol) => {
        if (isOpenPosition(position) && isValidPosition(position)) {
            gameboard[position] = symbol;
            return true;
        }
        return false;
    }

    const isValidPosition = (position) => {
        return (position >= 0 && position <= 9)
    }

    const isOpenPosition = (position) => {
        return gameboard[position] === null;
    }

    const getOpenPositions = () => {
        // return array of all the positions that are NOT null
        return gameboard.filter(position => position !== null)
    }

    const isBoardFull = () => {
        // every returns true if all elements pass the test, so checking if all not null
        return gameboard.every(position => position !== null)
    }

    const initBoard = () => {
        gameboard = Array(gridSize).fill(null);
    }

    /**
     * Returns an object detailing if there is a winner, and if so, their symbol. E.g.
     * In the case of a winner, returns {isGameOver: true, result: 'win', symbol: 'x'}
     * No winner, returns {isGameOver: false, result : 'none'}
     * Tie, returns {isGameOver: true, result: 'tie'}
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

        if (winningPosition) {
            return {isGameOver: true, result: 'win', symbol: gameboard[winningPosition[0]]}
        } else {
            return isBoardFull() ? 
            {isGameOver: true, result: 'tie'} 
            : {isGameOver: false, result: 'none'}
        }
      
    }

    const display = () => {
        console.log(gameboard)
    }

    return {markBoard, initBoard, checkWinner, display, getGridSize, getOpenPositions, getBoard}

})();

// Factories
const Player = (name, symbol) => {
    let score = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const addScore = () => {
        score++;
    }
    const resetScore = () => {
        score = 0;
    }

    return {getName, getSymbol, addScore, resetScore}
}

// Factory with inheritance
const AIPlayer = (name, symbol) => {
    const prototype = Player(name, symbol);
    
    const getPosition = (positions) => Math.floor(Math.random() * positions.length);
    // put all the properties of prototype and aiplayer methods into a new object
    return Object.assign({}, prototype, {getPosition});
}
/**
 * TODOS:
 * 1) Modularize repetitive code (restart game method that resets all values, player 1 should also always go first/ clear the board display back to blank buttons, etc.)
 * 2) allow the player to enter their name before starting the game 
 * 3) let the computer play in the game (as O)
 * 
 * That's all I want to do with Tictactoe... Once this is complete move on to next lesson
 */
const GameController = (() => {
    const startButton = document.querySelector('#start-btn');
    const messageDisplay = document.querySelector('#status');
    const board = document.querySelector('.gameboard');

    // For now, hardcode the names and symbols
    let player1 = Player('player1', 'X');
    let player2 = Player('player2', 'O');
    let isPlaying = false;
    let isPlayer1Turn = true;

    const toggleIsPlaying = () => {
        isPlaying = !isPlaying; 
    }

    const toggleIsPlayer1Turn = () => {
        isPlayer1Turn = !isPlayer1Turn;
    }

    const setupBoard = () => {
        let fragment = document.createDocumentFragment();
        let button, index = 0;
        while (index < Gameboard.getGridSize()) {
            button = document.createElement('button');
            button.dataset.index = index;
            button.addEventListener('click', function(e){
                // console.log(e.target.dataset['index']);
                // If I pass button directly into the method below something seems to bubble up? e.g. clicking index 0 turns into the last button index 8. But I don't totally understand the behavior. Will look up later how click events work
                updateGame(e.target.dataset['index']);
            });
            fragment.appendChild(button);
            index++;
        }
        board.appendChild(fragment);
        activateBoard(false);

        Gameboard.initBoard();
    }

    const activateBoard = (enable) => {
        const allButtons = document.querySelectorAll('.gameboard button');
        allButtons.forEach(button => {
            button.disabled = enable ? false : true;
        });
    }

    const updateGame = (index) => {
        let currentPlayer = isPlayer1Turn ? player1 : player2;
        let square = document.querySelector(`[data-index='${index}']`);

        let isMarked = false;
        do {
            isMarked = Gameboard.markBoard(index, currentPlayer.getSymbol());
        } while (!isMarked); 

        // Update the display to reflect underlying Gameboard
        square.textContent = currentPlayer.getSymbol();

        // Check for a winner to see if game is over
        const gameStatus = Gameboard.checkWinner();

        if (gameStatus.isGameOver) {
            // display the winner
            if (gameStatus.result === 'tie') {
                messageDisplay.textContent = `It's a tie!`;
            } else {
                messageDisplay.textContent = `${currentPlayer.getName()} is the winner!`;
            }
            
            // disable the game
            startButton.textContent = 'Restart';
            activateBoard(false);
            toggleIsPlaying();

            // Clear the gameboard
            Gameboard.initBoard();

        } else {
            // Switch turns
            toggleIsPlayer1Turn();
        }
 
    }

    startButton.addEventListener('click', function(e) {
            if (isPlaying) {
                e.target.textContent = 'Start';
                activateBoard(false);
            } else {
                e.target.textContent = 'Restart';
                activateBoard(true);
            }
            toggleIsPlaying();
    });

    
    
    return {setupBoard};
})();

GameController.setupBoard();

// Small console test cases
// Print board
// Gameboard.display();
// Make winning marks
// Gameboard.markBoard(0, 'x');
// Gameboard.markBoard(1, 'o');
// Gameboard.markBoard(2, 'o');
// Gameboard.markBoard(3, 'o');
// Gameboard.markBoard(4, 'x');
// Gameboard.markBoard(5, 'x');
// Gameboard.markBoard(6, 'x');
// Gameboard.markBoard(7, 'o');
// Gameboard.markBoard(8, 'o');
// Gameboard.display();
// Check for winner
// console.log(Gameboard.checkWinner());
// Make invalid and valid marks, show board
// Gameboard.markBoard(10, 'x');
// Gameboard.markBoard(-1, 'x');
// Gameboard.markBoard(0, 'o');
// Gameboard.markBoard(3, 'o');
// Gameboard.display();
