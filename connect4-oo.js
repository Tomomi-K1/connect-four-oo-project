class Game{
    constructor(p1, p2, HEIGHT=6, WIDTH=7) {
        this.HEIGHT = HEIGHT;
        this.WIDTH = WIDTH;
        this.board = [];
        this.player = [p1, p2];
        this.currPlayer = p1;
        this.makeHtmlBoard();
        this.makeBoard();
        this.gameOver = false;
    }
    makeBoard() {
      if(this.board.length !==0){
        return;
      }
        for (let y = 0; y < this.HEIGHT; y++) {
          this.board.push(Array.from({ length: this.WIDTH }));
        }

        console.log(this.board);
      
    }
    makeHtmlBoard() {
        const board = document.getElementById('board');
        //clears existing board, otherwise you will have multiple board
        board.innerHTML = '';
      
        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        //why dod you need this in front of handleGameClick
        this.handleGameClick = this.handleClick.bind(this);
        //by putting 'this' in front of newly created name handleGameClick, it works as it it was created inside the constructor. this.handleGameClick will be accessible from any other methods within this class.
        //you have to bind(this) to handleClick here so that when you use this as callback func of evend listner, it won't run against window. If you don't bind it will run on window

        top.addEventListener('click', this.handleGameClick);
      
        for (let x = 0; x < this.WIDTH; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
        }
      
        board.append(top);
      
        // make main part of board
        for (let y = 0; y < this.HEIGHT; y++) {
          const row = document.createElement('tr');
      
          for (let x = 0; x < this.WIDTH; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
          }
      
          board.append(row);
        }
    }
    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color;
        // piece.style.top = -50 * (y + 2);
      
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }
      endGame(msg) {
        alert(msg);
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleGameClick);
    }
    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
      //  console.log("this is set to", this);
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        //=================!!!! this is not working !!!======
        // when I click the top column to play, it gives me an error :Uncaught TypeError: this.findSpotForCol is not a function at HTMLTableRowElement.handleClick
        //I found out here refers to HTML element of where it is clicked.

        if (y === null) {
          return;
        }
      
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin()) {
          this.gameOver = true;
          return this.endGame(`Player ${this.currPlayer.color} player won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
          
        // switch players
        //=====why doesn't thinks work?=====//
        this.currPlayer = this.currPlayer === this.player[0] ? this.player[1] : this.player[0];
        // console.log(this.currPlayer);
    }
    checkForWin() {

        ///Need to make this function into arrow function to be able to refer to constructor properties of HEIGHT. 
        // function _win(cells) {
        //   return cells.every(
        //     ([y, x]) =>
        //       y >= 0 &&
        //       y < this.HEIGHT && 
        //          here "this" refers to function _win
        //       //WHY Error: Uncaught TypeError: Cannot read properties of undefined (reading 'HEIGHT')
        //       x >= 0 &&
        //       x < this.WIDTH &&
        //       this.board[y][x] === this.currPlayer
        //   );
        // }
        const _win=(cells) =>           // Check four cells to see if they're all color of current player
          //  - cells: list of four (y, x) cells
          //  - returns true if all are legal coordinates & all match currPlayer
          
          cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.HEIGHT && 
              //WHY Error: Uncaught TypeError: Cannot read properties of undefined (reading 'HEIGHT')
              x >= 0 &&
              x < this.WIDTH &&
              this.board[y][x] === this.currPlayer
          );
        
      
        for (let y = 0; y < this.HEIGHT; y++) {
          for (let x = 0; x < this.WIDTH; x++) {
            // get "check list" of 4 cells (starting here) for each of the different
            // ways to win
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      
            // find winner (only checking each win-possibility as needed)
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
              return true;
            }
          }
        }
    }
  }

  class Player{
    constructor(color){
      this.color = color;
    }
  }

  const startBtn = document.querySelector('#start-game');
  startBtn.addEventListener('click', () =>{
    let p1 = new Player(document.querySelector('#p1-color').value)
    let p2 = new Player(document.querySelector('#p2-color').value)
    new Game(p1, p2);
  });


