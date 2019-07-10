import React from 'react';

import './registration.scss';

export default (props) => {
        return (
            <div className = 'RegistrationBox'>
                <div className = 'RegistrationForm'>
                    <p>E-mail</p>
                    <input type = 'text' />
                    <p>Password</p>
                    <input type = 'password' />
                    <input className = 'loginButton'
                            type = 'button'
                            value = 'registration'
                    />
                </div>
            </div>
        )
}
