import * as actionsType from './actions';

const initialState = {
    currentCity: 'kyiv',
    currentCountry: 'Ukraine',
    currentTemperature: 0,
    text: 'sun',
    code: 12,
    humidity: 90,
    pressure: 1000.00,
    visibility: 10,
    wind: 10.00,
    forecast: [
        { code: '22', date: '29 Jan', day: 'Mon', high: '10', low: '2', text: 'cloudy'}
    ],
    cities: []
}

const reducer = (state = initialState, action) => {
    // ===============================================================
    // this method we use to transfer our retrieved data from API to redux
    if (action.type === actionsType.SET_WEATHER) {
        // copy forecast to keep the array immutable
        const newForcast = action.forecast.slice();
        return {
            ...state,
            currentTemperature: action.tmp,
            text: action.text,
            forecast: newForcast,
            code: action.code,
            humidity: action.humidity,
            pressure: action.pressure,
            visibility: action.visibility,
            wind: action.wind
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
    // method allow us to add a city to the favorite list
    if (action.type === actionsType.ADD_FAVORITE) {
        // copy received object 
        const newLoc = {
            ...action.newLocation
        }
        // copy necessary state 
        const newCities = state.cities.slice();
        newLoc.id = newCities.length;
        let pushNewLoc = true; // will we push new location or not
        // add favorite city to local Storage so then we can receive the whole list when starting app
        localStorage.setItem(`${newLoc.id}`, `${newLoc.city},${newLoc.country}`);
        newCities.forEach(item => {
            // We are looking if there is already this city in our array
            if (item.city.toLowerCase() === newLoc.city.toLowerCase()) {
                pushNewLoc = false;
            }
        });

        if (pushNewLoc) newCities.push(newLoc); // pushing city to list

        return {
            ...state,
            cities: newCities
        }
    }
    // ===============================================================
    if (action.type === actionsType.REMOVE_FAVORITE) {
        const removedCity = action.removedCity;
        const newCities = state.cities.slice();
        let index = 0; // declaring variable we will use in loop to write down an index in array 'newCities'
        const hasLocalStorage = typeof(Storage) !== "undefined"; // check if browser allows local storage
        newCities.forEach((item, i) => {
            // We are looking for this city in our array
            if (hasLocalStorage) localStorage.setItem(`${i}`, `${item.city},${item.country}`); // write down again our indexes to local storage
            if (item.city.toLowerCase() === removedCity.toLowerCase()) {
                index = i;
                if (hasLocalStorage) { 
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