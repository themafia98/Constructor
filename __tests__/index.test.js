"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

import withFirebase from '../src/components/firebaseHOC';
import Index from '../src/Pages/Index/Index';

const props = {
        active: false, /** @active - status firebase auth */
        wrongEnter: '', /** @Error about invalid enter */
        config: require('../config.json'), /** @config - app settings */
}

const Index = renderer.create(
    <withFirebase>
        <Index {...props} />
    </withFirebase>
)

test ('Index.js test', function(){

    const snapshotIndex = Index.toJSON();
    expect(snapshotIndex).toMatchSnapshot();
});