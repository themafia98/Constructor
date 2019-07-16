import React, {useEffect, useState} from 'react';
import eventStream from '../../../../EventEmitter';
import styled from 'styled-components';

const Title = styled.h1`
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

const TitleComponent = props => <Title onClick={openTitleInstruments} textColor = {props.color} size = {props.size}>{props.children}</Title>;


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