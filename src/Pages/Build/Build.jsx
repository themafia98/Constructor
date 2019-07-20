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
        param: PropTypes.string,
        match: PropTypes.shape({
            params: PropTypes.shape({
                param: PropTypes.string.isRequired
            }).isRequired
        }).isRequired
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
                    component: [],
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
                ...itemEvent.component,
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
        console.log(itemEvent);
        let componentSaveInBase = {...itemEvent, name: this.state.editComponent.name};

        this.setState({
            ...this.state,
            editComponent: {
                ...this.state.editComponent,
                build: {
                    ...this.state.editComponent.build,
                    component: [...this.state.editComponent.build.component, componentSaveInBase]
                }
            }
        }, () => (
        this.props.dispatch(updateMiddleware({
            uid: this.props.idUser,
            projects: [...this.props.currentProject],
            component: [...this.state.editComponent.build.component],
            idProject: this.state.idProject}))
        ));
    };


    render(){
        console.log('render build');
        let instrumentActive = this.state.instrumentPanel.instrumentActive;
        if (this.props.active && this.props.loadProject){
            console.log('build');
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
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = {process.env.PUBLIC_URL + '/'} />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'build' />
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate');
        if (prevProps.loadProject === this.props.loadProject && this.props.haveUpdateLoading) {
            console.log('componentDidUpdate build dispatch');
            let current =  this.props.currentProject.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                component: [...current.component]
            }))
        }
    }
    

    componentDidMount = () => {
        console.log('componentDidMount build');
        if (this.props.active && !this.props.loadProject && this.props.haveUpdateLoading) {
            console.log('componentDidMount build dispatch');
            let current =  this.props.currentProject.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                component: [...current.component]
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
        console.log('componentWillUnmount');
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

    console.log("mapStateToProps" + state);
    return {
        ...state.builder,
        active: state.cabinet.active,
        idUser: state.cabinet.idUser,
        currentProject: state.cabinet.projects
    }
}

export default connect(mapStateToProps)(withFirebase(Build));