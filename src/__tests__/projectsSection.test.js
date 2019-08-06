import React from 'react';
import { MemoryRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import ProjectsSection from '../components/ProjectsSection/ProjectsSection';
import Events from 'events';
import renderer from 'react-test-renderer';
import store from '../redux/testReduxStore';

const cabinetStream = new Events();

const ProjectSestion = renderer.create(
    <MemoryRouter>
        <Provider store = {store}>
            <ProjectsSection cabinetStream = {cabinetStream} />
        </Provider>
    </MemoryRouter>
)

test('ProjectsSection.jsx test ', function(){

    let snapshotProjectsSestion = ProjectSestion.toJSON();
    expect(snapshotProjectsSestion).toMatchSnapshot();
});