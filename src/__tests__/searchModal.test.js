import React from 'react';
import renderer from 'react-test-renderer';
import SearchModal from '../components/ModalWindow/Search/SearchModal';
import Events from 'events';


const cancelTest = event => {
    console.log('cancelTest work search modal!');
}

const cbShowImage = event => {
    console.log('cbShowImage work search modal!');
}

const cbSetSelectedImage = event => {
    console.log('cbSetSelectedImage work search modal!');
}

const cbSearch = event => {
    console.log('cbSearch work search');
}
    let stream2 = new Events();

    const ModalWindowComponent = renderer.create(
        <SearchModal
            modalSearchMode = 'image'
            content = {{}}
            cbSearch  = {cbSearch}
            cbCancel = {cancelTest}
            cbShowImage = {cbShowImage}
            cbSetSelectedImage = {cbSetSelectedImage}
        />
    );

    test("SearchModal test", () =>{

        let snapshotModalWindowComponent = ModalWindowComponent.toJSON();
        expect(snapshotModalWindowComponent).toMatchSnapshot();


        const projectSelect = ModalWindowComponent.root.find(item => item.props.className === 'acceptButton');
        projectSelect.props.onClick({stopPropagation: () => null});

        snapshotModalWindowComponent = ModalWindowComponent.toJSON();
        expect(snapshotModalWindowComponent).toMatchSnapshot();
    });