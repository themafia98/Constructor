import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import Viewer from '../imageViewer/Viewer';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';

const AdditionalTools = props => {

    return (
        <Fragment key = 'AdditionalBuild'>
            {   props.modalViewer.action &&
                    <Viewer 
                        key = 'ImageViewer'
                        eventStreamBuild = {props.eventStreamBuild} 
                        mode = {props.modalViewer.mode} 
                        path = {props.modalViewer.target}
                        iframe = {props.modalViewer.iframe}
                    />
            }
            {   props.modalSearch &&
                    <ModalWindow
                        eventStreamBuild = {props.eventStreamBuild}
                        idComponent = {props.componentStats.id}
                        modalSearchMode = {props.modalSearchMode}
                        key = 'ModalWindow' workMode = 'Search' 
                    />
            }
                <InstrumentsPanel
                    key = {`InstrumentsPanel${props.componentStats.id}`}
                    eventStreamBuild = {props.eventStreamBuild}
                    editComponentName = {props.editComponentName}
                    componentStats = {{...props.componentStats}}
                    instrumentPanel = {props.instrumentPanel}
                />
        </Fragment>
    )
}

AdditionalTools.propTypes = {
    eventStreamBuild: PropTypes.object.isRequired, // events stream
    componentStats: PropTypes.object.isRequired, // current components data
    instrumentPanel: PropTypes.object.isRequired, // instruments data
    modalViewer: PropTypes.object.isRequired, // Viewer data
}

export default AdditionalTools;