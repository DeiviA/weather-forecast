import React from 'react';

import './Favorite.css';

const favorite = (props) => {
    return (
    <div className="Favorite">
        {props.city}, {props.country}
    </div>
);
}

export default favorite;