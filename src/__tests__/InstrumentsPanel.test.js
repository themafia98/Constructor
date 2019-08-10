import React from 'react';
import renderer from 'react-test-renderer';
import InstrumentsPanel from '../components/InstrumentsPanel/InstrumentsPanel';
import Events from 'events';

    let stream2 = new Events();

    const InstrumentsPanelComponent = renderer.create(
        <InstrumentsPanel
            instrumentPanel = {{}}
            componentStats = {{id: '1', targetSection: 'Header'}}
            editComponentName = 'Header'
            eventStreamBuild = {stream2}
            controllerStream = {stream2}
        />
    );

    test("InstrumentsPanel test", () =>{

        let snapshotInstrumentsPanelComponent = InstrumentsPanelComponent.toJSON();
        expect(snapshotInstrumentsPanelComponent).toMatchSnapshot();

        const closeInstruments = InstrumentsPanelComponent.root.find(item => item.props.className === 'closeInstrumentsPanel');
        closeInstruments.props.onClick({stopPropagation: () => null});

        snapshotInstrumentsPanelComponent = InstrumentsPanelComponent.toJSON();
        expect(snapshotInstrumentsPanelComponent).toMatchSnapshot();
    });