import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter} from 'react-router-dom';
import Router from './Router';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import combineReducers from './redux/reducers';

import 'normalize.css';

const store = createStore(combineReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
    <Provider store = {store}>
        <BrowserRouter>
                <Router />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
    );

