import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter';

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
                <InstrumentsPanel editComponent = {{...this.state.editComponent}} id = {this.state.idProject} />
                <HeaderBuild id = {this.state.idProject}>
                    {{...this.state.editComponent, name: 'Header'}}
                </HeaderBuild>
            </Fragment>
        )
    }

    componentDidMount = () => {
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }

    componentWillUnmount = () => {
        eventEmitter.on('EventModeEdit', this.workModeEdit);
    }
}

export default Build;