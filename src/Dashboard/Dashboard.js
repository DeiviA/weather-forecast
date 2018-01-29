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
        const searchtext = `https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`;
        axios.get(searchtext)
        .then(response => {
            const newTemperature = response.data.query.results.channel.item.condition.temp;
            console.log(response);
            this.props.setWeather(newTemperature);
            this.props.onChangeCity(this.state.value);
        })
        .catch(error => {
            console.log(error);
        });
    }

    render () {
        return (
            <div className="Dashboard">
                <input className="Search" type="text" placeholder="Search for City" name="city" onKeyUp={(event) => this.onChangeValue(event)}/>
                <button className="SearchBtn" onClick={this.onSearchCity}>Search</button>
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
        onChangeCity: (city) => dispatch({ type: actionsType.CHANGE_CITY, city: city}),
        setWeather: (tmp) => dispatch({ type: actionsType.SET_WEATHER, tmp: tmp })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);