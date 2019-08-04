import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';


const Background = styled.div`
    position: relative;
    width: ${props => props.width || '100%'};
    height: ${props => props.height || '100%'};
    background-size: cover;
    background-color: ${props => props.backgroundColor};
    ${props => props.backgroundImage ? `background-image: url(${props.backgroundImage});` : null}
`;

class BackgroundComponent extends React.PureComponent {

    static propTypes = {
        id: PropTypes.string.isRequired,
        targetSection: PropTypes.string.isRequired,
        background: PropTypes.string,
        backgroundImage: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
        sectionNumber: PropTypes.number,
        mode: PropTypes.string.isRequired
    };

    state = {
        id: this.props.id,
        targetSection: this.props.targetSection,
        backgroundColor: this.props.background || this.props.color,
        backgroundImage: this.props.backgroundImage,
        width: this.props.width,
        height: this.props.height
    };

    boxComponent = null; // ref
    boxComponentRef = node => this.boxComponent = node;

    saveDataParent = () => {
        let boxInform =  this.boxComponent.getBoundingClientRect();
        eventEmitter.emit(`EventSaveWidth${this.state.targetSection}`,{
            sectionNumber: this.props.sectionNumber,
            size: {width: boxInform.width, height: boxInform.height}
        });
    };

    openBgInstruments = event => {

        const componentsPatternBackground = {
            id: this.state.id,
            targetSection: this.state.targetSection,
            type: 'background',
            backgroundColor: this.state.backgroundColor,
            backgroundImage: this.state.backgroundImage,
        }
        eventEmitter.emit('EventInstrumentPanel',{
            componentStats: componentsPatternBackground,
            targetSection: this.state.targetSection,
            type: 'background',
            id: this.state.id,
        });
        event.stopPropagation();
    };

    changeColor = eventItem => {
        this.setState({
            ...this.state,
            backgroundColor: eventItem.colorRGB
        });
    };

    setBackgroundImage = event => {
        const {urlFull} = event;
        this.setState({
            ...this.state,
            backgroundImage: urlFull,
        });
    };

    render(){
            if (this.props.mode === 'dev'){
        return (
            <Background
                ref  = {this.boxComponentRef}
                onDoubleClick={this.openBgInstruments}
                data-name = {this.state.targetSection}
                backgroundColor = {this.state.backgroundColor}
                backgroundImage = {this.state.backgroundImage}
                width = {this.state.width}
                height = {this.state.height}
            >
                {this.props.children}
            </Background>
        )
    } else if (this.props.mode === 'production'){

        return (
            <Background
            ref  = {this.boxComponentRef}
                data-name = {this.state.targetSection}
                backgroundColor = {this.state.backgroundColor}
                backgroundImage = {this.state.backgroundImage}
                width = {this.state.width}
                height = {this.state.height}
            >
            {this.props.children}
            </Background>
        )
    }

    }

    componentDidUpdate = () => {
        this.saveDataParent();
    }

    componentDidMount = () => {
        this.saveDataParent();
        eventEmitter.on(`EventChangeColorBackground${this.state.id}`, this.changeColor);
        eventEmitter.on(`EventSetBackgroundImage${this.state.id}`, this.setBackgroundImage);
    };

    componentWillUnmount = () => {
        eventEmitter.off(`EventChangeColorBackground${this.state.id}`, this.changeColor);
        eventEmitter.off(`EventSetBackgroundImage${this.state.id}`, this.setBackgroundImage);
    };
};



export default BackgroundComponent;