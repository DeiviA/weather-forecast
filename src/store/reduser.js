import * as actionsType from './actions';

const initialState = {
    currentCity: 'kyiv',
    currentCountry: 'Ukraine',
    currentTemperature: 0,
    text: 'sun',
    code: 12,
    forecast: [
        { code: '22', date: '29 Jan', day: 'Mon', high: '10', low: '2', text: 'cloudy'}
    ],
    cities: []
}

const reducer = (state = initialState, action) => {
    if (action.type === actionsType.GET_WEATHER) {

        return state;
    }
    // ===============================================================
    if (action.type === actionsType.SET_WEATHER) {
        const newForcast = action.forecast.slice();
        return {
            ...state,
            currentTemperature: action.tmp,
            text: action.text,
            forecast: newForcast,
            code: action.code
        }
    }
    // ===============================================================
    if (action.type === actionsType.CHANGE_CITY) {
        return {
            ...state,
            currentCity: action.city,
            currentCountry: action.country
        }
    }

    return state;
}

export default reducer;