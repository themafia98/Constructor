import React,{Fragment} from 'react';
import {Route} from 'react-router-dom';
import App from './App';

class Router extends React.Component {

    render(){
        return (
            <Fragment>
                <Route path = '/' exact component = {App}/>
                <Route path = '/login' exact component = {App} />
            </Fragment>
        );
    }
}

export default Router;