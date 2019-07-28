import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Media = styled.iframe`
    transform: translate(-50%,-50%);
    width: 30%;
    height: 50%;
    left: 50%;
    top: 50%;
    position: absolute;
    z-index: 9999999999999;
    border: 1px solid red;
    background: grey;
    padding: 25px;
`;


const MediaComponent = props => {

    const [targetSection] = useState(props.targetSection);
    const [id] = useState(props.id);
    const [sizeParentBox] = useState(props.sizeParentBox);
    const [content, setContent] = useState(props.path || props.content);
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(props.coords.x ? {x: props.coords.x, y: props.coords.y} : null);


    const openMediaInstruments = event => {

        eventEmitter.emit('EventInstrumentPanel',{target: 'media'});
        event.stopPropagation();
    }
    console.log('media');
    return (
        <Media
            onClick={openMediaInstruments} 
            width = {props.width} 
            height = {props.height}
            src="https://www.youtube.com/embed/B0b59jgudto" 
            frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        >
            {props.children}
        </Media>
    )
}

// <iframe width="560" height="315" 
// src="https://www.youtube.com/embed/7KoHDwvSOwc" 
// frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
// allowfullscreen>
// </iframe>

export default MediaComponent;