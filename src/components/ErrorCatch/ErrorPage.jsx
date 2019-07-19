import React,{Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import './errorPage.scss';


class ErrorPage extends React.PureComponent {

    update = event => {
        this.props.history.push('/');
        eventEmitter.emit('EventErrorCatchUpdate');
    }

    render(){
        console.log('error');
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

export default withRouter(ErrorPage);