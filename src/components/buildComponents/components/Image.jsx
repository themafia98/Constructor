import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter,{controllerStream} from '../../../EventEmitter';
import styled from 'styled-components';


const WrapperImg = styled.div.attrs(props => {
    if (props.mode !== 'production')
    return ({
        style: {
            zIndex: props.indexZ ? '9999' : null,
            transform: `rotateZ(${props.rotate}deg) scale(${props.scale})`,
            left: props.coordX ? props.coordX : '45%',
            top:  props.coordY ? props.coordY : '0',
            transition: `transform  0.3s linear`,
        }
    })
})`
    width: ${props => props.size ? props.size.w + '%' : '30%'};
    height: ${props => props.size ? props.size.h + '%' : '50%'};
    position: absolute;
`;

const ImageStyle = styled.img`
    width: 100%;
    height: 100%;
    opacity: ${props => props.opacity};
    border-radius: ${props => props.borderRadius}px;
    position: absolute;
`;

const ProductionStyle = styled(WrapperImg)`
    left: ${props => props.coordX ? props.coordX : '50%'};
    top:  ${props => props.coordY};
    transform: rotate(${props => props.rotate}deg) scale(${props => props.scale});
`;

class Image extends React.PureComponent {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        targetSection: PropTypes.string,
        sizeParentBox: PropTypes.object,
    }

    state = {
        id: this.props.id,
        istrumentsActive: false,
        getSizeBool: false,
        countSection: 0,
        opacity: this.props.opacity || 1,
        transformValue: this.props.rotate || 0,
        scaleValue: this.props.scale || 1,
        sectionNumber: 0,
        borderRadius: this.props.borderRadius || 0,
        sizeParentBox: this.props.sizeParentBox,
        targetSection: this.props.targetSection,
        path: this.props.image ? this.props.image : this.props.path,
        size: this.props.size ? this.props.size : {w: 30, h: 50},
        shiftCoords: null,
        posImage: this.props.coords.x ? {x: this.props.coords.x, y: this.props.coords.y} : null,
        startDragNdrop: false,
    }

    openImageInstruments = event => {
        /** open panel instruments */
        const componentsPatternImage = {
            id: this.state.id,
            targetSection: this.state.targetSection,
            size: {...this.state.size},
            type: 'image',
            rotate: this.state.transformValue,
            scale: this.state.scaleValue,
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
          /** save current coords */
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
          /** Checking the boundaries */
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

    rotateEvent = eventItem => {
         /** transform - rotate */
        const angle = eventItem.angle;
        this.setState({
            ...this.state,
            transformValue: angle,
        });
    }

    scaleEvent = eventItem => {
         /** transform - scale */
        const scale = eventItem.scale;
        this.setState({
            ...this.state,
            scaleValue: scale,
        });
    }

    move = (x,y) => this.setState({...this.state, posImage: {x: x, y: y}});

    moveText = event => {
          /** move element event */
        if (this.state.startDragNdrop && this.state.istrumentsActive){ /** if key down - false */
            const element = this.refImage.getBoundingClientRect();
            let xItem = event.clientX - (this.props.sizeParentBox.left  * this.state.sectionNumber);
            let yItem = event.clientY - (this.props.sizeParentBox.top * this.state.sectionNumber);
            let factorCoord = this.diffAngle(parseInt(this.state.transformValue),element.height,element.width);

            let coordX = xItem - this.state.shiftCoords.x + factorCoord.xFacotr;
            let coordY = yItem - 61 - this.state.shiftCoords.y + factorCoord.yFactor;

            let coords = this.checkPivotPosition(coordX,coordY);

            let convertToPercentX = coords.x * 100 / this.state.sizeParentBox.width;
            let convertToPercentY = coords.y * 100 / this.state.sizeParentBox.height;

            this.move(convertToPercentX.toFixed(2) + '%',
                      convertToPercentY.toFixed(2) + '%');
    }
        event.stopPropagation();
    };


    diffAngle = (transform, height, width) => {
          /** if user use transform rotate - coordinate recount */
        let powHeight = height**2;
        let powWidth =  width**2;

        let pythagoras = Math.sqrt(powHeight + powWidth) / 2;
        let _angle = Math.atan(height / width);
        let angle = Math.atan(width / height);

        let _biasFactor = 1;
        let biasFactor = 1;

        if (transform < 0 || transform > 180)
            _biasFactor = - 1;
        if (transform > 90 && transform < 270)
            biasFactor= -1;

        transform = transform * (Math.PI/180);

        let sinX = Math.sin(biasFactor * angle + _biasFactor * transform);
        let sinY = Math.sin(biasFactor* _angle + _biasFactor * transform);

        let xFacotr = pythagoras*(-Math.sin(angle)+sinX);
        let yFactor = pythagoras*(-Math.sin(_angle)+sinY);

        return {xFacotr, yFactor}
    };

    stopDragNdrop = event => {
        /** end move element */
        if (this.state.startDragNdrop) {
            this.setState({...this.state, startDragNdrop: false})
            controllerStream.emit(`EventUpdatePosition${this.state.id}`, this.state.posImage);
        }
        event.stopPropagation();
    };

    setCurrentImage = event => {
        /** set content */
        const {urlFull} = event;
        this.setState({...this.state, path: urlFull});
    };

    setWidth = eventItem => {
        /** set size w */
        const {width} = eventItem;
        this.setState({...this.state, 
            size: {
                ...this.state.size,
                w: width,
            }
        });
    }

    setHeight = eventItem => {
          /** set size h */
        const {height} = eventItem;
        this.setState({...this.state, 
            size: {
                ...this.state.size,
                h: height,
            }
        });
    }

    saveSize = event => {
         /** save sizes  */
        const {size} = event;
        if (!this.state.getSizeBool){
        this.setState({
            ...this.state,
            getSizeBool: true,
            countSection: event.countSection,
            sectionNumber: event.sectionNumber,
            sizeParentBox: {width: size.width, height: size.height}});
        } else controllerStream.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }

    setBorderRadius = eventItem => {
        //** saet border-radius */
        let radius = eventItem.borderRadius > 200 ? 200 : eventItem.borderRadius;
        radius = eventItem.borderDown < 0 ? 0 : eventItem.borderRadius;
        this.setState({
            ...this.state,
            borderRadius: radius
        });
    };

    setOpacity = eventItem => {
        //** saet opacity */
        let opacity = eventItem.opacity > 1 ? 1 : eventItem.opacity;
        opacity = eventItem.opacity < 0 ? 0 : eventItem.opacity;
            this.setState({
                ...this.state,
                opacity: opacity
            });
    }

    stopDrag = event => {
        event.preventDefault();
    }
 
    refImage = null;
    refImageComponent = node => this.refImage = node;

    render(){

        if (this.props.mode === 'dev'){
            return (
                <WrapperImg
                ref = {this.refImageComponent}
                size = {this.state.size}
                rotate = {this.state.transformValue}
                scale = {this.state.scaleValue}
                onClick = {this.openImageInstruments}
                onMouseDown = {this.saveCoords}
                onMouseMove= {this.moveText}
                onMouseLeave = {this.stopDragNdrop}
                onMouseUp = {this.stopDragNdrop}
                onDragStart = {this.stopDrag}
                coordX = {this.state.posImage ? this.state.posImage.x : null}
                coordY = {this.state.posImage ? this.state.posImage.y : null}
                indexZ = {this.state.startDragNdrop}
                data-imagecomponentwrapper
                >
                    <ImageStyle
                        data-imagecomponent
                        borderRadius = {this.state.borderRadius}
                        onDragStart = {this.stopDrag}
                        opacity = {this.state.opacity}
                        src = {this.state.path}
                        alt = 'img'
                    />
                </WrapperImg>
            )
        } else if (this.props.mode === 'production'){
            return (
                <ProductionStyle
                ref = {this.refImageComponent}
                size = {this.state.size}
                rotate = {this.state.transformValue}
                scale = {this.state.scaleValue}
                mode = {this.props.mode}
                coordX = {this.state.posImage ? this.state.posImage.x : null}
                coordY = {this.state.posImage ? this.state.posImage.y : null}
                indexZ = {this.state.startDragNdrop}
                >
                    <ImageStyle
                        borderRadius = {this.state.borderRadius}
                        opacity = {this.state.opacity}
                        crossOrigin = "anonymous"
                        src = {this.state.path}
                        alt = 'img'
                    />
                </ProductionStyle>
            )
        }
    }

    componentDidMount = () => {
        controllerStream.on(`EventSetCurrentImage${this.state.id}`, this.setCurrentImage);
        controllerStream.on(`EventSetOpacity${this.state.id}`, this.setOpacity);
        controllerStream.on(`EventSetBorderRadius${this.state.id}`,this.setBorderRadius);
        controllerStream.on(`EventSetWidth${this.state.id}`, this.setWidth);
        controllerStream.on(`EventSetHeight${this.state.id}`, this.setHeight); 
        controllerStream.on(`EventResize${this.state.id}`,this.rotateEvent);
        controllerStream.on(`EventScale${this.state.id}`,this.scaleEvent);
        controllerStream.on(`EventSaveWidth${this.state.targetSection}`, this.saveSize);
    }

    componentWillUnmount = () => {

        controllerStream.off(`EventSetOpacity${this.state.id}`, this.setOpacity);
        controllerStream.off(`EventSetBorderRadius${this.state.id}`,this.setBorderRadius);
        controllerStream.off(`EventSetCurrentImage${this.state.id}`, this.setCurrentImage);
        controllerStream.off(`EventSetWidth${this.state.id}`, this.setWidth);
        controllerStream.off(`EventSetHeight${this.state.id}`, this.setHeight); 
        controllerStream.off(`EventResize${this.state.id}`,this.rotateEvent);
        controllerStream.off(`EventScale${this.state.id}`,this.scaleEvent);
        controllerStream.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }
}

export default Image;