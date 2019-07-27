
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

import firebaseContext from './Firebase/firebaseContext';

firebase.saveSession('SESSION');
const config = require('./config.json');

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

serviceWorker.register();

