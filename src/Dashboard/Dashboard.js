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
    // this method is for watching what visitor is typing in input
    onChangeValue = (event) => {
        this.setState({
            value: event.target.value
        });
    }
    // get request to the yahoo server
    onSearchCity = (favorite) => {
        // if we click search
        let city = this.state.value; // if we don't pass any argument we get text from input
        // if we just pass an argument to the method
        if (favorite.length) city = favorite;
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
            // and object 'lcoation' 
            const location = {
                city: response.data.query.results.channel.location.city.replace(/'/g, ''),
                country: response.data.query.results.channel.location.country
            }
            console.log(response);
            // then pass all data to redux via 'setWeather' method
            this.props.setWeather(weather.newTemperature, weather.text, weather.forecast, weather.code, weather.humidity, weather.pressure, weather.visibility, weather.wind);
            // and via 'onChangeCity' method
            this.props.onChangeCity(location.city, location.country);
            this.saveToLocalStorage('currentCity', location.city); // and write current location to local storage
            this.saveToLocalStorage('currentCountry', location.country); // so when we come back to the app we retrieve our last data
            this.setState({  
                showBar: false  //  hide the bar
                });
            })
        .catch(error => {
            // in case we mistyped or server doesn't respond we show tooltip
            const tooltip = document.getElementById('searchTooltip'); 
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }, 3000);
            console.log(error); // what went wrong
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
        // transfer data via redux
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

    // this function add a star (className), if current city is in our list
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
        // first, we allow to find our coordinates
        let shouldNavigate = true;
        if (typeof(Storage) !== "undefined") {
            // but if we find we already did it in this session, we retrieve informstion from sessionStorage
            const savedCity = sessionStorage.getItem('city');
            if (savedCity) {
                shouldNavigate = false; // we don't allow to searh our coordinates
                // them pass retrived city from sessionStorage to method
                this.onSearchCity(savedCity);
            }
        }
        // in case our sessionStorage is empty, we allow to searh our coordinates
        if (shouldNavigate) {
            this.setState({
                spinner: true // we'll show spinner when browser is looking for coordinates
            });
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let city = ''; // here we'll write current city from server respond
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCx9uiyR6wDuSY4glfKO4FAuQHwH8vTF4A&language=en&result_type=political`;
                    axios.get(url)
                        .then(responce => {
                            city = responce.data.results[2].address_components[1].short_name;
                            city = `${city}`;
                            if (typeof(Storage) !== "undefined") {
                                sessionStorage.setItem("city", city); // writing our geolocation to sessionStorage
                            }                                         // to prevent another one long searching
                            this.onSearchCity(city);
                            this.setState({
                                spinner: false // hide our spinner
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({
                                spinner: false // hide our spinner
                            });
                        });
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
        // in case we have some data in local storage
        if (typeof(Storage) !== "undefined" && localStorage.getItem('currentCity')) {
            const location = {
                city: localStorage.getItem('currentCity'),
                country: localStorage.getItem('currentCountry')
            }
            this.props.onChangeCity(location.city, location.country);
            const cities = [];
            let counter = 0;
            // and get data about our favorite list
            for (let i = 0; i < 6; i++) {
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
                     <div className="DashboardBox__Elem" >
                        <input className="DashboardBox__Search" type="text" autoComplete="off" placeholder="Search for City" name="city" onChange={(event) => this.onChangeValue(event)}/>
                        <span className="tooltiptext" id="searchTooltip">No search resalts!</span>
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
        }),
        addFavorite: (loc) => dispatch({ type: actionsType.ADD_FAVORITE, newLocation: loc}),
        removeFavorite: (city) => dispatch({ type: actionsType.REMOVE_FAVORITE, removedCity: city })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);