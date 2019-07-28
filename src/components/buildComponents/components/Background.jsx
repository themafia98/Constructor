import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Background = styled.div`
    position: relative;
    width: 100%;
    height: 800px;
    background-size: cover;
    background-color: ${props => props.backgroundColor};
    background-image: url(${props => props.backgroundImage});
`;

const BackgroundComponent = props => {

    const [id] = useState(props.id);
    const [targetSection] = useState(props.targetSection);
    let boxComponent = React.createRef();

    console.log(props);

    let [backgroundColor, setBgColor] = useState(props.background);
    let [backgroundImage, setImage] = useState(props.backgroundImage ? props.backgroundImage : null);

    const saveWidth = event => {
        boxComponent.current.focus();
        let boxInform =  boxComponent.current.getBoundingClientRect();
        eventEmitter.emit(`EventSaveWidth${targetSection}`, {width: boxInform.width, height: boxInform.height});
    }

    const openBgInstruments = event => {

        const componentsPatternBackground = {
            id: id,
            targetSection: targetSection,
            type: 'background',
            color: backgroundColor,
            backgroundImage: backgroundImage,
        }
        eventEmitter.emit('EventInstrumentPanel',{
            componentStats: componentsPatternBackground,
            targetSection: targetSection,
            type: 'background',
            id: id,
        });
        event.stopPropagation();
    }
console.log('build');
    const changeColor = eventItem => {
        setBgColor(eventItem.colorRGB);
    }

    const setBackgroundImage = event => {
        const {urlFull} = event;
        setImage(urlFull);
    };

    const didUpdate = () => {
        saveWidth();
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
            data-name = {targetSection}
            backgroundColor = {backgroundColor ? backgroundColor : props.background}
            backgroundImage = {backgroundImage ? backgroundImage : props.backgroundImage}
        >
            {props.children}
        </Background>
    )
}

export default BackgroundComponent;