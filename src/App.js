import React, { Component } from 'react';
import Dashboard from './Dashboard/Dashboard';
import Info from './Info/Info';
import Forecast from './Forecast/Forecast';

import './App.css';
import images from './Images/Images';

class App extends Component {
  render() {
    let imgUrl = `url(${images.cloudy})`;
    if (!true) imgUrl = `url(${images.sun})`;
    if (true)  imgUrl = `url(${images.sunny})`
  
    const style = {
      backgroundImage: imgUrl
    }
    return (
      <div className="Wrapper" style={style}>
        <Dashboard />
        <Info />
        <Forecast />
      </div>
    );
  }
}

export default App;
