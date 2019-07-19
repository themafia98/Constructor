import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import ErrorBoundary from './components/ErrorCatch/ErrorBoundary';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import 'normalize.css';

const config = require('./config.json');

ReactDOM.render(
    <BrowserRouter basename = '/'>
        <ErrorBoundary>
            <Provider store = {store}>
                <App config = {config} />
            </Provider>
        </ErrorBoundary>
    </BrowserRouter>,
        document.getElementById('root')
);

serviceWorker.unregister();

