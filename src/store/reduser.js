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
    // ===============================================================
    if (action.type === actionsType.ADD_FAVORITE) {
        const newLoc = {
            ...action.newLocation
        }
        const newCities = state.cities.slice();
        let pushNewLoc = true; // will we oush new location or not
        newCities.forEach(item => {
            // We are looking if there is already this city in our array
            if (item.city.toLowerCase() === newLoc.city.toLowerCase()) {
                pushNewLoc = false;
            }
        });
        
        if (pushNewLoc) newCities.push(newLoc);

        return {
            ...state,
            cities: newCities
        }
    }
    // ===============================================================
    if (action.type === actionsType.REMOVE_FAVORITE) {
        const removedCity = action.removedCity;
        const newCities = state.cities.slice();
        let index = 0;
        newCities.forEach((item, i) => {
            // We are looking for this city in our array
            if (item.city.toLowerCase() === removedCity.toLowerCase()) {
                index = i;
            }
        });
        newCities.splice(index, 1);
        return {
            ...state,
            cities: newCities
        }
    }

    return state;
}

export default reducer;