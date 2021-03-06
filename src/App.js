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
    if (code <= 4)  imgUrl = `url(${images.lightning})`;  // tornado
    if (code === 5 || code === 6 || code === 10 || code === 11)  imgUrl = `url(${images.rain})`;  // snow & rain
    if (code >= 13 && code <= 16)  imgUrl = `url(${images.snow})`;  // snow flurries
    if (code >= 19 && code <= 22)  imgUrl = `url(${images.fog})`;  // fog
    if (code >= 24 && code <= 28)  imgUrl = `url(${images.clouds})`;  // cloudy
    if (code >= 29 && code <= 30)  imgUrl = `url(${images.sunlight})`;  // cloudy
    if (code >= 31 && code <= 33)  imgUrl = `url(${images.sunlight1})`;  // sunny
    if (code === 36)  imgUrl = `url(${images.sun})`;  // hot
    if (code >= 37 && code <= 40)  imgUrl = `url(${images.lightning})`;  // thunderstorm
    if (code >= 41 && code <= 46)  imgUrl = `url(${images.snow})`;  // heavy snow
    return imgUrl;
  }

  render() {
    // depending on which code we retrieve we switch between backgrounds
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
