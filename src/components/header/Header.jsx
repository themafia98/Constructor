import React from 'react';

import PropTypes from 'prop-types';
import './header.scss';

import {withRouter, NavLink} from 'react-router-dom';

import eventStream from '../../EventEmitter.js';
import Icon from '../Icon/icon';


const iconPath = require('../../config.json').CabinetIcon;

class Header extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
    }

    state = {

    }

    logOut = (e) => {
        console.log('logOut');
        eventStream.emit('EventLogOut', 'logOut');
    }

    redirect = (e) => {
        this.props.history.push('/Cabinet/About');
    }

    add = (e) => {
        eventStream.emit('EventChangeWorkMode',{action: 'newProject'});
    }

    render(){
        return (
            <header>
                <div className = 'container'>
                    <div className = 'flex-row'>
                            <div className = 'header__CabinetInfo'>
                                <Icon path = {iconPath} />
                                <NavLink to = '/Cabinet'><h3>{this.props.title}</h3></NavLink>
                            </div>
                            {this.props.location.pathname === '/Cabinet' ?
                                <div onClick = {this.add} className = 'header__newProject__AddButton'>
                                    <Icon path = '/img/plus.png' />
                                </div>
                                : null
                            }
                                <div  className = 'Navigator'>
                                    <Icon onClick = {this.redirect} title = 'about' path = '/img/about_logo.svg' />
                                    <Icon onClick = {this.logOut} title = 'logOut' path = '/img/logOut.svg' />
                                </div>
                    </div>
               </div>
            </header>
        )
    }
}

export default withRouter(Header);