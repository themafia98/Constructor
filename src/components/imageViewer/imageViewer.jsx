import React,{useState} from 'react';
import eventEmitter from '../../EventEmitter';

import './imageViewer.scss';

function ImageViewer(props){

    const closeViewer = event => {
        eventEmitter.emit("EventImageView", { action: false, target: null});
        event.stopPropagation();
    }

    let [path] = useState(props.path);
    console.log(props.path);
    return (
        <div onClick = {closeViewer} className = 'ImageViewer'>
            <img src = {path} alt = 'fullImage' />
        </div>
    )
}

export default ImageViewer;