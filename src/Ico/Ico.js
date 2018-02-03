import React from 'react';

import './weather-icons.css'; 

const ico = (props) => {
    //  via this method we recive a className 
    const useIco = (code) => {
        let ico = 'stars';
        for (let i = 0; i < 47; i++) {
            if (i === +code) {
                // we have a list of codes from yahoo weather https://developer.yahoo.com/weather/documentation.html
                ico = `wi wi-yahoo-${i}`; // the same list http://erikflowers.github.io/weather-icons/api-list.html
            }
        }
        return ico;
      }

    const ico = useIco(props.code);
    return (<i className={ico}></i>);
}

export default ico;