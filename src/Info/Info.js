import React, { Component } from 'react';
import axios from 'axios';

import './Info.css';

class Info extends Component {
    state = {
        city: 'kyiv',
        temperature: 0
    }

    componentDidMount () {
        const city = this.state.city;
        const searchtext = `https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`;
        axios.get(searchtext)
        .then(response => {
            const newTemperature = response.data.query.results.channel.item.condition.temp;
            this.setState({
                temperature: newTemperature
            });
            console.log(response);
        });
    }
    render () {
        return (<div className="Info">
        <p className="Info__Text">Temperature in <span className="Info__CityName">{this.state.city}</span> is {this.state.temperature}°C</p>
        </div>)
    }
}

export default Info;