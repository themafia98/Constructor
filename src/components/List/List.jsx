import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {saveChangesAction} from '../../redux/actions';

import './list.scss';

import firebase from '../Firebase/Firebase';
import Item from './Item';
import eventStream from '../../EventEmitter.js';

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
        user: this.props.idUser
    }

    addNewProject = (item) => {
        if (this.props.idUser) {

            let lastProject = [...this.props.list];
            const lastIndex = lastProject.length  ? lastProject[lastProject.length-1].id + 1 : 0;
            lastProject.push({"id": lastIndex, "title": item.title, "type": item.type, components: {}});

            firebase.db.collection("users").doc(this.props.idUser).update({
                'projects': lastProject,
            })
            .then (() => this.props.dispatch(saveChangesAction(lastProject)));

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
        console.log('render list');

        if (this.state.redirect)
            return <Redirect to = '/' />
            else return (
                    <div className = 'projectsList__list'>
                        {this.makeList([...this.props.list])}
                    </div>
                )
    }

    componentWillMount = () =>
        eventStream.on('EventAddProject',this.addNewProject);

      componentWillUnmount = () =>
        eventStream.off('EventAddProject',this.addNewProject);

}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        idUser: state.Cabinet.idUser,
        list: [...state.Cabinet.projects]
    }
}

export default connect(mapStateToProps)(List);