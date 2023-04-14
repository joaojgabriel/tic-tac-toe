const Gameboard = (() => {
  const cells = document.querySelectorAll('.cell');
  const gameBoard = ['X', 'X', 'X', 'O', 'O', 'O', 'X', 'X', 'X'];
  const changeGameBoard = (position, play) => {
    gameBoard[position] = play;
  };
  const renderBoard = () => {
    cells.forEach((cell, index) => {
      cell.textContent = gameBoard[index];
    });
  };

  return { changeGameBoard, renderBoard };
})();

const player = (state) => ({
  play: (position) => {
    Gameboard.changeGameBoard(position, state.playsWhich);
  },
});

const human = (playsWhich) => {
  const state = {
    playsWhich,
  };
  return {
    ...player(state),
  };
};

const computer = (playsWhich) => {
  const state = {
    playsWhich,
  };
  return {
    ...player(state),
  };
};

const Game = (() => {
  const playerX = human('X');
  const playerO = computer('O');
})();
