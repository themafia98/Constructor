import React from 'react';
import ReactDOM from 'react-dom';

import firebase from './components/Firebase/Firebase';
import App from './App.jsx';
import 'normalize.css';

const config = require('./config.json');


ReactDOM.render(
        <App firebase = {firebase} config = {config} />
    , document.getElementById('root')
);

