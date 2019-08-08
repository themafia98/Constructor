import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import Viewer from '../imageViewer/Viewer';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import {CSSTransition} from 'react-transition-group';

class AdditionalTools extends React.PureComponent{

    static propTypes = {
        eventStreamBuild: PropTypes.object.isRequired, // events stream
    }

    state = {
        modal: {
            modalSearch: false, /** @bool active modal search image/media */
            modalSearchMode: null, /** @String work mode of search modal */
        },
        modalViewer: {action: false, image: null, mode: null }, /** @Object data with viewer data */
        instrumentPanel: { /** @Object with data controll instrument panel */
            colorPickerActive: false,
            instrumentActive: false,
        },
        componentStats: {}, /** @Object with data about components */
        editComponentName:  this.props.editComponentName, /** @String | @null name current edit component */
    }

    modalSearchOn = itemEvent => {
        console.log(itemEvent);
        this.setState({
            ...this.state,
            modal:{
                ...this.state.modal,
                modalSearch: !this.state.modal.modalSearch,
                modalSearchMode: itemEvent.mode || null
            }
        });
    }

    ViewerSwitch = itemEvent => {
        /* set settings for viewer */
        this.setState({
            ...this.state,
            modalViewer: {
                ...this.state.modalViewer,
                action: itemEvent.action,
                target: itemEvent.target,
                mode: itemEvent.mode,
                iframe: itemEvent.iframe
            }
        });
    };

    openInstrument = itemEvent => {
        /* build instrument panel component */
           const idEqual = this.state.componentStats.id === itemEvent.componentStats.id;
           if (!idEqual || !this.state.instrumentPanel.instrumentActive)
           this.setState({
               ...this.state,
               editComponentName: itemEvent.targetSection,
               componentStats: {
                   ...this.state.componentStats,
                   ...itemEvent.componentStats
               },
               instrumentPanel: {
                   ...this.state.instrumentPanel,
                   instrumentActive: true,
               }
           });
   }

   closePanel = itemEvent => {
        /* unmount unstrument panel component */
       this.setState({
           ...this.state,
           instrumentPanel: {
               ...this.state.instrumentPanel,
               colorPickerActive: false,
               instrumentActive: itemEvent.close
           }
       });
   };

    render(){
        const props = this.props;
        if (this.state.instrumentPanel.instrumentActive){
            return (
                <Fragment key = 'AdditionalBuild'>
                    <CSSTransition
                        in={this.state.modalViewer.action}
                        timeout={300}
                        classNames="modalAnimation"
                        unmountOnExit
                        appear
                    >
                        <Viewer
                            key = 'ImageViewer'
                            eventStreamBuild = {props.eventStreamBuild}
                            mode = {this.state.modalViewer.mode}
                            path = {this.state.modalViewer.target}
                            iframe = {this.state.modalViewer.iframe}
                        />
                    </CSSTransition>
                    <CSSTransition
                        in={this.state.modal.modalSearch}
                        timeout={300}
                        classNames="modalAnimation"
                        unmountOnExit
                        appear
                    >
                            <ModalWindow
                                eventStreamBuild = {props.eventStreamBuild}
                                idComponent = {this.state.componentStats.id}
                                modalSearchMode = {this.state.modal.modalSearchMode}
                                key = 'ModalWindow' workMode = 'Search'
                            />
                    </CSSTransition>
                        <InstrumentsPanel
                            key = {`InstrumentsPanel${this.state.componentStats.id}`}
                            eventStreamBuild = {props.eventStreamBuild}
                            editComponentName = {this.state.editComponentName}
                            componentStats = {this.state.componentStats}
                            instrumentPanel = {this.state.instrumentPanel}
                        />
                </Fragment>
            )
        } else return <Fragment></Fragment>;
    }

    componentDidMount = () => {
        this.props.eventStreamBuild.on('EventModalSearchOn', this.modalSearchOn);
        this.props.eventStreamBuild.on('EventView', this.ViewerSwitch);
        this.props.eventStreamBuild.on('EventClosePanel', this.closePanel);
        this.props.eventEmitter.on('EventInstrumentPanel', this.openInstrument);
    }

    componentWillUnmount = () => {
        this.props.eventStreamBuild.off('EventModalSearchOn', this.modalSearchOn);
        this.props.eventEmitter.off('EventInstrumentPanel', this.openInstrument);
        this.props.eventStreamBuild.off('EventView', this.ViewerSwitch);
        this.props.eventStreamBuild.off('EventClosePanel', this.closePanel);
    }

}



export default AdditionalTools;