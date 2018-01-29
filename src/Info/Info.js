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
        const searchtext = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`;
        axios.get(searchtext)
        .then(response => {
            const newTemperature = response.data.query.results.channel.item.condition.temp;
            const text = response.data.query.results.channel.item.condition.text;
            const forecast = response.data.query.results.channel.item.forecast;
            console.log(response);
            this.props.setWeather(newTemperature, text, forecast);
        });
    }
    render () {
        return (
        <div className="Info">
            <div className="Info__Elem">
                <div className="Info__Tmp">{this.props.temperature}</div>
                <div className="Info__Tmp Info__Tmp_celsius">°C</div>
            </div>
            <div className="Info__Elem">
                <div className="Info__InsideElem">
                    <p className="Info__Text Info__Text_weightBold">{this.props.text}</p>
                    <p className="Info__Text">Temperature in <span className="Info__CityName">{this.props.currentCity}</span> is {this.props.temperature}°C ({this.props.text})</p>
                </div>
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        currentCity: state.currentCity,
        temperature: state.currentTemperature,
        text: state.text
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getWeather: () => dispatch({ type: actionsType.GET_WEATHER }),
        setWeather: (tmp, text, forecast) => dispatch({ type: actionsType.SET_WEATHER, tmp: tmp, text: text, forecast: forecast })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);