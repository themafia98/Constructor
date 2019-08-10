import React from 'react';
import renderer from 'react-test-renderer';
import BuildMenu from '../components/componentsBuildMenu/BuildMenu';
import Events from 'events';

    let stream = new Events();

    const BuildMenuComponent = renderer.create(
        <BuildMenu 
        mode = 'build'
        targetSection = 'Header'
        editComponentName = 'Header'
        eventStreamBuild  = {stream}
        countSection = {1}
        countComponents = {1}
        sizeParentBox = {{width: 1000, height: 1000, left: 0, top: 60}}
        />
    );

    test("BuildMenu test", () =>{

        let snapshotBuildMenuComponent = BuildMenuComponent.toJSON();
        expect(snapshotBuildMenuComponent).toMatchSnapshot();

        const imageTool = BuildMenuComponent.root.find(item => item.props.className === 'ImageTool CompoentnsMenu_button');
        imageTool.props.onClick({stopPropagation: () => null});

        snapshotBuildMenuComponent = BuildMenuComponent.toJSON();
        expect(snapshotBuildMenuComponent).toMatchSnapshot();

        
        const textTool = BuildMenuComponent.root.find(item => item.props.className === 'TextTool CompoentnsMenu_button');
        textTool.props.onClick({stopPropagation: () => null});

        snapshotBuildMenuComponent = BuildMenuComponent.toJSON();
        expect(snapshotBuildMenuComponent).toMatchSnapshot();

        
        const buttonTool = BuildMenuComponent.root.find(item => item.props.className === 'ButtonTool CompoentnsMenu_button');
        buttonTool.props.onClick({stopPropagation: () => null});

        snapshotBuildMenuComponent = BuildMenuComponent.toJSON();
        expect(snapshotBuildMenuComponent).toMatchSnapshot();

        const videoTool = BuildMenuComponent.root.find(item => item.props.className === 'VideoTool CompoentnsMenu_button');
        videoTool.props.onClick({stopPropagation: () => null});

        snapshotBuildMenuComponent = BuildMenuComponent.toJSON();
        expect(snapshotBuildMenuComponent).toMatchSnapshot();

    });