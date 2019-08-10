import React from 'react';
import renderer from 'react-test-renderer';

import ErrorBoundary from '../components/ErrorCatch/ErrorBoundary';
import ErrorPage from '../components/ErrorCatch/ErrorPage';

import Events from 'events';

let eventEmitter = new Events();

const ErrorBoundaryComponent = renderer.create(
    <ErrorBoundary>
            <ErrorPage />
    </ErrorBoundary>
);

test('Error catch test', () => {

    let snapshotErrorBoundaryComponent = ErrorBoundaryComponent.toJSON();
    expect(snapshotErrorBoundaryComponent).toMatchSnapshot();
    // try catch errors
    const updateApp = ErrorBoundaryComponent.root.find(item => item.props.className === 'ErrorPage__button_updateApp');
    updateApp.props.onClick({stopPropagation: () => null});

    snapshotErrorBoundaryComponent = ErrorBoundaryComponent.toJSON();
    expect(snapshotErrorBoundaryComponent).toMatchSnapshot();
});