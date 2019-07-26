import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

import BuilderComponents from '../../components/componentsBuilder/BuilderComponents';
import Controllers from '../../components/controllers/controllers';
import ImageViewer from '../../components/imageViewer/imageViewer';
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import MainBackground from '../../components/buildComponents/MainBackground/MainBackground';

import BuildMenu from '../../components/componentsBuildMenu/BuildMenu';

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
            editStart: false,
            isLoadComponents: true,
            projectEmpty: false,
            sectionTitleProjectAction: true,
            showSectionAddMenu: false,
            mainBuilderData: {
                mainBoxWidth: null,
                mainBoxHeight: null,
                buildGetComponents: false,
                components: [],
                sectionTitleProject: this.props.currentProjectsData ? this.props.currentProjectsData.sectionTitleProject : [],
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
        if (itemEvent.editStart)
        this.setState({
            ...this.state,
            editStart: itemEvent.editStart,
            editComponentName: itemEvent.idProject,
            mainBuilderData: {
                ...this.state.mainBuilderData,
                mainBoxWidth: itemEvent.width,
                mainBoxHeight: itemEvent.height,
            },
            menuActive: true,
        });

    }

    openInstrument = itemEvent => {

        if (this.state.editComponentName){
            const targetEqual = this.state.instrumentPanel.target !== itemEvent.target;
            const idEqual = this.state.instrumentPanel.idComponent !== itemEvent.id;
            const instumentActive = this.state.instrumentPanel.instrumentActive;
            if (targetEqual || !instumentActive || idEqual)
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

        let componentsFromDB = [];
        let components = [...this.state.mainBuilderData.components];
        array.forEach(item => {
            if (item.type !== 'background'){

                let component =
                    <BuilderComponents
                        sizeParenBox = {{...this.state.sizeParenBox}}
                        coords = {{...item.coords}}
                        size = {item.fontSize}
                        color = {item.color}
                        id = {item.id}
                        type = {item.type}
                        key = {`${item.type}${item.id}`}
                        content = {item.content ? item.content : 'Title'}
                    />

                const patternJSX = {
                    id: item.id,
                    name: item.name,
                    component: component
                }
                componentsFromDB.push(patternJSX);
                components.push(item);
            }
            else components.push(item);
        });
        this.addComponent({
            components: components,
            target: this.state.editComponentName,
            dataBaseData: componentsFromDB, mode: 'DB'});
    }

    addComponent = itemEvent => {
        let {componentJSX} = this.state.mainBuilderData;

        if (itemEvent.mode !== 'DB'){
        const patternJSX = {
            id: itemEvent.componentsPatternStatus.id,
            name: itemEvent.componentsPatternStatus.name,
            component: itemEvent.component
        }
            this.setState({
                ...this.state,
                mainBuilderData: {
                    ...this.state.mainBuilderData,
                    components: [...this.state.mainBuilderData.components,
                                itemEvent.componentsPatternStatus],
                    componentJSX: [...componentJSX, patternJSX],
                },
            });
        } else {
            this.setState({
                ...this.state,
                isLoadComponents: false,
                mainBuilderData: {
                    ...this.state.mainBuilderData,
                    components: [...this.state.mainBuilderData.components,
                                ...itemEvent.components],
                    componentJSX: [...componentJSX, ...itemEvent.dataBaseData],
                },
            });
        }
    };

    saveChangesComponent = itemEvent => {

        const {userData} = this.props;
        let findCurrentItem = false;
        const _components = this.state.mainBuilderData.components.map(item => {
            if (item.id === itemEvent.id) { findCurrentItem = true; return {...itemEvent}; }
            return item;
        });

        if (!findCurrentItem) _components.push(itemEvent);

        this.setState({
            ...this.state,
            mainBuilderData: {
                ...this.state.mainBuilderData,
                isChange: false,
                components: _components
            }
        }, () => {
            let {currentProjectsData} =this.props.userData;
        return    (
        this.props.dispatch(updateMiddleware({
            uid: userData.idUser,
            projects: [...userData.projects],
            components: [...this.state.mainBuilderData.components],
            sectionTitleProject: [...currentProjectsData.sectionTitleProject],
            idProject: this.state.idProject}))
        )});
    };

    saveWidth = eventItem => {
        this.setState({sizeParenBox: {...eventItem}});
    };

    sectionTitleProject = section => {
        return section.map(item => {
            return (
                <MainBackground
                    key = {item}
                    mainBuilderData = {{...this.state.mainBuilderData}}
                    currentProjectsData = {{...this.props.userData.currentProjectsData}}
                    editComponentName = {this.state.editComponentName}
                    countComponents = {this.state.mainBuilderData.componentJSX.length}
                    menuActive = {this.state.menuActive}
                    sizeParenBox = {this.state.sizeParenBox}
                    id = {item}
                >
                    {{name: this.state.editComponentName}}
                </MainBackground>
            );
        });
    }

    buildAdditional = () => {
        return (
            <Fragment key = 'AdditionalBuild'>
                {   this.state.modalImageViewer.action ?
                        <ImageViewer key = 'ImageViewer' path = {this.state.modalImageViewer.target} />
                    : null
                }
                {   this.state.modalSearch ?
                        <ModalWindow
                            idComponent = {this.state.instrumentPanel.idComponent}
                            key = 'ModalWindow' workMode = 'Search' 
                        /> 
                    : null
                }
                    <InstrumentsPanel
                        key = 'InstrumentsPanel'
                        editComponentName = {this.state.editComponentName}
                        mainBuilderData =  {{...this.state.mainBuilderData}}
                        instrumentPanel = {{...this.state.instrumentPanel}}
                    />
            </Fragment>
        )
    }

    showAddSection = event => {
        if (event.pageY > 780 && !this.state.showSectionAddMenu){
            this.setState({
                ...this.state,
                showSectionAddMenu: true,
            });
        } else if (event.pageY < 780 && this.state.showSectionAddMenu){
            this.setState({
                ...this.state,
                showSectionAddMenu: false,
            });
        }
        event.stopPropagation();
    }
    mainComponent = null;
    mainRefComponent = node => this.mainComponent = node;

    render(){

        if (this.state.projectEmpty) return <Redirect to = '/Cabinet' />

        const {instrumentActive} = this.state.instrumentPanel;
        const {userData} = this.props;
        const {currentProjectsData} = userData;

        if (userData.active && currentProjectsData.loadProject){
            return (
                    <div ref = {this.mainRefComponent} onMouseMove = {this.showAddSection} className = 'Build' key = 'Build'>
                        <Header key = 'Header' title = "Constructor"  />
                        { this.state.editStart ?
                        <Controllers
                            key = {`controllers`}
                            editComponentName = {this.state.editComponentName}
                            countComponents = {this.state.mainBuilderData.components.length}
                            menuActive = {this.state.menuActive}
                            sizeParenBox = {this.state.sizeParenBox}
                        /> : null
                        }
                        {   this.state.showSectionAddMenu ?
                            <BuildMenu
                                countSection = {this.state.mainBuilderData.sectionTitleProject.length}
                                mode = "section"
                                className = 'menu'
                            />
                        : null
                        }
                        {   instrumentActive ?
                                this.buildAdditional()
                            : null
                        }
                        {this.sectionTitleProject(currentProjectsData.sectionTitleProject)}
                    </div>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = '/' />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    addNewSection = eventItem => {

                const {userData} = this.props;
        const {currentProjectsData} = userData;
        this.setState({
            ...this.state,
            mainBuilderData:{
                ...this.state.mainBuilderData,
                sectionTitleProject: [
                    ...this.state.mainBuilderData.sectionTitleProject,
                    ...currentProjectsData.sectionTitleProject,
                    eventItem.componentsPatternStatus.id
                ],
                components:[
                    ...this.state.mainBuilderData.components,
                    eventItem.componentsPatternStatus
                ],
                componentJSX:[
                    ...this.state.mainBuilderData.componentJSX,
                    eventItem.component
                ]
            }
        },  () => (
            this.props.dispatch(updateMiddleware({
                uid: userData.idUser,
                projects: [...userData.projects],
                components: [...this.state.mainBuilderData.components],
                sectionTitleProject: [...this.state.mainBuilderData.sectionTitleProject],
                idProject: this.state.idProject}))
            ));
    }

    componentDidUpdate(prevProps) {

        let {userData} = this.props;
        let {currentProjectsData} = userData;
        const isLoadComponents = this.state.isLoadComponents;

        if (userData.active && !currentProjectsData.loadProject) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            current ?
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                sectionTitleProject: [...current.sectionTitleProject],
                components: [...current.components]
            })) : this.setState({...this.state, projectEmpty: true});
        }
        if (currentProjectsData.loadProject && isLoadComponents)
            this.addComponentsFromBD([...currentProjectsData.components]);
    }

    componentDidMount = () => {

        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject) {
            console.log('load prjoect');
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                sectionTitleProject: [...current.sectionTitleProject],
                typeProject: current.type,
                components: [...current.components]
            }));
        };

        eventEmitter.on('EventBuildComponents', this.addComponent);
        eventEmitter.on('EventNewSection', this.addNewSection);
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
        eventEmitter.off('EventNewSection', this.addNewSection);
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