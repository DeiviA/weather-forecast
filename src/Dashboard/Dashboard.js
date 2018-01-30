import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import './Dashboard.css';
import Favorite from './Favorite/Favorite';
import * as actionsType from './../store/actions';

class Dashboard extends Component {
    state = {
        value: '',
        showBar: false
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
            this.onClickDashboard();
        })
        .catch(error => {
            console.log(error);
        });
    }

    onClickDashboard = () => {
        const newValue = !this.state.showBar;
        this.setState({
            showBar: newValue
        });
    }

    onClickPlus = () => {
        const newLocation = {
            city: this.props.city,
            country: this.props.country
        }
        this.props.addFavorite(newLocation);
    }

    render () {
        let dashboardBox = '';
        const citiesList = this.props.cities.map((item, index) => {
            return <Favorite key={index} city={item.city} country={item.country}/>
        });

        if (this.state.showBar) {
            dashboardBox = (
                <div className="DashboardBox">
                    <div className="DashboardBox__Elem">
                        <input className="DashboardBox__Search" type="text" placeholder="Search for City" name="city" onKeyUp={(event) => this.onChangeValue(event)}/>
                        <button className="DashboardBox__SearchBtn" onClick={this.onSearchCity}>Search</button>
                    </div>
                    <div className="DashboardBox__Elem DashboardBox__Elem_list">
                        {citiesList}
                    </div>
                </div>
            );
        }
        return (
            <div className="Dashboard">
                <div className="DashboardBoxWrapper">
                    <div className="DashboardBoxWrapper__LocationWrapper"  onClick={this.onClickDashboard}>
                        <p className="DashboardBoxWrapper__LocationInfo">{this.props.city}, {this.props.country}</p>
                    </div>
                    <div className="DashboardBoxWrapper__Favorite" onClick={this.onClickPlus}>
                        <p className="DashboardBoxWrapper__Plus">+</p>
                    </div>
                </div>
                {dashboardBox}
            </div>
        )
    }
    
}

const mapStateToProps = state => {
    return {
        city: state.currentCity,
        country: state.currentCountry,
        cities: state.cities
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onChangeCity: (city, country) => dispatch({ type: actionsType.CHANGE_CITY, city: city, country: country }),
        setWeather: (tmp, text, forecast, code) => dispatch({ type: actionsType.SET_WEATHER, tmp: tmp, text: text, forecast: forecast, code: code }),
        addFavorite: (loc) => dispatch({ type: actionsType.ADD_FAVORITE, newLocation: loc})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);