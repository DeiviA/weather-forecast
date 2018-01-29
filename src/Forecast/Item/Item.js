import React from 'react';

import './Item.css'

const item = (props) => {
    return (
    <div className="Item">
        <p className="Item__Text">{props.date}</p>
        <p className="Item__Text">{props.high}</p>
        <p className="Item__Text">{props.low}</p>
    </div>
    );
}

export default item;