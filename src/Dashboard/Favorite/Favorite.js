import React from 'react';

import './Favorite.css';

const favorite = (props) => {
    return (
    <div className="Favorite">
        <p className="Favorite__Text" onClick={(city) => props.findFavorite(props.city)}>{props.city}, {props.country}</p>
        <span className="Favorite__Remove" onClick={(city) => props.removeFavorite(props.city)}>-</span>
    </div>
);
}

export default favorite;