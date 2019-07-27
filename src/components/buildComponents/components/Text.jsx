
import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const TextStyle = styled.h1.attrs(props => ({
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
    const [sizeParenBox, setSizeParenBox] = useState({...props.sizeParenBox});

    let [_ScrollY, setScrollY] = useState(0);


    const [name] = useState(props.target);
    let [count,setCount] = useState(0);

    let [colorText, setColorText] = useState(props.color);
    let [sizeText, setSizeText] = useState(props.size ? props.size : 120);
    let [contentText, setText] = useState(props.content ? props.content : props.children);
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(props.coords.left ? {x: props.coords.left, y: props.coords.top} : null);

    let textComponent = React.createRef();

    const openTitleInstruments = event => {

        eventEmitter.emit(`EventInstrumentPanel`,{
            target: 'text',
            id: id,
            sizeTextValue: sizeText
        });
        event.stopPropagation();
    }

    const changeColorText = eventItem => {
        setColorText(eventItem.colorRGB);
    }

    const changeSizeText = eventSize => {
        const {size} = eventSize;
        setSizeText(size);
    }

    const saveSize = event => {

        if (count === 0){
        setSizeParenBox({width: event.width, height: event.height});
        setCount(count + 1);
        } else  eventEmitter.off(`EventSaveWidth`,saveSize);
    }

    const changeContentText = eventContent => {
        if (name === eventContent.idSection){
            const {content} = eventContent;
            setText(content);
        }
    }

    const scrollCordsSet = eventItem => {
        setScrollY(eventItem);
    }


    const didUpdate = event => {
        eventEmitter.on('ScrollRecalcPosition', scrollCordsSet);
        eventEmitter.on(`EventChangeColorText${id}`, changeColorText);
        eventEmitter.on(`EventChangeSizeText${id}`, changeSizeText);
        eventEmitter.on(`EventChangeContentText${id}`, changeContentText);
        eventEmitter.on(`EventSaveWidth${name}`,saveSize);
        return () => {
            eventEmitter.off('ScrollRecalcPosition', scrollCordsSet);
            eventEmitter.off(`EventChangeColorText${id}`, changeColorText);
            eventEmitter.off(`EventSaveWidth${name}`,saveSize);
            eventEmitter.off(`EventChangeSizeText${id}`, changeSizeText);
            eventEmitter.off(`EventChangeContentText${id}`, changeContentText);
        }
    }

    const saveCoords = event => {

        let rect = event.target.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top + _ScrollY;
        let width = rect.width;
        let height = rect.height;

        setShiftCoords({x: event.pageX - left - width/2, y: event.pageY - top + height/2});

        event.stopPropagation();
    }

    const moveText = event => {

        let {current} = textComponent;
        current.focus();

        const MARGIN = 150;
        const borderBottom = sizeParenBox.height - MARGIN;
        const borderLeft = sizeParenBox.width - MARGIN;

        let coordX = event.pageX - shiftCoords.x;
        let coordY = event.pageY - shiftCoords.y;
        
        console.log("X:" + coordX);
        console.log("Y:" + coordY);

        if (coordY < 0) coordY =  0;
        if (coordY > borderBottom) coordY = borderBottom;



        let convertToPercentX = ((coordX) * 100) / sizeParenBox.width;
        let convertToPercentY = ((coordY) * 100) / (sizeParenBox.height);

        const position = {
            x: convertToPercentX.toFixed(1) + '%', 
            y: convertToPercentY.toFixed(1) + '%', 
            shadowDisplay: event.type === 'drag' ? true : false
        };
        setDragNdrop(position);
        if (event.type === 'dragend') {
            eventEmitter.emit('EventUpdatePosition', position);
        }
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
        <TextStyle
            ref  = {textComponent}
            onClick={openTitleInstruments}
            textColor = {colorText ? colorText : 'red'}
            size = {sizeText ? sizeText + 'px' : '120px'}
            draggable = {true}
            onMouseDown = {saveCoords}
            onDragStart = {openTitleInstruments}
            onDrag   = {moveText}
            onDragEnd = {moveText}
            onWheel = {weelResizeText}
            coordX = {dragNdrop ? dragNdrop.x : null}
            coordY = {dragNdrop ? dragNdrop.y : null}
            shadowDisplay = {dragNdrop ? dragNdrop.shadowDisplay : false}
        >
            {contentText}
        </TextStyle>
    )
}

export default TextComponent;