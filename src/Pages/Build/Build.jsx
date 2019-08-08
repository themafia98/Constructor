import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Reveal from 'react-reveal/Reveal';
/* ------- Events streams ------- */
import eventEmitter from '../../EventEmitter'; // common
import EventBuild from 'events'; // for builder controllers
/* ------- For load project and exit from project ------- */
import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';
/* ------- Moddlewares ------- */
import {middlewareDeleteProjectComponent} from '../../redux/middleware/middlewareDelete';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
/* ------- HOC for het firebase controll object ------- */
import withScroll from '../../components/withScroll';
import withFirebase from '../../components/withFirebase';
/* ------- Child components ------- */
import AdditionalTools from '../../components/additionalTools/additionalTools';
import builderHOC from '../../components/builderHOC';
import Controllers from '../../components/controllers/controllers';
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import Section from '../../components/buildComponents/section';
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
            idProject: parseInt(this.props.match.params.param), /** @Id project */
            editStart: false, /** @Bool start edit or no */
            isChange: false, /** @Bool detected changes */
            isLoadComponents: true, /** @Bool load all necessary components  */
            projectEmpty: false, /** @Bool detected project undefiend */
            componentJSX: [], /** @Array with JSX */
            editComponentName:  null, /** @String | @null name current edit component */
            menuActive: false, /** @bool active menu or no */
            sizeParentBox: null, /** @Object size store */
        }

        eventEmitterBuild = new EventBuild(); // events stream for controllers
        timer = null; // save timer

    workModeEdit = itemEvent => {
        /* set edit mode */
        if (itemEvent.editStart)
        this.setState({
            ...this.state,
            editStart: itemEvent.editStart,
            editComponentName: itemEvent.targetSection,
            menuActive: true,
        });
    }

    deleteComponent = eventItem => {
        /* delete component from DB and from JSX array */
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

    addComponentsFromBD = (array, sizeParentBox) => {
        /* build JSX components from DB */
        if (!sizeParentBox) sizeParentBox = this.state.sizeParentBox;
        let {componentJSX} = this.state;
        let componentsFromDB = [];

        array.forEach(item => {
            if (item.type !== 'background'){
                const itemHash = {
                    props: {
                        ...item,
                        sizeParentBox,
                        mode: 'dev',
                    },
                    type: item.type,
                    id: item.id,
                }
                const patternJSX = {
                    id: item.id,
                    targetSection: item.targetSection,
                    component: builderHOC(itemHash)(Fragment)
                };
                componentsFromDB.push(patternJSX);
            }
        });
            this.setState({
                ...this.state,
                isLoadComponents: false,
                sizeParentBox: {...sizeParentBox},
                componentJSX: [...componentJSX, ...componentsFromDB],
            });
    };

    addComponent = itemEvent => {
         /* create new component */
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
        /* save detected changes in DB and call confirm modal */
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
    /* create new project section */
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

        const {userData} = this.props;
        const {currentProjectsData} = userData;
        const section = currentProjectsData.sectionsProject;

        if (userData.active && currentProjectsData.loadProject){
            return (
                <Reveal effect="fade">
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
                            <AdditionalTools key = 'tools'
                                eventStreamBuild = {this.eventEmitterBuild}
                                eventEmitter = {eventEmitter}
                                editComponentName = {this.state.editComponentName}
                            />
                        {section.length &&
                            <Section mode = 'dev' key = 'section'
                                componentJSX = {this.state.componentJSX}
                                editComponentName = {this.state.editComponentName}
                                menuActive = {this.state.menuActive}
                                sizeParentBox = {this.state.sizeParentBox}
                                userData = {userData}
                            />
                        }
                    </div>
                </Reveal>
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
            /** load current project of user session active and load project - false */
            const current =  userData.projects.find(item => /* find current project */
                                                    item.id === this.state.idProject)
            if (current){ /* load data */
                this.props.dispatch(loadCurrentProjectAction({
                    id: current.id,
                    typeProject: current.type,
                    sectionsProject: [...current.sectionsProject],
                    components: [...current.components]
                }))
                /* else redirect */
            } else this.setState({...this.state, projectEmpty: true});
        }
        if (currentProjectsData.loadProject && isLoadComponents) {
             /* if all components load build our JSX */
            if (this.state.sizeParentBox === null && sizeParentBox !== null)
                this.addComponentsFromBD([...currentProjectsData.components], sizeParentBox);
            else this.addComponentsFromBD([...currentProjectsData.components]);
            /** For scroll component */
            eventEmitter.emit('EventSetState',currentProjectsData.sectionsProject.length-1);
        }
    }

    componentDidMount = () => {
        let {userData} = this.props;
        let {currentProjectsData} = userData;
        /**  If the session is already active, immediately load */
        if (userData.active && !currentProjectsData.loadProject) {
        /** load current project of user session active and load project - false */
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                sectionsProject: [...current.sectionsProject],
                typeProject: current.type,
                components: [...current.components]
            }));

            eventEmitter.on('EventModeEdit', this.workModeEdit);
            this.eventEmitterBuild.on('EventBuildComponents', this.addComponent);
            this.eventEmitterBuild.on('EventDeleteComponent', this.deleteComponent);
            this.eventEmitterBuild.on('EventNewSection', this.addNewSection);
            this.eventEmitterBuild.on('EventSaveChangesComponent', this.saveChangesComponent);
        }; /** else redirect */
    }

    componentWillUnmount = () => {

        let {userData} = this.props;
        if (userData.active){
            this.props.dispatch(exitProjectAction(true));
            eventEmitter.off('EventModeEdit', this.workModeEdit);
            this.eventEmitterBuild.off('EventBuildComponents', this.addComponent);
            this.eventEmitterBuild.off('EventDeleteComponent', this.deleteComponent);
            this.eventEmitterBuild.off('EventNewSection', this.addNewSection);
            this.eventEmitterBuild.off('EventSaveChangesComponent', this.saveChangesComponent);
        }
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

export default connect(mapStateToProps)(withFirebase(withScroll(Build)));
