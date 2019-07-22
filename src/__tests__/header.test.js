import React from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import { MemoryRouter} from 'react-router-dom';
import store from '../redux/testReduxStore';
import Header from '../components/header/Header';

const HeaderComponent = renderer.create(
    <MemoryRouter>
        <Provider store = {store}>
            <Header />
        </Provider>
    </MemoryRouter>
);

test("Header.js test", function(){

    let snapshotHeader = HeaderComponent.toJSON();
    expect(snapshotHeader).toMatchSnapshot();

});