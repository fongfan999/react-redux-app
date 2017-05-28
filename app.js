// Libs
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import Scoreboard from './components/Scoreboard';

// CSS
import './css/style.css';

var PLAYERS = [
  {
    name: "Jim Hoskins",
    score: 0,
    id: 1
  },
  {
    name: "Phong Phan",
    score: 0,
    id: 2
  }
];

ReactDOM.render(<Scoreboard initialPlayers={PLAYERS} />, document.getElementById('container'));
