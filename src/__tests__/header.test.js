import React from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import { MemoryRouter} from 'react-router-dom';
import store from '../redux/testReduxStore';
import Header from '../components/header/Header';

const HeaderComponent = renderer.create(
    <MemoryRouter>
        <Provider store = {store}>
            <Header title = 'Constructor' />
        </Provider>
    </MemoryRouter>
);

const act = renderer.act;

test("Header.js test", function(){

    let snapshotHeader = HeaderComponent.toJSON();
    expect(snapshotHeader).toMatchSnapshot();

    const logOut = HeaderComponent.root.find(button => button.props.className === 'logoutButton');
    act(()=> logOut.props.onClick({stopPropagation: () => null}));

    snapshotHeader = HeaderComponent.toJSON();
    expect(snapshotHeader).toMatchSnapshot();


        /** @redirect */
    const about = HeaderComponent.root.find(aboutButton => aboutButton.props.className === 'header__CabinetInfo');

    act(()=> about.props.onClick({stopPropagation: () => null}));

    snapshotHeader = HeaderComponent.toJSON();
    expect(snapshotHeader).toMatchSnapshot();

});