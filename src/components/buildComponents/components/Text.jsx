
import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Title = styled.h1.attrs(props => ({
    style: {
        display: props.shadowDisplay ? 'none' : 'block',
        left: props.coordX,
        top: props.coordY,
}}))`
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    font-size: ${props => props.size};
    color: ${props => props.textColor};
    text-align: center;
    margin: 0;
`;


const TitleComponent = props =>  {

    let [colorText, setColorText] = useState(props.color);
    let [sizeText, setSizeText] = useState(props.size ? props.size : 120);
    let [contentText, setText] = useState(props.children);
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(null);

    const openTitleInstruments = event => {

        eventEmitter.emit('EventInstrumentPanel',{target: 'text'});
        event.stopPropagation();
    }

    const changeColorText = colorHash => {
        const {rgb} = colorHash;
        let colorRGB = `rgb(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        setColorText(colorRGB);
    }

    const changeSizeText = eventSize => {
        
        const {size} = eventSize;
        setSizeText(size);
    }

    const changeContentText = eventContent => {
        const {content} = eventContent;
        setText(content);
    }


    const didUpdate = event => {
        eventEmitter.on('EventChangeColorText', changeColorText);
        eventEmitter.on('EventChangeSizeText', changeSizeText);
        eventEmitter.on('EventChangeContentText', changeContentText);
        return () => {
            eventEmitter.off('EventChangeColorText', changeColorText);
            eventEmitter.off('EventChangeSizeText', changeSizeText);
            eventEmitter.off('EventChangeContentText', changeContentText);
        }
    }

    const saveCoords = event => {

        let rect = event.target.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        let width = rect.width;
        let height = rect.height;
        setShiftCoords({x: event.pageX - left - width/2, y: event.pageY - top + height/2.8});

        event.stopPropagation();
    }

    const moveText = event => {

        
        let coordX = event.pageX - shiftCoords.x;
        let coordY = event.pageY - shiftCoords.y;

        coordX = coordX <= 130 ? 130 : coordX;
        coordY = coordY <= 0 ? 0 : coordY;

            setDragNdrop({x: coordX + 'px', y: coordY + 'px', shadowDisplay: event.type === 'drag' ? true : false});
            event.stopPropagation();
    }

    const weelResizeText = event => {

        if (event.shiftKey && event.deltaY === -100) {
            let counter = sizeText + 1;
            counter = counter > 200 ? 200 : counter;
            setSizeText(counter);
            eventEmitter.emit('EventUpdateSizeText', counter);
        }

        if (event.shiftKey && event.deltaY === 100) {
            let counter = sizeText - 1;
             counter = counter <= 10 ? 10 : counter;
             setSizeText(counter);
             eventEmitter.emit('EventUpdateSizeText', counter);
            }
        event.stopPropagation();
    }
    useEffect(didUpdate);

    return (
        <Title
            onClick={openTitleInstruments}
            textColor = {colorText ? colorText : 'red'}
            size = {sizeText ? sizeText + 'px' : '120px'}
            draggable = {true}
            onMouseDown = {saveCoords}
            onDrag   = {moveText}
            onDragEnd = {moveText}
            onWheel = {weelResizeText}
            coordX = {dragNdrop ? dragNdrop.x : null}
            coordY = {dragNdrop ? dragNdrop.y : null}
            shadowDisplay = {dragNdrop ? dragNdrop.shadowDisplay : false}
        >
            {contentText}
        </Title>
    )
}

export default TitleComponent;