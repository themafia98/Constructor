import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {middlewareCreateProject} from '../../redux/middleware/createProjectMiddleware';

import './list.scss';

import Item from './Item';
import eventEmitter from '../../EventEmitter.js';

class List extends React.PureComponent {

    static propTypes = {
        children: PropTypes.shape({
            projects: PropTypes.array.isRequired,
           count: PropTypes.number.isRequired,
        }),
        list: PropTypes.array.isRequired,
    }

    state = {
        redirect: false,
    }

    addNewProject = (item) => {
        if (this.props.idUser) {
            this.props.dispatch(middlewareCreateProject(this.props.idUser, this.props.list, item.title, item.type));
        } else this.setState({...this.state, redirect: true});
    }


    makeList = (list) => {

        return list.map (project => {

            return(
                <Item
                    key = {project.id}
                    id = {project.id}
                    name = {project.title}
                    type = {project.type}
                />
            )
        });
    }

    render(){
        if (this.state.redirect)
            return <Redirect to = '/' />
            else return (
                    <div className = 'projectsList__list'>
                        {this.makeList([...this.props.list])}
                    </div>
                )
    }

    componentWillMount = () =>
        eventEmitter.on('EventAddProject',this.addNewProject);

      componentWillUnmount = () =>
        eventEmitter.off('EventAddProject',this.addNewProject);

}

const mapStateToProps = (state) => {
    return {
        idUser: state.cabinet.idUser,
        list: [...state.cabinet.projects]
    }
}

export default connect(mapStateToProps)(List);