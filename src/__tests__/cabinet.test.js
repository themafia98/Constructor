import React from 'react';
import firebase from 'firebase';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import renderer from 'react-test-renderer';
import Cabinet from '../Pages/Cabinet/Cabinet';
import store from '../redux/testReduxStore';

const config = require('../config.json');

const props = {
    history: {},
    match: {},
    location: {}
}

const CabinetComponent = renderer.create(
    <MemoryRouter initialEntries = {['/Cabinet']}>
        <Route path = "/Cabinet" exact >
            <Provider store = {store}>
                <Cabinet   {...props} config = {config} firebase = {firebase} />
            </Provider>
        </Route>
    </MemoryRouter>
);

const act = renderer.act;
test("Cabinet test", function(){

    let snapshotCabient = CabinetComponent.toJSON();
    expect(snapshotCabient).toMatchSnapshot();
    act(() => {
    const controllerEnter = CabinetComponent.root.find(item => item.props.className === 'projectControllerButton_enter');

    controllerEnter.props.onClick({stopPropagation: () => null});
    });
    snapshotCabient = CabinetComponent.toJSON();
    expect(snapshotCabient).toMatchSnapshot();

    act(() => {
    const logoutButton = CabinetComponent.root.find(item => item.props.className === 'logoutButton');

    logoutButton.props.onClick({stopPropagation: () => null});
    });
    snapshotCabient = CabinetComponent.toJSON();
    expect(snapshotCabient).toMatchSnapshot();
    act(() => {
    const about = CabinetComponent.root.find(item => item.props.className === 'about');

    about.props.onClick({stopPropagation: () => null});
    });
    snapshotCabient = CabinetComponent.toJSON();
    expect(snapshotCabient).toMatchSnapshot();



});