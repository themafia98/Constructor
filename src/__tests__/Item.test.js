import React from 'react';
import { MemoryRouter} from 'react-router-dom';
import renderer from 'react-test-renderer';

import Item from '../components/List/Item';

let ItemComponents = renderer.create(
    <MemoryRouter initialEntries = {['/Cabinet/Build/0']}>
        <Item id = {0} title = {'test1'} type = {"portfolio"}  />
    </MemoryRouter>
)


const act = renderer.act;

test('Item.js test ', function() {

    let snapshotItemComponents = ItemComponents.toJSON();
    expect(snapshotItemComponents).toMatchSnapshot();

    const buttonEnter = ItemComponents.root.find(buttonEnter => buttonEnter.props.className === 'projectControllerButton_enter');
    const buttonDelete = ItemComponents.root.find(buttonDelete => buttonDelete.props.className === 'projectControllerButton_delete');

    act(()=> {
        buttonEnter.props.onClick({stopPropagation: () => null});
    });


    snapshotItemComponents = ItemComponents.toJSON();
    expect(snapshotItemComponents).toMatchSnapshot();

    act(()=>{
        buttonDelete.props.onClick({stopPropagation: () => null});
    });

    snapshotItemComponents = ItemComponents.toJSON();
    expect(snapshotItemComponents).toMatchSnapshot();
});