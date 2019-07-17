import React, {useEffect, useState} from 'react';
import eventStream from '../../../../EventEmitter';
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

const Background = styled.div`
    position: relative;
    width: 100%;
    height: 95vh;
    background: ${props => props.background}
`;

const Media = styled.video`
    width: 100%;
`;

const openBgInstruments = event => {

    eventStream.emit('EventInstrumentPanel',{target: 'background'});
    event.stopPropagation();
}

const openMediaInstruments = event => {

    eventStream.emit('EventInstrumentPanel',{target: 'media'});
    event.stopPropagation();
}

const openTitleInstruments = event => {

    eventStream.emit('EventInstrumentPanel',{target: 'text'});
    event.stopPropagation();
}

const TitleComponent = props =>  {

    let [colorText, setColorText] = useState(props.color);
    let [sizeText, setSizeText] = useState(props.size);
    let [contentText, setText] = useState(props.children);
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(null);

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
        eventStream.on('EventChangeColorText', changeColorText);
        eventStream.on('EventChangeSizeText', changeSizeText);
        eventStream.on('EventChangeContentText', changeContentText);
        return () => {
            eventStream.off('EventChangeColorText', changeColorText);
            eventStream.off('EventChangeSizeText', changeSizeText);
            eventStream.off('EventChangeContentText', changeContentText);
        }
    }

    const saveCoords = event => {

        let rect = event.target.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        let width = rect.width;
        let height = rect.height;
        console.log(rect);
        setShiftCoords({x: event.pageX - left - width/2, y: event.pageY - top + height/2.8});

        event.stopPropagation();
    }

    const moveText = event => {

        
        let coordX = event.pageX - shiftCoords.x;
        let coordY = event.pageY - shiftCoords.y;

        coordX = coordX <= 130 ? 130 : coordX;
        coordY = coordY <= 0 ? 0 : coordY;

            setDragNdrop({x: coordX + 'px', y: coordY + 'px', shadowDisplay: event.type === 'drag' ? true : false});
            // console.log("x:" + (event.pageX - shiftCoords.x));
            // console.log("y:" + (event.pageY - shiftCoords.y));
            event.stopPropagation();
    }
    useEffect(didUpdate);

    return (
        <Title
            onClick={openTitleInstruments}
            textColor = {colorText ? colorText : 'red'}
            size = {sizeText ? sizeText : '120px'}
            draggable = {true}
            onMouseDown = {saveCoords}
            onDrag   = {moveText}
            onDragEnd = {moveText}
            coordX = {dragNdrop ? dragNdrop.x : null}
            coordY = {dragNdrop ? dragNdrop.y : null}
            shadowDisplay = {dragNdrop ? dragNdrop.shadowDisplay : false}
        >
            {contentText}
        </Title>
    )
}


const BackgroundComponent = props => {

    let [backgroundColor, setBgColor] = useState(props.background);

    const changeColor = colorHash => {
        const {rgb} = colorHash;
        let colorRGB = `rgb(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        setBgColor(colorRGB);
    }

    const didUpdate = event => {
        eventStream.on('EventChangeColor', changeColor);
        return () => {
            eventStream.off('EventChangeColor', changeColor);
        }
    }

    useEffect(didUpdate);
    return (
        <Background
            onClick={openBgInstruments}
            background = {backgroundColor}
        >
            {props.children}
            </Background>
    )
}

const MediaComponent = props => <Media onClick={openMediaInstruments} width = {props.width} height = {props.height}>{props.children}</Media>;

export {
    TitleComponent, BackgroundComponent,
    MediaComponent
}