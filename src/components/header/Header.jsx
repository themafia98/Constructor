import React from 'react';

import PropTypes from 'prop-types';
import './header.scss';

import {middlewareLogOutUser} from '../../redux/middleware/loadUserMiddleware';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';

import eventEmitter from '../../EventEmitter.js';
import Icon from '../Icon/icon';
import Confirm from '../confirmBox/Confirm';

const iconPath = require('../../config.json').CabinetIcon;

class Header extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired, /** @Config title app */
        cabinetStream: PropTypes.object, /** @Events stream cabinet */
        dispatch: PropTypes.func.isRequired, /** @dispatch redux */
        history: PropTypes.object.isRequired, /** @Router HTML5 history */
        location: PropTypes.object.isRequired, /** @Router */
        match: PropTypes.object.isRequired, /** @Router */
    };

    state = {
        idUser: this.props.idUser,
        title: this.props.title,
        isChange: false,
        redirectConfirm: false,
        redirectAbout: {
            path:  '/Cabinet/About',
            redirectA: false,
        },
        redirectCabinet: {
            path:  '/Cabinet',
            redirectC: false,
        }
    };

    confirm = event => {
        if (typeof event !== 'object')
        this.setState({isChange: event});
        else this.setState({isChange: event.false, redirectConfirm: event.confirm});
    }

    confirmSaveDetectChanges = event => {
        eventEmitter.emit('EventRedirectSaveChanges');
        this.setState({
            redirectConfirm: false,
            redirectCabinet: {
                ...this.state.redirectCabinet,
                redirectC: true
            }
        });
    };

    logOut = event => {
        console.log(this.state);
        if (this.state.idUser)
            this.props.dispatch(middlewareLogOutUser(this.props.idUser));
        event.stopPropagation();
    };

    redirectAbout = event => {
        const isPath = this.props.location.pathname !== this.state.redirectAbout.path;
        if (isPath && !this.state.isChange)
           this.setState({
                redirectConfirm: false,
                redirectAbout: {
                   ...this.state.redirectAbout,
                   redirectA: true
               }
           });
           else this.setState({redirectConfirm: true});
        event.stopPropagation()
    };

    redirectCabinet = event => {
        if (event !== 'cancelMode'){
            const isPath = this.props.location.pathname !== this.state.redirectCabinet.path;
            if (isPath && this.state.isChange === false)
            this.setState({
                redirectConfirm: false,
                redirectCabinet: {
                    ...this.state.redirectCabinet,
                    redirectC: true
                }
            });
            else if (!this.state.redirectConfirm) this.setState({redirectConfirm: true});
            event.stopPropagation();

        } else this.setState({
            redirectConfirm: false,
            redirectCabinet: {
                ...this.state.redirectCabinet,
                redirectC: true
            }
        });
    }

    add = event => {
        this.props.cabinetStream.emit('EventChangeWorkMode',{action: 'newProject'});
        event.stopPropagation()
    };

    render(){
        let {redirectA} = this.state.redirectAbout;
        let {redirectC} = this.state.redirectCabinet;

        if (redirectA) return <Redirect to = {this.state.redirectAbout.path} />
        if(redirectC) return <Redirect to = {this.state.redirectCabinet.path} />

        return (
            <React.Fragment>
            {this.state.isChange && this.state.redirectConfirm ? 
                <Confirm 
                    cbSaveChanges = {this.confirmSaveDetectChanges}
                    cbCancelSave = {() => this.redirectCabinet('cancelMode')}
                /> : null}
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
                                        <Icon className = 'about' onClick = {this.redirectAbout}
                                            title = 'about'
                                            path = '/img/about_logo.svg'
                                        />
                                        <Icon className = 'logoutButton'
                                            onClick = {this.logOut}
                                            title = 'logOut'
                                            path = '/img/logOut.svg'
                                        />
                                    </div>
                        </div>
                </div>
                </header>
            </React.Fragment>
        )
    }

    componentWillMount = () => {
        eventEmitter.on('EventRedirectConfirm', this.confirm);
    }

    componentWillUnmount = () => {
        eventEmitter.off('EventRedirectConfirm', this.confirm);
    }
}

export default connect()(withRouter(Header));