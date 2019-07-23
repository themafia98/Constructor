import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

import BuilderComponents from '../../components/componentsBuilder/BuilderComponents';

import ImageViewer from '../../components/imageViewer/imageViewer';
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import HeaderBuild from '../../components/buildComponents/header/headerBuild';

import './build.scss';


class Build extends React.PureComponent {

    static propTypes = {
        firebase: PropTypes.object.isRequired, /** @firebase class for use firebase functions */
        active: PropTypes.bool, /** @active - status firebase auth */
        dispatch: PropTypes.func.isRequired, /** @dispatch - redux */
        history: PropTypes.object, /** @Router HTML5 history */
        location: PropTypes.object, /** @Router */
        match: PropTypes.object.isRequired, /** @Router */
        userData: PropTypes.object.isRequired, /** @UserData data about projects,user and current edit prject */
    }

    state = {
            idProject: parseInt(this.props.match.params.param),
            mainBuilderData: {
                mainBoxWidth: null,
                mainBoxHeight: null,
                buildGetComponents: false,
                components: [],
                componentJSX: []
            },
            instrumentPanel: {
                colorPickerActive: false,
                instrumentActive: false,
                target: '',
                idComponent: null,
            },
            editComponentName:  null,
            menuActive: false,
            editStart: false,
            modalSearch: false,
            modalImageViewer: {action: false, image: null },
        }

    modalSearchOn = itemEvent => {
        this.setState({...this.state, modalSearch: this.state.modalSearch ? false : true});
    }

    imageViewerSwitch = itemEvent => {
        this.setState({
            ...this.state,
            modalImageViewer: {
                ...this.state.modalImageViewer, 
                action: itemEvent.action, 
                target: itemEvent.target
            }
        });
    };

    workModeEdit = itemEvent => {
        if (!this.state.editStart)
        this.setState({
            ...this.state,
            idProject: itemEvent.idProject,
            editComponentName: itemEvent.target,
            mainBuilderData: {
                ...this.state.mainBuilderData,
                mainBoxWidth: itemEvent.width,
                mainBoxHeight: itemEvent.height,
            },
            menuActive: true,
            editStart: true
        });

    }

    openInstrument = itemEvent => {
        const targetEqual = this.state.instrumentPanel.target !== itemEvent.target;
        const instumentActive = this.state.instrumentPanel.instrumentActive;
        if ((targetEqual || !instumentActive) && this.state.editStart)
        this.setState({
            ...this.state,
            instrumentPanel: {
                ...this.state.instrumentPanel,
                instrumentActive: true,
                sizeTextValue: itemEvent.sizeTextValue,
                idComponent: itemEvent.id,
                target: itemEvent.target
            }
        })
    }

    closePanel = itemEvent => {
        this.setState({
            ...this.state,
            instrumentPanel: {
                ...this.state.instrumentPanel,
                colorPickerActive: false,
                instrumentActive: itemEvent.close
            }
        });
    };

    addComponentsFromBD = array => {
        
        let componentsFromDb = [];
        this.setState({
            ...this.state,
            mainBuilderData: {
                ...this.state.mainBuilderData,
                buildGetComponents: true,
            }
        }, () => {
                let components = [...this.state.mainBuilderData.components];
                array.forEach(item => {
                    if (item.type !== 'background'){
                    let id = this.state.mainBuilderData.componentJSX.length;
                    let component =
                        <BuilderComponents
                            sizeParenBox = {{...this.state.sizeParenBox}}
                            coords = {{...item.coords}}
                            size = {item.fontSize}
                            color = {item.color}
                            id = {id}
                            type = {item.type}
                            key = {`${item.type}${id}`}
                            content = {item.content ? item.content : 'Title'}
                        />

                    let inform = {type: item.type, component: component};
                    componentsFromDb.push({component: component, inform: inform});
                    }
                    else components.push(item);
                });
                this.addComponent({components: components, target: 'Header', dataBaseData: componentsFromDb, mode: "DB"});
            });
    }

    addComponent = itemEvent => {

        let {componentJSX} = this.state.mainBuilderData;
        if (itemEvent.mode !== 'DB')
            this.setState({
                ...this.state,
                mainBuilderData: {
                    ...this.state.mainBuilderData,
                    components: [...itemEvent.components],
                    componentJSX: [...componentJSX, {...itemEvent.component}]
                },
            });
        else {
            let _bufferComponents = [];
            itemEvent.dataBaseData.forEach(item => {
                _bufferComponents.push(item.component);

            });

            this.setState({
                ...this.state,
                mainBuilderData: {
                    ...this.state.mainBuilderData,
                    components: [...itemEvent.components],
                    componentJSX: [...componentJSX, ..._bufferComponents]
                },
            });
        }
    };

