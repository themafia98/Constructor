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
        config: PropTypes.object,
    }

    state = {
        title:  "Constructor",
        registrationActive: false,
        regStatus: false,
        wrongEnter: false,
        error: ''
    }

    statusRegistration = (event) => {
        event.additionalUserInfo.isNewUser ?
        this.setState({...this.state,
                        regStatus: true,
                        registrationActive: false,
                        error: 'Account create!'
                    })
        : console.log('error registration');
    }

    showBox = (event) => {
        this.setState ({
            ...this.state,
        registrationActive: this.state.registrationActive ? false : true
        })
    }

    authTo = (event) => {
            this.props.dispatch(middlewareLogin(this.emailImput.value, this.passwordImput.value));
}
    emailImput = null;
    passwordImput = null;
    emailRef = (node) => this.emailImput = node;
    passwordRef = (node) => this.passwordImput = node;

    render(){

        if (this.props.active) return <Redirect to = '/Cabinet' />
        else if (!this.props.active) {
            let currentSelected = this.state.registrationActive;
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
                                    className = 'loginButton'
                                    type = 'button'
                                    value = 'enter' />
                                <input
                                    onClick = {this.showBox}
                                    className = {currentSelected ? `loginButton selected`
                                        : 'loginButton'}
                                    type = 'button'
                                    value = 'registration'
                                    />
                            </div>
                        </div>
                        {
                            this.state.registrationActive ?
                            <Registration auth = {this.props.auth} />
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
    console.log('state index');
    return {
        active: state.cabinet.active, 
        wrongEnter: state.cabinet.error
    }
  }

export default connect(mapStateToProps)(Index);