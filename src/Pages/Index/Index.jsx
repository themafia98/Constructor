import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import styled from 'styled-components';
import Events from 'events';
import {middlewareLogin} from '../../redux/middleware/loadUserMiddleware';

import Loader from '../../components/loading/Loader';
import Registration from '../../components/Registration/Registration';

import {connect} from 'react-redux';

import './index.scss';

const AnimationTitle = styled.h3`
    user-select: none;
    transition: .4s linear all;
    color: ${props => props.color === 'up' ? 'red' : 'blue'};
`;

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
        tilteContent: 'Build your landing page!'.split(''),
        currentTitle: 'B',
        positionTitle: 1,
        directionAnimation: 'up',
        msAnimation: 100,
    }

    emailImput = null;
    passwordImput = null;
    timerAnimation = null;

    animationTitle = event => {
        console.log(event);
        let self = this;
        this.timerAnimation = setTimeout( function tick(){
            if (self.state.directionAnimation === 'up'){
                let counter = self.state.tilteContent.length;
                const word = counter > self.state.positionTitle ?
                            self.state.tilteContent[self.state.positionTitle] :
                            self.state.tilteContent[self.state.positionTitle-1];
                self.setState({
                    ...self.state,
                    currentTitle: self.state.currentTitle + word,
                    positionTitle: self.state.positionTitle + 1,
                    directionAnimation: self.state.positionTitle === counter ? 'down' : 'up',
                    msAnimation: self.state.positionTitle === counter ? 1000 : 150
                });
            }
            if (self.state.directionAnimation === 'down'){
                let _title = self.state.currentTitle;
                const length = self.state.currentTitle.length;
                _title = _title.slice(0,length - 1);
                self.setState({
                    ...self.state,
                    currentTitle: _title,
                    positionTitle: self.state.positionTitle - 1,
                    directionAnimation: self.state.positionTitle === 2 ? 'up' : 'down',
                    msAnimation: self.state.positionTitle === 2 ? 1000 : 150
                });
            }
            self.timerAnimation = setTimeout(tick, self.state.msAnimation);
        }, this.state.msAnimation);
    }

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
                        <AnimationTitle data-titlebuild color = {this.state.directionAnimation}>
                            {this.state.currentTitle}
                        </AnimationTitle>
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
                            <Registration indexStream = {this.indexStream} />
                            : null
                        }
                </div>
            )
        } else  return <Loader path = '/img/loading.gif' type = 'session' />
    }

    componentDidMount = (e) => {
        console.log(e);
        this.animationTitle();
        this.indexStream.on('EventRegistrationCorrect', this.statusRegistration);
    }
    componentWillUnmount = (e) => {
        if (this.timerAnimation) clearTimeout(this.timerAnimation);
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