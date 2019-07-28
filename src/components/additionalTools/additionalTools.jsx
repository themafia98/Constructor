import React,{Fragment} from 'react';
import ImageViewer from '../../components/imageViewer/imageViewer';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';

const AdditionalTools = props => {
    return (
        <Fragment key = 'AdditionalBuild'>
            {   props.modalImageViewer.action &&
                    <ImageViewer key = 'ImageViewer' path = {props.modalImageViewer.target} />
            }
            {   props.modalSearch &&
                    <ModalWindow
                        idComponent = {props.componentStats.id}
                        key = 'ModalWindow' workMode = 'Search' 
                    />
            }
                <InstrumentsPanel
                    key = 'InstrumentsPanel'
                    editComponentName = {props.editComponentName}
                    componentStats = {{...props.componentStats}}
                    mainBuilderData =  {{...props.mainBuilderData}}
                    instrumentPanel = {{...props.instrumentPanel}}
                />
        </Fragment>
    )
}

export default AdditionalTools;