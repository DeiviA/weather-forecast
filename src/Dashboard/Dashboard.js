import React, { Component } from 'react';

import './Dashboard.css';

class Dashboard extends Component {
    render () {
        return (
            <div className="Dashboard">
                <input className="Search" type="text" placeholder="Search for City" name="city" />
                <button className="SearchBtn">Search</button>
            </div>
        )
    }
    
}

export default Dashboard;