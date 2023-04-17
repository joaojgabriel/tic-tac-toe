const Gameboard = (() => {
  let gameBoard = [null, null, null, null, null, null, null, null, null];
  const get = () => gameBoard;
  const change = (position, symbol) => {
    gameBoard[position] = symbol;
  };
  const clear = () => {
    gameBoard = [null, null, null, null, null, null, null, null, null];
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
    canMark,
    areSelectable,
  };
})();

let Game;

const displayController = (() => {
  const startMenu = document.querySelectorAll('.start');
  const playerInput = document.querySelector('input#name');
  const playerName = playerInput.value;
  const startButton = document.querySelector('.startButton');
  const game = document.querySelector('.game');
  const restartButton = document.querySelector('.restartButton');
  const display = document.querySelector('.display');
  const cells = document.querySelectorAll('.cell');
  const isSmartSelect = document.querySelector('select#isSmart');
  const isSmartValue = isSmartSelect.value;

  const updateDisplay = (text) => {
    display.textContent = text;
  };

  const announcePlayer = () => {
    if (playerName) updateDisplay(`${playerName} plays`);
    else updateDisplay(`${Game.currentPlayer.symbol} plays`);
  };

  const handleStart = () => {
    Array.prototype.forEach.call(startMenu, (startItem) =>
      startItem.classList.toggle('hidden'),
    );
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
    isSmartValue,
    playerName,
  };
})();

Game = (() => {
  let currentPlayer;
  let isWinner;
  let switchPlayer;
  let turn = 0;
  let endTurn;

  const handleTie = () => {
    displayController.updateDisplay("It's a tie");
  };

  const handleWin = (playerSymbol) => {
    const { playerName } = displayController;
    if (playerName) {
      displayController.updateDisplay(`${playerName} wins!`);
    } else {
      displayController.updateDisplay(`${playerSymbol} wins!`);
    }
    endTurn();
  };

  const isTie = (turnParam) => turnParam === 9;

  endTurn = (playerSymbol, board) => {
    turn += 1;
    if (isWinner(playerSymbol, board)) {
      handleWin(playerSymbol);
      turn = 0;
      return 0;
    }
    if (isTie(turn)) {
      handleTie();
      turn = 0;
      return 0;
    }
    switchPlayer();
    currentPlayer.pick();
    return 0;
  };

  isWinner = (playerSymbol, board) => {
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

    let isWinning = false;

    winning.forEach((combo) => {
      const [a, b, c] = combo;
      if (
        board[a] === playerSymbol &&
        board[b] === playerSymbol &&
        board[c] === playerSymbol
      ) {
        isWinning = true;
      }
    });

    return isWinning;
  };

  const marker = (symbol) => ({
    mark: (position) => {
      Gameboard.change(position, symbol);
      displayController.renderBoard();
      endTurn(symbol, Gameboard.get());
    },
  });

  const human = (symbol) => ({
    ...marker(symbol),
    symbol,
    pick: () => {
      displayController.getClick();
    },
  });

  const computer = (symbol) => ({
    ...marker(symbol),
    isSmart: !!displayController.isSmartValue,
    symbol,
    pick() {
      const options = Gameboard.areSelectable();
      let move;
      if (this.isSmart) {
        const boardState = Gameboard.get();
        const opponent = symbol === 'O' ? 'X' : 'O';
        const minimax = (board, currentOptions, depth, isMaximizingPlayer) => {
          if (isWinner(symbol, board)) return +10;
          if (isWinner(opponent, board)) return -10;
          if (isTie(depth)) return 0;

          if (isMaximizingPlayer) {
            let max = -Infinity;
            currentOptions.forEach((option) => {
              board[option] = symbol;
              const newOptions = currentOptions.filter(
                (optionsLeft) => optionsLeft !== option,
              );

              const thisScore = minimax(board, newOptions, depth + 1, false);
              board[option] = null;
              max = Math.max(max, thisScore);
            });
            return max;
          }
          let min = Infinity;
          currentOptions.forEach((option) => {
            board[option] = opponent;
            const newOptions = currentOptions.filter(
              (optionsLeft) => optionsLeft !== option,
            );

            const thisScore = minimax(board, newOptions, depth + 1, true);
            board[option] = null;
            min = Math.min(min, thisScore);
          });
          return min;
        };

        let maxScore = -Infinity;
        let bestMove;

        options.forEach((option) => {
          boardState[option] = symbol;
          const newOptions = options.filter(
            (optionsLeft) => optionsLeft !== option,
          );

          const thisScore = minimax(boardState, newOptions, turn + 1, false);
          boardState[option] = null;
          if (thisScore > maxScore) {
            maxScore = thisScore;
            bestMove = option;
          }
        });

        move = bestMove;
      } else {
        move = options[Math.floor(Math.random() * options.length)];
      }
      this.mark(move);
      displayController.renderBoard();
    },
  });

  const playerX = human('X');
  const playerO = computer('O');

  currentPlayer = playerX;

  const start = () => {
    turn = 0;
    currentPlayer = playerX;
    currentPlayer.pick();
  };

  switchPlayer = () => {
    currentPlayer = currentPlayer.symbol === 'X' ? playerO : playerX;
    currentPlayer.pick();
  };

  return { currentPlayer, start, isWinner, isTie };
})();
