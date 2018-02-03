import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Forecast.css';
import Item from './Item/Item';

class Forecast extends Component {
    render () {
        // First, I was trying to use this carousel - https://github.com/akiran/react-slick
        // for the 10-day forecast, it seemed very simple, but it didn't work correct. I spent a lot of time 
        // and didn't succeed. I chose another way, I just cut off the array with the weather forecast when 
        // client width is too small ;) I know it's stupid, but I have no more time to find a good carousel
        const width = document.getElementById('root').clientWidth;
        const forecast = this.props.forecast.slice(); // copy the array
        if (width < 800) forecast.pop(); // and cut off depending how small is the width
        if (width < 720) forecast.pop();
        if (width < 640) forecast.pop();
        if (width < 560) forecast.pop();
        if (width < 480) forecast.pop();
        if (width < 400) forecast.pop();
        // { code: '22', date: '29 Jan', day: 'Mon', high: '10', low: '2', text: 'cloudy'}
        const weekForecast = forecast.map((item, index) => {
            return <Item key={item.code + index} date={item.date} day={item.day} high={item.high} low={item.low} text={item.text} code={item.code}/>
        });

        return (
        <div className="Forecast">
            {weekForecast}
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        forecast: state.forecast
    }
}

export default connect(mapStateToProps)(Forecast);