    saveChangesComponent = itemEvent => {

        const {userData} = this.props;
        const componentSaveInBase = {...itemEvent, name: this.state.editComponentName};

        this.setState({
            ...this.state,
            mainBuilderData: {
                ...this.state.mainBuilderData,
                components: [...this.state.mainBuilderData.components, componentSaveInBase]
            }
        }, () => (
        this.props.dispatch(updateMiddleware({
            uid: userData.idUser,
            projects: [...userData.projects],
            components: [...this.state.mainBuilderData.components],
            idProject: this.state.idProject}))
        ));
    };

    saveWidth = eventItem => {
        this.setState({sizeParenBox: {...eventItem}});
    };


    render(){
        console.log('build comp render');
        const {userData} = this.props;
        const {currentProjectsData} = userData;
        const {instrumentActive} = this.state.instrumentPanel;

        if (userData.active && currentProjectsData.loadProject){
            return (
                    <Fragment key = 'build'>
                    {   this.state.modalImageViewer.action ?
                        <ImageViewer key = 'ImageViewer' path = {this.state.modalImageViewer.target} /> : null
                    }
                    {this.state.modalSearch ?
                        <ModalWindow
                            idComponent = {this.state.instrumentPanel.idComponent}
                            key = 'ModalWindow' workMode = 'Search' /> : null
                    }
                    { instrumentActive ?
                        <InstrumentsPanel
                            key = 'InstrumentsPanel'
                            editComponentName = {this.state.editComponentName}
                            mainBuilderData =  {{...this.state.mainBuilderData}}
                            instrumentPanel = {{...this.state.instrumentPanel}}
                        />
                        : null
                    }
                        <Header key = 'Header' title = "Constructor"  />
                        <HeaderBuild
                                key = 'HeaderBuild'
                                mainBuilderData = {{...this.state.mainBuilderData}}
                                currentProjectsData = {{...this.props.userData.currentProjectsData}}
                                editStart = {this.state.editStart}
                                countComponents = {this.state.mainBuilderData.componentJSX.length}
                                menuActive = {this.state.menuActive}
                                sizeParenBox = {this.state.sizeParenBox}
                                id = {currentProjectsData.idProject}
                        >
                            {{name: this.state.editComponentName}}
                        </HeaderBuild>
                    </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = { '/'} />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    componentDidUpdate(prevProps) {

        let {userData} = this.props;
        let {currentProjectsData} = userData;
        let {buildGetComponents} = this.state.mainBuilderData;

        const isLOAD = prevProps.userData.currentProjectsData.loadProject === currentProjectsData.loadProject;

        if (isLOAD && currentProjectsData.haveUpdateLoading) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                components: [...current.components]
            }));
        }

        if (currentProjectsData.loadProject && this.state.editStart && !buildGetComponents)
            this.addComponentsFromBD([...currentProjectsData.components]);
    }

    componentDidMount = () => {

        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject && currentProjectsData.haveUpdateLoading) {
            const currentProject =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: currentProject.id,
                typeProject: currentProject.type,
                components: [...currentProject.components]
            }));
        };

        eventEmitter.on('EventBuildComponents', this.addComponent);
        eventEmitter.on('EventSaveChangesComponent', this.saveChangesComponent);
        eventEmitter.on('EventSaveWidth', this.saveWidth);
        eventEmitter.on('EventClosePanel', this.closePanel);
        eventEmitter.on('EventModalSearchOn', this.modalSearchOn);
        eventEmitter.on('EventInstrumentPanel', this.openInstrument);
        eventEmitter.on('EventImageView', this.imageViewerSwitch);
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {

        let {userData} = this.props;

        if (userData.active)  this.props.dispatch(exitProjectAction(true));
        eventEmitter.off('EventBuildComponents', this.addComponent);
        eventEmitter.off('EventSaveChangesComponent', this.saveChangesComponent);
        eventEmitter.off('EventSaveWidth', this.saveWidth);
        eventEmitter.off('EventModalSearchOn', this.modalSearchOn);
        eventEmitter.off('EventClosePanel', this.closePanel);
        eventEmitter.off('EventInstrumentPanel', this.openInstrument);
        eventEmitter.off('EventImageView', this.imageViewerSwitch);
        eventEmitter.off('EventModeEdit', this.workModeEdit);
    }
}


const mapStateToProps = (state) => {
    return {
        userData: {
            active: state.cabinet.active,
            idUser: state.cabinet.idUser,
            projects: [...state.cabinet.projects],
            currentProjectsData: {...state.builder}
        },
    }
}

export default connect(mapStateToProps)(withFirebase(Build));