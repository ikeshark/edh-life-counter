import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var blue = "#00B1E1";
var grey = "#7D7D7D";
var red = "#ff0000";
var green = "#228B22";
var orange = "#ffd700";
var purple = "#9932CC";

class Modal extends React.Component {
   render() {
      if (this.props.isOpen === false)
         return null
      return (
         <div>
            <div className="modalWindow" style={{backgroundColor: this.props.backgroundColor}}>{this.props.children}</div>
            <div className="modalBackground" onClick={() => this.props.onClose()} />
         </div>
      )
   }
}

class Player extends React.Component {
   constructor() {
      super();
      this.state = {
         isModalOpen: false,
         poison: 0,
         commanderDamage: Array(6).fill(0),
         showSlider: Array(6).fill(false)
      }
      this.handlePoison = this.handlePoison.bind(this);
      this.handleCommanderDamage = this.handleCommanderDamage.bind(this);
   }
   openModal() {
      this.setState({ isModalOpen: true })
   }
   closeModal() {
      this.setState({ isModalOpen: false })
   }
   showSlider(i) {
      const showSlider = this.state.showSlider.splice();
      showSlider[i] = true;
      this.setState({ showSlider: showSlider });
   }
   renderCommanderDamage() {
      var commanders = [];
      for (let i = 0; i < this.props.numPlayers; i++) {
         commanders.push(
            <span>
               <button
                  className="commanderDamage"
                  id={i + 10}
                  style={{backgroundColor: this.props.colors[i]}}
                  onClick={() => this.showSlider(i)}
               >
                  {this.state.commanderDamage[i]}
               </button>
               <input
                  value={this.state.commanderDamage[i]}
                  min="0" max="21"
                  type="range"
                  className="commanderDamageSlider"
                  name={i}
                  onChange={this.handleCommanderDamage}
                  style={this.state.showSlider[i] ? {backgroundColor: this.props.colors[i]} : {display: "none", backgroundColor: this.props.colors[i]}}
               />
            </span>
         );
      }
      return <div>{commanders}</div>;
   }
   handlePoison(e) {
      var poison = this.state.poison;
      poison = e.target.value;
      this.setState({ poison: poison });
   }
   handleCommanderDamage(e) {
      const commanderDamage = this.state.commanderDamage.slice();
      var i = e.target.name;
      commanderDamage[i] = e.target.value;
      this.setState({ commanderDamage: commanderDamage });
   }
   render() {
      return (
         <div className="player" id={this.props.index} style={{backgroundColor: this.props.color}}>
            <button className="incrementUp" onClick={() => this.props.onGainLife()}>&#43;</button>
            <button className="playerName" onClick={() => this.props.onRename()}>
               {this.props.name}
            </button>
            <span className="life">{this.props.life}</span>
            <button className="commanderBtn" onClick={() => this.openModal()}>
               <img src="edh.png" width="30px" alt="Commander icon" />
            </button>
            <button className="incrementDown" onClick={() => this.props.onLoseLife()}>&#8211;</button>
            <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()} backgroundColor={this.props.color}>
               <h1>{this.props.name} Commander Damage</h1>
               {this.renderCommanderDamage()}
               <br />
               <br />
               <br />
               <h1>Poison: {this.state.poison}</h1>
               <input
                  type="range"
                  min="0" max="10"
                  className="poisonSlider"
                  value={this.state.poison}
                  onChange={this.handlePoison}
               />
            </Modal>
         </div>
      );
   }
}
class Game extends React.Component {
   constructor() {
      super();
      this.state = {
         colors: [grey, red, green, blue, orange, purple],
         numPlayers: 4,
         isModalOpen: false,
         life: Array(6).fill(40),
         name: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"]
      };
   }

   openModal() {
      this.setState({ isModalOpen: true })
   }
   closeModal() {
      this.setState({ isModalOpen: false })
   }

   handleGainLife(i) {
      const life = this.state.life.slice();
      life[i] += 1;
      this.setState({life: life});
   }
   handleLoseLife(i) {
      const life = this.state.life.slice();
      life[i] -= 1;
      this.setState({ life: life });
   }
   handleRename(i) {
      let newName = prompt("New name", "");
      if (newName === "") {
         alert("You didn't provide a name, that's not nice");
      } else {
         const name = this.state.name.slice();
         name[i] = newName;
         this.setState({ name: name });
      }
   }

   renderPlayer() {
      var players = [];
      for (let i = 0; i < this.state.numPlayers; i++) {
         players.push(
            <Player
               index={i}
               name={this.state.name[i]}
               life={this.state.life[i]}
               color={this.state.colors[i]}
               colors={this.state.colors}
               numPlayers={this.state.numPlayers}
               onGainLife={() => this.handleGainLife(i)}
               onLoseLife={() => this.handleLoseLife(i)}
               onRename={() => this.handleRename(i)}
            />
         );
      }
      if (this.state.numPlayers === 2){
         return <div className="container2">{players}</div>;
      } else if (this.state.numPlayers === 3){
         return <div className="container3">{players}</div>;
      } else if (this.state.numPlayers === 5){
         return <div className="container5">{players}</div>;
      } else if (this.state.numPlayers === 6) {
         return <div className="container6">{players}</div>;
      } else {
         return <div className="container">{players}</div>;
      }
   }
   handleSubtractPlayer() {
      if (this.state.numPlayers === 2) {
         alert("2 is minimum");
      } else {
         let numPlayers = this.state.numPlayers;
         numPlayers -= 1;
         this.setState({ numPlayers: numPlayers });
         this.renderPlayer();
      }
   }
   addPlayer() {
      if (this.state.numPlayers === 6) {
         alert("6 is max");
      } else {
         let numPlayers = this.state.numPlayers;
         numPlayers += 1;
         this.setState({ numPlayers: numPlayers });
         this.renderPlayer();
      }
   }
  render() {
    return (
      <div>
         {this.renderPlayer()}
         <button onClick={() => this.openModal()} id="gearBtn"></button>
         <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
            <h1>Utilities</h1>
            <button className="utiliBtn" onClick={() => alert("To start a new game please refresh your browser")}>new game</button>
            <button className="utiliBtn" onClick={() => this.addPlayer()}>add a player</button>
            <button className="utiliBtn" onClick={() => this.handleSubtractPlayer()}>subtract a player</button>
            <button className="utiliBtn" onClick={() => this.closeModal()}>close window</button>
         </Modal>
      </div>
    );
  }
}
// GOAL LIST
// fast increment
//    reset button (?)
//    change colors
// partner option for commander damage


// FIX LIST
// separate components as is custom
// use map instead of loop in renderPlayer?
// make ALL units relative

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
