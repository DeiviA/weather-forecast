import React from 'react';

import Ico from'../../Ico/Ico';
import './Item.css'

const item = (props) => {
    // new Date without year
    const newDate = props.date.match(/.{6}/).join('');

    return (
    <div className="Item">
        <p className="Item__Text">{newDate} <Ico code={props.code} /></p>
        <p className="Item__Text Item__Text_bigger">{props.high}°</p>
        <p className="Item__Text Item__Text_bigger">{props.low}°</p>
    </div>
    );
}

export default item;