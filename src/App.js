import React from 'react';
import './App.css';
import Square from './square/square';
// import 'bootstap/dist/css/bootstapbootstrap.min.css' 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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
          <Container>
            <Row>
              <Col sm={6}>
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
              </Col>
              <Col sm={6}>
              <form onSubmit={()=>this.submitWord()}>
                <input type="text" value={this.state.currentWord} onChange={(event)=>this.textInput(event)} />
                <input type="submit" value="Submit" />
              </form>
              </Col>
            </Row>
          </Container>
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

    submitWord() {
      const currentWord = this.state.currentWord;
      const correctWords = this.state.correctWords;
      const requestOption = {
        method: 'post',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ word: currentWord})
      };
      console.log("posting word")
      fetch('http://localhost:3000/boards/1/correct_words/', requestOption)
        .then(res => {
          console.log("got response")
          console.log(res)
          // console.log(res.json())
          // return res;

          const payload = res.json();
                    console.log(payload);

          console.log("evalutating ok or not")
          if (!res.ok) {
            console.log("not ok")

            return Promise.reject(payload);
          }
          console.log("returning promise")
          return Promise.resolve(payload);
         })
        .then(data => {
          console.log(data)
          correctWords.push(currentWord);
          this.setState({
            correctWords: correctWords,
            row: null,
            col: null,
            currentWord: ""
          })
          console.log("Added word " + correctWords)
        })
        .catch(err => { 
          console.log(err);
          alert("Incorrect Word");
          this.setState({
            row: null,
            col: null,
            currentWord: ""
          })

        })
      //submit currentWord
    }

    handleClick(i,j) {
      //check i, j in state is null then only allow, natra dont allow. 

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
      fetch('http://localhost:3000/boards/1')
      .then(res =>res.json())
      .then((data) => {
        const board =  this.state.board;
        data.squares.forEach(square => {
          board[square.i][square.j] = square.character;
        })
        this.setState({
          board : board,
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
