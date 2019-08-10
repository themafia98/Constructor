import React from 'react';
import firebaseContext from '../Firebase/firebaseContext';


const withFirebase = Component => props => {

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production')
        return ( /** Context API */
            <firebaseContext.Consumer>
                {firebase => <Component {...props} firebase = {firebase} /> }
            </firebaseContext.Consumer>
        )
    else return <Component {...props} />;
};


export default withFirebase;