import React, {Fragment} from 'react';
import eventEmitter from '../../EventEmitter';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import './instrumentsPanel.scss';

import Icon from '../Icon/icon';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired,
        editComponent: PropTypes.object.isRequired
    };

    state = {
        instrumentPanel: {...this.props.instrumentPanel},
        componentsStats: {
            content: null,
            fontSize: null,
            color: null,
            backgroundImage: null,
            image: null,
            coords: {left: null, top: null} // x, y
        },
        images: null,
    };

    updateSizeText = eventSize => {
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentsStats: {...this.state.componentsStats, fontSize: eventSize}
        });
    };

    closePanel = event => {
        eventEmitter.emit('EventClosePanel', {close: false});
    };

    setSize = event => {
        // let {fontSize} = this.state.componentsStats;
        let {idComponent} = this.state.instrumentPanel;
        let size = event.target.value > 200 ? 200 : event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentsStats: {...this.state.componentsStats,fontSize: size}
        },
            () => eventEmitter.emit(`EventChangeSizeText${idComponent}`, {size: size })
        );

        event.stopPropagation();
    };

    setContent = event => {
        let {idComponent} = this.state.instrumentPanel;
        let contentValue = event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentsStats: {...this.state.componentsStats,content: contentValue}
        },
        () => eventEmitter.emit(`EventChangeContentText${idComponent}`,{content: contentValue}));
        event.stopPropagation();
    };

    updatePosition = eventItem => {

        this.setState({
            ...this.state, 
            componentsStats: {
                ...this.state.componentsStats,
                coords: {
                    ...this.state.componentsStats.coords,
                    left: eventItem.x,
                    top: eventItem.y
                }
            }
        });
    };

    setColor = event => {
        this.setState({...this.state,
            instrumentPanel:{
                ...this.state.instrumentPanel,
                colorPickerActive: this.state.instrumentPanel.colorPickerActive ? false : true
            }
        });
        event.stopPropagation();
    };

    updateBimageStats = eventItem => {
        const {urlFull} = eventItem;
        this.setState({
            ...this.state,
            componentsStats:{
                ...this.state.componentsStats,
                backgroundImage: urlFull
            }
        });
    };

    handleChangeComplete = event => {

        const {rgb} = event;
        let colorRGB = `rgb(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;

        let {idComponent} = this.state.instrumentPanel;
        if (this.state.instrumentPanel.target === 'background'){
            this.setState({
                ...this.state,
                componentsStats: {...this.state.componentsStats,color: colorRGB}
            }, () => eventEmitter.emit(`EventChangeColorBackground${idComponent}`, colorRGB));
        }

        else if (this.state.instrumentPanel.target === 'text') {
            this.setState({
                ...this.state,
                componentsStats: {...this.state.componentsStats,color: colorRGB}
            },
            () => eventEmitter.emit(`EventChangeColorText${idComponent}`, colorRGB));
        }

    };

    saveChanges = event => {
        eventEmitter.emit("EventSaveChangesComponent", {
            ...this.state.componentsStats,
            type: this.state.instrumentPanel.target
        });

        event.stopPropagation();
    }

    searchImage = event => {

        let {idComponent} = this.state.instrumentPanel;
        eventEmitter.emit('EventModalSearchOn', {idComponent: idComponent});

        event.stopPropagation();
    };

    makePanelInstruments = (type) => {

        let {colorPickerActive} = this.state.instrumentPanel;
        let {fontSize} = this.state.componentsStats;
            switch (type){
                case 'text':
                    return (
                        <Fragment>
                        <p className = 'titleInstument'>Color: </p>
                        <input onClick = {this.setColor} className = 'button_switchColor' type = 'button' value = 'color pick' />
                        <p className = 'titleInstument'>Text size: </p>
                        <input 
                            onChange = {this.setSize} 
                            type="number"
                            min = '10' max = '200'
                            value = {fontSize ? fontSize : 120 }
                        />
                            { colorPickerActive ?
                                <SketchPicker
                                onChangeComplete={this.handleChangeComplete}
                                />
                                : null
                            }
                        <p className = 'titleInstument'>Content: </p>
                        <input onChange = {this.setContent} maxLength = '20' type = 'text' defaultValue = 'Title' />
                        <input onClick = {this.saveChanges} className = 'saveButtonInstument' type = 'button' value = 'save changes' />
                        </Fragment>
                )
                case 'background': 
                    return (
                        <Fragment>
                        <p className = 'titleInstument'>Color: </p>
                        <input onClick = {this.setColor} className = 'button_switchColor' type = 'button' value = 'color pick' />
                            { colorPickerActive ?
                                <SketchPicker
                                onChangeComplete={this.handleChangeComplete}
                                />
                                : null
                            }
                            <input onClick = {this.searchImage} className = 'ImageSearchButton' type = 'button' value = 'background-image' />
                            <input onClick = {this.saveChanges} className = 'saveButtonInstument' type = 'button' value = 'save changes' />
                        </Fragment>
                    )
                default: return <p className = 'warningInstruments'>Select elements for accses edit instruments</p>
            }
    };

    componentDidUpdate = (oldProps, oldState) => {
        let targetBool = oldState.instrumentPanel.target !== this.props.instrumentPanel.target;
        let idBool = oldState.instrumentPanel.idComponent !== this.props.instrumentPanel.idComponent;
        console.log(this.props.instrumentPanel);
        if (idBool || targetBool)
            this.setState({
                ...this.state,
                instrumentPanel: {...this.props.instrumentPanel, colorPickerActive: false},
                componentsStats: {
                    content: null, fontSize: null, color: null,
                    backgroundImage: null, image: null,
                    coords: {left: null, top: null} // x, y
                },
            })
    };

    componentDidMount = event => {
        eventEmitter.on("EventUpdateSizeText", this.updateSizeText);
        eventEmitter.on("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.on("EventUpdatePosition", this.updatePosition);
    };

    componentWillUnmount = event => {
        eventEmitter.off("EventUpdateSizeText", this.updateSizeText);
        eventEmitter.off("EventUpdatePosition", this.updatePosition);
    };

    render(){
        let { instrumentActive } = this.state.instrumentPanel;
        return (
            <Fragment>
                <div  className = 'instumentsPanel'>
                <button onClick = {this.closePanel} className = 'closeInstrumentsPanel'><Icon path = '/img/close.svg' /></button>
                    <h3>Instruments</h3>
                    {
                        instrumentActive ? 
                        <p className = 'TextComponent'>{this.state.instrumentPanel.target}</p>
                        : null
                    }
                    {
                        instrumentActive ?
                        <div  className= 'instuments'>{this.makePanelInstruments(this.state.instrumentPanel.target)}</div>
                        : null
                    }
                </div>
            </Fragment>
        )
    };
};

export default InstrumentsPanel;