import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Router from './Router';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import combineReducers from './redux/reducers';

const store = createStore(combineReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function App(){

    return (
        <Provider store = {store}>
        <BrowserRouter>
                <Router />
        </BrowserRouter>
    </Provider>
    )
}

export default App;