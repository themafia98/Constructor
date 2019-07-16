import React from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter';
import './registration.scss';

import withFirebase from '../../components/firebaseHOC';


class Registration extends React.PureComponent {

    static propTypes = {
        firebase: PropTypes.object.isRequired,
    }

    state = {
        firebase: this.props.firebase,
        error: null,
    }

    emailRef = null;
    passwordRef = null;

    setRefEmail = (node) => this.emailRef = node;
    setRefPassword = (node) => this.passwordRef = node;

    createUser = (event) => {

        const email = this.emailRef.value;
        const password = this.passwordRef.value;
        const { firebase } = this.props;

        firebase.registration(email, password)
        .then(response => {
            firebase.db.collection("users").doc(response.user.uid).set({
                'projects': [],
                'email': email,
            }).then(() => eventStream.emit('EventRegistrationCorrect', response))
        })
        .catch((error) => this.setState({error: error.message}));
    };

    render(){
        let  { error } = this.state;

        return (
            <div className = 'RegistrationBox'>
                <div  className = 'RegistrationForm'>
                    <h3>Registration</h3>
                    <form autoComplete = 'off' className = 'RegForm'>
                        { error ?
                            <p className = 'error'>{error}</p>
                            : null
                        }
                        <span>E-mail</span>
                        <input ref = {this.setRefEmail} type = 'text' />
                        <span>Password</span>
                        <input  autoComplete = "off" ref = {this.setRefPassword} type = 'password' />
                        <input onClick = {this.createUser}
                                className = 'loginButton'
                                type = 'button'
                                value = 'registration'
                        />
                    </form>
                </div>
            </div>
        )
    }

}
export default withFirebase(Registration);
