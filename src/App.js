import React, { Component } from 'react';
import Dashboard from './Dashboard/Dashboard';
import Info from './Info/Info';
import Forecast from './Forecast/Forecast';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="Wrapper">
        <Dashboard />
        <Info />
        <Forecast />
      </div>
    );
  }
}

export default App;
