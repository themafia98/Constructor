import React, {Fragment} from 'react';
import eventEmitter from '../../EventEmitter';
import PropTypes from 'prop-types';

import InputInstruments from './InputTools/InputInstruments';
import MediaInstruments from './MediaTools/MediaInstruments';
import ImageInstruments from './ImageTools/ImageInstruments';
import BackgroundInstruments from './BackgroundTools/BackgroundInstruments';
import TextInstruments from './TextTools/TextInstruments';

import Icon from '../Icon/icon';

import './instrumentsPanel.scss';


class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired, /** @Settings for panel and data about component */
        editComponentName: PropTypes.string, /** @Name editable component */
        eventStreamBuild: PropTypes.object.isRequired // stream events
    };

    state = {
        instrumentPanel: {...this.props.instrumentPanel},
        componentStats: this.props.componentStats,
        images: null,
    };


    closePanel = event => {
        this.props.eventStreamBuild.emit('EventClosePanel', {close: false});
    };

    setSize = event => {
        let {id} = this.state.componentStats;
        let size = event.target.value > 200 ? 200 : event.target.value;

        if (this.state.componentStats.type !== 'input')
        this.setState({
            ...this.state, 
            instrumentPanel: {...this.state.instrumentPanel},
            componentStats: {...this.state.componentStats,fontSize: size}
        }, () => eventEmitter.emit(`EventChangeSize${id}`, {
                targetSection: this.state.editComponentName, size: size 
        }));
        else this.setState({
                ...this.state, 
                instrumentPanel: {...this.state.instrumentPanel},
                componentStats: {...this.state.componentStats,fontSize: size}
            }, () => eventEmitter.emit(`EventChangeSizeText${id}`, {size: size}
            ));
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

    setIframeContent = eventItem => {

        this.setState({
            ...this.state,
            componentStats:{
                ...this.state.componentStats,
                content: eventItem.iframe
            }
        });
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

        else if (this.state.componentStats.type === 'input') {
            this.setState({
                ...this.state,
                componentStats: {...this.state.componentStats,color: colorRGB}
            },
            () => eventEmitter.emit(`EventChangecolor${id}`, colorRGB));
        }

    };

    redirectSaveChanges = event => {
        this.props.eventStreamBuild.emit("EventSaveChangesComponent", {
            ...this.state.componentStats,
            id: this.state.componentStats.id,
            type: this.state.componentStats.type,
            ms: 0
        });
        if (event) event.stopPropagation();
    }

    saveChanges = event => {

        this.props.eventStreamBuild.emit("EventSaveChangesComponent", {
                ...this.state.componentStats,
                id: this.state.componentStats.id,
                type: this.state.componentStats.type,
                ms: 1500
            });

        eventEmitter.emit('EventRedirectConfirm', true);
        if (event) event.stopPropagation();
    }

    deleteComponent = event => {
        this.props.eventStreamBuild.emit('EventDeleteComponent', {
            id: this.state.componentStats.id,
            targetSection: this.state.componentStats.targetSection,
            type: this.state.componentStats.type
        });
    };

    search = event => {

        let {id} = this.state.componentStats;
        this.props.eventStreamBuild.emit('EventModalSearchOn', {idComponent: id, mode: this.state.componentStats.type});

        event.stopPropagation();
    };

    loadFile = event => {
        let {id} = this.state.componentStats;
        try {
            let image = event.target.files[0];
            let reader = new FileReader();
            if (image.type[0] !== 'i') throw new Error('Invalid file');
            reader.readAsDataURL(image);
            reader.onload = (e) => {
                eventEmitter.emit(`EventSetCurrentImage${id}`,{ urlFull: reader.result });
                this.updateBimageStats({images: { urlFull: reader.result }, mode: 'image'});
                e.stopPropagation();
            }
            reader.onerror = () => {
                console.error(reader.error);
            }
        } catch (error) {
            console.error(error.message);
        }

        event.stopPropagation();
    }

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
                            cbSearch = {this.search}
                        />
                    )
                case 'image':
                        return (
                            <ImageInstruments
                                instrumentPanel = {{...this.state.instrumentPanel}}
                                componentStats = {{...this.state.componentStats}}
                                cbSearch = {this.search}
                                cbSetSize = {this.setSize}
                                cbSetBorderRadius = {this.setBorderRadius}
                                cbSetOpacity = {this.setOpacity}
                                cbSetWidth = {this.setWidth}
                                cbSetHeight = {this.setHeight}
                                cbLoadFile = {this.loadFile}
                                cbDelete = {this.deleteComponent}
                            />
                        )
                case 'media':
                        return (
                            <MediaInstruments
                                instrumentPanel = {{...this.state.instrumentPanel}}
                                componentStats = {{...this.state.componentStats}}
                                cbSearch = {this.search}
                                cbDelete = {this.deleteComponent}
                            />
                            )
                case 'input':
                        return (
                            <InputInstruments
                                instrumentPanel = {{...this.state.instrumentPanel}}
                                componentStats = {{...this.state.componentStats}}
                                cbSetColor = {this.setColor}
                                cbHandleChangeComplete = {this.handleChangeComplete}
                                cbSetSize = {this.setSize}
                                cbSetWidth = {this.setWidth}
                                cbSetHeight = {this.setHeight}
                                cbSetContent = {this.setContent}
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
        eventEmitter.on(`EventSetIframe`, this.setIframeContent);
        eventEmitter.on("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.on(`EventUpdatePosition${this.state.componentStats.id}`, this.updatePosition);
    };

    componentWillUnmount = event => {
        if (this.timer) clearTimeout(this.timer);
        eventEmitter.on('EventClosePaanel', this.closePanel);
        eventEmitter.off('EventRedirectSaveChanges', this.redirectSaveChanges);
        eventEmitter.off(`EventSetIframe`, this.setIframeContent);
        eventEmitter.off("EventSetBImageInstumentPanel", this.updateBimageStats);
        eventEmitter.off(`EventUpdatePosition${this.state.componentStats.id}`, this.updatePosition);
    };
};

export default InstrumentsPanel;