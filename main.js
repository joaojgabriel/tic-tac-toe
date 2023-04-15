const Gameboard = (() => {
  const gameBoard = ['X', 'O', 'X', null, 'X', null, 'X', 'O', 'X'];
  const getGameboard = () => gameBoard;
  const changeGameBoard = (position, symbol) => {
    gameBoard[position] = symbol;
  };
  const canMark = (index) => !gameBoard[index];
  const areSelectable = () => {
    const selectableIndexes = [];
    for (let i = 0; i < 9; i += 1) {
      if (canMark(i)) selectableIndexes.push(i);
    }
    return selectableIndexes;
  };

  return {
    changeGameBoard,
    getGameboard,
    canMark,
    areSelectable,
  };
})();

const displayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const gameBoard = Gameboard.getGameboard();

  const renderBoard = () => {
    cells.forEach((cell, index) => {
      cell.textContent = gameBoard[index];
    });
  };

  const handleCLick = (e) => {
    cells.forEach((cell) => {
      cell.classList.remove('selectable');
      cell.removeEventListener('click', handleCLick);
    });

    const thisCell = e.target;
    const thisCellIndex = thisCell.getAttribute('data-index');
    Game.currentPlayer.mark(thisCellIndex);
    Game.turn += 1;
  };

  const getClick = () => {
    cells.forEach((cell, index) => {
      if (Gameboard.canMark(index)) {
        cell.classList.add('selectable');
        cell.addEventListener('click', handleCLick);
      }
    });
  };

  return { renderBoard, getClick };
})();

const Game = (() => {
  const marker = (state) => ({
    mark: (position) => {
      Gameboard.changeGameBoard(position, state.symbol);
      displayController.renderBoard();
    },
  });

  const human = (symbol) => {
    const state = {
      symbol,
    };
    return {
      ...marker(state),
      pick: () => {
        displayController.getClick();
      },
    };
  };

  const computer = (symbol) => {
    const state = {
      symbol,
    };
    return {
      ...marker(state),
      pick() {
        const options = Gameboard.areSelectable();
        const randomChoice =
          options[Math.floor(Math.random() * options.length)];
        this.mark(randomChoice);
      },
    };
  };

  let turn = 0;
  turn += 1;
  const playerX = human('X');
  const playerO = computer('O');
  const currentPlayer = playerX;
  while (turn < 9) {
    currentPlayer.pick();
    turn += 1;
  }
  return { currentPlayer };
})();
