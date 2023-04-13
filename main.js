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
