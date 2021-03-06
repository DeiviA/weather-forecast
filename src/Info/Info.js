import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import * as actionsType from './../store/actions';
import './Info.css';

class Info extends Component {

    componentDidMount () {
        // write to variable initial state from reduser.js in case we first time running our app
        let city = this.props.currentCity; 
        if (typeof(Storage) !== "undefined" && localStorage.getItem('currentCity')) {
            city = localStorage.getItem('currentCity'); // but if not, we retrieve data from local storage
        }   
        const searchtext = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`;
        axios.get(searchtext)
        .then(response => {
            // if get request is successful we create object 'weather' and write there all necessary information
            const weather = {
                newTemperature: response.data.query.results.channel.item.condition.temp,
                text: response.data.query.results.channel.item.condition.text,
                forecast: response.data.query.results.channel.item.forecast,
                code: response.data.query.results.channel.item.condition.code,
                humidity: response.data.query.results.channel.atmosphere.humidity,
                pressure: response.data.query.results.channel.atmosphere.pressure,
                visibility: response.data.query.results.channel.atmosphere.visibility,
                wind: response.data.query.results.channel.wind.speed
            };
            // then pass all data to redux via 'setWeather' method
            this.props.setWeather(weather.newTemperature, weather.text, weather.forecast, weather.code, weather.humidity, weather.pressure, weather.visibility, weather.wind);
        })
        .catch(error => {
            console.log(error);
        });
    }
    render () {
        return (
        <div className="Info">
            <div className="Info__Elem">
                <div className="Info__Tmp">{this.props.temperature}</div>
                <div className="Info__Cel">°C</div>
            </div>
            <div className="Info__Elem">
                <div className="Info__InsideElem">
                    <p className="Info__Text Info__Text_bigger">{this.props.text}</p>
                    <p className="Info__Text">Barometer <span className="Info__Text_bold">{this.props.pressure} mb</span></p>
                    <p className="Info__Text">Visibility <span className="Info__Text_bold">{this.props.visibility} km</span></p>
                    {/* <p className="Info__Text">Temperature in <span className="Info__CityName">{this.props.currentCity}</span> is {this.props.temperature}°C ({this.props.text})</p> */}
                </div>
                <div className="Info__InsideElem">
                    <p className="Info__Text">Humidity <span className="Info__Text_bold">{this.props.humidity}%</span></p>
                    <p className="Info__Text">Wind <span className="Info__Text_bold">{this.props.wind} km/h</span></p>
                </div>
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        currentCity: state.currentCity,
        temperature: state.currentTemperature,
        text: state.text,
        humidity: state.humidity,
        pressure: state.pressure,
        visibility: state.visibility,
        wind: state.wind
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setWeather: (tmp, text, forecast, code, humidity, pressure, visibility, wind) => dispatch({ 
            type: actionsType.SET_WEATHER, 
            tmp: tmp, 
            text: text, 
            forecast: forecast, 
            code: code,
            humidity: humidity,
            pressure: pressure,
            visibility: visibility,
            wind: wind
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);