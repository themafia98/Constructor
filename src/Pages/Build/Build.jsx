import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

// import {middlewareLoadUserData} from '../../redux/middleware/loadUserMiddleware';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';


import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import InstrumentsPanel from '../../components/instrumentsPanel/InstrumentsPanel';

import HeaderBuild from '../../components/buildComponents/header/headerBuild';

import './build.scss';

const config = require('../../config.json');

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
            idProject: this.props.match.params.param,
            typeProject: null,
            editComponent: {name: null, edit: false},
            edit: false
        }

    workModeEdit = (event) => {
        this.setState({
            ...this.state,
            idProject: event.idProject,
            editComponent: {...event.component, edit: true}
        });
    }

    render(){
        console.log('Build');
        console.log(this.props);
        if (this.props.active){
            return (
                <Fragment>
                    <Header title = {config.title} />
                    { this.state.editComponent.edit ?
                        <InstrumentsPanel
                            editComponent = { this.props.currentEditable ? {...this.props.currentEditable} :
                            {...this.props.editComponent}}
                            id = {this.state.idProject}
                        />
                        : null
                    }
                    <HeaderBuild id = {this.state.idProject}>
                        {{...this.state.editComponent, name: 'Header'}}
                    </HeaderBuild>
                </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = '/' />
        else return <Loader path = '/img/loading.gif' type = 'build' />
    }

    componentDidMount = () => {
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {
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