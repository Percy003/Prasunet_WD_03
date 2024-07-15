
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const backButton = document.getElementById('backButton');
const playerVsPlayerButton = document.getElementById('pvp');
const playerVsAiButton = document.getElementById('pvai');
const gameBoardElement = document.getElementById('gameBoard');
const gameContainer = document.getElementById('gameContainer');
const modeSelection = document.getElementById('modeSelection');
const container = document.getElementById('container');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isPlayerVsAI = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const handleCellClick = (event) => {
  const cell = event.target;
  const cellIndex = cell.getAttribute('data-index');

  if (gameBoard[cellIndex] !== '' || !isGameActive || (isPlayerVsAI && currentPlayer !== 'X')) {
    return;
  }

  updateCell(cell, cellIndex);
  checkForWinner();

  if (isGameActive && isPlayerVsAI) {
    currentPlayer = 'O';
    setTimeout(aiMove, 500);
  }
};

const updateCell = (cell, index) => {
  gameBoard[index] = currentPlayer;
  cell.textContent = currentPlayer;
};

const checkForWinner = () => {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    const a = gameBoard[winCondition[0]];
    const b = gameBoard[winCondition[1]];
    const c = gameBoard[winCondition[2]];

    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    alert(`Player ${currentPlayer} has won!`);
    isGameActive = false;
  } else if (!gameBoard.includes('')) {
    alert('Game is a draw!');
    isGameActive = false;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const resetGame = () => {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  isGameActive = true;
  currentPlayer = 'X';

  cells.forEach(cell => {
    cell.textContent = '';
  });
};

const aiMove = () => {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = 'O';
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  if (move !== undefined) {
    const cell = document.querySelector(`.cell[data-index="${move}"]`);
    updateCell(cell, move);
    checkForWinner();
    currentPlayer = 'X';
  }
};

const minimax = (board, depth, isMaximizing) => {
  const scores = {
    'X': -1,
    'O': 1,
    'draw': 0
  };

  let result = checkWinnerForMinimax(board);
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const checkWinnerForMinimax = (board) => {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes('')) {
    return 'draw';
  }
  return null;
};

const startGame = (isAI) => {
  isPlayerVsAI = isAI;
  modeSelection.style.display = 'none';
  gameContainer.style.display = 'flex';
  container.classList.add('game-active');
};

const backToModeSelection = () => {
  resetGame();
  modeSelection.style.display = 'block';
  gameContainer.style.display = 'none';
  container.classList.remove('game-active');
};

playerVsPlayerButton.addEventListener('click', () => startGame(false));
playerVsAiButton.addEventListener('click', () => startGame(true));
resetButton.addEventListener('click', resetGame);
backButton.addEventListener('click', backToModeSelection);

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});