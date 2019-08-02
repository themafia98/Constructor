import React,{useState} from 'react';
import eventEmitter from '../../EventEmitter';

import './Viewer.scss';

function Viewer(props){

    let [mode] = useState(props.mode);
    let [path] = useState(props.path);

    const closeViewer = event => {
        eventEmitter.emit("EventView", { action: false, target: null});
        event.stopPropagation();
    }

    return (
        
        <div onClick = {closeViewer} className = 'Viewer'>
            {mode === 'image' ? <img src = {path} alt = 'fullImage' /> 
            : 
            <iframe 
            src= {`https://www.youtube.com/embed/${props.iframe}`}
            title = 'youtube'
            frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
            </iframe>
            }
        </div>
    )
}

export default Viewer;