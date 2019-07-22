"use strict";

import React from 'react';
import firebase from '../Firebase/Firebase';
import renderer from 'react-test-renderer';

import Registration from '../components/Registration/Registration';

firebase.saveSession("NONE");

const RegistrationComponent = renderer.create(
        <Registration firebase = {firebase} />
)
test ('registration.js test', function(){

    let snapshotReg = RegistrationComponent.toJSON();
    expect(snapshotReg).toMatchSnapshot();

    const button = RegistrationComponent.root.find(button => button.props.className === 'loginButton');

    button.props.onClick({});

    snapshotReg = RegistrationComponent.toJSON();
    expect(snapshotReg).toMatchSnapshot();
});