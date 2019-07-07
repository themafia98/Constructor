import React,{Fragment} from 'react';
import {Route} from 'react-router-dom';
import Main from './Main';

class Router extends React.Component {

    render(){
        return (
            <Fragment>
                <Route path = '/' exact component = {Main}/>
            </Fragment>
        );
    }
}

export default Router;