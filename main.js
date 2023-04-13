const Gameboard = (() => {
  const gameBoard = ['X', 'X', 'X', 'O', 'O', 'O', 'X', 'X', 'X'];
  const getGameBoard = () => gameBoard;
  const changeGameBoard = (position, play) => {
    gameBoard[position] = play;
  };

  return { getGameBoard, changeGameBoard };
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
