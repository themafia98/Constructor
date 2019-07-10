import React from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter';
import {withRouter} from 'react-router-dom';

import Registration from '../../components/Registration/Registration';

import './index.scss';

class Index extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object
    }

    state = {
        title:  this.props.config.title || "Constructor",
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
        : console.log('errpr registration');
    }

    showBox = (event) => {
        this.setState ({
            ...this.state,
        registrationActive: this.state.registrationActive ? false : true
        })
    }

    authTo = (event) => {
        this.setState({...this.state, wrongEnter: false});
        this.props.auth().signInWithEmailAndPassword(this.emailImput.value, this.passwordImput.value)
        .then(response => {
            console.log(response);
            this.props.history.push('/Cabinet');
        })
        .catch((error) => {
          console.log(error);
          this.setState({...this.state, wrongEnter: true, error: error.message});
          });
    }
    emailImput = null;
    passwordImput = null;
    emailRef = (node) => this.emailImput = node;
    passwordRef = (node) => this.passwordImput = node;

    render(){

        let currentSelected = this.state.registrationActive;
        return (
            <div className = 'LoginPage flex-column'>
                    <h1>{this.state.title}</h1>
                    <div className = 'LoginBox'>
                        <div className = 'LoginForm'>
                            <h3>Connect form</h3>
                            {
                                this.state.wrongEnter || this.state.regStatus ?
                                <p className = 'error'>{this.state.error}</p>
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
    }

    componentDidMount = (e) => {
        eventStream.on('EventRegistrationCorrect', this.statusRegistration);
    }
    componentWillUnmount = (e) => {
        eventStream.off('EventRegistrationCorrect', this.statusRegistration);
    }
}

export default withRouter(Index);