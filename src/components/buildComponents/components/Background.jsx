import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter,{controllerStream} from '../../../EventEmitter';
import styled from 'styled-components';


const Background = styled.div`
    position: relative;
    width: ${props => props.width || '100%'};
    height: ${props => props.height || '100%'};
    background-color: ${props => props.backgroundColor};
    ${props => props.backgroundImage ? `background-image: url(${props.backgroundImage});` : null}
    background-size: cover;
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
        /** "memorize" paren sizes  */
        let boxInform =  this.boxComponent.getBoundingClientRect();
        controllerStream.emit(`EventSaveWidth${this.state.targetSection}`,{
            countSection: this.props.countSection,
            sectionNumber: this.props.sectionNumber,
            size: {width: boxInform.width, height: boxInform.height}
        });
    };

    openBgInstruments = event => {
        /** open panel instrument trigger */
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
         /** change bg color */
        this.setState({
            ...this.state,
            backgroundColor: eventItem.colorRGB
        });
    };

    setBackgroundImage = event => {
         /** change bg image */
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
                key = {this.state.id}
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
                key = {this.state.id}
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
        controllerStream.on(`EventChangeColorBackground${this.state.id}`, this.changeColor);
        controllerStream.on(`EventSetBackgroundImage${this.state.id}`, this.setBackgroundImage);
    };

    componentWillUnmount = () => {
        controllerStream.off(`EventChangeColorBackground${this.state.id}`, this.changeColor);
        controllerStream.off(`EventSetBackgroundImage${this.state.id}`, this.setBackgroundImage);
    };
};



export default BackgroundComponent;