import * as actionsType from './actions';

const initialState = {
    currentCity: 'kyiv',
    currentTemperature: 0,
    text: 'sun',
    cities: []
}

const reducer = (state = initialState, action) => {
    if (action.type === actionsType.GET_WEATHER) {

        return state;
    }
    // ===============================================================
    if (action.type === actionsType.SET_WEATHER) {
        return {
            ...state,
            currentTemperature: action.tmp,
            text: action.text
        }
    }
    // ===============================================================
    if (action.type === actionsType.CHANGE_CITY) {
        return {
            ...state,
            currentCity: action.city
        }
    }

    return state;
}

export default reducer;