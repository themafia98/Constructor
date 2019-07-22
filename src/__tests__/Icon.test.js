import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../components/Icon/Icon';


const testEvent = event => {
    console.log('event work!');
}

const IconComponents = renderer.create(
    <Icon title = 'icon' className = "testIcon" path = '/img/plus.png' onClick = {testEvent} />
);

test('Icon.js test ', function () {

    let snaphotIcon = IconComponents.toJSON();
    expect(snaphotIcon).toMatchSnapshot();

    snaphotIcon.props.onClick({});

    snaphotIcon = IconComponents.toJSON();
    expect(snaphotIcon).toMatchSnapshot();
});