const Gameboard = (() => {
  const gameBoard = ['X', 'O', 'X', null, 'X', null, 'X', 'O', 'X'];
  const getGameboard = () => gameBoard;
  const changeGameBoard = (position, marker) => {
    gameBoard[position] = marker;
  };

  return { changeGameBoard, getGameboard };
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
    renderBoard();
  };

  const getClick = () => {
    cells.forEach((cell, index) => {
      if (!gameBoard[index]) {
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

const human = (marker) => {
  const state = {
    marker,
  };
  return {
    ...player(state),
  };
};

const computer = (marker) => {
  const state = {
    marker,
  };
  return {
    ...player(state),
  };
};

const Game = (() => {
  const playerX = human('X');
  const playerO = computer('O');
  const currentPlayer = playerX;
  return { currentPlayer };
})();
