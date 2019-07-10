import React, {createRef, useEffect, useState} from 'react';
import eventStream from '../../EventEmitter';
import './registration.scss';


function Registration(props){

    const [error,setError] = useState(null);
    const ref = createRef();
    const ref2 = createRef();


    useEffect(() => {

        ref.current.focus();
        ref2.current.focus();
    });

    const createUser = (event) => {

        const email = ref.current.value;
        const password = ref2.current.value;

        props.auth().createUserWithEmailAndPassword(email, password)
        .then (response => {
            eventStream.emit('EventRegistrationCorrect', response);
        })
        .catch((error) => {
            console.log(error);

            setError(error.message);
          });
    };

        return (
            <div className = 'RegistrationBox'>
                <div className = 'RegistrationForm'>
                    <h3>Registration</h3>
                    <div className = 'RegForm'>
                        { error ?
                            <p className = 'error'>{error}</p>
                            : null
                        }
                        <p>E-mail</p>
                        <input ref = {ref} type = 'text' />
                        <p>Password</p>
                        <input ref = {ref2} type = 'password' />
                        <input onClick = {createUser}
                                className = 'loginButton'
                                type = 'button'
                                value = 'registration'
                        />
                    </div>
                </div>
            </div>
        )
}

export default Registration;
