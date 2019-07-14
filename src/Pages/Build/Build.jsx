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
            menuActive: false,
        }

    workModeEdit = (event) => {
        console.log('workMode');
        this.setState({
            ...this.state,
            idProject: event.idProject,
            editComponent: {...event.component},
            menuActive: true,
            editStart: true
        });

    }
    
    addTextBox = (itemEvent) => {
        this.setState({
            ...this.state,
            editComponent: {...this.state.editComponent,
                build: {type: itemEvent.type, component: [...itemEvent.component]},
            },
            menuActive: false,
        });
    };

    render(){
        console.log('Build');
        console.log(this.state);
        if (this.props.active){
            return (
                <Fragment>
                    <Header title = "Constructor"  />
                    { this.state.editComponent.edit ?
                        <InstrumentsPanel
                            editComponent =  {{...this.state.editComponent, name: 'Header'}}
                            id = {this.state.idProject}
                        />
                        : null
                    }
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
        eventEmitter.on('EventTextBox', this.addTextBox);
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {
        eventEmitter.off('EventTextBox', this.addTextBox);
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