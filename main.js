const Gameboard = (() => {
  const gameBoard = ['X', 'O', 'X', null, 'X', null, 'X', 'O', 'X'];
  const getGameboard = () => gameBoard;
  const changeGameBoard = (position, marker) => {
    gameBoard[position] = marker;
  };
  const canMark = (index) => !gameBoard[index];
  const areSelectable = () => gameBoard.map((_item, index) => canMark(index));

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
    const thisCellIndex = Array.prototype.indexOf.call(cells, thisCell);
    Game.currentPlayer.mark(thisCellIndex);
    Game.turn += 1;
    renderBoard();
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

const player = (state) => ({
  mark: (position) => {
    Gameboard.changeGameBoard(position, state.marker);
  },
});

const picker = (state) => ({
  pick: () => {
    state.pick();
  },
});

const human = (marker) => {
  const state = {
    marker,
    pick: () => {
      displayController.getClick();
    },
  };
  return {
    ...player(state),
    ...picker(state),
  };
};

const computer = (marker) => {
  const state = {
    marker,
    pick: () => {
      // make computer pick
    },
  };
  return {
    ...player(state),
    ...picker(state),
  };
};

const Game = (() => {
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
