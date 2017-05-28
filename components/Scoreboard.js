import React from 'react';

var nextId = 3;

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      elapsedTime: 0,
      previousTime: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.onTick.bind(this), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onTick() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
      });
    }
  }

  onStart() {
    this.setState({
      running: true,
      previousTime: Date.now()
    });
  }

  onStop() {
    this.setState({ running: false });
  }

  onReset() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now()
    });
  }

  render() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        { (this.state.running) ?
            <button onClick={this.onStop.bind(this)}>Stop</button> :
            <button onClick={this.onStart.bind(this)}>Start</button> }
        <button onClick={this.onReset.bind(this)}>Reset</button>
      </div>
    )
  }
}

class AddPlayerForm extends React.Component {
  static propTypes = {
    onAdd: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  render () {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" value={this.state.name} onChange={this.onNameChange.bind(this)} />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    )
  }
}

function Stats(props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player) {
    return total += player.score;
  }, 0);

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  )
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired
}

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired
};

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
      <div className="counter-score">{props.score}</div>
      <button className="counter-action increment" onClick={function() {props.onChange(1);}}> + </button>
    </div>
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>X</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange} />
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onRemove: React.PropTypes.func.isRequired
}

class Scoreboard extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired
    })).isRequired
  };

  static defaultProps = {
    title: "Scoreboard"
  };

  constructor(props) {
    super(props);
    this.state = {
      players: this.props.initialPlayers
    }
  }

  onScoreChange(index, delta) {
    this.state.players[index].score += delta;
    this.setState(this.state);
  }

  onPlayerAdd(name) {
    this.state.players.push({
      id: nextId,
      name: name,
      score: 0
    });
    this.setState(this.state);
    nextId += 1;
  }

  onRemovePlayer(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  }

  render() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />

        <div className="players">
          {this.state.players.map(function(player, index) {
            return (
              <Player
                onScoreChange={function(delta) {this.onScoreChange(index, delta)}.bind(this)}
                onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
                key={player.id}
                name={player.name}
                score={player.score} />
            );
          }.bind(this))}

          <AddPlayerForm onAdd={this.onPlayerAdd.bind(this)} />
        </div>
      </div>
    );
  }
}

export default Scoreboard;
