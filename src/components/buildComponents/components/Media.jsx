import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Media = styled.video`
    width: 100%;
`;

const openMediaInstruments = event => {

    eventEmitter.emit('EventInstrumentPanel',{target: 'media'});
    event.stopPropagation();
}

const MediaComponent = props => (
    <Media
        onClick={openMediaInstruments} 
        width = {props.width} 
        height = {props.height}
    >
            {props.children}
    </Media>
)

export default MediaComponent;