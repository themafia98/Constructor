import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';


import {animateScroll as scroll, scroller } from "react-scroll";

import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';

import {middlewareDeleteProjectComponent} from '../../redux/middleware/middlewareDelete';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

import AdditionalTools from '../../components/additionalTools/additionalTools';
import BuilderComponents from '../../components/componentsBuilder/BuilderComponents';
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
            idProject: parseInt(this.props.match.params.param),
            editStart: false,
            isChange: false,
            position: 0,
            isLoadComponents: true,
            projectEmpty: false,
            componentStats: {},
            componentJSX: [],
            instrumentPanel: {
                colorPickerActive: false,
                instrumentActive: false,
            },
            scrollConfig: {
                duration: 1000,
                delay: 50,
                smooth: true,
                offset: -60, // Scrolls to element -80 pixels down the page
            },
            editComponentName:  null,
            menuActive: false,
            modalSearch: false,
            modalSearchMode: null,
            modalViewer: {action: false, image: null, mode: null },
            sizeParentBox: null,
        }

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
            if (!idEqual)
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
                let sizeParentBox = {
                    width: this.mainComponent.data.width,
                    height: this.mainComponent.data.height,
                    top: this.mainComponent.data.top,
                    left: this.mainComponent.data.left,
                }
                let component =
                    <BuilderComponents
                        sizeParentBox = {{...sizeParentBox}}
                        {...item}
                        mode = 'dev'
                        key = {`${item.type}${item.id}`}
                    />;

                const patternJSX = {
                    id: item.id,
                    targetSection: item.targetSection,
                    component: component
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
        }))
        .then(() => this.setState({...this.state,isChange: false}));
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
                            eventItem.componentsPatternBackground],
                sectionsProject: [
                    ...currentProjectsData.sectionsProject,
                    eventItem.componentsPattern.id
                ],
                idProject: this.state.idProject
        }))
        .then(() => {
            this.setState({
                ...this.state,
                componentJSX:[
                    ...this.state.componentJSX,
                    eventItem.component
                ]
            })
        });
}

    moveLocation = event => {
        if (!this.state.modalSearch){ 
            const {sectionsProject} = this.props.userData.currentProjectsData;
            const count = sectionsProject.length-1;
            const moveDown = this.state.position < count && event.deltaY > 0;
            const moveUp = event.deltaY < 0 && this.state.position > 0;

            let sizeParentBox = {
                width: this.mainComponent.data.width,
                height: this.mainComponent.data.height,
                top: this.mainComponent.data.top,
                left: this.mainComponent.data.left,
            }

            if (moveDown){
                this.setState({
                    ...this.state,
                    position: this.state.position + 1,
                    sizeParentBox: sizeParentBox
                }, () => scroller.scrollTo(`element${this.state.position}`,this.state.scrollConfig));
            }  else if (moveUp){
                if (this.state.position === 1){
                    this.setState({
                        ...this.state,
                        position: this.state.position - 1,
                        sizeParentBox: sizeParentBox
                    }, () => scroll.scrollToTop());
                } else {
                    this.setState({
                        ...this.state,
                        position: this.state.position - 1,
                        sizeParentBox: sizeParentBox
                    }, () => scroller.scrollTo(`element${this.state.position}`,this.state.scrollConfig));
                }
            }
        }
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
                    <Header key = 'Header' title = "Constructor"  />
                    <div
                        ref = {this.mainRefComponent} 
                        onWheel = {this.moveLocation}
                        onMouseMove = {this.showAddSection} 
                        className = 'Build' 
                        key = 'Build'
                    >
                        { this.state.editStart &&
                        <Controllers
                            key = 'controllers'
                            editComponentName = {this.state.editComponentName}
                            countComponents = {currentProjectsData.components.length}
                            menuActive = {this.state.menuActive}
                            sizeParentBox = {this.state.sizeParentBox}
                        />
                        }
                            <BuildMenu
                                key = 'buildMenu'
                                countSection = {this.state.componentJSX.length * 5}
                                mode = "section"
                                className = 'menu'
                            />
                        {instrumentActive && <AdditionalTools key = 'tools' {...this.state} />}
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
            current ?
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                sectionsProject: [...current.sectionsProject],
                components: [...current.components]
            })) : this.setState({...this.state, projectEmpty: true, sizeParentBox: sizeParentBox});
        }
        if (currentProjectsData.loadProject && isLoadComponents) {
            if (this.state.sizeParentBox === null && sizeParentBox !== null)
            this.setState({
                ...this.state,
                sizeParentBox: sizeParentBox
            }, () => this.addComponentsFromBD([...currentProjectsData.components]));
            else this.addComponentsFromBD([...currentProjectsData.components]);
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

        eventEmitter.on('EventBuildComponents', this.addComponent);
        eventEmitter.on('EventDeleteComponent', this.deleteComponent);
        eventEmitter.on('EventNewSection', this.addNewSection);
        eventEmitter.on('EventSaveChangesComponent', this.saveChangesComponent);
        eventEmitter.on('EventClosePanel', this.closePanel);
        eventEmitter.on('EventModalSearchOn', this.modalSearchOn);
        eventEmitter.on('EventInstrumentPanel', this.openInstrument);
        eventEmitter.on('EventView', this.ViewerSwitch);
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {

        let {userData} = this.props;
        if (userData.active)  this.props.dispatch(exitProjectAction(true));

        eventEmitter.off('EventBuildComponents', this.addComponent);
        eventEmitter.off('EventDeleteComponent', this.deleteComponent);
        eventEmitter.off('EventNewSection', this.addNewSection);
        eventEmitter.off('EventSaveChangesComponent', this.saveChangesComponent);
        eventEmitter.off('EventModalSearchOn', this.modalSearchOn);
        eventEmitter.off('EventClosePanel', this.closePanel);
        eventEmitter.off('EventInstrumentPanel', this.openInstrument);
        eventEmitter.off('EventView', this.ViewerSwitch);
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
