import React,{Fragment} from 'react';
import {Route} from 'react-router-dom';
import Main from './Pages/Main';
import About from './Pages/About';

class Router extends React.Component {

    render(){
        return (
            <Fragment>
                <Route path = '/' exact component = {Main}/>
                <Route path = '/About' component = {About}/>
            </Fragment>
        );
    }
}

export default Router;