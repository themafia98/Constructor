import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter,{controllerStream} from '../../../EventEmitter';
import styled from 'styled-components';

const WrapperMedia = styled.div.attrs(props => {
    if (props.mode !== 'production')
    return ({
        style: {
            zIndex: props.indexZ ? '9999' : null,
            left: props.coordX ? props.coordX : '45%',
            top:  props.coordY ? props.coordY : '0%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: props.mode === 'dev' ? '40px' : null
        }
    })
})`
    width: ${props => props.size.w ? props.size.w + '%' : '30%'};
    height: ${props => props.size.h ? props.size.h + '%' : '50%'};
    position: absolute;
    background: ${props => props.mode === 'dev' ? `url(${process.env.PUBLIC_URL}/img/media.svg)` : null};
    background-size: cover;
    border: ${props => props.mode === 'dev' ? `1px solid red` : null};
    padding: 10px;
`;
const Media = styled.iframe`
    width: 100%;
    height: 100%;
    z-index: ${props => props.zIndex ? '0' : '-1'};
`;

const ProductionStyle = styled(WrapperMedia)`
    left: ${props => props.coordX ? props.coordX : '45%'};
    top:  ${props => props.coordY ? props.coordY : '0%'};
`;

class MediaComponent extends React.PureComponent {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        targetSection: PropTypes.string.isRequired,
        sizeParentBox: PropTypes.object,
        content: PropTypes.string,
    }

    state = {
        targetSection: this.props.targetSection,
        id : this.props.id,
        sizeParentBox: this.props.sizeParentBox,
        shiftCoords: null,
        countSection: 0,
        size: this.props.size ? this.props.size : {w: null, h: null},
        posMedia: this.props.coords.x ? {x: this.props.coords.x, y: this.props.coords.y} : null,
        startDragNdrop: false,
        istrumentsActive: false,
        drawContent: false,
        sectionNumber: this.props.sectionNumber,
        content: this.props.content ? this.props.content : null
    }

    openMediaInstruments = event => {

        const componentsPatternMedia = {
            id: this.state.id,
            size: this.state.size,
            targetSection: this.state.targetSection,
            type: 'media',
            zIndex: null,
            content: this.state.content,
            coords: {...this.state.posMedia}, // x, y
        }

        eventEmitter.emit('EventInstrumentPanel',{
            componentStats: componentsPatternMedia,
            targetSection: this.state.targetSection,
            id: this.state.id,
            size: this.state.size,
        });
        this.setState({...this.state, istrumentsActive: true});
        event.stopPropagation();
    }

    saveCoords = event => {
        if (event.nativeEvent.which !== 1) return false;
        const element = this.refMedia.getBoundingClientRect();
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

    checkPivotPosition = (coordX, coordY) => {

        const element = this.refMedia.getBoundingClientRect();
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
    move = (x,y) => this.setState({...this.state, posMedia: {x: x, y: y}});

    moveMedia = event => {

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
            controllerStream.emit(`EventUpdatePosition${this.state.id}`, this.state.posMedia);
        }
        event.stopPropagation();
    };

    setContent = event => {
        const {iframe} = event;
        this.setState({...this.state, content: iframe});
    };


    saveSize = event => {
        const {size} = event;
        if (!this.state.getSizeBool){
        this.setState({
            ...this.state,
            getSizeBool: true,
            countSection: event.countSection,
            sectionNumber: event.sectionNumber + 1,
            sizeParentBox: {width: size.width, height: size.height}});
        } else controllerStream.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }

    refMedia = null;
    refMediaComponent = node => this.refMedia = node;

    render(){
        const url = 'https://www.youtube.com/embed/';

        if (this.props.mode === 'dev'){
            return (
                <WrapperMedia
                    ref = {this.refMediaComponent}
                    onClick={this.openMediaInstruments}
                    onMouseDown = {this.saveCoords}
                    onMouseMove= {this.moveMedia}
                    onMouseLeave = {this.stopDragNdrop}
                    onMouseUp = {this.stopDragNdrop}
                    onDragStart = {this.stop}
                    mode = {this.props.mode}
                    indexZ = {this.state.startDragNdrop}
                    coordX = {this.state.posMedia ? this.state.posMedia.x : null}
                    coordY = {this.state.posMedia ? this.state.posMedia.y : null}
                    size = {this.state.size}
                >
                {!this.state.startDragNdrop ? 
                    <Media
                        src= {this.state.content ? url + this.state.content : null }
                        drawContent = {this.state.drawContent}
                        width = {this.state.width} 
                        height = {this.state.height}
                        zIndex = {this.state.content}
                        allowfullscreen
                    ></Media> : null
                }
                </WrapperMedia>
            )
        } else if (this.props.mode === 'production'){
            return (
                <ProductionStyle
                    ref = {this.refMediaComponent}
                    indexZ = {this.state.startDragNdrop}
                    size = {this.state.size}
                    coordX = {this.state.posMedia ? this.state.posMedia.x : null}
                    coordY = {this.state.posMedia ? this.state.posMedia.y : null}
                    mode = {this.props.mode}
                >
                {!this.state.startDragNdrop ? 
                    <Media
                        src= {this.state.content ? url + this.state.content : null }
                        drawContent = {this.state.drawContent}
                        width = {this.state.width} 
                        height = {this.state.height}
                        zIndex = {this.state.content}
                        mode = {this.props.mode}
                        allowfullscreen
                    ></Media> : null
                }
                </ProductionStyle>
            )
        }
    }

    componentDidMount = () => {
        controllerStream.on(`EventSetContentMedia${this.state.id}`, this.setContent);
        controllerStream.on(`EventSaveWidth${this.state.targetSection}`, this.saveSize);
        controllerStream.on(`EventSetWidth${this.state.id}`, this.setWidth);
        controllerStream.on(`EventSetHeight${this.state.id}`, this.setHeight); 
    }

    componentWillUnmount = () => {
        controllerStream.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
        controllerStream.off(`EventSetContentMedia${this.state.id}`, this.setContent);
        controllerStream.off(`EventSetWidth${this.state.id}`, this.setWidth);
        controllerStream.off(`EventSetHeight${this.state.id}`, this.setHeight); 
    }
}

export default MediaComponent;