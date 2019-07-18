import React,{useState} from 'react';
import eventEmitter from '../../EventEmitter';

import './imageViewer.scss';

function ImageViewer(props){

    let [path] = useState(props.path);

    const closeViewer = event => {
        eventEmitter.emit("EventImageView", { action: false, target: null});
        event.stopPropagation();
    }

    return (
        <div onClick = {closeViewer} className = 'ImageViewer'>
            <img src = {path} alt = 'fullImage' />
        </div>
    )
}

export default ImageViewer;