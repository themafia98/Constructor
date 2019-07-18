import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Background = styled.div`
    position: relative;
    width: 100%;
    height: 95vh;
    background-size: cover;
    background-color: ${props => props.backgroundColor};
    background-image: url(${props => props.backgroundImage});
`;

const BackgroundComponent = props => {

    let [backgroundColor, setBgColor] = useState(props.background);
    let [backgroundImage, setImage] = useState(props.backgroundImage ? props.backgroundImage : null);

    const openBgInstruments = event => {

        eventEmitter.emit('EventInstrumentPanel',{target: 'background'});
        event.stopPropagation();
    }

    const changeColor = event => {
        const {rgb} = event;
        let colorRGB = `rgb(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        setBgColor(colorRGB);
    }

    const setBackgroundImage = event => {
        const {urlFull} = event;
        setImage(urlFull);
    };

    const didUpdate = event => {
        eventEmitter.on('EventChangeColor', changeColor);
        eventEmitter.on('EventSetBackgroundImage', setBackgroundImage);
        return () => {
            eventEmitter.off('EventChangeColor', changeColor);
            eventEmitter.off('EventSetBackgroundImage', setBackgroundImage);
        }
    }

    useEffect(didUpdate);
    return (
        <Background
            onClick={openBgInstruments}
            backgroundColor = {backgroundColor}
            backgroundImage = {backgroundImage}
        >
            {props.children}
        </Background>
    )
}

export default BackgroundComponent;