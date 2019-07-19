import React, {useEffect, useState, useRef} from 'react';
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

    const [count, setCount] = useState(0);
    let boxComponent = React.createRef();
    let linkRefBox = null;
    let [backgroundColor, setBgColor] = useState(props.background);
    let [backgroundImage, setImage] = useState(props.backgroundImage ? props.backgroundImage : null);




    const saveWidth = event => {
        setCount(count + 1);
        boxComponent.current.focus();
        let boxInform =  boxComponent.current.getBoundingClientRect();
        eventEmitter.emit('EventSaveWidth', {width: boxInform.width, height: boxInform.height});
    }

    const openBgInstruments = event => {
        console.log(Background);
        eventEmitter.emit('EventInstrumentPanel',{target: 'background'});
        event.stopPropagation();
    }

    const changeColor = color => {
        setBgColor(color);
    }

    const setBackgroundImage = event => {
        const {urlFull} = event;
        setImage(urlFull);
    };

    const didUpdate = event => {
        console.log('didUpdate');
        if (count === 0 ) saveWidth();
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
            ref  = {boxComponent}
            onClick={openBgInstruments}
            backgroundColor = {backgroundColor}
            backgroundImage = {backgroundImage}
        >
            {props.children}
        </Background>
    )
}

export default BackgroundComponent;