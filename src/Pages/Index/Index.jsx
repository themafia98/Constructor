import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import Registration from '../../components/Registration/Registration';

import './index.scss';

class Index extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object
    }

    state = {
        title:  this.props.config.title || "Constructor",
        rgistrationActive: false,
    }

    showBox = (event) => {
        this.setState ({
            ...this.state,
            rgistrationActive: this.state.rgistrationActive ? false : true
        })
    }

    sign = (event) => {

        this.props.firebase.auth().signInWithEmailAndPassword(this.emailImput.value, this.passwordImput.value)
        .then(response => {
            this.props.history.push('/Cabinet');
        })
        .catch(function(error) {
          return console.log(error);
          });
    }
    emailImput = null;
    passwordImput = null;
    emailRef = (node) => this.emailImput = node;
    passwordRef = (node) => this.passwordImput = node;

    render(){

        console.log('index');
        return (
            <div className = 'LoginPage flex-column'>
                    <h1>{this.state.title}</h1>
                    <div className = 'LoginBox'>
                        <div className = 'LoginForm'>
                            <h3>Connect form</h3>
                            <p>E-mail</p>
                            <input ref = {this.emailRef} type = 'text' />
                            <p>Password</p>
                            <input ref = {this.passwordRef} type = 'password' />
                            <input onClick = {this.sign} className = 'loginButton' type = 'button' value = 'enter' />
                            <input
                                onClick = {this.showBox}
                                className = 'loginButton'
                                type = 'button'
                                value = 'registration'
                                />
                        </div>
                    </div>
                    {
                        this.state.rgistrationActive ?
                        <Registration />
                        : null
                    }
            </div>
        )
    }
}

export default withRouter(Index);