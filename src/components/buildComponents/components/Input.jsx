import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter,{controllerStream} from '../../../EventEmitter';
import styled from 'styled-components';


const InputComponent = styled.input.attrs(props => {
    if (props.mode !== 'production')
    return ({
        style: {
            zIndex: props.indexZ ? '9999' : null,
            left: props.coordX ? props.coordX : '45%',
            top:  props.coordY ? props.coordY : '0%',
        }
    })
})`
    width: ${props => props.size ? props.size.w + 'px' : null};
    height: ${props => props.size ? props.size.h + 'px' : null};
    font-size: ${props => props.fontSize ? props.fontSize + 'px' : null};
    position: absolute;
    background-color: ${props => props.color || null};
    border-radius: ${props => props.borderRadius || null};
    white-space: normal;
    font-weight: bold;
`;

const ProductionStyle = styled(InputComponent)`
    left: ${props => props.coordX ? props.coordX : '45%'};
    top:  ${props => props.coordY ? props.coordY : '0%'};
`;


class Input extends React.PureComponent {

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
        sizeParentBox: this.props.sizeParentBox,
        targetSection: this.props.targetSection,
        size: this.props.size && this.props.size.w ? this.props.size : {w: '100', h:'50'},
        fontSize: this.props.fontSize || 20,
        borderRadius: this.props.borderRadius || null,
        color: this.props.color || null,
        shiftCoords: null,
        content: this.props.content || 'Input',
        posInput: this.props.coords.x ? {x: this.props.coords.x, y: this.props.coords.y} : null,
        startDragNdrop: false,
    }

    openInputInstruments = event => {

        const componentsPatternImage = {
            id: this.state.id,
            targetSection: this.state.targetSection,
            type: 'input',
            color: this.state.color,
            borderRadius: this.state.borderRadius,
            zIndex: null,
            size: {...this.state.size},
            fontSize: this.state.fontSize,
            content: this.state.content,
            coords: {...this.state.posInput}, // x, y
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
        const element = this.refInput.getBoundingClientRect();

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

    changeSize = eventSize => {
        this.setState({...this.state, size: eventSize.size});
    };

    changeColor = colorRGB => {

        if (typeof colorRGB === 'string')
            this.setState({
                ...this.state,
                color: colorRGB
            });
    };

    changeSizeText = eventSize => {
        this.setState({...this.state, fontSize: eventSize.size});
    };

    setBorderRadius = eventItem => {

        let radius = eventItem.borderRadius > 200 ? 200 : eventItem.borderRadius;
        radius = eventItem.borderDown < 0 ? 0 : eventItem.borderRadius;
            this.setState({
                ...this.state,
                borderRadius: radius
            });
    };

    changeContent = eventItem => {
        let booldContent = eventItem.content || eventItem.content === '';
        if (booldContent)
            this.setState({
                ...this.state,
                content: eventItem.content
            });
    }



    checkPivotPosition = (coordX, coordY) => {

        const element = this.refInput.getBoundingClientRect();
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
    move = (x,y) => this.setState({...this.state, posInput: {x: x, y: y}});

    moveInput = event => {

        if (this.state.startDragNdrop && this.state.istrumentsActive){

            let xItem = event.clientX - (this.props.sizeParentBox.left  * this.state.sectionNumber);
            let yItem = event.clientY - (this.props.sizeParentBox.top * this.state.sectionNumber);

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
            controllerStream.emit(`EventUpdatePosition${this.state.id}`, this.state.posInput);
        }
        event.stopPropagation();
    };

    saveSize = event => {
        const {size} = event;
        if (!this.state.getSizeBool){
        this.setState({
            ...this.state,
            getSizeBool: true,
            sectionNumber: event.sectionNumber,
            sizeParentBox: {width: size.width, height: size.height}});
        } else controllerStream.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }

    setWidth = eventItem => {
        const {width} = eventItem;
        this.setState({...this.state, 
            size: {
                ...this.state.size,
                w: width,
            }
        });
    }

    setHeight = eventItem => {
        const {height} = eventItem;
        this.setState({...this.state, 
            size: {
                ...this.state.size,
                h: height,
            }
        });
    }

    refInput = null;
    refInputComponent = node => this.refInput = node;

    render(){

        if (this.props.mode === 'dev'){
            return (
                <InputComponent
                    type = 'button'
                    value = {this.state.content}
                    ref = {this.refInputComponent}
                    size = {this.state.size}
                    color = {this.state.color}
                    borderRadius = {this.state.borderRadius}
                    fontSize = {this.state.fontSize}
                    onClick = {this.openInputInstruments}
                    onMouseDown = {this.saveCoords}
                    onMouseMove= {this.moveInput}
                    onMouseLeave = {this.stopDragNdrop}
                    onMouseUp = {this.stopDragNdrop}
                    onDragStart = {this.stop}
                    coordX = {this.state.posInput ? this.state.posInput.x : null}
                    coordY = {this.state.posInput ? this.state.posInput.y : null}
                    indexZ = {this.state.startDragNdrop}
                    data-imagecomponentwrapper
                />
            )
        } else if (this.props.mode === 'production'){

            return (
                <ProductionStyle
                    type = 'button'
                    value = {this.state.content}
                    ref = {this.refInputComponent}
                    size = {this.state.size}
                    color = {this.state.color}
                    fontSize = {this.state.fontSize}
                    borderRadius = {this.state.borderRadius}
                    coordX = {this.state.posInput ? this.state.posInput.x : null}
                    coordY = {this.state.posInput ? this.state.posInput.y : null}
                    indexZ = {this.state.startDragNdrop}
                    mode = {this.props.mode}
                />
            )
        }
    }

    componentDidMount = () => {
        controllerStream.on(`EventSaveWidth${this.state.targetSection}`, this.saveSize);
        controllerStream.on(`EventChangecolor${this.state.id}`, this.changeColor);
        controllerStream.on(`EventChangeSize${this.state.id}`, this.changeSize);
        controllerStream.on(`EventChangeSizeText${this.state.id}`, this.changeSizeText);
        controllerStream.on(`EventChangeContentText${this.state.id}`, this.changeContent);
        controllerStream.on(`EventSetWidth${this.state.id}`, this.setWidth);
        controllerStream.on(`EventSetHeight${this.state.id}`, this.setHeight);
    }

    componentWillUnmount = () => {
        controllerStream.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
        controllerStream.off(`EventChangeSize${this.state.id}`, this.changeSize);
        controllerStream.off(`EventChangeSizeText${this.state.id}`, this.changeSizeText);
        controllerStream.off(`EventChangeContentText${this.state.id}`, this.changeContent);
        controllerStream.off(`EventChangecolor${this.state.id}`, this.changeColor);
        controllerStream.off(`EventSetWidth${this.state.id}`, this.setWidth);
        controllerStream.off(`EventSetHeight${this.state.id}`, this.setHeight);
    }
}

export default Input;