import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import combineReducers from './redux/reducers';


import Main from './Pages/Main/Main';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';

const store = createStore(combineReducers,
                window.__REDUX_DEVTOOLS_EXTENSION__ &&
                 window.__REDUX_DEVTOOLS_EXTENSION__());
function App(){

    return (
        <Provider store = {store}>
        <BrowserRouter>
                <Switch>
                    <Route path = '/' exact component = {Main}/>
                    <Route path = '/About' component = {About}/>
                    <Route path = '/Build/:param'  component = {Build}/>
                </Switch>
        </BrowserRouter>
    </Provider>
    )
}

export default App;