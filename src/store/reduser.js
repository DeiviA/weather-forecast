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
        newLoc.id = newCities.length;
        let pushNewLoc = true; // will we push new location or not
        localStorage.setItem(`${newLoc.id}`, `${newLoc.city},${newLoc.country}`);
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
        const hasLocalStorage = typeof(Storage) !== "undefined";
        newCities.forEach((item, i) => {
            // We are looking for this city in our array
            if (hasLocalStorage) localStorage.setItem(`${i}`, `${item.city},${item.country}`);
            if (item.city.toLowerCase() === removedCity.toLowerCase()) {
                index = i;
                if (hasLocalStorage) {
                    console.log('remove #' + i);
                    localStorage.removeItem(`${i}`);
                }
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