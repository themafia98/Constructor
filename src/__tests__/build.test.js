import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import renderer from 'react-test-renderer';
import firebase from '../Firebase/Firebase';
import store from '../redux/testReduxStore';
import Build from '../Pages/Build/Build';



const BuildComponent = renderer.create(
    <MemoryRouter initialEntries = {['/Cabinet/Build/0']}>
        <Route path = "/Cabinet/Build/:param" >
            <Provider store = {store}>
                <Build firebase = {firebase} match = {{params: {param: 0}}} />
            </Provider>
        </Route>
    </MemoryRouter>
);

test("Build test", function(){

    let snapshotBuild = BuildComponent.toJSON();
    expect(snapshotBuild).toMatchSnapshot();

    let info = BuildComponent.root.find(item => item.props.className === 'newSectionTool CompoentnsMenu_button');
    info.props.onClick({stopPropagation: () => null});

    snapshotBuild = BuildComponent.toJSON();
    expect(snapshotBuild).toMatchSnapshot();

    let logout = BuildComponent.root.find(item => item.props.className === 'logoutButton');
    logout.props.onClick({stopPropagation: () => null});

    snapshotBuild = BuildComponent.toJSON();
    expect(snapshotBuild).toMatchSnapshot();

    let about = BuildComponent.root.find(item => item.props.className === 'about');
    about.props.onClick({stopPropagation: () => null});

    snapshotBuild = BuildComponent.toJSON();
    expect(snapshotBuild).toMatchSnapshot();
});