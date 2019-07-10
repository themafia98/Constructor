import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import eventEmitter from '../../EventEmitter';

import {loadCurrentProjectAction} from '../../redux/actions';
import {connect} from 'react-redux';

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
        component: {},
        editComponent: {
            name: '',
            edit: false
        }
    }

    workModeEdit = (event) => {
        this.setState({
            ...this.state,
            idProject: event.idProject,
            editComponent: {...event.component, edit: true}
        });
    }

    render(){
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
    }

    componentDidMount = () => {
        eventEmitter.on('EventModeEdit', this.workModeEdit);

        let currentComponents = this.props.project.find(item => {
            return parseInt(item.id) === parseInt(this.state.idProject)
        });
        if (currentComponents)
        this.props.dispatch(loadCurrentProjectAction({...currentComponents}));
        else this.props.history.push('/');
    }

    componentWillUnmount = () => {
        eventEmitter.off('EventModeEdit', this.workModeEdit);
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.builder,
        currentEditable: state.builder.currentEditable ? {...state.builder.currentEditable} : null,
        project: [...state.builder.project]
    }
}

export default connect(mapStateToProps)(withRouter(Build));