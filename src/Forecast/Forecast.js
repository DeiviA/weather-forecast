import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Forecast.css';
import Item from './Item/Item';

class Forecast extends Component {
    render () {
        // { code: '22', date: '29 Jan', day: 'Mon', high: '10', low: '2', text: 'cloudy'}
        const weekForecast = this.props.forecast.map(item => {
            return <Item key={item.code} date={item.date} day={item.day} high={item.high} low={item.low} text={item.text}/>
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