# gameApp

Small games used as a playground for practicing pull requests.

## Rock, Paper, Scissors (Python)

### Run

```bash
python game.py
```

### Test

```bash
pytest
```

## Sudoku (browser)

A vanilla HTML/CSS/JS sudoku game with puzzle generation, difficulty levels, hints, and conflict checking. No build step or dependencies.

### Play

Serve the repo root with any static file server and open `sudoku/index.html`, for example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/sudoku/index.html`.

(Opening the file directly via `file://` also works in most browsers.)

### Test

```bash
node --test tests/test_sudoku.js
```

Not yet included: pencil marks/notes, undo/redo, saving progress across reloads, a timer.
