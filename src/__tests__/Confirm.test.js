import React from 'react';
import renderer from 'react-test-renderer';
import Confirm from '../components/confirmBox/Confirm';

const saveChanges = props => {
    console.log('button save work!');
}

const cancelChanges = props => {
    console.log('cancel save work!');
}

const ConfirmComponent = renderer.create(
    <Confirm cbSaveChanges = {saveChanges} cbCancelSave = {cancelChanges} title = 'icon' />
);

test('Confirm test ', function () {

    let snaphotConfirmComponent = ConfirmComponent.toJSON();
    expect(snaphotConfirmComponent).toMatchSnapshot();

    const saveCofirm = ConfirmComponent.root.find(item => item.props.className === 'saveCofirm');
    saveCofirm.props.onClick({stopPropagation: () => null});

    snaphotConfirmComponent = ConfirmComponent.toJSON();
    expect(snaphotConfirmComponent).toMatchSnapshot();

    const cancelCofirm = ConfirmComponent.root.find(item => item.props.className === 'cancelCofirm');
    cancelCofirm.props.onClick({stopPropagation: () => null});

    snaphotConfirmComponent = ConfirmComponent.toJSON();
    expect(snaphotConfirmComponent).toMatchSnapshot();



});