
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
    const [sizeParentBox, setsizeParentBox] = useState({...props.sizeParentBox});

    let [_ScrollY, setScrollY] = useState(0);

    const [targetSection] = useState(props.targetSection);
    let [count,setCount] = useState(0);

    let [colorText, setColorText] = useState(props.color);
    let [sizeText, setSizeText] = useState(props.size ? props.size : 120);
    let [contentText, setText] = useState(props.content ? props.content : props.children);
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(props.coords.x ? {x: props.coords.x, y: props.coords.y} : null);


    let textComponent = React.createRef();

    const openTitleInstruments = event => {

        const componentsPatternText = {
            id: id,
            targetSection: targetSection,
            type: 'text',
            color: colorText,
            fontSize: sizeText,
            content: contentText,
            coords: {...dragNdrop}, // x, y
        }

        eventEmitter.emit(`EventInstrumentPanel`,{
            type: 'text',
            targetSection: targetSection,
            id: id,
            componentStats: componentsPatternText,
            sizeTextValue: sizeText
        });

        event.stopPropagation();
    }

    const changeColorText = colorRGB => {
        if (typeof colorRGB === 'string')
        setColorText(colorRGB);
    }

    const changeSizeText = eventSize => {
        const {size} = eventSize;
        setSizeText(size);
    }

    const saveSize = event => {

        if (count === 0){
        setsizeParentBox({width: event.width, height: event.height});
        setCount(count + 1);
        } else  eventEmitter.off(`EventSaveWidth`,saveSize);
    }

    const changeContentText = eventContent => {
        let booldContent = eventContent.content || eventContent.content === '';
        if (booldContent){
            const {content} = eventContent;
            setText(content);
        }
    }

    const scrollCordsSet = eventItem => {
  
        if (eventItem >= 700) eventItem =  eventItem - sizeParentBox.height;
        // if (eventItem >= 1300) eventItem =  eventItem*2 - sizeParentBox.height;
        setScrollY(eventItem);
    }


    const didUpdate = event => {
        eventEmitter.on('ScrollRecalcPosition', scrollCordsSet);
        eventEmitter.on(`EventChangeColorText${id}`, changeColorText);
        eventEmitter.on(`EventChangeSizeText${id}`, changeSizeText);
        eventEmitter.on(`EventChangeContentText${id}`, changeContentText);
        eventEmitter.on(`EventSaveWidth${targetSection}`,saveSize);
        return () => {
            eventEmitter.off('ScrollRecalcPosition', scrollCordsSet);
            eventEmitter.off(`EventChangeColorText${id}`, changeColorText);
            eventEmitter.off(`EventSaveWidth${targetSection}`,saveSize);
            eventEmitter.off(`EventChangeSizeText${id}`, changeSizeText);
            eventEmitter.off(`EventChangeContentText${id}`, changeContentText);
        }
    }

    const saveCoords = event => {

        if (_ScrollY === undefined) _ScrollY = 0;
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
        const borderBottom = sizeParentBox.height - MARGIN;

        // const borderLeft = sizeParentBox.width - MARGIN;

        let coordX = event.pageX - shiftCoords.x;
        let coordY = event.pageY - shiftCoords.y;

        if (coordY < 0) coordY =  0;
        if (coordY > borderBottom) coordY = borderBottom;



        let convertToPercentX = ((coordX) * 100) / sizeParentBox.width;
        let convertToPercentY = ((coordY) * 100) / (sizeParentBox.height);

        if (isNaN(convertToPercentX) || isNaN(convertToPercentY)){
            console.log('error');
        }

        const position = {
            x: convertToPercentX.toFixed(1) + '%', 
            y: convertToPercentY.toFixed(1) + '%', 
            shadowDisplay: event.type === 'drag' ? true : false
        };
        setDragNdrop(position);
        if (event.type === 'dragend') {
            eventEmitter.emit(`EventUpdatePosition${id}`, position);
        }
        event.stopPropagation();
    }

    const weelResizeText = event => {

        if (event.shiftKey && event.deltaY === -100) {
            let counter = sizeText + 1;
            counter = counter > 200 ? 200 : counter;
            setSizeText(counter);
            eventEmitter.emit(`EventUpdateSizeText${id}`, counter);
        }

        if (event.shiftKey && event.deltaY === 100) {
            let counter = sizeText - 1;
             counter = counter <= 10 ? 10 : counter;
             setSizeText(counter);
             eventEmitter.emit(`EventUpdateSizeText${id}`, counter);
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