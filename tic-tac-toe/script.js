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
        const result = [];
        gameboard.forEach( (element, index) => {
            if (element === null) {
                result.push(index);
            }
        });
        return result;
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
    
    const getPosition = (positions) => {
        let index = Math.floor(Math.random() * positions.length);
        return positions[index];
    }
    
    // put all the properties of prototype and aiplayer methods into a new object
    return Object.assign({}, prototype, {getPosition});
}

const GameController = (() => {
    const startButton = document.querySelector('#start-btn');
    const messageDisplay = document.querySelector('#status');
    const board = document.querySelector('.gameboard');

    // For now, hardcode the names and symbols
    let player1 = Player('Player', 'X');
    let player2 = AIPlayer('Computer', 'O');
    let isPlaying = false;

    const toggleIsPlaying = () => {
        isPlaying = !isPlaying; 
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
        activateSquares(false);

        Gameboard.initBoard();
    }

    const activateSquares = (enable) => {
        const allButtons = document.querySelectorAll('.gameboard button');
        allButtons.forEach(button => {
            button.disabled = enable ? false : true;
        });
    }

    const resetSquares = () => {
        const allButtons = document.querySelectorAll('.gameboard button');
        allButtons.forEach(button => {
            button.textContent = '';
        }); 
    }

    const setMessageDisplay = (message) => {
        messageDisplay.textContent = message;
    }

    const endGame = (gameStatus) => {
        // display the winner
        if (gameStatus.result === 'tie') {
            setMessageDisplay(`It's a tie!`);
        } else {
            setMessageDisplay(`${gameStatus.symbol} is the winner!`);
        }

        Gameboard.initBoard();
        toggleIsPlaying();
        activateSquares(false);
    }

    const playerMove = (index) => {
        
        // If player picked valid square, mark the underlying board
        let isMarked = Gameboard.markBoard(index, player1.getSymbol());

        // Return true if player successfully marked board, false otherwise
        if (isMarked) {
            // update the display and square with player's choice
            let square = document.querySelector(`[data-index='${index}']`);
            square.textContent = player1.getSymbol();
            return true;
        }

        return false;
    }

    const computerMove = () => {
        let position = player2.getPosition(Gameboard.getOpenPositions());
        Gameboard.markBoard(position, player2.getSymbol());
        let square = document.querySelector(`[data-index='${position}']`);
        square.textContent = player2.getSymbol();
    }

    const updateGame = (index) => {
        let gameStatus;
        // Let the player make a move and mark board
        let isPlayerMove = playerMove(index);

        if (isPlayerMove) {
            gameStatus = Gameboard.checkWinner()
            if (gameStatus.isGameOver) {
                endGame(gameStatus);
            } else {
                // Let the computer play and check game status again
                computerMove();
                gameStatus = Gameboard.checkWinner()
                if (gameStatus.isGameOver) {
                    endGame(gameStatus);
                }

            }

        }

    }

    startButton.addEventListener('click', function(e) {
            if (isPlaying) {
                e.target.textContent = 'Start';
                activateSquares(false);
            } else {
                e.target.textContent = 'Restart';
                activateSquares(true);
                resetSquares();
                setMessageDisplay('');
                
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
