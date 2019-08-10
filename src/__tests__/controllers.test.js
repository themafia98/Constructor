import React from 'react';
import renderer from 'react-test-renderer';
import Controllers from '../components/controllers/controllers';
import Events from 'events';

    let stream = new Events();

    const ControllersComponent = renderer.create(
        <Controllers
        targetSection = 'Header'
        menuActive = {true}
        eventStreamBuild  = {stream}
        countSection = {0}
        countComponents = {0}
        sizeParentBox = {{width: 1000, height: 1000, left: 0, top: 60}}
        />
    );

    test("Controllers test", () =>{

        let snapshotControllersComponent = ControllersComponent.toJSON();
        expect(snapshotControllersComponent).toMatchSnapshot();

        const addButton = ControllersComponent.root.find(item => item.props.className === 'ControllersEditComponent__addButton');
        addButton.props.onClick({stopPropagation: () => null});

        snapshotControllersComponent = ControllersComponent.toJSON();
        expect(snapshotControllersComponent).toMatchSnapshot();

        const imageToolC = ControllersComponent.root.find(item => item.props.className === 'ImageTool CompoentnsMenu_button');
        imageToolC.props.onClick({stopPropagation: () => null});

        snapshotControllersComponent = ControllersComponent.toJSON();
        expect(snapshotControllersComponent).toMatchSnapshot();

        const textTool = ControllersComponent.root.find(item => item.props.className === 'TextTool CompoentnsMenu_button');
        textTool.props.onClick({stopPropagation: () => null});

        snapshotControllersComponent = ControllersComponent.toJSON();
        expect(snapshotControllersComponent).toMatchSnapshot();

        const buttonTool = ControllersComponent.root.find(item => item.props.className === 'ButtonTool CompoentnsMenu_button');
        buttonTool.props.onClick({stopPropagation: () => null});

        snapshotControllersComponent = ControllersComponent.toJSON();
        expect(snapshotControllersComponent).toMatchSnapshot();

        const videoTool = ControllersComponent.root.find(item => item.props.className === 'VideoTool CompoentnsMenu_button');
        videoTool.props.onClick({stopPropagation: () => null});

        snapshotControllersComponent = ControllersComponent.toJSON();
        expect(snapshotControllersComponent).toMatchSnapshot();

    });