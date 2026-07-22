const SIZE = 9;
const BOX = 3;
const MAX_VISITED_NODES = 50000;

const DIFFICULTY_CLUES = {
  easy: 40,
  medium: 32,
  hard: 26,
};

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isValidPlacement(board, row, col, val) {
  for (let i = 0; i < SIZE; i++) {
    if (i !== col && board[row][i] === val) return false;
    if (i !== row && board[i][col] === val) return false;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r++) {
    for (let c = boxCol; c < boxCol + BOX; c++) {
      if ((r !== row || c !== col) && board[r][c] === val) return false;
    }
  }
  return true;
}

function findEmptyCell(board) {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
}

function solveBoard(board, randomize = false) {
  const working = cloneBoard(board);

  function backtrack() {
    const empty = findEmptyCell(working);
    if (!empty) return true;
    const [row, col] = empty;
    let candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (randomize) candidates = shuffle(candidates);
    for (const val of candidates) {
      if (isValidPlacement(working, row, col, val)) {
        working[row][col] = val;
        if (backtrack()) return true;
        working[row][col] = 0;
      }
    }
    return false;
  }

  return backtrack() ? working : null;
}

function countSolutions(board, limit = 2) {
  const working = cloneBoard(board);
  let count = 0;
  let visited = 0;
  let aborted = false;

  function backtrack() {
    if (count >= limit) return;
    visited++;
    if (visited > MAX_VISITED_NODES) {
      aborted = true;
      return;
    }
    const empty = findEmptyCell(working);
    if (!empty) {
      count++;
      return;
    }
    const [row, col] = empty;
    for (let val = 1; val <= 9; val++) {
      if (count >= limit || aborted) return;
      if (isValidPlacement(working, row, col, val)) {
        working[row][col] = val;
        backtrack();
        working[row][col] = 0;
      }
    }
  }

  backtrack();
  return aborted ? limit : count;
}

function generateSolvedBoard() {
  return solveBoard(createEmptyBoard(), true);
}

function generatePuzzle(difficulty) {
  const targetClues = DIFFICULTY_CLUES[difficulty] ?? DIFFICULTY_CLUES.medium;
  const solution = generateSolvedBoard();
  const puzzle = cloneBoard(solution);

  const cells = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      cells.push([row, col]);
    }
  }
  shuffle(cells);

  let clues = SIZE * SIZE;
  for (const [row, col] of cells) {
    if (clues <= targetClues) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    if (countSolutions(puzzle, 2) === 1) {
      clues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  const givens = new Set();
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (puzzle[row][col] !== 0) givens.add(`${row},${col}`);
    }
  }

  return { puzzle, solution, givens };
}

function validateBoard(board) {
  const conflicts = new Set();

  function markIfConflict(cells) {
    const seen = new Map();
    for (const [row, col] of cells) {
      const val = board[row][col];
      if (val === 0) continue;
      if (seen.has(val)) {
        conflicts.add(`${row},${col}`);
        const [pr, pc] = seen.get(val);
        conflicts.add(`${pr},${pc}`);
      } else {
        seen.set(val, [row, col]);
      }
    }
  }

  for (let row = 0; row < SIZE; row++) {
    markIfConflict(Array.from({ length: SIZE }, (_, col) => [row, col]));
  }
  for (let col = 0; col < SIZE; col++) {
    markIfConflict(Array.from({ length: SIZE }, (_, row) => [row, col]));
  }
  for (let boxRow = 0; boxRow < SIZE; boxRow += BOX) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += BOX) {
      const cells = [];
      for (let r = boxRow; r < boxRow + BOX; r++) {
        for (let c = boxCol; c < boxCol + BOX; c++) {
          cells.push([r, c]);
        }
      }
      markIfConflict(cells);
    }
  }

  return conflicts;
}

const Sudoku = {
  SIZE,
  DIFFICULTY_CLUES,
  createEmptyBoard,
  isValidPlacement,
  solveBoard,
  countSolutions,
  generateSolvedBoard,
  generatePuzzle,
  validateBoard,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sudoku;
} else {
  window.Sudoku = Sudoku;
}
