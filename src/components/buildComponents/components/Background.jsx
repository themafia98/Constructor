import React, {useEffect, useState} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Background = styled.div`
    position: relative;
    width: ${props => props.width};
    height: ${props => props.height};
    background-size: cover;
    background-color: ${props => props.backgroundColor};
    background-image: url(${props => props.backgroundImage});
`;

const BackgroundComponent = props => {

    const [id] = useState(props.id);
    const [targetSection] = useState(props.targetSection);
    let boxComponent = React.createRef();

    let [backgroundColor, setBgColor] = useState(props.background || props.color);
    let [backgroundImage, setImage] = useState(props.backgroundImage ? props.backgroundImage : null);

    let [width] = useState(props.width ? props.width : '100%');
    let [height] = useState(props.height ? props.height : '100%');

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

    const changeColor = eventItem => {
        setBgColor(eventItem.colorRGB);
    }

    const setBackgroundImage = event => {
        const {urlFull} = event;
        setImage(urlFull);
    };

    const saveScroll = eventItem => {
        console.log(eventItem);
    }

    const didUpdate = () => {
        saveWidth();
        eventEmitter.on(`EventChangeColorBackground${id}`, changeColor);
        eventEmitter.on(`EventSaveSize${id}`, saveScroll);
        eventEmitter.on(`EventSetBackgroundImage${id}`, setBackgroundImage);
        return () => {
            eventEmitter.off(`EventChangeColorBackground${id}`, changeColor);
            eventEmitter.off(`EventSaveSize${id}`, saveScroll);
            eventEmitter.off(`EventSetBackgroundImage${id}`, setBackgroundImage);
        }
    }

    useEffect(didUpdate);
    return (
        <Background
            ref  = {boxComponent}
            onDoubleClick={openBgInstruments}
            data-name = {targetSection}
            backgroundColor = {backgroundColor ? backgroundColor : props.background}
            backgroundImage = {backgroundImage ? backgroundImage : props.backgroundImage}
            width = {width}
            height = {height}
        >
            {props.children}
        </Background>
    )
}

export default BackgroundComponent;