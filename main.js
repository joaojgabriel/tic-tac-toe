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
  let currentPlayer;
  let switchPlayer;
  const handleTie = () => {
    // TODO
  };
  const handleWin = (player) => {
    // TODO
  };

  function turnEnder() {
    let turn = 0;
    return function () {
      turn += 1;
      if (currentPlayer.isWinner()) {
        handleWin(currentPlayer);
        turn = 0;
        return 0;
      }
      if (turn === 9) {
        handleTie();
        turn = 0;
        return 0;
      }
      switchPlayer();
      currentPlayer.pick();
      return 0;
    };
  };

  const endTurn = turnEnder();

  const winner = (state) => ({
    isWinner: () => {
      const winning = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // horizontal
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // vertical
        [0, 4, 8],
        [2, 4, 6], // diagonal
      ];

      winning.forEach((combo) => {
        const [a, b, c] = combo;
        const gameBoard = Gameboard.getGameboard();
        if (
          gameBoard[a] === state.symbol &&
          gameBoard[b] === state.symbol &&
          gameBoard[c] === state.symbol
        ) {
          return true;
        }
        return 0;
      });

      return false;
    },
  });

  const marker = (state) => ({
    mark: (position) => {
      Gameboard.changeGameBoard(position, state.symbol);
      displayController.renderBoard();
      endTurn();
    },
  });

  const human = (symbol) => {
    const state = {
      symbol,
    };
    return {
      ...marker(state),
      ...winner(state),
      symbol,
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
      ...winner(state),
      symbol,
      pick() {
        const options = Gameboard.areSelectable();
        const randomChoice =
          options[Math.floor(Math.random() * options.length)];
        this.mark(randomChoice);
        displayController.renderBoard();
      },
    };
  };

  const playerX = human('X');
  const playerO = computer('O');

  currentPlayer = playerX;
  switchPlayer = () => {
    currentPlayer = currentPlayer.symbol === 'X' ? playerO : playerX;
    currentPlayer.pick();
  };

  currentPlayer.pick();

  return { currentPlayer };
})();
