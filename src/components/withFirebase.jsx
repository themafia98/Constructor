import React from 'react';
import firebaseContext from '../Firebase/firebaseContext';


const withFirebase = Component => props => {
        return (
            <firebaseContext.Consumer>
                {firebase => <Component {...props} firebase = {firebase} /> }
            </firebaseContext.Consumer>
        )
};


export default withFirebase;