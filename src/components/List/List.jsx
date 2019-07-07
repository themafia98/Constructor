import React from 'react';
import PropTypes from 'prop-types';

import './list.scss';

import Item from './Item';
import eventStream from '../../EventEmitter.js';
const projects = require('../../projects.json').projects;

class List extends React.PureComponent {

    static propTypes = {
        children: PropTypes.shape({
            projects: PropTypes.array.isRequired,
           count: PropTypes.number.isRequired,
        })
    }

    state = {
        list: [...projects],
        listCount: projects.length

    }
    
    addHTML = (item) => {

        let lastProject = [...this.state.list];
        const lastIndex = lastProject[lastProject.length-1].id + 1;
        lastProject.push({"id": lastIndex, "title": item.title});

        this.setState({
            ...this.state,
            list: lastProject,
            listCount: lastProject.length
        });
    }

    makeList = (list) => {

        return list.map (project => {

            return <Item key = {project.id} id = {project.id} name = {project.title} />
        });
    }

    render(){
        console.log('render');
        return (
            <div className = 'projectsList__list'>
                {this.makeList([...this.state.list])}
            </div>
        )
    }

    componentWillMount = () => {
        eventStream.on('EventAddHTML', this.addHTML);
      }
    
      componentWillUnmount = () => {
        eventStream.off('EventAddHTML', this.addHTML);
      }
}

export default List;