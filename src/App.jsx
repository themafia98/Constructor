import React, {Fragment,useState, useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import eventStream from './EventEmitter';

import {Provider} from 'react-redux';
import store from './redux/store';

import Index from './Pages/Index/Index';
import Cabinet from './Pages/Cabinet/Cabinet';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';

function App(props){

    let [session, setSession] = useState(false);
    let [redirect, setReditect] = useState(false);
    const refresh = (event) => {
        let eo = {...event};
        setSession(eo.ses);
        setReditect(eo.redirect);
    }

    useEffect(() => {
        eventStream.on('EventRefresh', refresh);
        return () => {
            eventStream.off('EventRefresh', refresh);
        };
    } , []);


    if (session || redirect){
    return (

        <Provider store = {store}>
        <BrowserRouter>
                <Switch>
                    <Route path = "/" exact component = {
                    () => <Index session = {session} config = {props.config} />
                    } />
                    <Route path = '/Cabinet' exact component = {Cabinet}/>
                    <Route path = '/Cabinet/About' component = {About}/>
                    <Route path = '/Cabinet/Build/:param' component = {Build}/>
                </Switch>
        </BrowserRouter>
    </Provider>
    )
    } else return (
        <Fragment>
        <img className = 'loader' src = '/img/loading.gif' alt = 'loader'></img>
      </Fragment>
    )
}

export default App;