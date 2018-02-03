import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import './Dashboard.css';
import Favorite from './Favorite/Favorite';
import * as actionsType from './../store/actions';

class Dashboard extends Component {
    state = {
        value: '',
        showBar: false,
        spinner: false
    }

    // onSubmitCity = (event) => {
    //     event.preventDefault();
    //     this.onSearchCity();
    // }

    onChangeValue = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    onSearchCity = (favorite) => {
        console.log('search city is ' + favorite);
        let city = this.state.value;
        if (favorite.length) city = favorite;
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
                country: response.data.query.results.channel.location.country
            }
            console.log(response);
            this.props.setWeather(weather.newTemperature, weather.text, weather.forecast, weather.code);
            this.props.onChangeCity(location.city, location.country);
            this.saveToLocalStorage('currentCity', location.city);
            this.saveToLocalStorage('currentCountry', location.country);
            this.setState({  
                showBar: false  //  hide the bar
                });
            })
        .catch(error => {
            console.log(error);
        });
    }

    // hide or show favorite list ?
    onClickDashboard = () => {
        const newValue = !this.state.showBar;
        this.setState({
            showBar: newValue
        });
    }

    // Add new location to our favorite list
    onClickPlus = () => {
        const newLocation = {
            city: this.props.city,
            country: this.props.country
        }
        this.props.addFavorite(newLocation);
    }

    // Choose some location from our favorite list
    // and transfer city name to method onSearchCity()
    onClickFavorite = (city) => {
        const favoriteCity = `${city}`;
        this.setState({
            value: city
        });
        this.onSearchCity(favoriteCity);
    }

    // this function add a star if current city is in our list
    isCityFavorite = () => {
        const currentCity = this.props.city;
        const cities = this.props.cities.slice();
        let res = (<i className="fa fa-star-o"></i>);
        // check if the array of cities is empty to preven the error
        if (cities.length) {
            cities.forEach(item => {
                if (item.city.toLowerCase() === currentCity.toLowerCase()) {
                // is city in list ?
                // if so we change our star
                res = (<i className="fa fa-star"></i>);
                }
            });
        }
        return res;
    }

    findMyLocation = () => {
        let shouldNavigate = true;
        if (typeof(Storage) !== "undefined") {
            const savedCity = sessionStorage.getItem('city');
            console.log('savedCity =');
            console.log(savedCity);
            if (savedCity) {
                console.log('local storage');
                shouldNavigate = false;
                this.onSearchCity(savedCity);
            }
        }
        if (shouldNavigate) {
            this.setState({
                spinner: true
            });
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let city = '';
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCx9uiyR6wDuSY4glfKO4FAuQHwH8vTF4A&language=en&result_type=political`;
                    axios.get(url)
                        .then(responce => {
                            city = responce.data.results[2].address_components[1].short_name;
                            city = `${city}`;
                            if (typeof(Storage) !== "undefined") {
                                sessionStorage.setItem("city", city);
                            }
                            console.log(responce);
                            console.log('GOOD!!! Geolocation city is ' + city);
                            console.log(responce.data.results[2].address_components);
                            this.onSearchCity(city);
                            this.setState({
                                spinner: false
                            });
                        })
                        .catch(error => {
                            console.log('WHY ERROR!');
                            console.log(error);
                            this.setState({
                                spinner: false
                            });
                        });
                    
                    // console.log('Последний раз вас засекали здесь: ' +
                    //     position.coords.latitude + ", " + position.coords.longitude);
                }
            );
        }
    }

    saveToLocalStorage = (key, data) => {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, data);
        }
    }

    componentDidMount () {
        if (typeof(Storage) !== "undefined" && localStorage.getItem('currentCity')) {
            const location = {
                city: localStorage.getItem('currentCity'),
                country: localStorage.getItem('currentCountry')
            }
            this.props.onChangeCity(location.city, location.country);
            const cities = [];
            let counter = 0;
            for (let i = 0; i < 4; i++) {
                let data = localStorage.getItem(`${i}`);
                let favLoc = '';
                if (data) {
                    this.saveToLocalStorage(counter, data);
                    counter++;
                    cities.push(data);
                    favLoc = data.split(',');
                    let newLocation = {
                        city: favLoc[0],
                        country: favLoc[1]
                    }
                    this.props.addFavorite(newLocation);
                }
            }
            console.log(cities);
        }
    }

    render () {
        let dashboardBox = ''; 
        let citiesList = ''; //empty favorite list
        let geoIco = (<i className="fa fa-crosshairs"></i>);
        let star = this.isCityFavorite(); // star 
        if (this.props.cities.length) {
            citiesList = this.props.cities.map((item, index) => {
            return <Favorite key={index} city={item.city} country={item.country} findFavorite={this.onClickFavorite} removeFavorite={this.props.removeFavorite}/>
        });
        }

        if (this.state.spinner) geoIco = (<i className="fa fa-spinner fa-spin"></i>);

        if (this.state.showBar) {
            dashboardBox = (
                <div className="DashboardBox">
                     <div className="DashboardBox__Elem" > {/* onSubmit={this.onSubmitCity} */}
                        <input className="DashboardBox__Search" type="text" autoComplete="off" placeholder="Search for City" name="city" onChange={(event) => this.onChangeValue(event)}/>
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
                        <p className="DashboardBoxWrapper__Plus">{star}</p>
                        <span className="tooltiptext">Add to my favorites</span>
                    </div>
                    <div className="DashboardBoxWrapper__Favorite" onClick={this.findMyLocation}>
                        <p className="DashboardBoxWrapper__Plus">{geoIco}</p>
                        <span className="tooltiptext">Detect my location</span>
                    </div>
                    {dashboardBox}
                </div>
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
        addFavorite: (loc) => dispatch({ type: actionsType.ADD_FAVORITE, newLocation: loc}),
        removeFavorite: (city) => dispatch({ type: actionsType.REMOVE_FAVORITE, removedCity: city })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);