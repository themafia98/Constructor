import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const WrapperImg = styled.div.attrs(props => ({
    style: {
        zIndex: props.indexZ ? '9999' : null,
        left: props.coordX ? props.coordX : '45%',
        top:  props.coordY ? props.coordY : '0%',
}}))`
    width: ${props => props.size ? props.size + '%' : '30%'};
    height: ${props => props.size ? props.size + '%' : '50%'};
    position: absolute;
`;

const ImageStyle = styled.img`
    width: 100%;
    height: 100%;
    opacity: ${props => props.opacity};
    border-radius: ${props => props.borderRadius}px;
    pointer-events: none;
    position: absolute;
`;

class Image extends React.PureComponent {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        targetSection: PropTypes.string.isRequired,
        sizeParentBox: PropTypes.object.isRequired,
    }

    state = {
        id: this.props.id,
        istrumentsActive: false,
        getSizeBool: false,
        opacity: this.props.opacity || 1,
        borderRadius: this.props.borderRadius || 0,
        sizeParentBox: this.props.sizeParentBox,
        targetSection: this.props.targetSection,
        path: this.props.path,
        size: this.props.size ? this.props.size : 30,
        shiftCoords: null,
        posImage: this.props.coords.x ? {x: this.props.coords.x, y: this.props.coords.y} : null,
        startDragNdrop: false,
    }

    openImageInstruments = event => {

        const componentsPatternImage = {
            id: this.state.id,
            targetSection: this.state.targetSection,
            type: 'image',
            borderRadius: this.state.borderRadius,
            opacity: this.state.opacity,
            zIndex: null,
            image: this.state.path,
            coords: {...this.state.posImage}, // x, y
        }

        eventEmitter.emit(`EventInstrumentPanel`,{
            componentStats: componentsPatternImage,
            targetSection: this.state.targetSection,
            id: this.state.id,
            sizeTextValue: this.state.size
        });
        this.setState({...this.state, istrumentsActive: true});
        event.stopPropagation();
    };

    saveCoords = event => {
        if (event.nativeEvent.which !== 1) return false;
        const element = this.refImage.getBoundingClientRect();

        const cords = {
            left: element.left,
            top: element.top,
            width: element.right - element.left,
            height: element.bottom - element.top
        }

        this.setState({
            ...this.state,
            shiftCoords: {x: event.clientX - cords.left, y: event.clientY - cords.top},
            startDragNdrop: !this.state.startDragNdrop ? true : false
        });

        event.stopPropagation();
    };

    checkPivotPosition = (coordX, coordY) => {

        const element = this.refImage.getBoundingClientRect();
        const borderTopLeft = 0;
        const borderDown = 800 - element.height;
        const borderRight = this.props.sizeParentBox.width - element.width;

        if (coordY < borderTopLeft) coordY = borderTopLeft;
        if (coordY > borderDown) coordY = borderDown;
        if (coordX < borderTopLeft) coordX = borderTopLeft;
        if (coordX > borderRight) coordX = borderRight;

        return {x: coordX, y: coordY};
    }

    delta = (trans,transT) => {
        return {
            x: 0,
            y: 0,
        }
    }
    move = (x,y) => this.setState({...this.state, posImage: {x: x, y: y}});

    moveText = event => {

        if (this.state.startDragNdrop && this.state.istrumentsActive){

            let xItem = event.clientX - this.props.sizeParentBox.left;
            let yItem = event.clientY - this.props.sizeParentBox.top;

            let coordX = xItem - this.state.shiftCoords.x + this.delta().x;
            let coordY = yItem - this.state.shiftCoords.y + this.delta().y;

            let coords = this.checkPivotPosition(coordX,coordY);

            let convertToPercentX = coords.x * 100 / this.state.sizeParentBox.width;
            let convertToPercentY = coords.y * 100 / this.state.sizeParentBox.height;

            this.move(convertToPercentX.toFixed(2) + '%',
                      convertToPercentY.toFixed(2) + '%');
    }
        event.stopPropagation();
    };

    stopDragNdrop = event => {
        if (this.state.startDragNdrop) {
            this.setState({...this.state, startDragNdrop: false})
            eventEmitter.emit(`EventUpdatePosition${this.state.id}`, this.state.posImage);
        }
        event.stopPropagation();
    };

    setCurrentImage = event => {
        const {urlFull} = event;
        this.setState({...this.state, path: urlFull});
    };

    weelResizeText = event => {

        if (event.shiftKey && event.deltaY === -100) {
            let counter = this.state.size + 1;
            counter = counter > 100 ? 100 : counter;
            this.setState({...this.state,size: counter});
            eventEmitter.emit(`EventupdateSize${this.state.id}`, counter);
        }

        if (event.shiftKey && event.deltaY === 100) {
            let counter = this.state.size - 1;
             counter = counter <= 0 ? 0 : counter;
             this.setState({...this.state,size: counter});
             eventEmitter.emit(`EventupdateSize${this.state.id}`, counter);
            }
        event.stopPropagation();
    };

    saveSize = event => {
        if (!this.state.getSizeBool){
            const {size} = event;
        this.setState({
            ...this.state, getSizeBool: true,
            sizeParentBox: {width: size.width, height: size.height}
        });
    } else eventEmitter.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    };

    changeSizeImage = eventItem => {
        console.log(eventItem);
        this.setState({...this.state, size: eventItem.size});
    };

    setBorderRadius = eventItem => {

    let radius = eventItem.borderRadius > 200 ? 200 : eventItem.borderRadius;
    radius = eventItem.borderDown < 0 ? 0 : eventItem.borderRadius;
        this.setState({
            ...this.state,
            borderRadius: radius
        });
    };

    setOpacity = eventItem => {
        let opacity = eventItem.opacity > 1 ? 1 : eventItem.opacity;
        opacity = eventItem.opacity < 0 ? 0 : eventItem.opacity;
            this.setState({
                ...this.state,
                opacity: opacity
            });
    }
 
    refImage = null;
    refImageComponent = node => this.refImage = node;

    render(){
        console.log(this.state);
            return (
                <WrapperImg
                ref = {this.refImageComponent}
                size = {this.state.size}
                onClick = {this.openImageInstruments}
                onMouseDown = {this.saveCoords}
                onMouseMove= {this.moveText}
                onMouseLeave = {this.stopDragNdrop}
                onMouseUp = {this.stopDragNdrop}
                onDragStart = {this.stop}
                onWheel = {this.weelResizeText}
                coordX = {this.state.posImage ? this.state.posImage.x : null}
                coordY = {this.state.posImage ? this.state.posImage.y : null}
                indexZ = {this.state.startDragNdrop}
                data-imagecomponentwrapper
                >
                    <ImageStyle
                        data-imagecomponent
                        borderRadius = {this.state.borderRadius}
                        opacity = {this.state.opacity}
                        src = {this.state.path}
                        alt = 'img'
                    />
                </WrapperImg>
            )
    }

    componentDidMount = () => {
        eventEmitter.on(`EventSetCurrentImage${this.state.id}`, this.setCurrentImage);
        eventEmitter.on(`EventChangeSize${this.state.id}`, this.changeSizeImage);
        eventEmitter.on(`EventSetOpacity${this.state.id}`, this.setOpacity);
        eventEmitter.on(`EventSetBorderRadius${this.state.id}`,this.setBorderRadius);
        eventEmitter.on(`EventSaveWidth${this.state.targetSection}`, this.saveSize);
    }

    componentWillUnmount = () => {
        eventEmitter.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
        eventEmitter.off(`EventChangeSize${this.state.id}`, this.changeSizeImage);
        eventEmitter.off(`EventSetOpacity${this.state.id}`, this.setOpacity);
        eventEmitter.off(`EventSetBorderRadius${this.state.id}`,this.setBorderRadius);
        eventEmitter.off(`EventSetCurrentImage${this.state.id}`, this.setCurrentImage);
    }
}

export default Image;