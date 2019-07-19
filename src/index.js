import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import 'normalize.css';

const config = require('./config.json');


ReactDOM.render(
    <Provider store = {store}>
        <App config = {config} />
    </Provider>,
        document.getElementById('root')
);

serviceWorker.unregister();

