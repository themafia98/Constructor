import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Provider} from 'react-redux';
import firebase from './components/Firebase/Firebase';
import store from './redux/store';
import Index from './Pages/Index/Index';
import Cabinet from './Pages/Cabinet/Cabinet';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';

function App(props){

    return (
        <Provider store = {store}>
        <BrowserRouter>
                <Switch>
                    <Route path = "/" exact component = {
                    () => <Index firebase = {firebase} config = {props.config} />
                    } />
                    <Route path = '/Cabinet' component = {Cabinet}/>
                    <Route path = '/About' component = {About}/>
                    <Route path = '/Build/:param'  component = {Build}/>
                </Switch>
        </BrowserRouter>
    </Provider>
    )
}

export default App;