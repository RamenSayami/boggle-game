// import React from 'react';
import React from "react";
import './App.css';
import Square from './square/square';
import 'bootstrap/dist/css/bootstrap.css';
import CountdownTimer from './countDownTimer/count-down-timer';

// import Container from 'react';
// import Row from 'react';
// import Col from 'react';


class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [...Array(4)].map(item => Array(4).fill('A')),
      row: null, 
      col: null,
      loading: true,
      serverNotFound: false,
      history: [],
      currentWordSteps: [],
      currentWord: '',
      correctWords: [],
      timeUpAt: new Date(),
      score: 0,
    };
    this.textInput = this.textInput.bind(this);
    this.submitWord = this.submitWord.bind(this);
  }

  componentDidMount() {
    this.getBoard();
  }


  render() {
      return (
          <div className="game">
          {this.state.loading &&  <div className="loader"></div>}
          {!this.state.loading &&  this.state.serverNotFound && <div> Backend not found! Try running backend first.</div>}

          {!this.state.loading &&  !this.state.serverNotFound &&  <div>
          <div className="container">
            <div className="row">
              <div className="col-md-2">
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
              </div>
              <div className="col-md-3">
                <form onSubmit={(event)=>this.submitWord(event)}>
                  <div className="form-group">
                    <input type="text" class="form-control" placeholder="Type your word here" 
                    value={this.state.currentWord} onChange={(event)=>this.textInput(event)} />
                    <input type="submit" class="btn btn-primary" value="Submit" />
                  </div>
                </form>
                </div>
              <div className="col-md-3">
                <h4>Correct Words:</h4>
                <ul className="list-group">
                  {this.state.correctWords.map(listitem => (
                    <li className="list-group-item list-group-item-primary">
                      {listitem}
                    </li>
                  ))}
                </ul>
                {/* <div>
                  {this.state.correctWords.map((item, index) => (
                    <p key={index} item={item} />
                  ))}
                </div> */}
                {/* <ul>{this.state.correctWords}
                </ul> */}
              </div>
              <div className="col-md-2">
                <CountdownTimer key="countDownTimer" timeUpAt={this.state.timeUpAt} />
              </div>
              <div className="col-md-2">
                <h4>Score: </h4> {this.state.score}
              </div>
            </div>
          </div>
          </div>
          } 
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

    textInput(event){
      this.setState({
        currentWord: event.target.value,
        row: null,
        col: null
      });
    }

    submitWord(event) {
      event.preventDefault();
      const currentWord = this.state.currentWord;
      const correctWords = this.state.correctWords;
      const requestOption = {
        method: 'post',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ "word": currentWord})
      };
      console.log("hitting")
      fetch('http://localhost:3000/boards/1/correct_words/', requestOption)
        .then(res =>  {
          console.log(res);
          if(res.status === 200) {
            return Promise.resolve("Correct Word");
          } else if (res.status === 400) {
            return Promise.reject("Word not present in board");
          } else {
            return Promise.reject("Incorrect word");
          }
        })
        .then(data => {
          console.log("success" + data)

          correctWords.push(currentWord);
          this.setState({
            correctWords: correctWords,
            row: null,
            col: null,
            currentWord: "",
            score: correctWords.length
          })
          console.log(this.state.correctWords)
        })
        .catch(err => { 
          console.log(err)
          alert("Incorrect Word: " + err);
          this.setState({
            row: null,
            col: null,
            currentWord: ""
          })

        })
    }

    handleClick(i,j) {
      const currentWord = this.state.currentWord;
      const currentWordSteps = this.state.currentWordSteps;
      const row = this.state.row;
      const col = this.state.col;
      if(row != null && col!=null) {
        if( !((row -1) <= i && i  <= (row + 1)) || !((col -1) <= j && j <= (col + 1)) ) {
          alert('Cannot click this');
          return;
        }
      }
      this.setState({
        row : i,
        col : j,
        currentWord: currentWord.concat(this.state.board[i][j]),
        currentWordSteps: currentWordSteps.concat({row: i, col: j, letter: this.state.board[i][j] }),
      })
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

    getBoard() {    
      const timeUpAt = new Date(Date.now() + (5 * 60 * 1000));
      fetch('http://localhost:3000/boards/1')
      .then(res =>res.json())
      .then((data) => {
        const board =  this.state.board;
        data.squares.forEach(square => {
          board[square.i][square.j] = square.character;
        })
        this.setState({
          board : board,
          timeUpAt : timeUpAt,
          loading: false,
        })
      })
      .catch( err=> {
        this.setState({
          loading: false,
          serverNotFound: true
        })
      });    
    }
}

export default Game;
