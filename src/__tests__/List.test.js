import React from 'react';
import {Provider} from 'react-redux';
import { MemoryRouter} from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import Events from 'events';

import List from '../components/List/List';
import store from '../redux/testReduxStore';
const stream = new Events();
const ListComponent = renderer.create(
    <MemoryRouter>
        <Provider store = {store}>
            <List cabinetStream = {stream} list = {{id: 0, title: 'test1', type: "portfolio"}} />
        </Provider>
    </MemoryRouter>
)


test('List.js test ',function(){

    let snapshotList = ListComponent.toJSON();
    expect(snapshotList).toMatchSnapshot();
});