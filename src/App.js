import React, { Component } from 'react';
import './App.css';
import ColorForm from './colorAddForm';
import ShowColors from './colorShow';

class App extends Component {
  state = {
    colors: [],
  };

  handleAddColor = (color) => {
    this.setState((prevState) => ({ colors: [...prevState.colors, color] }));
  };

  render() {
    return (
      <div className="App">
        <ColorForm onAddColor={this.handleAddColor} />
        <ShowColors colors={this.state.colors} />
      </div>
    );
  }
}

export default App;
