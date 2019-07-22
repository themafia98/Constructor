import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import renderer from 'react-test-renderer';

import store from '../redux/testReduxStore';
import Build from '../Pages/Build/Build';



const BuildComponent = renderer.create(
    <MemoryRouter initialEntries = {['/Cabinet/Build/0']}>
        <Route path = "/Cabinet/Build/:param" >
            <Provider store = {store}>
                <Build match = {{params: {param: 0}}} />
            </Provider>
        </Route>
    </MemoryRouter>
);

test("Build test", function(){

    const snapshotBuild = BuildComponent.toJSON();
    expect(snapshotBuild).toMatchSnapshot();
});