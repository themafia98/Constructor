import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Media = styled.iframe`
    transform: translate(-50%,-50%);
    width: 30%;
    height: 50%;
    left: 50%;
    top: 50%;
    position: absolute;
    z-index: 10;
    border: 1px solid red;
    background: grey;
    padding: 25px;
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
        dragNdrop: this.props.coords.x ? {x: this.props.coords.x, y: this.props.coords.y} : null

    }

    openMediaInstruments = event => {

        eventEmitter.emit('EventInstrumentPanel',{target: 'media'});
        event.stopPropagation();
    }

    render(){
        return (
            <Media
                onClick={this.openMediaInstruments}
                width = {this.state.width} 
                height = {this.state.height}
                src="https://www.youtube.com/embed/B0b59jgudto"
                allowfullscreen
            >
                {this.props.children}
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