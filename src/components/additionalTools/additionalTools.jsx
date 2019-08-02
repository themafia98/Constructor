import React,{Fragment} from 'react';
import Viewer from '../imageViewer/Viewer';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';

const AdditionalTools = props => {

    return (
        <Fragment key = 'AdditionalBuild'>
            {   props.modalViewer.action &&
                    <Viewer 
                        key = 'ImageViewer' 
                        mode = {props.modalViewer.mode} 
                        path = {props.modalViewer.target}
                        iframe = {props.modalViewer.iframe}
                    />
            }
            {   props.modalSearch &&
                    <ModalWindow
                        idComponent = {props.componentStats.id}
                        modalSearchMode = {props.modalSearchMode}
                        key = 'ModalWindow' workMode = 'Search' 
                    />
            }
                <InstrumentsPanel
                    key = {`InstrumentsPanel${props.componentStats.id}`}
                    editComponentName = {props.editComponentName}
                    componentStats = {{...props.componentStats}}
                    mainBuilderData =  {props.mainBuilderData}
                    instrumentPanel = {props.instrumentPanel}
                />
        </Fragment>
    )
}

export default AdditionalTools;