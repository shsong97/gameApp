(function () {
  const SIZE = Sudoku.SIZE;
  const MAX_HINTS = 3;

  const boardEl = document.getElementById('board');
  const numpadEl = document.getElementById('numpad');
  const statusEl = document.getElementById('status');
  const difficultyEl = document.getElementById('difficulty');
  const newGameBtn = document.getElementById('new-game');
  const checkBtn = document.getElementById('check');
  const hintBtn = document.getElementById('hint');
  const hintCountEl = document.getElementById('hint-count');

  let puzzle = null;
  let solution = null;
  let givens = null;
  let current = null;
  let selected = null;
  let hintsLeft = MAX_HINTS;
  let cellEls = [];

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function buildBoard() {
    boardEl.innerHTML = '';
    cellEls = [];
    for (let row = 0; row < SIZE; row++) {
      cellEls.push([]);
      for (let col = 0; col < SIZE; col++) {
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        if (row % 3 === 2 && row !== SIZE - 1) cellEl.classList.add('row-thick-bottom');
        cellEl.dataset.row = row;
        cellEl.dataset.col = col;
        cellEl.addEventListener('click', () => selectCell(row, col));
        boardEl.appendChild(cellEl);
        cellEls[row].push(cellEl);
      }
    }
  }

  function buildNumpad() {
    numpadEl.innerHTML = '';
    for (let val = 1; val <= 9; val++) {
      const btn = document.createElement('button');
      btn.textContent = String(val);
      btn.addEventListener('click', () => enterValue(val));
      numpadEl.appendChild(btn);
    }
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => enterValue(0));
    numpadEl.appendChild(clearBtn);
  }

  function selectCell(row, col) {
    if (givens.has(`${row},${col}`)) return;
    selected = [row, col];
    render();
  }

  function enterValue(val) {
    if (!selected) return;
    const [row, col] = selected;
    if (givens.has(`${row},${col}`)) return;
    current[row][col] = val;
    render();
    checkWin();
  }

  function render() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const el = cellEls[row][col];
        const val = current[row][col];
        el.textContent = val === 0 ? '' : String(val);
        el.classList.toggle('given', givens.has(`${row},${col}`));
        el.classList.toggle(
          'selected',
          Boolean(selected) && selected[0] === row && selected[1] === col
        );
      }
    }
  }

  function clearErrors() {
    for (const row of cellEls) {
      for (const el of row) {
        el.classList.remove('error');
      }
    }
  }

  function checkBoard() {
    clearErrors();
    const conflicts = Sudoku.validateBoard(current);
    for (const key of conflicts) {
      const [row, col] = key.split(',').map(Number);
      cellEls[row][col].classList.add('error');
    }
    if (conflicts.size === 0) {
      setStatus('No conflicts found.');
    } else {
      setStatus(`${conflicts.size} cell(s) conflict.`);
    }
  }

  function checkWin() {
    const isFull = current.every((row) => row.every((val) => val !== 0));
    if (!isFull) return;
    const conflicts = Sudoku.validateBoard(current);
    if (conflicts.size === 0) {
      setStatus('Solved! \u{1F389}');
    }
  }

  function useHint() {
    if (hintsLeft <= 0) return;
    let target = null;
    if (selected && current[selected[0]][selected[1]] === 0) {
      target = selected;
    } else {
      outer: for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (current[row][col] === 0) {
            target = [row, col];
            break outer;
          }
        }
      }
    }
    if (!target) return;
    const [row, col] = target;
    current[row][col] = solution[row][col];
    hintsLeft--;
    hintCountEl.textContent = String(hintsLeft);
    hintBtn.disabled = hintsLeft <= 0;
    render();
    checkWin();
  }

  function newGame() {
    const difficulty = difficultyEl.value;
    const generated = Sudoku.generatePuzzle(difficulty);
    puzzle = generated.puzzle;
    solution = generated.solution;
    givens = generated.givens;
    current = puzzle.map((row) => row.slice());
    selected = null;
    hintsLeft = MAX_HINTS;
    hintCountEl.textContent = String(hintsLeft);
    hintBtn.disabled = false;
    clearErrors();
    setStatus('');
    render();
  }

  document.addEventListener('keydown', (event) => {
    if (!selected) return;
    if (event.key >= '1' && event.key <= '9') {
      enterValue(Number(event.key));
    } else if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
      enterValue(0);
    }
  });

  newGameBtn.addEventListener('click', newGame);
  checkBtn.addEventListener('click', checkBoard);
  hintBtn.addEventListener('click', useHint);

  buildBoard();
  buildNumpad();
  newGame();
})();
