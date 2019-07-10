import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {saveChangesAction} from '../../redux/actions';

import './list.scss';

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

    addNewProject = (item) => {
        let lastProject = [...this.props.list];
        const lastIndex = lastProject.length  ? lastProject[lastProject.length-1].id + 1 : 0;
        lastProject.push({"id": lastIndex, "title": item.title, "type": item.type, components: {}});
        this.props.dispatch(saveChangesAction(lastProject));
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
        return (
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
    return {list: [...state.builder.project]}
}

export default connect(mapStateToProps)(List);