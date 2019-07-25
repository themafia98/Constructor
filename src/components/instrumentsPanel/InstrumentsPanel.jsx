import React, {Fragment} from 'react';
import eventEmitter from '../../EventEmitter';
import PropTypes from 'prop-types';
import './instrumentsPanel.scss';

import BackgroundInstruments from './BackgroundTools/BackgroundInstruments';
import TextInstruments from './TextTools/TextInstruments';

import Confirm from '../confirmBox/Confirm';
import Icon from '../Icon/icon';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired, /** @Settings for panel and data about component */
        editComponentName: PropTypes.string.isRequired /** @Name editable component */
    };

    state = {
        isChange: false,
        confirmActive: false,
        instrumentPanel: {...this.props.instrumentPanel},
        componentsStats: this.props.mainBuilderData.components.find(item =>
                    {return item.id === this.props.instrumentPanel.idComponent }),
        images: null,
    };

    updateSizeText = eventSize => {
        this.setState({
            ...this.state,
            instrumentPanel: {...this.state.instrumentPanel},
            componentsStats: {
                ...this.state.componentsStats,
                fontSize: eventSize
            }
        });
    };

    closePanel = event => {
        if (!this.state.isChange)
        eventEmitter.emit('EventClosePanel', {close: false});
        else this.setState({...this.state, confirmActive: true});
    };

    setSize = event => {
        let {idComponent} = this.state.instrumentPanel;
        let size = event.target.value > 200 ? 200 : event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentsStats: {...this.state.componentsStats,fontSize: size}
        },
            () => eventEmitter.emit(`EventChangeSizeText${idComponent}`, {idSection: this.props.editComponentName, size: size })
        );
    };

    setContent = event => {
        let {idComponent} = this.state.instrumentPanel;
        let contentValue = event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentsStats: {...this.state.componentsStats,content: contentValue}
        },
        () => eventEmitter.emit(`EventChangeContentText${idComponent}`,{idSection: this.props.editComponentName, content: contentValue}));
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
            }, () => eventEmitter.emit(`EventChangeColorBackground${idComponent}`,{idSection: this.props.editComponentName,  colorRGB}));
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

        this.setState({...this.state, isChange: false, confirmActive: false}, () =>
        eventEmitter.emit("EventSaveChangesComponent", {
            ...this.state.componentsStats,
            id: this.state.instrumentPanel.idComponent,
            type: this.state.instrumentPanel.target,
        }));

        event.stopPropagation();
    }

    searchImage = event => {

        let {idComponent} = this.state.instrumentPanel;
        eventEmitter.emit('EventModalSearchOn', {idComponent: idComponent});

        event.stopPropagation();
    };

    makePanelInstruments = (type) => {
            switch (type){
                case 'text':
                   return(
                    <TextInstruments
                        instrumentPanel = {{...this.state.instrumentPanel}}
                        componentsStats = {{...this.state.componentsStats}}
                        cbSetColor = {this.setColor}
                        cbSetSize = {this.setSize}
                        cbHandleChangeComplete = {this.handleChangeComplete}
                        cbSetContent = {this.setContent}
                        cbSaveChanges = {this.saveChanges}
                    />
                   )
                case 'background':
                    return (
                        <BackgroundInstruments
                            instrumentPanel = {{...this.state.instrumentPanel}}
                            componentsStats = {{...this.state.componentsStats}}
                            cbSetColor = {this.setColor}
                            cbHandleChangeComplete = {this.handleChangeComplete}
                            cbSearchImage = {this.searchImage}
                            cbSaveChanges = {this.saveChanges}
                        />
                    )
                default: return <p className = 'warningInstruments'>
                                    Select elements for accses edit instruments
                                </p>
            }
    };


    cancelSave = event => {
        this.setState({...this.state, isChange: false, confirmActive: false});
        event.stopPropagation();
    }


    render(){
        let { instrumentActive } = this.state.instrumentPanel;

        return (
            <Fragment>
                { this.state.confirmActive ?
                    <Confirm cbSaveChanges = {this.saveChanges} cbCancelSave = {this.cancelSave} /> : null
                }
                <div  className = 'instumentsPanel'>
                    <button
                        onClick = {this.closePanel}
                        className = 'closeInstrumentsPanel'
                    >
                        <Icon path = '/img/close.svg' />
                    </button>
                    <h3>Instruments</h3>
                    {
                        instrumentActive ? 
                        <p className = 'TextComponent'>{this.state.instrumentPanel.target}</p>
                        : null
                    }
                    {
                        instrumentActive ?
                        <div className = 'instuments'>
                            {this.makePanelInstruments(this.state.instrumentPanel.target)}
                        </div>
                        : null
                    }
                </div>
            </Fragment>
        )
    };

    componentDidUpdate = (oldProps, oldState) => {

        let targetBool = oldState.instrumentPanel.target !== this.props.instrumentPanel.target;
        let idBool = oldState.instrumentPanel.idComponent !== this.props.instrumentPanel.idComponent;

        const compare = idBool || targetBool;
        if (compare && !this.state.isChange){
            this.setState({
                ...this.state,
                instrumentPanel: {...this.props.instrumentPanel, colorPickerActive: false, isChange: false},
                componentsStats: this.props.mainBuilderData.components.find(item =>
                    {return item.id === this.props.instrumentPanel.idComponent }),
            });
        } else if (this.state.componentsStats !== oldState.componentsStats &&
                !this.state.isChange) this.setState({...this.state, isChange: true});
        else if (compare && this.state.isChange) this.setState({...this.state, confirmActive: true});
    };

    componentDidMount = event => {
        eventEmitter.on("EventUpdateSizeText", this.updateSizeText);
        eventEmitter.on("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.on("EventUpdatePosition", this.updatePosition);
    };

    componentWillUnmount = event => {
        console.log('componentWillUnmount');
        eventEmitter.off("EventUpdateSizeText", this.updateSizeText);
        eventEmitter.off("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.off("EventUpdatePosition", this.updatePosition);
    };
};

export default InstrumentsPanel;