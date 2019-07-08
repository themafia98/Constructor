import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Main from './Pages/Main/Main';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';

const baseUrl = process.env.PUBLIC_URL;

class Router extends React.Component {

    render(){
        return (
            <Switch>
                <Route path = {baseUrl + '/'} exact component = {Main}/>
                <Route path = {baseUrl + '/About'} component = {About}/>
                <Route path = {baseUrl + '/Build/:param'}  component = {Build}/>
            </Switch>
        );
    }
}

export default Router;