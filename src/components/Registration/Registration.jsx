import React from 'react';
import PropTypes from 'prop-types';

import './registration.scss';

import withFirebase from '../withFirebase';


class Registration extends React.PureComponent {

    static propTypes = {
        firebase: PropTypes.object.isRequired, /** @firebase class for use firebase functions */
        indexStream: PropTypes.object.isRequired /** @Events stream object */
    }

    state = {
        firebase: this.props.firebase,
        error: null,
    }

    emailRef = null;
    passwordRef = null;

    setRefEmail = (node) => this.emailRef = node;
    setRefPassword = (node) => this.passwordRef = node;

    createUser = event => {

        const email = this.emailRef ? this.emailRef.value : null;
        const password = this.passwordRef ? this.passwordRef.value : null;
        const { firebase } = this.props;

        if (password && email)
        firebase.registration(email, password)
        .then(response => {
            if (!response) throw new Error('Ivaid registration')
            firebase.db.collection("users").doc(response.user.uid).set({
                'projects': [],
                'email': email,
            }).then(() => this.props.indexStream.emit('EventRegistrationCorrect', response));
        })
        .catch((error) => {
        console.error(error.message);
        this.setState({error: error.message});
        });
        else  return this.setState({error: 'invalid user data'});
    };

    render(){
        let  { error } = this.state;
        return (
            <div className ='RegistrationBox'>
                <div  className = 'RegistrationBox__RegistrationForm'>
                    <h3>Registration</h3>
                    <form autoComplete = 'off' className = 'RegistrationForm__RegForm'>
                        { error ?
                            <p className = 'error'>{error}</p>
                            : null
                        }
                        <span>E-mail</span>
                        <input placeholder="email" ref = {this.setRefEmail} type = 'text' />
                        <span>Password</span>
                        <input 
                            className = 'password' 
                            autoComplete = "off" 
                            ref = {this.setRefPassword} 
                            type = 'password' 
                            placeholder="password"
                        />
                        <input onClick = {this.createUser}
                                className = 'RegForm__loginButton'
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
