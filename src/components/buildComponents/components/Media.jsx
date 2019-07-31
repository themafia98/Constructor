import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Media = styled.iframe.attrs(props => ({
    style: {
        zIndex: props.indexZ ? '9999' : null,
        left: props.coordX ? props.coordX : '45%',
        top:  props.coordY ? props.coordY : '0',
        padding: '40px'
}}))`
    width: 30%;
    height: 50%;
    background-color: ${props => !props.drawContent ? 'green' : null};
    position: absolute;
    border: 1px solid red;
`;

class MediaComponent extends React.PureComponent {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        targetSection: PropTypes.string.isRequired,
        sizeParentBox: PropTypes.object.isRequired,
        content: PropTypes.string,
        children: PropTypes.object,
    }

    state = {
        targetSection: this.props.targetSection,
        id : this.props.id,
        sizeParentBox: this.props.sizeParentBox,
        content: this.props.path || this.props.content,
        shiftCoords: null,
        size: this.props.size ? this.props.size : 30,
        posMedia: this.props.coords.x ? {x: this.props.coords.x, y: this.props.coords.y} : null,
        startDragNdrop: false,
        istrumentsActive: false,
        drawContent: false,
    }

    openMediaInstruments = event => {

        const componentsPatternMedia = {
            id: this.state.id,
            targetSection: this.state.targetSection,
            type: 'media',
            zIndex: null,
            image: this.state.path,
            coords: {...this.state.posImage}, // x, y
        }

        eventEmitter.emit('EventInstrumentPanel',{
            componentStats: componentsPatternMedia,
            targetSection: this.state.targetSection,
            id: this.state.id,
            sizeTextValue: this.state.size
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
            shiftCoords: {x: event.pageX - cords.left, y: event.pageY - cords.top},
            startDragNdrop: !this.state.startDragNdrop ? true : false
        });

        event.stopPropagation();
    };

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
    move = (x,y) => this.setState({...this.state, posImage: {x: x, y: y}});

    moveMedia = event => {

        if (this.state.startDragNdrop && this.state.istrumentsActive){

            let coordX = event.pageX - this.props.sizeParentBox.left - this.state.shiftCoords.x + this.delta().x;
            let coordY = event.pageY - this.props.sizeParentBox.top - this.state.shiftCoords.y + this.delta().y;

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
            eventEmitter.emit(`EventUpdatePosition${this.state.id}`, this.state.posMedia);
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
            eventEmitter.emit('EventUpdateSizeText', counter);
        }

        if (event.shiftKey && event.deltaY === 100) {
            let counter = this.state.size - 1;
             counter = counter <= 0 ? 0 : counter;
             this.setState({...this.state,size: counter});
             eventEmitter.emit('EventUpdateSizeText', counter);
            }
        event.stopPropagation();
    };
    saveSize = event => {
        if (!this.state.getSizeBool)
        this.setState({
            ...this.state, getSizeBool: true,
            sizeParentBox: {width: event.width, height: event.height}
        });
    };

    refMedia = null;
    refMediaComponent = node => this.refMedia = node;

    render(){
        let link = "https://www.youtube.com/embed/B0b59jgudto";
        console.log(link);
        return (
            <Media
                ref = {this.refMediaComponent}
                onClick={this.openMediaInstruments}
                onMouseDown = {this.saveCoords}
                onMouseMove= {this.moveMedia}
                onMouseLeave = {this.stopDragNdrop}
                onMouseUp = {this.stopDragNdrop}
                onDragStart = {this.stop}
                onWheel = {this.weelResizeText}
                coordX = {this.state.posMedia ? this.state.posMedia.x : null}
                coordY = {this.state.posMedia ? this.state.posMedia.y : null}
                width = {this.state.width} 
                height = {this.state.height}
                src= {this.state.drawContent ? link : null }
                drawContent = {this.state.drawContent}
                allowfullscreen
            >
                {this.state.drawContent ? this.props.children : null}
            </Media>
        )
    }
}


// <iframe width="560" height="315" 
// src="https://www.youtube.com/embed/7KoHDwvSOwc" 
// frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
// allowfullscreen>
// </iframe>

export default MediaComponent;