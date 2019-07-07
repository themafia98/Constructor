import React from 'react';
import PropTypes from 'prop-types';
import './header.scss';

import Icon from '../Icon/icon';


const iconPath = require('../../config.json').mainIcon;

class Header extends React.Component {

    static propTypes = {
        children: PropTypes.object.isRequired, // jsx
    }

    state = {

    }

    add = (e) => {
        console.log('add');
    }

    render(){

        return (
            <header>
                <div className = 'container'>
                    <div className = 'flex-row'>
                    <div className = 'col-12'>
                            <div className = 'header__mainInfo'>
                                <Icon path = {iconPath} />
                                    {this.props.children}
                            </div>
                                <div onClick = {this.add} className = 'header__newProject__AddButton'>
                                    <Icon path = '/img/plus.png' />
                                </div>
                    </div>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;