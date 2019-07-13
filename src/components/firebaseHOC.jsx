import React from 'react';
import firebase from '../Firebase/Firebase';

const withFirebase = Component => props => (
    <Component firebase = {firebase} {...props} />
);

export default withFirebase;