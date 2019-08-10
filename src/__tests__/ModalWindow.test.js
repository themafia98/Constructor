import React from 'react';
import renderer from 'react-test-renderer';
import ModalWindow from '../components/ModalWindow/ModalWindow';
import Events from 'events';


    let stream2 = new Events();

    const ModalWindowComponent = renderer.create(
        <ModalWindow
            workMode = 'newProject'
            eventStreamBuild = {stream2}
            cabinetStream = {stream2}
        />
    );

    test("ModalWindow test", () =>{

        let snapshotModalWindowComponent = ModalWindowComponent.toJSON();
        expect(snapshotModalWindowComponent).toMatchSnapshot();


        const acceptButton = ModalWindowComponent.root.find(item => item.props.className === 'acceptButton');
        acceptButton.props.onClick({stopPropagation: () => null});

        snapshotModalWindowComponent = ModalWindowComponent.toJSON();
        expect(snapshotModalWindowComponent).toMatchSnapshot();
    });