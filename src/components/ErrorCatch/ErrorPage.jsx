import React from 'react';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import './errorPage.scss';


class ErrorPage extends React.Component {

    state = {
        redirect: false,
    }

    update = event => {
       this.setState({redirect: true},
        () => eventEmitter.emit('EventErrorCatchUpdate'));
    }

    render(){
        console.log('error');
        if (this.state.redirect) return <Redirect to = '/' />
        return (
        <div class = 'container'>
            <div class = 'flex-column'>
                <h1>Application crash</h1>
                <button onClick = {this.update}>Update</button>
            </div>
        </div>
        )
    }
}

export default ErrorPage;