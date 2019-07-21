
import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Title = styled.h1.attrs(props => ({
    style: {
        display: props.shadowDisplay ? 'none' : 'block',
        left: props.coordX ? props.coordX : '50%',
        top:  props.coordY,
}}))`
    position: absolute;
    transform: translate(-50%);
    font-size: ${props => props.size};
    color: ${props => props.textColor};
    text-align: center;
    margin: 0;
`;

// left: ${props => props.coordX ? props.coordX : '50%'};
// top:  ${props => props.coordY};

const TextComponent = props =>  {

    const [id] = useState(props.id);

    const [sizeParenBox] = useState({...props.sizeParenBox});

    let [colorText, setColorText] = useState(props.color);
    let [sizeText, setSizeText] = useState(props.size ? props.size : 120);
    let [contentText, setText] = useState(props.children);
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(null);

    const openTitleInstruments = event => {

        eventEmitter.emit(`EventInstrumentPanel`,{
            target: 'text',
            id: id,
            sizeTextValue: sizeText
        });
        event.stopPropagation();
    }

    const changeColorText = color => {
        setColorText(color);
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
        eventEmitter.on(`EventChangeColorText${id}`, changeColorText);
        eventEmitter.on(`EventChangeSizeText${id}`, changeSizeText);
        eventEmitter.on(`EventChangeContentText${id}`, changeContentText);
        return () => {
            eventEmitter.off(`EventChangeColorText${id}`, changeColorText);
            eventEmitter.off(`EventChangeSizeText${id}`, changeSizeText);
            eventEmitter.off(`EventChangeContentText${id}`, changeContentText);
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

        let convertToPercentX = (coordX * 100) / sizeParenBox.width;
        let convertToPercentY = (coordY * 100) / sizeParenBox.height;

        const position = {
            x: convertToPercentX + '%', 
            y: convertToPercentY + '%', 
            shadowDisplay: event.type === 'drag' ? true : false
        };
        setDragNdrop(position);
        
        if (event.type === 'dragend') 
            eventEmitter.emit('EventUpdatePosition', position);
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

export default TextComponent;