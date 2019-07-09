import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Provider} from 'react-redux';

import store from './redux/store';

import Main from './Pages/Main/Main';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';

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