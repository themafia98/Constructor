import React,{useState,useEffect} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';

const ImageStyle = styled.img.attrs(props => ({
    style: {
        display: props.shadowDisplay ? 'none' : 'block',
        left: props.coordX ? props.coordX : '45%',
        top:  props.coordY ? props.coordY : '0',
}}))`
    position: absolute;
    width: ${props => props.size}%;
    transform: translate(-50%,50%);
`;

const Image = props => {

    const [id] = useState(props.id);
    const [path] = useState(props.path);
    const [size,setSize] = useState(props.size ? props.size : 30);
    const [targetSection] = useState(props.targetSection);


    let [count,setCount] = useState(0);
    const [sizeParentBox, setsizeParentBox] = useState({...props.sizeParentBox});
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(props.coords.x ? {x: props.coords.x, y: props.coords.y} : null);


console.log('image');
    const openImageInstruments = event => {

        const componentsPatternImage = {
            id: id,
            targetSection: targetSection,
            type: 'image',
            borderRadius: null,
            opacity: 1,
            zIndex: null,
            image: path,
            coords: {...dragNdrop}, // x, y
        }

        eventEmitter.emit(`EventInstrumentPanel`,{
            componentStats: componentsPatternImage,
            targetSection: targetSection,
            id: id,
            sizeTextValue: size
        });
        event.stopPropagation();
    }

    const saveCoords = event => {

        let rect = event.target.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        let width = rect.width;
        let height = rect.height;

        setShiftCoords({x: event.pageX - left - width/2, y: event.pageY - top + height/2});

        event.stopPropagation();
    }

    const moveText = event => {

        let coordX = event.pageX - shiftCoords.x;
        let coordY = event.pageY - shiftCoords.y;
        console.log(coordX);

        let convertToPercentX = ((coordX) * 100) / sizeParentBox.width;
        let convertToPercentY = ((coordY) * 100) / (sizeParentBox.height);

        const position = {
            x: convertToPercentX.toFixed(1) + '%', 
            y: convertToPercentY.toFixed(1) + '%', 
            shadowDisplay: event.type === 'drag' ? true : false,
            type: 'image'
        };
        setDragNdrop(position);
        if (event.type === 'dragend') {
            eventEmitter.emit('EventUpdatePosition', position);
        }
        event.stopPropagation();
    }

    
    const weelResizeText = event => {

        if (event.shiftKey && event.deltaY === -100) {
            let counter = size + 1;
            counter = counter > 100 ? 100 : counter;
            setSize(counter);
            eventEmitter.emit('EventUpdateSizeText', counter);
        }

        if (event.shiftKey && event.deltaY === 100) {
            let counter = size - 1;
             counter = counter <= 0 ? 0 : counter;
             setSize(counter);
             eventEmitter.emit('EventUpdateSizeText', counter);
            }
        event.stopPropagation();
    }

    const saveSize = event => {

        if (count === 0){
        setsizeParentBox({width: event.width, height: event.height});
        setCount(count + 1);
        } else  eventEmitter.off(`EventSaveWidth`,saveSize);
    }

    const didUpdate = effect => {
        eventEmitter.on(`EventSaveWidth${targetSection}`,saveSize);
        return () => {
            eventEmitter.off(`EventSaveWidth${targetSection}`,saveSize);
        }
    }

    // const searchTest = e => {

    //     const api = 'https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=';

    //     isFetch(`${api}${process.env.REACT_APP_CHANNEL_ID}&maxResults=20&key=${process.env.REACT_APP_YOUTUBE_SEARCH_TOKEN}`)
    //     .then(res => {
    //         if (res.ok)
    //         return res.json();
    //         else throw new Error (`Error ${res.status}`);
    //     })
    //     .then(res => {
    //         console.log(res);
    //     })
    //     .catch(error => console.error(error));
    // }

    useEffect(didUpdate);
    return (
        <ImageStyle  
            size = {size}
            src = {process.env.PUBLIC_URL + path}
            alt = 'img' 
            onClick = {openImageInstruments}
            draggable = {true}
            onMouseDown = {saveCoords}
            onDragStart = {openImageInstruments}
            onDrag   = {moveText}
            onDragEnd = {moveText}
            coordX = {dragNdrop ? dragNdrop.x : null}
            coordY = {dragNdrop ? dragNdrop.y : null}
            onWheel = {weelResizeText}
            shadowDisplay = {dragNdrop ? dragNdrop.shadowDisplay : false}
        />
    )
};

export default Image;