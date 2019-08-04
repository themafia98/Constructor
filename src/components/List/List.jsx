import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {middlewareCreateProject} from '../../redux/middleware/createProjectMiddleware';

import './list.scss';

import Item from './Item';

class List extends React.PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired, /** @dispatch redux */
        idUser: PropTypes.string.isRequired, /** @UID current user */
        list: PropTypes.array.isRequired, /** @List user projects */
    }

    state = {
        redirect: false,
    }

    addNewProject = (item) => {
        if (this.props.idUser) {
            this.props.dispatch(middlewareCreateProject(
                    this.props.idUser,
                    this.props.list,
                    item.title,
                    item.type
                ));
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
                    cabinetStream = {this.props.cabinetStream}
                />
            )
        });
    }

    render(){
        if (this.state.redirect)
            return <Redirect to = { '/'} />
            else return (
                    <div className = 'projectsList__list'>
                        {this.makeList([...this.props.list])}
                    </div>
                )
    }

    componentDidMount = () => {
        this.props.cabinetStream.on('EventAddProject',this.addNewProject);
    }

      componentWillUnmount = () => {
        this.props.cabinetStream.off('EventAddProject',this.addNewProject);
      }

}

const mapStateToProps = (state) => {
    return {
        idUser: state.cabinet.idUser,
        list: [...state.cabinet.projects]
    }
}

export default connect(mapStateToProps)(List);