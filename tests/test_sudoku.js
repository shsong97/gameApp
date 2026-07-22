const test = require('node:test');
const assert = require('node:assert');
const Sudoku = require('../sudoku/sudoku.js');

test('generateSolvedBoard returns a full conflict-free board', () => {
  const board = Sudoku.generateSolvedBoard();
  assert.ok(board);
  for (const row of board) {
    for (const val of row) {
      assert.ok(val >= 1 && val <= 9);
    }
  }
  assert.strictEqual(Sudoku.validateBoard(board).size, 0);
});

for (const difficulty of ['easy', 'medium', 'hard']) {
  test(`generatePuzzle(${difficulty}) yields a uniquely-solvable puzzle near the target clue count`, () => {
    const { puzzle, solution, givens } = Sudoku.generatePuzzle(difficulty);
    const target = Sudoku.DIFFICULTY_CLUES[difficulty];

    let clueCount = 0;
    for (const row of puzzle) {
      for (const val of row) {
        if (val !== 0) clueCount++;
      }
    }
    assert.ok(clueCount <= target + 5, `expected clue count near ${target}, got ${clueCount}`);
    assert.strictEqual(givens.size, clueCount);
    assert.strictEqual(Sudoku.countSolutions(puzzle, 2), 1);
    assert.strictEqual(Sudoku.validateBoard(solution).size, 0);
  });
}

test('validateBoard detects an injected duplicate', () => {
  const board = Sudoku.generateSolvedBoard();
  const original = board[0][1];
  board[0][1] = board[0][0];
  const conflicts = Sudoku.validateBoard(board);
  assert.ok(conflicts.has('0,0'));
  assert.ok(conflicts.has('0,1'));
  board[0][1] = original;
});

test('solveBoard can re-solve a generated puzzle back to a full valid board', () => {
  const { puzzle } = Sudoku.generatePuzzle('hard');
  const solved = Sudoku.solveBoard(puzzle, false);
  assert.ok(solved);
  assert.strictEqual(Sudoku.validateBoard(solved).size, 0);
  for (const row of solved) {
    for (const val of row) {
      assert.ok(val >= 1 && val <= 9);
    }
  }
});
