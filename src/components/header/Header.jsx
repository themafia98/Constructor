import React from 'react';

import PropTypes from 'prop-types';
import './header.scss';

import {middlewareLogOutUser} from '../../redux/middleware/loadUserMiddleware';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';

import eventEmitter from '../../EventEmitter.js';
import Icon from '../Icon/icon';


const iconPath = require('../../config.json').CabinetIcon;

class Header extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired, /** @Config title app */
        dispatch: PropTypes.func.isRequired, /** @dispatch redux */
        history: PropTypes.object.isRequired, /** @Router HTML5 history */
        location: PropTypes.object.isRequired, /** @Router */
        match: PropTypes.object.isRequired, /** @Router */
    };

    state = {
        title: this.props.title,
        redirectAbout: {
            path:  '/Cabinet/About',
            redirectA: false,
        },
        redirectCabinet: {
            path:  '/Cabinet',
            redirectC: false,
        }
    };

    logOut = event => {
        if (this.props.idUser)
            this.props.dispatch(middlewareLogOutUser(this.props.idUser));
        event.stopPropagation();
    };

    redirectAbout = event => {
        if (this.props.location.pathname !== this.state.redirectAbout.path)
           this.setState({
               redirectAbout: {
                   ...this.state.redirectAbout,
                   redirectA: true
               }
           });
        event.stopPropagation()
    };

    redirectCabinet = event => {
        if (this.props.location.pathname !== this.state.redirectCabinet.path)
        this.setState({
            redirectCabinet: {
                ...this.state.redirectCabinet,
                redirectC: true
            }
        });
        event.stopPropagation()
    }

    add = (e) => {
        eventEmitter.emit('EventChangeWorkMode',{action: 'newProject'});
    };

    render(){
        let {redirectA} = this.state.redirectAbout;
        let {redirectC} = this.state.redirectCabinet;

        if (redirectA) return <Redirect to = {this.state.redirectAbout.path} />
        if(redirectC) return <Redirect to = {this.state.redirectCabinet.path} />

        return (
            <header>
                <div className = 'container'>
                    <div className = 'flex-row'>
                            <div onClick = {this.redirectCabinet} className = 'header__CabinetInfo'>
                                <Icon className ='mainIcon' path = {iconPath} />
                                <h3 className = 'tilteApp'>{this.state.title}</h3>
                            </div>
                            {this.props.location.pathname === '/Cabinet' ?
                                <div onClick = {this.add} className = 'header__newProject__AddButton'>
                                    <Icon className = 'Cabinet' path = '/img/plus.png' />
                                </div>
                                : null
                            }
                                <div  className = 'Navigator'>
                                    <Icon className = 'about' onClick = {this.redirectAbout} title = 'about' path = '/img/about_logo.svg' />
                                    <Icon className = 'logoutButton' onClick = {this.logOut} title = 'logOut' path = '/img/logOut.svg' />
                                </div>
                    </div>
               </div>
            </header>
        )
    }
}

export default connect()(withRouter(Header));