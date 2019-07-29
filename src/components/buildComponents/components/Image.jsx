import React,{useState,useEffect} from 'react';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const WrapperImg = styled.div.attrs(props => ({
    style: {
        zIndex: props.indexZ ? '9999' : null,
        left: props.coordX ? props.coordX : '45%',
        top:  props.coordY ? props.coordY : '0',
}}))`
    width: 30%;
    height: 50%;
    position: absolute;
`;

const ImageStyle = styled.img`
    width: 100%;
    height: 100%;
    position: absolute;
`;

const Image = props => {

    const [id] = useState(props.id);

    const [sizeParentBox, setsizeParentBox] = useState({...props.sizeParentBox});

    const [targetSection] = useState(props.targetSection);
    let [count,setCount] = useState(0);

    const [path, setImage] = useState(props.path);
    const [size,setSize] = useState(props.size ? props.size : 30);

    const [shiftCoords, setShiftCoords] = useState(null);

    const [posImage, setPosImage] = useState(props.coords.x ? {x: props.coords.x, y: props.coords.y} : null);
    const [startDragNdrop,setStartDragNdrop] = useState(false);

    const openImageInstruments = event => {

        const componentsPatternImage = {
            id: id,
            targetSection: targetSection,
            type: 'image',
            borderRadius: null,
            opacity: 1,
            zIndex: null,
            image: path,
            coords: {...posImage}, // x, y
        }

        eventEmitter.emit(`EventInstrumentPanel`,{
            componentStats: componentsPatternImage,
            targetSection: targetSection,
            id: id,
            sizeTextValue: size
        });
        event.stopPropagation();
    };

    const getPos = (element) => {
        return {
            left: element.left,
            top: element.top,
            width: element.right - element.left,
            height: element.bottom - element.top
        }
    }

    const saveCoords = event => {

        const cords = getPos(event.target.getBoundingClientRect());

        setShiftCoords({x: event.nativeEvent.pageX - cords.left, y: event.nativeEvent.pageY - cords.top});
        if (!startDragNdrop) setStartDragNdrop(true);

        event.stopPropagation();
    };

    const moveText = event => {

        if (startDragNdrop){

            let coordX = event.pageX - shiftCoords.x;
            let coordY = event.pageY - shiftCoords.y;

            let convertToPercentX = ((coordX) * 100) / sizeParentBox.width;
            let convertToPercentY = ((coordY) * 100) / (sizeParentBox.height);

            const position = {
                x: convertToPercentX.toFixed(2) + '%',
                y: convertToPercentY.toFixed(2) + '%',
            };
            setPosImage(position);
    }
        event.stopPropagation();
    };

    const stopDragNdrop = event => {
        if (startDragNdrop) {
            setStartDragNdrop(false);
            eventEmitter.emit(`EventUpdatePosition${id}`, posImage);
        }
        event.stopPropagation();
    };


    const setCurrentImage = event => {
        const {urlFull} = event;
        setImage(urlFull);
    };

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
    };
    const saveSize = event => {

        if (count === 0){
        setsizeParentBox({width: event.width, height: event.height});
        setCount(count + 1);
        } else  eventEmitter.off(`EventSaveWidth`,saveSize);
    };
    const didUpdate = effect => {
        eventEmitter.on(`EventSetCurrentImage${id}`, setCurrentImage);
        eventEmitter.on(`EventSaveWidth${targetSection}`,saveSize);
        return () => {
            eventEmitter.off(`EventSaveWidth${targetSection}`,saveSize);
            eventEmitter.off(`EventSetCurrentImage${id}`, setCurrentImage);
        }
    };


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

    const stop = () => false;

    useEffect(didUpdate);

    return (
        <WrapperImg
        size = {size}
        onClick = {openImageInstruments}
        onMouseDown = {saveCoords}
        onMouseMove= {moveText}
        onMouseLeave = {stopDragNdrop}
        onMouseUp = {stopDragNdrop}
        onDragStart = {stop}
        onWheel = {weelResizeText}
        coordX = {posImage ? posImage.x : null}
        coordY = {posImage ? posImage.y : null}
        indexZ = {startDragNdrop}
        data-imagecomponentwrapper
        >
            <ImageStyle data-imagecomponent src = {path}  alt = 'img' />
        </WrapperImg>
    )
};

export default Image;