import React from 'react';

import './weather-icons.css';

const ico = (props) => {

    const useIco = (code) => {
        let ico = 'stars';
        for (let i = 0; i < 47; i++) {
            if (i === +code) {
                ico = `wi wi-yahoo-${i}`; 
            }
        }
        return ico;
      }

    const ico = useIco(props.code);
    return (<i className={ico}></i>);
}

export default ico;