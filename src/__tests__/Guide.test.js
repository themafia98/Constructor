import React from 'react';
import firebase from 'firebase';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import renderer from 'react-test-renderer';
import Guide from '../Pages/Guide/Guide';
import store from '../redux/testReduxStore';



const config = require('../config.json');

const GuideComponent = renderer.create(
    <MemoryRouter initialEntries = {['/Cabinet/Guide']}>
    <Route path = "/Cabinet/Guide" exact >
        <Provider store = {store}>
            <Guide config = {config} firebase = {firebase} />
        </Provider>
    </Route>
    </MemoryRouter>
);

test("Guide test", function(){

    let snapshotGuideComponent = GuideComponent.toJSON();
    expect(snapshotGuideComponent).toMatchSnapshot();

    const panel = GuideComponent.root.find(item => item.props.className === 'switch__button panel activeButton');
    panel.props.onClick({stopPropagation: () => null});

    snapshotGuideComponent = GuideComponent.toJSON();
    expect(snapshotGuideComponent).toMatchSnapshot();

    const add = GuideComponent.root.find(item => item.props.className === 'switch__button add');
    add.props.onClick({stopPropagation: () => null});

    snapshotGuideComponent = GuideComponent.toJSON();
    expect(snapshotGuideComponent).toMatchSnapshot();

    const section = GuideComponent.root.find(item => item.props.className === 'switch__button section');
    section.props.onClick({stopPropagation: () => null});

    snapshotGuideComponent = GuideComponent.toJSON();
    expect(snapshotGuideComponent).toMatchSnapshot();

    const project = GuideComponent.root.find(item => item.props.className === 'switch__button project');
    project.props.onClick({stopPropagation: () => null});

    snapshotGuideComponent = GuideComponent.toJSON();
    expect(snapshotGuideComponent).toMatchSnapshot();
});