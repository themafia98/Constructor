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

    console.log('BG');
    const [id] = useState(props.id);

    const [count, setCount] = useState(0);
    let boxComponent = React.createRef();

    let [backgroundColor, setBgColor] = useState(props.background);
    let [backgroundImage, setImage] = useState(props.backgroundImage ? props.backgroundImage : null);

    const saveWidth = event => {
        setCount(count + 1);
        boxComponent.current.focus();
        let boxInform =  boxComponent.current.getBoundingClientRect();
        eventEmitter.emit('EventSaveWidth', {width: boxInform.width, height: boxInform.height});
    }

    const openBgInstruments = event => {
        eventEmitter.emit('EventInstrumentPanel',{
            target: 'background',
            id: id,
        });
        event.stopPropagation();
    }

    const changeColor = color => {
        setBgColor(color);
    }

    const setBackgroundImage = event => {
        const {urlFull} = event;
        setImage(urlFull);
    };

    const didUpdate = () => {
        if (count === 0 ) saveWidth();
        eventEmitter.on(`EventChangeColorBackground${id}`, changeColor);
        eventEmitter.on(`EventSetBackgroundImage${id}`, setBackgroundImage);
        return () => {
            eventEmitter.off(`EventChangeColorBackground${id}`, changeColor);
            eventEmitter.off(`EventSetBackgroundImage${id}`, setBackgroundImage);
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