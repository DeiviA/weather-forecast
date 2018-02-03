import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Forecast.css';
import Item from './Item/Item';

class Forecast extends Component {
    render () {
        const width = document.getElementById('root').clientWidth;
        console.log(width);
        const forecast = this.props.forecast.slice();
        if (width < 800) forecast.pop();
        if (width < 720) forecast.pop();
        if (width < 640) forecast.pop();
        if (width < 560) forecast.pop();
        if (width < 480) forecast.pop();
        if (width < 400) forecast.pop();
        // { code: '22', date: '29 Jan', day: 'Mon', high: '10', low: '2', text: 'cloudy'}
        const weekForecast = forecast.map((item, index) => {
            return <Item key={item.code + index} date={item.date} day={item.day} high={item.high} low={item.low} text={item.text} code={item.code}/>
        });
        console.log(this.props.forecast);

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