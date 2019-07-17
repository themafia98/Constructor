import React,{Fragment} from 'react';

import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';

import HeaderBuild from '../../components/buildComponents/header/headerBuild';

import './build.scss';
import Item from '../../components/List/Item';


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
            typeProject: null,
            editComponent: {name: null, build: {}, edit: false},
            changeEdit: false,
            instrumentPanel: { instrumentActive: false, target: '' },
            menuActive: false,
            editStart: false,
        }

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
        if (this.state.editStart)
        this.setState({
            ...this.state,
            instrumentPanel: {
                ...this.state.instrumentPanel, 
                instrumentActive: true, 
                target: itemEvent.target }
        })
    }

    closePanel = event => {

        this.setState({
            ...this.state,
            instrumentPanel: {
                ...this.state.instrumentPanel,
                colorPickerAvtive: false,
                instrumentActive: event.close}
        })
    }

    addHeaderComponent = itemEvent => {
        this.setState({
            ...this.state,
            editComponent: {
                ...this.state.editComponent,
                build: {
                    target: itemEvent.target,
                    type: itemEvent.type,
                    component: [...itemEvent.component]},
            },
        });
    };


    render(){
        let { instrumentActive } = this.state.instrumentPanel;
        if (this.props.active){
            return (
                <Fragment>
                { instrumentActive ?
                    <InstrumentsPanel
                        editComponent =  {{...this.state.editComponent}}
                        instrumentPanel = {{...this.state.instrumentPanel}}
                    />
                    : null
                }
                    <Header title = "Constructor"  />
                    <HeaderBuild
                            editStart = {this.state.editStart}
                            menuActive = {this.state.menuActive}
                            id = {this.state.idProject}
                    >
                        {{...this.state.editComponent, name: 'Header'}}
                    </HeaderBuild>
                </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = '/' />
        else return <Loader path = '/img/loading.gif' type = 'build' />
    }

    componentDidMount = () => {
        eventEmitter.on('EventBuildHeaderComponents', this.addHeaderComponent);
        eventEmitter.on('EventClosePanel', this.closePanel);
        eventEmitter.on('EventInstrumentPanel', this.openInstrument);
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {
        eventEmitter.off('EventBuildHeaderComponents', this.addHeaderComponent);
        eventEmitter.off('EventClosePanel', this.closePanel);
        eventEmitter.off('EventInstrumentPanel', this.openInstrument);
        eventEmitter.off('EventModeEdit', this.workModeEdit);
    }
}

const mapStateToProps = (state) => {

    return {
        ...state.builder,
        active: state.cabinet.active,
        idUser: state.cabinet.idUser,
        currentEditable: {}
    }
}

export default connect(mapStateToProps)(withFirebase(Build));