import React from 'react';
import './App.css';
import Square from './square/square';


class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: getBoard(),
      row: null, 
      col: null,
      history: [],
      currentWordSteps: [],
      currentWord: ''
    };
  }


  render() {
      return (
          <div className="board">
            <div className="board-row">
              {this.renderSquare(0,0)}
              {this.renderSquare(0,1)}
              {this.renderSquare(0,2)}
              {this.renderSquare(0,3)}
            </div>
            <div className="board-row">
              {this.renderSquare(1,0)}
              {this.renderSquare(1,1)}
              {this.renderSquare(1,2)}
              {this.renderSquare(1,3)}
            </div>
            <div className="board-row">
              {this.renderSquare(2,0)}
              {this.renderSquare(2,1)}
              {this.renderSquare(2,2)}
              {this.renderSquare(2,3)}
            </div>
            <div className="board-row">
              {this.renderSquare(3,0)}
              {this.renderSquare(3,1)}
              {this.renderSquare(3,2)}
              {this.renderSquare(3,3)}
            </div>
            {this.state.currentWord}
            <button >Submit Word</button>
          </div>
       
      );
    }

    renderSquare(i,j) {
        const higlight = this.highlight(i,j);
        return <Square 
        value={this.state.board[i][j]} 
        highlight ={higlight} 
        onClick={() => this.handleClick(i,j)}
        />;
    }   

    handleClick(i,j) {
      //check i, j in state is null then only allow, natra dont allow. 

      const currentWord = this.state.currentWord;
      const currentWordSteps = this.state.currentWordSteps;
      this.setState({
        row : i,
        col : j,
        currentWord: currentWord.concat(this.state.board[i][j]),
        currentWordSteps: currentWordSteps.concat({row: i, col: j, letter: this.state.board[i][j] }),
      })

      console.log(this.state);
      console.log(i + ',' + j + '=' + this.state.board[i][j]);
    }

    highlight(i,j) {
      if(this.state.row != null && this.state.col !=null) {
        if(this.state.row === i && this.state.col === j) {
          return false;
        }
        if((this.state.row -1 === i || this.state.row === i || this.state.row +1 === i ) 
           && (this.state.col -1 === j || this.state.col === j || this.state.col +1 === j )){
          return true;
        }
        return false;
      }
      return false;
    }


}


function getBoard() {
  // const lines = [
  //   ['E','N','M','G'],
  //   ['T','S','N','E'],
  //   ['Y','E','S','A'],
  //   ['S','U','I','T'],
  // ];
  //cal backend api to load this up
  const board = [...Array(4)].map(item => Array(4).fill('A'))

  fetch('http://localhost:3000/boards/1')
  .then(res =>res.json())
  .then((data) => {
    console.log(data);
    data.squares.forEach(square => {
      console.log(square.i+","+ square.i+"="+square.character)
      board[square.i][square.j] = square.character;
      
    })
    console.log(board)
    return board;

  })
  .catch(console.log)
  console.log(board[0][0]);
}


export default Game;
