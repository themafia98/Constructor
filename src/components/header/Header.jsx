import React from 'react';

import PropTypes from 'prop-types';
import './header.scss';

import {withRouter, NavLink} from 'react-router-dom';

import eventStream from '../../EventEmitter.js';
import Icon from '../Icon/icon';


const iconPath = require('../../config.json').mainIcon;

class Header extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
    }

    state = {

    }

    redirect = (e) => {
        this.props.history.push('/About');
    }

    add = (e) => {
        console.log('add');
        eventStream.emit('EventChangeWorkMode',{action: 'newProject'});
    }

    render(){
        return (
            <header>
                <div className = 'container'>
                    <div className = 'flex-row'>
                    <div className = 'col-12'>
                            <div className = 'header__mainInfo'>
                                <Icon path = {iconPath} />
                                <NavLink to = '/'><h3>{this.props.title}</h3></NavLink>
                            </div>
                            {this.props.location.pathname === '/' ?
                                <div onClick = {this.add} className = 'header__newProject__AddButton'>
                                    <Icon path = '/img/plus.png' />
                                </div>
                                : null
                            }
                                <div onClick = {this.redirect} className = 'Navigator'>
                                    <Icon title = 'about' path = '/img/about_logo.svg' />
                                </div>
                    </div>
                    </div>
                </div>
            </header>
        )
    }
}

export default withRouter(Header);