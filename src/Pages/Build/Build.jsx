import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import firebase from '../../Firebase/Firebase';
import {middlewareLoadUserData} from '../../redux/middleware/loadUserMiddleware';
import {loadCurrentProjectAction} from '../../redux/actions';
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

    loadUserData = async () => await this.props.dispatch(middlewareLoadUserData(this.state.user.uid));

    state = {
            user: firebase.getCurrentUser(),
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

        if (this.props.idUser){
            return (
                <Fragment>
                    <Header title = {config.title} />
                    { this.state.edit ?
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
        } else return <Loader path = '/img/loading.gif' type = 'build' />
    }

    componentDidMount = () => {
        eventEmitter.on('EventModeEdit', this.workModeEdit);
        console.log('build');
        if (!this.props.idUser && this.state.user)
            this.loadUserData().then(() => console.log('dispatch here in future...'))
            .catch(error => { console.warn(error); this.props.history.push('/')});
        else if (!this.state.user) this.props.history.push('/');
    }

    componentWillUnmount = () => {
        eventEmitter.off('EventModeEdit', this.workModeEdit);
    }
}

const mapStateToProps = (state) => {

    return {
        ...state.builder,
        idUser: state.cabinet.idUser,
        currentEditable: {}
    }
}

export default connect(mapStateToProps)(withRouter(Build));