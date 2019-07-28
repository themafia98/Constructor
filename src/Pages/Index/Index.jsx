import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter';
import {Redirect} from 'react-router-dom';

import {middlewareLogin} from '../../redux/middleware/loadUserMiddleware';

import Loader from '../../components/loading/Loader';
import Registration from '../../components/Registration/Registration';

import {connect} from 'react-redux';

import './index.scss';

class Index extends React.PureComponent {

    static propTypes = {
        active: PropTypes.bool, /** @active - status firebase auth */
        dispatch: PropTypes.func.isRequired, /** @dispatch - redux */
        history: PropTypes.object.isRequired, /** @Router HTML5 history */
        location: PropTypes.object.isRequired, /** @Router */
        match: PropTypes.object.isRequired, /** @Router */
        wrongEnter: PropTypes.string, /** @Error about invalid enter */
        config: PropTypes.object, /** @config - app settings */
    }

    state = {
        title:  "Constructor",
        registrationActive: false,
        regStatus: false,
        wrongEnter: false,
        error: ''
    }

    emailImput = null;
    passwordImput = null;

    statusRegistration = event => {
        event.additionalUserInfo.isNewUser ?
            this.setState({
                ...this.state,
                regStatus: true,
                registrationActive: false,
                error: 'Account create!'
            })
        : console.error('error registration');
    }

    showBox = event => {
        this.setState ({
            ...this.state,
        registrationActive: this.state.registrationActive ? false : true
        });
        event.stopPropagation();
    }

    authTo = event => {
            if (this.emailImput && this.passwordImput)
            this.props.dispatch(middlewareLogin(this.emailImput.value, this.passwordImput.value));
            event.stopPropagation();
    }

    emailRef = node => this.emailImput = node;
    passwordRef = node => this.passwordImput = node;

    render(){

        if (this.props.active) return <Redirect to = { '/Cabinet'} />
        else if (!this.props.active) {
            return (
                <div className = 'LoginPage flex-column'>
                        <h1>{this.state.title}</h1>
                        <div className = 'LoginBox'>
                            <div className = 'LoginForm'>
                                <h3>Connect form</h3>
                                {
                                    this.props.wrongEnter || this.state.regStatus ?
                                    <p className = 'error'>{this.props.wrongEnter}</p>
                                    : null
                                }
                                <p>E-mail</p>
                                <input ref = {this.emailRef} type = 'text' />
                                <p>Password</p>
                                <input ref = {this.passwordRef} type = 'password' />
                                <input 
                                    onClick = {this.authTo} 
                                    className = 'loginButton enterInput'
                                    type = 'button'
                                    value = 'enter' />
                                <input
                                    onClick = {this.showBox}
                                    className = {this.state.registrationActive ?
                                        `loginButton registration selected` : 'loginButton registration'}
                                    type = 'button'
                                    value = 'registration'
                                    />
                            </div>
                        </div>
                        {
                            this.state.registrationActive ?
                            <Registration />
                            : null
                        }
                </div>
            )
        } else  return <Loader path = '/img/loading.gif' type = 'session' />
    }

    componentDidMount = (e) => {
        eventEmitter.on('EventRegistrationCorrect', this.statusRegistration);
    }
    componentWillUnmount = (e) => {
        eventEmitter.off('EventRegistrationCorrect', this.statusRegistration);
    }
}

const mapStateToProps = (state) => {
    return {
        active: state.cabinet.active, 
        wrongEnter: state.cabinet.error
    }
  }

export default connect(mapStateToProps)(Index);