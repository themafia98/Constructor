import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

import TextComponent from '../../components/buildComponents/components/Text';
import BackgroundComponent from '../../components/buildComponents/components/Background';

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
            editComponent: {
                name: null,
                build: {
                    name: null,
                    target: null,
                    type: null,
                    mainBoxWidth: null,
                    mainBoxHeight: null,
                    buildGetComponents: false,
                    components: [],
                    componentJSX: []
                },
            },
            instrumentPanel: {
                colorPickerActive: false,
                instrumentActive: false,
                target: '',
                idComponent: null,
            },
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
            editComponent: {
                ...this.state.editComponent,
                ...itemEvent.components,
                mainBoxWidth: itemEvent.width,
                mainBoxHeight: itemEvent.height
            },
            menuActive: true,
            editStart: true
        });

    }

    openInstrument = itemEvent => {
        const targetEqual = this.state.instrumentPanel.target !== itemEvent.target;
        const {instumentActive} = this.state.instrumentPanel;
        if (targetEqual && this.state.editStart && !instumentActive)
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
        let {buildGetComponents} = this.state.editComponent.build;
        let componentsFromDb = [];
        this.setState({
            ...this.state,
            editComponent: {
                ...this.state.editComponent,
                build:{
                    ...this.state.editComponent.build,
                    buildGetComponents: true,
                }
            }
        }, () => {
            array.forEach(item => {

                let id = this.state.editComponent.build.componentJSX.length;
                if (item.type === 'text'){
                    let component = 
                        <TextComponent
                            sizeParenBox = {{...this.state.sizeParenBox}} 
                            id = {id}
                            key = {`text${id}`}>{item.content ? item.content : 'Title'}
                        </TextComponent>;
                        let inform = {type: 'text', component: component};
                        componentsFromDb.push({component: component, inform: inform});
                }

                if (item.type === 'background'){
                    let background = <BackgroundComponent id = {id} key = {`bg${id}`}/>;
                    let inform = {type: 'background', component: background};
                    componentsFromDb.push({component: background, inform: inform});
                }

            });
            this.addHeaderComponent({target: 'Header', dataBaseData: componentsFromDb, mode: "DB"});
        });
    }

    addHeaderComponent = itemEvent => {

        let {componentJSX} = this.state.editComponent.build;
        if (itemEvent.mode !== 'DB')
        this.setState({
            ...this.state,
            editComponent: {
                ...this.state.editComponent,
                build: {
                    ...this.state.editComponent.build,
                    target: itemEvent.target,
                    type: itemEvent.type,
                    componentJSX: [...componentJSX, ...itemEvent.component]},
            },
        });
        else {
            let _bufferComponents = [];
            itemEvent.dataBaseData.forEach(item => {
                _bufferComponents.push(item.component);

            });

            this.setState({
                ...this.state,
                editComponent: {
                    ...this.state.editComponent,
                    build: {
                        ...this.state.editComponent.build,
                        target: itemEvent.target,
                        type: 'text',
                        componentJSX: [...componentJSX, ..._bufferComponents]},
                },
            });
        }
    };

    saveChangesComponent = itemEvent => {

        const {userData} = this.props;
        const componentSaveInBase = {...itemEvent, name: this.state.editComponent.name};

        this.setState({
            ...this.state,
            editComponent: {
                ...this.state.editComponent,
                build: {
                    ...this.state.editComponent.build,
                    components: [...this.state.editComponent.build.components, componentSaveInBase]
                }
            }
        }, () => (
        this.props.dispatch(updateMiddleware({
            uid: userData.idUser,
            projects: [...userData.projects],
            components: [...this.state.editComponent.build.components],
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
                            editComponent =  {{...this.state.editComponent}}
                            instrumentPanel = {{...this.state.instrumentPanel}}
                        />
                        : null
                    }
                        <Header key = 'Header' title = "Constructor"  />
                        <HeaderBuild
                                key = 'HeaderBuild'
                                currentProjectsData = {{...this.props.userData.currentProjectsData}}
                                editStart = {this.state.editStart}
                                countComponents = {this.state.editComponent.build.componentJSX.length}
                                menuActive = {this.state.menuActive}
                                sizeParenBox = {this.state.sizeParenBox}
                                id = {currentProjectsData.idProject}
                        >
                            {{...this.state.editComponent, name: 'Header'}}
                        </HeaderBuild>
                    </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = { '/'} />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    componentDidUpdate(prevProps) {

        let {userData} = this.props;
        let {currentProjectsData} = userData;
        let length = currentProjectsData.components.length;
        let {buildGetComponents} = this.state.editComponent.build;

        const isLOAD = prevProps.userData.currentProjectsData.loadProject === currentProjectsData.loadProject;

        if (isLOAD && currentProjectsData.haveUpdateLoading) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                components: [...current.components]
            }));
        }

        if (currentProjectsData.loadProject && length && !buildGetComponents)
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

        eventEmitter.on('EventBuildHeaderComponents', this.addHeaderComponent);
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
        eventEmitter.off('EventBuildHeaderComponents', this.addHeaderComponent);
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