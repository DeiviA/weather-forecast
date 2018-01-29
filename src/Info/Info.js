import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import * as actionsType from './../store/actions';
import './Info.css';

class Info extends Component {
    state = {
        city: 'kyiv',
        temperature: 0
    }

    componentDidMount () {
        const city = this.props.currentCity;
        const searchtext = `https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`;
        axios.get(searchtext)
        .then(response => {
            const newTemperature = response.data.query.results.channel.item.condition.temp;
            console.log(response);
            this.props.setWeather(newTemperature);
        });
    }
    render () {
        return (<div className="Info">
        <p className="Info__Text">Temperature in <span className="Info__CityName">{this.props.currentCity}</span> is {this.props.temperature}°C</p>
        </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        currentCity: state.currentCity,
        temperature: state.currentTemperature
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getWeather: () => dispatch({ type: actionsType.GET_WEATHER }),
        setWeather: (tmp) => dispatch({ type: actionsType.SET_WEATHER, tmp: tmp })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);