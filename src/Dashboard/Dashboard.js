import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import './Dashboard.css';
import * as actionsType from './../store/actions';

class Dashboard extends Component {
    state = {
        value: ''
    }

    onChangeValue = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    onSearchCity = () => {
        const city = this.state.value;
        const searchtext = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`;
        axios.get(searchtext)
        .then(response => {
            const weather = {
                newTemperature: response.data.query.results.channel.item.condition.temp,
                text: response.data.query.results.channel.item.condition.text,
                forecast: response.data.query.results.channel.item.forecast,
                code: response.data.query.results.channel.item.condition.code
            };
            const location = {
                city: response.data.query.results.channel.location.city,
                contry: response.data.query.results.channel.location.country
            }
            console.log(response);
            this.props.setWeather(weather.newTemperature, weather.text, weather.forecast, weather.code);
            this.props.onChangeCity(location.city, location.country);
        })
        .catch(error => {
            console.log(error);
        });
    }

    render () {
        return (
            <div className="Dashboard">
                <input className="Dashboard__Search" type="text" placeholder="Search for City" name="city" onKeyUp={(event) => this.onChangeValue(event)}/>
                <button className="Dashboard__SearchBtn" onClick={this.onSearchCity}>Search</button>
            </div>
        )
    }
    
}

const mapStateToProps = state => {
    return {
        city: state.currentCity
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onChangeCity: (city, country) => dispatch({ type: actionsType.CHANGE_CITY, city: city, country: country }),
        setWeather: (tmp, text, forecast, code) => dispatch({ type: actionsType.SET_WEATHER, tmp: tmp, text: text, forecast: forecast, code: code })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);