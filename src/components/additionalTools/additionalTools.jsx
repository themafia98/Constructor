import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import Viewer from '../imageViewer/Viewer';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import {CSSTransition} from 'react-transition-group';

class AdditionalTools extends React.PureComponent{

    static propTypes = {
        eventStreamBuild: PropTypes.object.isRequired, // events stream
        componentStats: PropTypes.object.isRequired, // current components data
        instrumentPanel: PropTypes.object.isRequired, // instruments data
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
        editComponentName:  null, /** @String | @null name current edit component */
    }

    modalSearchOn = itemEvent => {
        const modeHave = itemEvent.hasOwnProperty('mode');
        console.log(itemEvent);
        this.setState({
            ...this.state,
            modal:{
                ...this.state.modal,
                modalSearch: !this.state.modal.modalSearch,
                modalSearchMode: modeHave ? itemEvent.mode : null
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

    render(){
        const props = this.props;
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
                            idComponent = {props.componentStats.id}
                            modalSearchMode = {this.state.modal.modalSearchMode}
                            key = 'ModalWindow' workMode = 'Search'
                        />
                </CSSTransition>
                    <InstrumentsPanel
                        key = {`InstrumentsPanel${props.componentStats.id}`}
                        eventStreamBuild = {props.eventStreamBuild}
                        editComponentName = {props.editComponentName}
                        componentStats = {props.componentStats}
                        instrumentPanel = {props.instrumentPanel}
                    />
            </Fragment>
        )
    }

    componentDidMount = () => {
        this.props.eventStreamBuild.on('EventModalSearchOn', this.modalSearchOn);
        this.props.eventStreamBuild.on('EventView', this.ViewerSwitch);
    }

    componentWillMount = () => {
        this.props.eventStreamBuild.off('EventModalSearchOn', this.modalSearchOn);
        this.props.eventStreamBuild.off('EventView', this.ViewerSwitch);
    }

}



export default AdditionalTools;