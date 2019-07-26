import React,{useState,useEffect} from 'react';
import eventEmitter from '../../../EventEmitter';
import isFetch from 'isomorphic-fetch';
import styled from 'styled-components';

const ImageStyle = styled.img.attrs(props => ({
    style: {
        // display: props.shadowDisplay ? 'none' : 'block',
        left: props.coordX ? props.coordX : '30%',
        top:  props.coordY,
}}))`
    position: absolute;
    width: ${props => props.size}%;
    transform: translate(-50%,50%);
`;

const Image = props => {


    console.log(props);

    const [id] = useState(props.id);
    const [path] = useState(props.path);
    const [size,setSize] = useState(props.size ? props.size : 30);
    const [name] = useState(props.target);

    let [count,setCount] = useState(0);
    const [sizeParenBox, setSizeParenBox] = useState({...props.sizeParenBox});
    const [shiftCoords, setShiftCoords] = useState(null)
    const [dragNdrop, setDragNdrop] = useState(props.coords.left ? {x: props.coords.left, y: props.coords.top} : null);



    const openImageInstruments = event => {

        eventEmitter.emit(`EventInstrumentPanel`,{
            target: 'image',
            id: id,
            sizeTextValue: size
        });
        event.stopPropagation();
    }

    const saveCoords = event => {

        let rect = event.target.getBoundingClientRect();
        let left = rect.left + window.pageXOffset;
        let top = rect.top;
        let width = rect.width;
        let height = rect.height;

        setShiftCoords({x: event.pageX - left - width/2, y: event.pageY - top + height/2});

        event.stopPropagation();
    }

    const moveText = event => {

        let coordX = event.pageX - shiftCoords.x;
        let coordY = event.pageY - shiftCoords.y;


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
        setSizeParenBox({width: event.width, height: event.height});
        setCount(count + 1);
        } else  eventEmitter.off(`EventSaveWidth`,saveSize);
    }

    const didUpdate = effect => {
        eventEmitter.on(`EventSaveWidth${name}`,saveSize);
        return () => {
            eventEmitter.off(`EventSaveWidth${name}`,saveSize);
        }
    }
    // console.log('asdsa');
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
        />
    )
};

export default Image;