import React from 'react';
import {Provider} from 'react-redux';

import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import List from '../components/List/List';
import store from '../redux/testReduxStore';
const ListComponent = renderer.create(
    <Provider store = {store}>
        <List list = {{id: 0, title: 'test1', type: "portfolio"}} />
    </Provider>
)


test('List.js test ',function(){

    let snapshotList = ListComponent.toJSON();
    expect(snapshotList).toMatchSnapshot();
});