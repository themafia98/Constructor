import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';
import EventBuild from 'events';
import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';

import {middlewareDeleteProjectComponent} from '../../redux/middleware/middlewareDelete';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

import AdditionalTools from '../../components/additionalTools/additionalTools';
import builderHOC from '../../components/builderHOC';
import Controllers from '../../components/controllers/controllers';
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import Section from '../../components/buildComponents/section';
import BuildMenu from '../../components/componentsBuildMenu/BuildMenu';

import './build.scss';

import Input from '../../components/buildComponents/components/Input';
import Media from '../../components/buildComponents/components/Media';
import Image from '../../components/buildComponents/components/Image';
import TextComponent from '../../components/buildComponents/components/Text';
import BackgroundComponent from '../../components/buildComponents/components/Background';

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
            isChange: false,
            isLoadComponents: true,
            projectEmpty: false,
            componentStats: {},
            componentJSX: [],
            instrumentPanel: {
                colorPickerActive: false,
                instrumentActive: false,
            },
            editComponentName:  null,
            menuActive: false,
            modalSearch: false,
            modalSearchMode: null,
            modalViewer: {action: false, image: null, mode: null },
            sizeParentBox: null,
        }

        eventEmitterBuild = new EventBuild(); // events stream for controllers
        timer = null; // save timer

    modalSearchOn = itemEvent => {
        const modeHave = itemEvent.hasOwnProperty('mode');
        this.setState({
            ...this.state, 
            modalSearch: !this.state.modalSearch,
            modalSearchMode: modeHave ? itemEvent.mode : null
        });
    }

    ViewerSwitch = itemEvent => {

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

    workModeEdit = itemEvent => {

        if (itemEvent.editStart)
        this.setState({
            ...this.state,
            editStart: itemEvent.editStart,
            editComponentName: itemEvent.targetSection,
            menuActive: true,
        });

    }

    openInstrument = itemEvent => {
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

        this.setState({
            ...this.state,
            instrumentPanel: {
                ...this.state.instrumentPanel,
                colorPickerActive: false,
                instrumentActive: itemEvent.close
            }
        });
    };

    deleteComponent = eventItem => {
        let {currentProjectsData} = this.props.userData;
        let {componentJSX} = this.state;

        const data = {
            id: this.state.idProject,
            uid: this.props.userData.idUser,
            idComponent: eventItem.id,
            sectionsProject: [...currentProjectsData.sectionsProject],
            type: eventItem.type
        }

        this.props.dispatch(middlewareDeleteProjectComponent(data))
        .then(id => {
            if (id !== null){
               const _componentJSX = componentJSX.filter(item => item.id !== id);
            this.setState({
                ...this.state,
                componentJSX: _componentJSX
            });
        }
        });
    }

    addComponentsFromBD = array => {

        let {componentJSX} = this.state;
        let componentsFromDB = [];

        array.forEach(item => {
            if (item.type !== 'background'){

                let props = {
                    sizeParentBox: {
                        width: this.mainComponent.data.width,
                        height: this.mainComponent.data.height,
                        top: this.mainComponent.data.top,
                        left: this.mainComponent.data.left,
                    },
                    ...item,
                    mode: 'dev',
                }
                let Component = null;
                    if (item.type === 'background') Component = BackgroundComponent;
                    else if (item.type === 'input') Component = Input;
                    else if (item.type === 'media') Component = Media;
                    else if (item.type === 'image') Component = Image;
                    else if (item.type === 'text') Component = TextComponent;

                const patternJSX = {
                    id: item.id,
                    targetSection: item.targetSection,
                    component: builderHOC(props)(Component)
                };
                componentsFromDB.push(patternJSX);
            }
        });
            this.setState({
                ...this.state,
                isLoadComponents: false,
                componentJSX: [...componentJSX, ...componentsFromDB],
            });
    };

    addComponent = itemEvent => {
        console.log(itemEvent);
        let {componentJSX} = this.state;
        let {componentsPattern} = itemEvent;

        const patternJSX = {
            id: componentsPattern.id,
            targetSection: componentsPattern.targetSection,
            component: itemEvent.component
        };
            this.setState({
                ...this.state,
                componentJSX: [...componentJSX, patternJSX],
            });
    };

    saveChangesComponent = itemEvent => {

        const {ms} = itemEvent;
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            const {currentProjectsData} = this.props.userData;
            const {userData} = this.props;
            let findCurrentItem = false;
            const _components = currentProjectsData.components.map(item => {
                if (item.id === itemEvent.id) { findCurrentItem = true; return {...itemEvent}; }
                return item;
            });

            if (!findCurrentItem) _components.push(itemEvent);

            this.props.dispatch(updateMiddleware({
                uid: userData.idUser,
                projects: [...userData.projects],
                components: _components,
                sectionsProject: [...currentProjectsData.sectionsProject],
                idProject: this.state.idProject
            })).then(() =>
                eventEmitter.emit('EventRedirectConfirm', {false: false, confirm: false}));
        },ms);
    };

    mainComponent = null;
    mainRefComponent = node => node ?
        this.mainComponent = {data: node.getBoundingClientRect(), node: node} : node;

    addNewSection = eventItem => {

        const {userData} = this.props;
        const {currentProjectsData} = userData;

        this.props.dispatch(updateMiddleware({
                uid: userData.idUser,
                projects: [...userData.projects],
                components: [...currentProjectsData.components,
                            eventItem.componentsPattern],
                sectionsProject: [
                    ...currentProjectsData.sectionsProject,
                    eventItem.componentsPattern.id
                ],
                idProject: this.state.idProject
        })).then(() => {
            this.setState({
                ...this.state,
                componentJSX:[
                    ...this.state.componentJSX,
                    eventItem.component
                ]
            }, () => {
                eventEmitter.emit('EventSetState', currentProjectsData.sectionsProject.length);
            });
        });
}

    render(){

        if (this.state.projectEmpty) return <Redirect to = '/Cabinet' />

        const {instrumentActive} = this.state.instrumentPanel;
        const {userData} = this.props;
        const {currentProjectsData} = userData;
        const section = currentProjectsData.sectionsProject;

        if (userData.active && currentProjectsData.loadProject){
            return (
                <Fragment>
                    <Header key = 'Header' title = "Constructor" idUser = {userData.idUser}  />
                    <div
                        ref = {this.mainRefComponent} 
                        onMouseMove = {this.showAddSection} 
                        className = 'Build' 
                        key = 'Build'
                    >
                        { this.state.editStart &&
                        <Controllers
                            key = 'controllers'
                            eventStreamBuild = {this.eventEmitterBuild}
                            editComponentName = {this.state.editComponentName}
                            countComponents = {currentProjectsData.components.length}
                            menuActive = {this.state.menuActive}
                            sizeParentBox = {this.state.sizeParentBox}
                        />
                        }
                            <BuildMenu
                                key = 'buildMenu'
                                eventStreamBuild = {this.eventEmitterBuild}
                                countSection = {this.state.componentJSX.length * 5}
                                mode = "section"
                                className = 'menu'
                            />
                        {instrumentActive && 
                            <AdditionalTools
                                eventStreamBuild = {this.eventEmitterBuild}
                                key = 'tools' {...this.state} 
                            />}
                        {section.length && <Section mode = 'dev' key = 'section' {...this.state} userData = {userData} />}
                    </div>
                </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = '/' />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    componentDidUpdate = (prevProps) => {

        let {userData} = this.props;
        let {currentProjectsData} = userData;
        const isLoadComponents = this.state.isLoadComponents;
        let sizeParentBox = null;

        if (this.mainComponent && this.state.sizeParentBox === null)
            sizeParentBox = {
                width: this.mainComponent.data.width,
                height: this.mainComponent.data.height,
                top: this.mainComponent.data.top,
                left: this.mainComponent.data.left,
            }

        if (userData.active && !currentProjectsData.loadProject) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            if (current){
                this.props.dispatch(loadCurrentProjectAction({
                    id: current.id,
                    typeProject: current.type,
                    sectionsProject: [...current.sectionsProject],
                    components: [...current.components]
                }))

            } else this.setState({...this.state, projectEmpty: true, sizeParentBox: sizeParentBox});
        }
        if (currentProjectsData.loadProject && isLoadComponents) {
            if (this.state.sizeParentBox === null && sizeParentBox !== null)
            this.setState({
                ...this.state,
                sizeParentBox: sizeParentBox
            }, () => this.addComponentsFromBD([...currentProjectsData.components]));
            else this.addComponentsFromBD([...currentProjectsData.components]);
            eventEmitter.emit('EventSetState',currentProjectsData.sectionsProject.length-1);
        }
    }

    componentDidMount = () => {
        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject) {

            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                sectionsProject: [...current.sectionsProject],
                typeProject: current.type,
                components: [...current.components]
            }));
        };

        eventEmitter.on('EventInstrumentPanel', this.openInstrument);
        eventEmitter.on('EventModeEdit', this.workModeEdit);
        this.eventEmitterBuild.on('EventBuildComponents', this.addComponent);
        this.eventEmitterBuild.on('EventDeleteComponent', this.deleteComponent);
        this.eventEmitterBuild.on('EventNewSection', this.addNewSection);
        this.eventEmitterBuild.on('EventSaveChangesComponent', this.saveChangesComponent);
        this.eventEmitterBuild.on('EventClosePanel', this.closePanel);
        this.eventEmitterBuild.on('EventModalSearchOn', this.modalSearchOn);
        this.eventEmitterBuild.on('EventView', this.ViewerSwitch);
    }

    componentWillUnmount = () => {

        let {userData} = this.props;
        if (userData.active)  this.props.dispatch(exitProjectAction(true));

        eventEmitter.off('EventInstrumentPanel', this.openInstrument);
        eventEmitter.off('EventModeEdit', this.workModeEdit);
        this.eventEmitterBuild.off('EventBuildComponents', this.addComponent);
        this.eventEmitterBuild.off('EventDeleteComponent', this.deleteComponent);
        this.eventEmitterBuild.off('EventNewSection', this.addNewSection);
        this.eventEmitterBuild.off('EventSaveChangesComponent', this.saveChangesComponent);
        this.eventEmitterBuild.off('EventModalSearchOn', this.modalSearchOn);
        this.eventEmitterBuild.off('EventClosePanel', this.closePanel);
        this.eventEmitterBuild.off('EventView', this.ViewerSwitch);
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
