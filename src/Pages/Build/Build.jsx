import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';
import updateMiddleware from '../../redux/middleware/updateMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

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
        history: PropTypes.object.isRequired, /** @Router HTML5 history */
        location: PropTypes.object.isRequired, /** @Router */
        match: PropTypes.object.isRequired, /** @Router */
        idProject: PropTypes.number, /** @ID current user project from redux */
        typeProject: PropTypes.string, /** @Type current project */
        loadProject: PropTypes.bool.isRequired, /** @Status load project from redux */
        idUser: PropTypes.string, /** @Session user id from redux */
        projects: PropTypes.arrayOf(PropTypes.object).isRequired, /** @currentProject array with user projects */
        components: PropTypes.arrayOf(PropTypes.object).isRequired, /** @Components for current project */
        haveUpdateLoading: PropTypes.bool.isRequired /** @Status status for update state redux and render */
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
                    components: [],
                    componentJSX: []
                },
                edit: false
            },
            changeEdit: false,
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

    modalSearchOn = event => {
        this.setState({...this.state, modalSearch: this.state.modalSearch ? false : true});
    }

    imageViewerSwitch = event => {
        this.setState({
            ...this.state,
            modalImageViewer: {
                ...this.state.modalImageViewer, 
                action: event.action, 
                target: event.target
            }
        });
    };

    workModeEdit = itemEvent => {
        if (!this.state.editStart || this.state.changeEdit)
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
        let targetEqual = this.state.instrumentPanel.target !== itemEvent.target;
        let {instumentActive} = this.state.instrumentPanel;
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

    closePanel = event => {
        this.setState({
            ...this.state,
            instrumentPanel: {
                ...this.state.instrumentPanel,
                colorPickerActive: false,
                instrumentActive: event.close
            }
        });
    };

    addHeaderComponent = itemEvent => {

        let {componentJSX} = this.state.editComponent.build;
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
    };

    saveChangesComponent = itemEvent => {
        let componentSaveInBase = {...itemEvent, name: this.state.editComponent.name};

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
            uid: this.props.idUser,
            projects: [...this.props.projects],
            components: [...this.state.editComponent.build.components],
            idProject: this.state.idProject}))
        ));
    };


    render(){

        let instrumentActive = this.state.instrumentPanel.instrumentActive;
        if (this.props.active && this.props.loadProject){
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
                                editStart = {this.state.editStart}
                                countComponents = {this.state.editComponent.build.componentJSX.length}
                                menuActive = {this.state.menuActive}
                                id = {this.state.idProject}
                        >
                            {{...this.state.editComponent, name: 'Header'}}
                        </HeaderBuild>
                    </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = { '/'} />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.loadProject === this.props.loadProject && this.props.haveUpdateLoading) {
            let current =  this.props.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                components: [...current.components]
            }))
        }
    }
    

    componentDidMount = () => {
        if (this.props.active && !this.props.loadProject && this.props.haveUpdateLoading) {
            let current =  this.props.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                components: [...current.components]
            }))
        };
        eventEmitter.on('EventBuildHeaderComponents', this.addHeaderComponent);
        eventEmitter.on('EventSaveChangesComponent', this.saveChangesComponent);
        eventEmitter.on('EventClosePanel', this.closePanel);
        eventEmitter.on('EventModalSearchOn', this.modalSearchOn);
        eventEmitter.on('EventInstrumentPanel', this.openInstrument);
        eventEmitter.on('EventImageView', this.imageViewerSwitch);
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {
        if (this.props.active)  this.props.dispatch(exitProjectAction(true));
        eventEmitter.off('EventBuildHeaderComponents', this.addHeaderComponent);
        eventEmitter.off('EventSaveChangesComponent', this.saveChangesComponent);
        eventEmitter.off('EventModalSearchOn', this.modalSearchOn);
        eventEmitter.off('EventClosePanel', this.closePanel);
        eventEmitter.off('EventInstrumentPanel', this.openInstrument);
        eventEmitter.off('EventImageView', this.imageViewerSwitch);
        eventEmitter.off('EventModeEdit', this.workModeEdit);
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.builder,
        active: state.cabinet.active,
        idUser: state.cabinet.idUser,
        projects: state.cabinet.projects
    }
}

export default connect(mapStateToProps)(withFirebase(Build));