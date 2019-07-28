import React, {Fragment} from 'react';
import eventEmitter from '../../EventEmitter';
import PropTypes from 'prop-types';
import './instrumentsPanel.scss';
import ImageInstruments from './ImageTools/ImageInstruments';
import BackgroundInstruments from './BackgroundTools/BackgroundInstruments';
import TextInstruments from './TextTools/TextInstruments';

import Confirm from '../confirmBox/Confirm';
import Icon from '../Icon/icon';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired, /** @Settings for panel and data about component */
        editComponentName: PropTypes.string /** @Name editable component */
    };

    state = {
        isChange: false,
        confirmActive: false,
        instrumentPanel: {...this.props.instrumentPanel},
        componentStats: this.props.componentStats,
        images: null,
    };

    updateSizeText = eventSize => {
        this.setState({
            ...this.state,
            instrumentPanel: {...this.state.instrumentPanel},
            componentStats: {
                ...this.state.componentStats,
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
        let {id} = this.state.componentStats;
        let size = event.target.value > 200 ? 200 : event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentStats: {...this.state.componentStats,fontSize: size}
        },
            () => eventEmitter.emit(`EventChangeSizeText${id}`, {
                targetSection: this.state.editComponentName, size: size 
            })
        );
    };

    setContent = event => {
        let {id} = this.state.componentStats;
        let contentValue = event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentStats: {...this.state.componentStats,content: contentValue}
        },
            () => eventEmitter.emit(`EventChangeContentText${id}`,{
                targetSection: this.state.editComponentName, content: contentValue
            })
        );
    };

    updatePosition = eventItem => {
        this.setState({
            ...this.state, 
            componentStats: {
                ...this.state.componentStats,
                coords: {
                    ...this.state.componentStats.coords,
                    x: eventItem.x,
                    y: eventItem.y
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
        const {images} = eventItem;
        console.log(eventItem);
        if (eventItem.mode !== 'image')
        this.setState({
            ...this.state,
            componentStats:{
                ...this.state.componentStats,
                backgroundImage: images.urlFull
            }
        });
        else {
            this.setState({
                ...this.state,
                componentStats:{
                    ...this.state.componentStats,
                    image: images.urlFull
                }
            });
        }
    };

    handleChangeComplete = event => {

        const {rgb} = event;
        let colorRGB = `rgb(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;

        let {id} = this.state.componentStats;
        if (this.state.componentStats.type === 'background'){
            this.setState({
                ...this.state,
                componentStats: {...this.state.componentStats,color: colorRGB}
            }, () => eventEmitter.emit(`EventChangeColorBackground${id}`,
                        {colorRGB: this.state.componentStats.color}
                    ));
        }

        else if (this.state.componentStats.type === 'text') {
            this.setState({
                ...this.state,
                componentStats: {...this.state.componentStats,color: colorRGB}
            },
            () => eventEmitter.emit(`EventChangeColorText${id}`, colorRGB));
        }

    };

    saveChanges = event => {
        this.setState({...this.state, isChange: false, confirmActive: false}, () =>
        eventEmitter.emit("EventSaveChangesComponent", {
            ...this.state.componentStats,
            id: this.state.componentStats.id,
            type: this.state.componentStats.type,
        }));

        event.stopPropagation();
    }

    searchImage = event => {

        let {id} = this.state.componentStats;
        eventEmitter.emit('EventModalSearchOn', {idComponent: id, mode: this.state.componentStats.type});

        event.stopPropagation();
    };

    makePanelInstruments = (type) => {
        console.log(type);
            switch (type){
                case 'text':
                   return(
                    <TextInstruments
                        instrumentPanel = {{...this.state.instrumentPanel}}
                        componentStats = {{...this.state.componentStats}}
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
                            colorPickerActive = {this.state.instrumentPanel.colorPickerActive}
                            componentStats = {{...this.state.componentStats}}
                            cbSetColor = {this.setColor}
                            cbHandleChangeComplete = {this.handleChangeComplete}
                            cbSearchImage = {this.searchImage}
                            cbSaveChanges = {this.saveChanges}
                        />
                    )
                case 'image':
                        return (
                            <ImageInstruments
                                instrumentPanel = {{...this.state.instrumentPanel}}
                                componentStats = {{...this.state.componentStats}}
                                cbSearchImage = {this.searchImage}
                                cbSaveChanges = {this.saveChanges}
                            />
                        )
                default: return <p className = 'warningInstruments'>No found element</p>
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
                        <p className = 'TextComponent'>{this.state.componentStats.type}</p>
                        : null
                    }
                    {
                        instrumentActive ?
                        <div className = 'instuments'>
                            {this.makePanelInstruments(this.state.componentStats.type)}
                        </div>
                        : null
                    }
                </div>
            </Fragment>
        )
    };

    componentDidUpdate = (oldProps, oldState) => {
        console.log(oldProps);
        let targetBool = oldState.componentStats.targetSection !== this.props.componentStats.targetSection;
        let idBool = oldState.componentStats.id !== this.props.componentStats.id;
        let statsBool = this.state.componentStats !== oldState.componentStats && !this.state.isChange;
        const compare = idBool || targetBool;
        if (compare && !this.state.isChange){
            this.setState({
                ...this.state,
                instrumentPanel: {...this.props.instrumentPanel, colorPickerActive: false, isChange: false},
                componentStats: this.props.mainBuilderData.components.find(item =>
                    {return item.id === this.props.componentStats.id }),
            });
        } else if (!this.state.isChange && statsBool) {
            this.setState({
                    ...this.state,
                    componentStats: {...this.state.componentStats},
                    isChange: true
            });
        } else if (compare && this.state.isChange) this.setState({...this.state, confirmActive: true});
    };

    componentDidMount = event => {
        eventEmitter.on(`EventUpdateSizeText${this.state.componentStats.id}`, this.updateSizeText);
        eventEmitter.on("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.on(`EventUpdatePosition${this.state.componentStats.id}`, this.updatePosition);
    };

    componentWillUnmount = event => {
        eventEmitter.off(`EventUpdateSizeText${this.state.componentStats.id}`, this.updateSizeText);
        eventEmitter.off("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.off(`EventUpdatePosition${this.state.componentStats.id}`, this.updatePosition);
    };
};

export default InstrumentsPanel;