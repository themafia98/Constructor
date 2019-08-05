import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AnimationText from '../../components/AnimationText/AnimationTitle';
import Events from 'events';
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

    indexStream = new Events();

    state = {
        title:  "Constructor",
        registrationActive: false,
        regStatus: false,
        wrongEnter: false,
        error: '',
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
                        <AnimationText
                            content = 'Build your landing page!'
                            msPauseEnd = {1000}
                            msAnimation = {150}
                        />
                            <form className = 'LoginForm'>
                                <h3>Connect form</h3>
                                {
                                    this.props.wrongEnter || this.state.regStatus ?
                                    <p className = 'error'>{this.props.wrongEnter}</p>
                                    : null
                                }
                                <p>E-mail</p>
                                <input ref = {this.emailRef} type = 'text' />
                                <p>Password</p>
                                <input 
                                    ref = {this.passwordRef} 
                                    type = 'password' 
                                    autoComplete = 'off'
                                    placeholder="Enter the Password"
                                    />
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
                            </form>
                        </div>
                            <TransitionGroup component={null}>
                            { this.state.registrationActive &&
                                    <CSSTransition
                                        timeout={300}
                                        unmountOnExit
                                        classNames="boxOpacity">
                                        <Registration  indexStream = {this.indexStream} />
                                    </CSSTransition>
                            }
                            </TransitionGroup>
                </div>
            )
        } else  return <Loader path = '/img/loading.gif' type = 'session' />
    }

    componentDidMount = (e) => {
        this.indexStream.on('EventRegistrationCorrect', this.statusRegistration);
    }
    componentWillUnmount = (e) => {
        this.indexStream.off('EventRegistrationCorrect', this.statusRegistration);
    }
}

const mapStateToProps = (state) => {
    return {
        active: state.cabinet.active, 
        wrongEnter: state.cabinet.error
    }
  }

export default connect(mapStateToProps)(Index);