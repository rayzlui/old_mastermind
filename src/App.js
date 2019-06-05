import React from 'react';
import logo from './logo.svg';
import './App.css';
import BasicContainer from './basic_container'

const colors = ["red", "white", "blue", "green", "black", "purple", "yellow", "orange"]

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      code : this.generateCode.bind(this)(),
      input: [],
      gameover: false,
      turns: 8,
      winner: false,
      previousmoves: [],
      buttons: this.colorInputs.bind(this)(colors, true, "input-button"),
      hint: []
    }
  }

  generateCode(){
    let code = []
    for (var i = 0; i < 4; i ++){
      let random = Math.floor(Math.random() * 8)
      code.push(colors[random])
    }
    return code
  }

  notGameOver(){
    let hint = this.checkWin()
    if (hint.every(color => color === "red")&&hint.length===4){
      this.setState({winner: true, gameover: true})
      return false
    }
    if (this.state.turns === 0){
      this.setState({gameover: true})
      return false
    }else{
      
      return hint
    }
  }

  colorInputs(colors, func = null, type = "display"){
    let result = []
    
    for (let i = 0; i < colors.length; i ++){
      let task = func ? ()=>this.selectColor.bind(this)(colors[i]) : null
      result.push(<div key = {colors[i]+ i} className = {type} style = {{border: "2px black solid", display: "inline-block", height: "20px", width: "20px", backgroundColor: colors[i]}} onClick = {task}></div>)
    }
    return result
  }

  currentGuess(input){
    let result = []
    for (let i = 0; i < 4; i ++){
      let color = input[i] ? input[i] : "grey"
      result.push(<div key = {colors[i]+ i}  style = {{border: "2px black solid", display: "inline-block", height: "30px", width: "30px", backgroundColor: color}}></div>)
    }
    return result
  }
  
  

  selectColor(color){
    
    let input = this.state.input
    input.push(color)
    this.setState({input: input})
  }

  submitGuess(){
    let hint = this.notGameOver()
    if (hint){
      let previous = this.state.previousmoves
      previous.push(this.state.input.concat(hint))
      let turns = this.state.turns - 1
      this.setState({previousmoves: previous, input: [], turns: turns})
    }
  }

  removeSelection(){
    let remove = this.state.input
    remove.pop()
    this.setState({input: remove})
  }


  checkWin(){
    let hint = []
    let code = this.state.code.slice()
    let input = this.state.input.slice()
    for (let i = 0 ; i < code.length; i++){
      if (code[i] === input[i]){
        hint.push("red")
        code.splice(i,1)
        input.splice(i,1)
        i-=1
      }
    }
    for (let i = 0; i < input.length; i++){
        
        if(code.includes(input[i])){
          code.splice(code.indexOf(input[i]),1)
          hint.push("white")
        }
    }
    
    return hint
  }

  deleteButton(){
    return <button onClick = {this.removeSelection.bind(this)} className = "remove-color">Delete Previous</button>

  }

  displayInput(){
    let display
    if (this.state.input.length === 4){
      display = <button className = "submit" onClick = {this.submitGuess.bind(this)}>Submit Guess</button>
    }else{
      display = <section>{this.state.buttons}</section>
    }
      return (
              <section  style = {{display: "inline-block"}} className = "selector-buttons">
                <h3>Buttons:</h3>
                {display}
                {this.deleteButton()}
              </section>)
    
  }

  showGuessesInColor(move = this.state.input){
    return (this.colorInputs(move, null, "input"))
  }

  showPreviousGuesses(){
    let display = []
    for (let i = 0; i < this.state.previousmoves.length;i ++){
      let move = this.state.previousmoves[i]
      let guess = this.showGuessesInColor.bind(this)(move.slice(0,4))
      let hint = move.slice(4).map(color => <div style= {{border:"2px black solid", height: "10px", width: "10px", backgroundColor: color, display: "inline-block"}} className = {"hint"+i} ></div>)
      let row = <section className = "previous-guesses">Guess #{i}: {guess} Hint: {hint} </section>
      display.push(row)
    }
    return (
      <section className = "previous-guesses">
        
        {display}
      </section>
    )
  }

  winner(){
    return (
      <h1 className = "winner">
        Winner!
      </h1>
    )
  }

  loser(){
    return(
      <div className = "loser">
        <h1>LOSER :(</h1>
        <p>Correct code was:</p>
        {this.colorInputs(this.state.code)}
      </div>
    )
  }

  turnsLeft(){
    let display
    if (this.state.gameover===true){
      display = this.state.winner ? this.winner() : this.loser()
    }else{
      display = <h2>Turns Remaining: {this.state.turns}</h2>
    }
    return (
      <div className = "left">
        {display}
      </div>
    )
  }


  displayDetails(){
   
    let buttons
    if (this.state.gameover===true){
      buttons = null
    }else{

      buttons = <div style = {{display: "inline-block"}}>{this.displayInput.bind(this)()}</div>
    }
    
    return(  
    
        
        <section className = "input-buttons">
            <h2>Select Colors</h2>
            {buttons}
        </section>
      
    )
  }

  render(){
    
    return(
      <div className = "container">

        <header className = "mastermind-header"><h1>Mastermind</h1></header>
        {this.turnsLeft()}
        <section className = "current-guess">
            <h2>Current Guess</h2>
            {this.currentGuess.bind(this)(this.state.input)}
        </section>
        <div className = "right">
            <h2>Previous Moves</h2>
            {this.showPreviousGuesses.bind(this)()}
        </div>
        
        
        {this.displayDetails()}
        
      </div>
    )
  }
}

export default App;
