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
            sectionTitleProjectAction: true,
            showSectionAddMenu: false,
            mainBuilderData: {
                mainBoxWidth: null,
                mainBoxHeight: null,
                buildGetComponents: false,
                components: [],
                sectionsJSX: [],
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
        const idEqual = this.state.instrumentPanel.idComponent !== itemEvent.id;
        const instumentActive = this.state.instrumentPanel.instrumentActive;
        if ((targetEqual || !instumentActive || idEqual) && this.state.editStart)
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
                componentsFromDB.push(component);
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
        console.log('add');
        let {componentJSX} = this.state.mainBuilderData;
        if (itemEvent.mode !== 'DB')
            this.setState({
                ...this.state,
                mainBuilderData: {
                    ...this.state.mainBuilderData,
                    components: [...this.state.mainBuilderData.components,
                                itemEvent.componentsPatternStatus],
                    componentJSX: [...componentJSX, {...itemEvent.component}]
                },
            });
        else {
            this.setState({
                ...this.state,
                mainBuilderData: {
                    ...this.state.mainBuilderData,
                    components: [...this.state.mainBuilderData.components,
                                ...itemEvent.components],
                    componentJSX: [...componentJSX, ...itemEvent.dataBaseData]
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
                components: _components
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

    sectionTitleProject = section => {
        const {userData} = this.props;
        const {currentProjectsData} = userData;
        return section.map(item => {
            if (item === 'Header')
            return (
                <MainBackground
                    key = 'HeaderBuild'
                    mainBuilderData = {{...this.state.mainBuilderData}}
                    currentProjectsData = {{...this.props.userData.currentProjectsData}}
                    editStart = {this.state.editStart}
                    editComponentName = {this.state.editComponentName}
                    countComponents = {this.state.mainBuilderData.componentJSX.length}
                    menuActive = {this.state.menuActive}
                    sizeParenBox = {this.state.sizeParenBox}
                    id = {currentProjectsData.idProject}
                >
                {{name: this.state.editComponentName}}
            </MainBackground>
            );
            else return item;
        })
    }

    buildAdditional = () => {
        const {instrumentActive} = this.state.instrumentPanel;
        return (
            <Fragment key = 'AdditionalBuild'>
                {   this.state.modalImageViewer.action ?
                    <ImageViewer key = 'ImageViewer' path = {this.state.modalImageViewer.target} />
                    : null
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
                {this.state.showSectionAddMenu ?
                    <BuildMenu mode = "section" className = 'menu' />
                    : null
                }
            </Fragment>
        )
    }

    showAddSection = event => {
        console.log(this.mainComponent.getBoundingClientRect().height);
        console.log(event.pageY);
        if (event.pageY > 800 && !this.state.showSectionAddMenu){
            this.setState({
                ...this.state,
                showSectionAddMenu: true,
            });
        } else if (event.pageY < 850 && this.state.showSectionAddMenu){
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
        const {userData} = this.props;
        const {currentProjectsData} = userData;

        if (userData.active && currentProjectsData.loadProject){
            return (
                    <div ref = {this.mainRefComponent} onMouseMove = {this.showAddSection} className = 'Build' key = 'Build'>
                        <Header key = 'Header' title = "Constructor"  />
                        {this.buildAdditional()}
                        {this.sectionTitleProject(currentProjectsData.sectionTitleProject)}
                    </div>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = { '/'} />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    componentDidUpdate(prevProps) {

        let {userData} = this.props;
        let {currentProjectsData} = userData;
        const isIncludeComponent = currentProjectsData.components.length;
        const isIncludeComponentJSX = this.state.mainBuilderData.componentJSX.length;
        const isIclude = isIncludeComponent && !isIncludeComponentJSX;

        if (userData.active && !currentProjectsData.loadProject) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                sectionTitleProject: [...current.sectionTitleProject],
                components: [...current.components]
            }));
        }
        if (currentProjectsData.loadProject && isIclude && this.state.editStart)
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