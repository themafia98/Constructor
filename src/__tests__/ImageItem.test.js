import React from 'react';
import renderer from 'react-test-renderer';

import ImageItem from '../components/imageViewer/imageItem';
import Item from '../components/List/Item';

const path = "https://images.unsplash.com/";
let imageurl = "photo-1504215680853-026ed2a45def?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;";
imageurl = imageurl + "crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjgwNjg0fQ";

const imagePath = path + imageurl;

const ImageItemComponent = renderer.create(
    <ImageItem id = {0} urls ={{regular: imagePath, urlFull: imagePath}} />
)

test("ImageItem.js test", function(){

    let snapshotImageItem = ImageItemComponent.toJSON();
    expect(snapshotImageItem).toMatchSnapshot();

    const eventClick = ImageItemComponent.root.find(item => item.props.className === 'ImageItem');
    eventClick.props.onClick({stopPropagation: () => null});

    snapshotImageItem = ImageItemComponent.toJSON();
    expect(snapshotImageItem).toMatchSnapshot();

});