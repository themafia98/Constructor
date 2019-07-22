import React from 'react';
import renderer from 'react-test-renderer';
import ImageViewer from '../components/imageViewer/imageViewer';

const path = "https://images.unsplash.com/";
let imageurl = "photo-1504215680853-026ed2a45def?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;";
imageurl = imageurl + "crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjgwNjg0fQ";

const imagePath = path + imageurl;

let ImageViewerComponent = renderer.create(
    <ImageViewer path ={imagePath} />
)

test('imageViewer.js test ', function(){

    let snapshotComponent = ImageViewerComponent.toJSON();
    expect(snapshotComponent).toMatchSnapshot();

    const setCurrentImage = ImageViewerComponent.root.find(item => item.props.className === 'ImageViewer');
    setCurrentImage.props.onClick({stopPropagation: () => null});

    snapshotComponent = ImageViewerComponent.toJSON();
    expect(snapshotComponent).toMatchSnapshot();
});