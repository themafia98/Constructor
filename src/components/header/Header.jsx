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
        title: PropTypes.string.isRequired,
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
        console.log('heade');
        return (
            <header>
                <div className = 'container'>
                    <div className = 'flex-row'>
                            <div onClick = {this.redirectCabinet} className = 'header__CabinetInfo'>
                                <Icon path = {iconPath} />
                                <h3 className = 'tilteApp'>{this.state.title}</h3>
                            </div>
                            {this.props.location.pathname === '/Cabinet' ?
                                <div onClick = {this.add} className = 'header__newProject__AddButton'>
                                    <Icon path = '/img/plus.png' />
                                </div>
                                : null
                            }
                                <div  className = 'Navigator'>
                                    <Icon onClick = {this.redirectAbout} title = 'about' path = '/img/about_logo.svg' />
                                    <Icon onClick = {this.logOut} title = 'logOut' path = '/img/logOut.svg' />
                                </div>
                    </div>
               </div>
            </header>
        )
    }
}

export default connect()(withRouter(Header));