import React,{useState} from 'react';
import PropTypes from 'prop-types';
import './Viewer.scss';

function Viewer(props){

    let [mode] = useState(props.mode);
    let [path] = useState(props.path);

    const closeViewer = event => {
        props.eventStreamBuild.emit("EventView", { action: false, target: null});
        event.stopPropagation();
    }

    return (
        
        <div onClick = {closeViewer} className = 'Viewer'>
            {(mode === 'image' || mode === 'background') ? <img src = {path} alt = 'fullImage' /> 
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

Viewer.propTypes = {
    eventStreamBuild: PropTypes.object.isRequired, // events stream
    mode: PropTypes.string.isRequired, // use mode
    path: PropTypes.string.isRequired // path to data component
}

export default Viewer;