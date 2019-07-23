import React from 'react';
import firebase from 'firebase';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import {initialStateOffline} from '../redux/testReduxStore';
import Index from '../Pages/Index/Index';
import { CustomConsole } from '@jest/console';

const config = require('../config.json');
const props = {
    history: {},
    match: {},
    location: {}
}

const mockStore = configureStore();
const store = mockStore(initialStateOffline);

const IndexComponent = renderer.create(
    <MemoryRouter initialEntries = {['/']}>
        <Provider store = {store}>
            <Index {...props} config = {config} firebase = {firebase} />
        </Provider>
    </MemoryRouter>
)

test("Index test", function(){

    let snapshotIndex = IndexComponent.toJSON();
    expect(snapshotIndex).toMatchSnapshot();

    const loginButton = IndexComponent.root.find(input => input.props.className === 'loginButton enterInput');
    loginButton.props.onClick({stopPropagation: () => null});

    snapshotIndex = IndexComponent.toJSON();
    expect(snapshotIndex).toMatchSnapshot();

    const regButton = IndexComponent.root.find(input => input.props.className === 'loginButton registration');
    regButton.props.onClick({stopPropagation: () => null});

    snapshotIndex = IndexComponent.toJSON();
    expect(snapshotIndex).toMatchSnapshot();

});