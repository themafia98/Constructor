
/** IE supports polyfills */
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/symbol';
import smoothscroll from 'smoothscroll-polyfill';
/** --------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import firebase from './Firebase/Firebase';
import ErrorBoundary from './components/ErrorCatch/ErrorBoundary';
import {HashRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import 'normalize.css';

import firebaseContext from './Firebase/firebaseContext'; /** firebase contect API */
import config from './config.json'; /** app config file */


// kick off the polyfill!
smoothscroll.polyfill();

ReactDOM.render(
        <HashRouter>
            <ErrorBoundary>
                <firebaseContext.Provider value = {firebase}>
                    <Provider store = {store}>
                        <App config = {config} />
                    </Provider>
                </firebaseContext.Provider>
            </ErrorBoundary>
        </HashRouter>,
        document.getElementById('root')
);


serviceWorker.unregister();

