"use strict";
import Events from 'events';
import React from 'react';
import firebase from '../Firebase/Firebase';
import renderer from 'react-test-renderer';

import Registration from '../components/Registration/Registration';

firebase.saveSession("NONE");

const RegistrationComponent = renderer.create(
        <Registration indexStream = {new Events()} firebase = {firebase} />
)
test ('registration.js test', function(){

    let snapshotReg = RegistrationComponent.toJSON();
    expect(snapshotReg).toMatchSnapshot();

    const button = RegistrationComponent.root.find(button => button.props.className === 'RegForm__loginButton');

    button.props.onClick({});

    snapshotReg = RegistrationComponent.toJSON();
    expect(snapshotReg).toMatchSnapshot();
});