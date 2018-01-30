import React, { Component } from 'react';
import Dashboard from './Dashboard/Dashboard';
import Info from './Info/Info';
import Forecast from './Forecast/Forecast';
import { connect } from 'react-redux';

import './App.css';
import images from './Images/Images';

class App extends Component {
  whichBackground = (codeStr) => {
    const code = +codeStr;
    let imgUrl = `url(${images.cloudy})`;
    if (code <= 4)  imgUrl = `url(${images.cloudy})`;  // tornado
    if (code >= 10 && code <= 16)  imgUrl = `url(${images.cloudy})`;  // snow & rain
    if (code >= 24 && code <= 30)  imgUrl = `url(${images.cloudy})`;  // cloudy
    if (code >= 31 && code <= 32)  imgUrl = `url(${images.sunny})`;  // sunny
    if (code === 36)  imgUrl = `url(${images.sun})`;  // hot
    if (code >= 37 && code <= 40)  imgUrl = `url(${images.sunny})`;  // thunderstorm
    if (code >= 41 && code <= 43)  imgUrl = `url(${images.sunny})`;  // heavy snow
    return imgUrl;
  }

  render() {
    const imgUrl = this.whichBackground(this.props.code);
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

const mapStateToProps = state => {
  return {
    code: state.code
  }
}

export default connect(mapStateToProps)(App);
