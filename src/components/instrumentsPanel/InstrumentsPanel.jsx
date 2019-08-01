import React, {Fragment} from 'react';
import eventEmitter from '../../EventEmitter';
import PropTypes from 'prop-types';
import './instrumentsPanel.scss';

import MediaInstruments from './MediaTools/MediaInstruments';
import ImageInstruments from './ImageTools/ImageInstruments';
import BackgroundInstruments from './BackgroundTools/BackgroundInstruments';
import TextInstruments from './TextTools/TextInstruments';


import Icon from '../Icon/icon';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired, /** @Settings for panel and data about component */
        editComponentName: PropTypes.string /** @Name editable component */
    };

    state = {
        instrumentPanel: {...this.props.instrumentPanel},
        componentStats: this.props.componentStats,
        images: null,
    };

    timer = null;

    updateSize = eventSize => {
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
        eventEmitter.emit('EventClosePanel', {close: false});
    };

    setSize = event => {
        let {id} = this.state.componentStats;
        let size = event.target.value > 200 ? 200 : event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentStats: {...this.state.componentStats,fontSize: size}
        },
            () => eventEmitter.emit(`EventChangeSize${id}`, {
                targetSection: this.state.editComponentName, size: size 
            })
        );
    };

    setFont = event => {
        let {id} = this.state.componentStats;
        let fontName = event.target.value;
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentStats: {...this.state.componentStats,font: fontName}
        },
            () => eventEmitter.emit(`EventSetFont${id}`, {
                targetSection: this.state.editComponentName, font: fontName
            })
        );
    }

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
        if (event) event.stopPropagation();
    };

    setWidth = event => {
        const {id} = this.state.componentStats;
        const width = event.target.value;
        this.setState({
            ...this.state,
            componentStats: {...this.state.componentStats,
                size: {
                    ...this.state.componentStats.size,
                    w: width
                }}
        },
            () => eventEmitter.emit(`EventSetWidth${id}`,{width: width}));

        if (event) event.stopPropagation();
    };

    setHeight = event => {
        const {id} = this.state.componentStats;
        const height = event.target.value;
        this.setState({
            ...this.state,
            componentStats: {...this.state.componentStats,
                size: {
                    ...this.state.componentStats.size,
                    h: height
                }}
        },
            () => eventEmitter.emit(`EventSetHeight${id}`,{height: height}));

        if (event) event.stopPropagation();
    }

    updatePosition = eventItem => {
        if (!eventItem) return;
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
        if (event) event.stopPropagation();
    };

    setOpacity = event => {
        let {id} = this.state.componentStats;
        let opacity = event.target.value;

        this.setState({
            ...this.state,
            componentStats: {...this.state.componentStats,opacity: opacity}
        },
         () => eventEmitter.emit(`EventSetOpacity${id}`, {opacity: opacity}));
    };

    setBorderRadius = event => {
        let {id} = this.state.componentStats;
        let radius = event.target.value;

        this.setState({
            ...this.state,
            componentStats: {...this.state.componentStats,borderRadius: radius}
        },
         () => eventEmitter.emit(`EventSetBorderRadius${id}`, {borderRadius: radius}));
    };

    updateBimageStats = eventItem => {
        const {images} = eventItem;
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

    redirectSaveChanges = event => {
        eventEmitter.emit("EventSaveChangesComponent", {
            ...this.state.componentStats,
            id: this.state.componentStats.id,
            type: this.state.componentStats.type,
        });
        if (event) event.stopPropagation();
    }

    saveChanges = event => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            eventEmitter.emit("EventSaveChangesComponent", {
                ...this.state.componentStats,
                id: this.state.componentStats.id,
                type: this.state.componentStats.type,
            });
            eventEmitter.emit('EventRedirectConfirm', false);
        }, 2000);
        eventEmitter.emit('EventRedirectConfirm', true);
        if (event) event.stopPropagation();
    }

    deleteComponent = event => {
        eventEmitter.emit('EventDeleteComponent', {
            id: this.state.componentStats.id,
            targetSection: this.state.componentStats.targetSection,
            type: this.state.componentStats.type
        });
    };

    searchImage = event => {

        let {id} = this.state.componentStats;
        eventEmitter.emit('EventModalSearchOn', {idComponent: id, mode: this.state.componentStats.type});

        event.stopPropagation();
    };

    makePanelInstruments = (type) => {
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
                        cbSetFont = {this.setFont}
                        cbSetOpacity = {this.setOpacity}
                        cbDelete = {this.deleteComponent}
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
                        />
                    )
                case 'image':
                        return (
                            <ImageInstruments
                                instrumentPanel = {{...this.state.instrumentPanel}}
                                componentStats = {{...this.state.componentStats}}
                                cbSearchImage = {this.searchImage}
                                cbSetSize = {this.setSize}
                                cbSetBorderRadius = {this.setBorderRadius}
                                cbSetOpacity = {this.setOpacity}
                                cbSetWidth = {this.setWidth}
                                cbSetHeight = {this.setHeight}
                                cbDelete = {this.deleteComponent}
                            />
                        )
                case 'media':
                        return (
                            <MediaInstruments
                                instrumentPanel = {{...this.state.instrumentPanel}}
                                componentStats = {{...this.state.componentStats}}
                                cbSearchImage = {this.searchImage}
                                cbDelete = {this.deleteComponent}
                            />
                            )
                default: return <p className = 'warningInstruments'>No found element</p>
            }
    };

    render(){
        let { instrumentActive } = this.state.instrumentPanel;
        return (
            <Fragment>
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
        if (oldState.componentStats !== this.state.componentStats)
        this.saveChanges();
    };

    componentDidMount = event => {
        eventEmitter.on('EventRedirectSaveChanges', this.redirectSaveChanges);
        eventEmitter.on(`EventupdateSize${this.state.componentStats.id}`, this.updateSize);
        eventEmitter.on("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.on(`EventUpdatePosition${this.state.componentStats.id}`, this.updatePosition);
    };

    componentWillUnmount = event => {
        if (this.timer) clearTimeout(this.timer);
        eventEmitter.off('EventRedirectSaveChanges', this.redirectSaveChanges);
        eventEmitter.off(`EventupdateSize${this.state.componentStats.id}`, this.updateSize);
        eventEmitter.off("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.off(`EventUpdatePosition${this.state.componentStats.id}`, this.updatePosition);
    };
};


export default InstrumentsPanel;