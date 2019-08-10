import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import renderer from 'react-test-renderer';
import About from '../Pages/About/About';
import store from '../redux/testReduxStore';


const firebase = {
    getCurrentUser: () => true
};
const config = require('../config.json');

const AboutComponent = renderer.create(
    <MemoryRouter initialEntries = {['/Cabinet/About']}>
    <Route path = "/Cabinet/About" exact >
        <Provider store = {store}>
            <About config = {config} idUser = {'asdasd'} firebase = {firebase} />
        </Provider>
    </Route>
    </MemoryRouter>
);

test("About test", function(){

    let snapshotAboutComponent = AboutComponent.toJSON();
    expect(snapshotAboutComponent).toMatchSnapshot();
});