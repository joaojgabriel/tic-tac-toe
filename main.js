const Gameboard = (() => {
  let gameBoard = [null, null, null, null, null, null, null, null, null];
  const get = () => gameBoard;
  const change = (position, symbol) => {
    gameBoard[position] = symbol;
  };
  const clear = () => {
    gameBoard = [null, null, null, null, null, null, null, null, null];
  };
  const isClear = () => {
    let allNull = true;
    gameBoard.forEach((position) => {
      if (position) allNull = false;
    });
    return allNull;
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
    change,
    get,
    clear,
    isClear,
    canMark,
    areSelectable,
  };
})();

let Game;

const displayController = (() => {
  const startMenu = document.querySelector('.startMenu');
  const playerInput = document.querySelector('input#name');
  const playerName = playerInput.value;
  const startButton = document.querySelector('.startButton');
  const game = document.querySelector('.game');
  const restartButton = document.querySelector('.restartButton');
  const display = document.querySelector('.display');
  const cells = document.querySelectorAll('.cell');

  const updateDisplay = (text) => {
    display.textContent = text;
  };

  const announcePlayer = () => {
    if (playerName) updateDisplay(`${playerName} plays`);
    else updateDisplay(`${Game.currentPlayer.symbol} plays`);
  };

  const handleStart = () => {
    startMenu.classList.toggle('hidden');
    game.classList.toggle('hidden');
    announcePlayer();
    Game.start();
  };

  startButton.addEventListener('click', handleStart);
  const renderBoard = () => {
    const gameBoard = Gameboard.get();
    cells.forEach((cell, index) => {
      cell.textContent = gameBoard[index];
    });
  };

  const handleRestart = () => {
    Gameboard.clear();
    renderBoard();
    Game.start();
    announcePlayer();
  };

  restartButton.addEventListener('click', handleRestart);

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

  return {
    renderBoard,
    getClick,
    updateDisplay,
    playerName,
  };
})();

Game = (() => {
  let currentPlayer;
  let switchPlayer;
  let turn = 0;
  let endTurn;

  const handleTie = () => {
    displayController.updateDisplay("It's a tie");
  };

  const handleWin = (player) => {
    const { playerName } = displayController;
    if (playerName) {
      displayController.updateDisplay(`${playerName} wins!`);
    } else {
      displayController.updateDisplay(`${player.symbol} wins!`);
    }
    endTurn();
  };

  endTurn = () => {
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
      const gameBoard = Gameboard.get();

      let isWinning = false;

      winning.forEach((combo) => {
        const [a, b, c] = combo;
        if (
          gameBoard[a] === state.symbol &&
          gameBoard[b] === state.symbol &&
          gameBoard[c] === state.symbol
        ) {
          isWinning = true;
        }
      });

      return isWinning;
    },
  });

  const marker = (state) => ({
    mark: (position) => {
      Gameboard.change(position, state.symbol);
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

  switchPlayer = () => {
    currentPlayer = currentPlayer.symbol === 'X' ? playerO : playerX;
    currentPlayer.pick();
  };
  currentPlayer = playerX;

  const start = () => {
    turn = 0;
    currentPlayer = playerX;
    currentPlayer.pick();
  };

  return { currentPlayer, start };
})();
