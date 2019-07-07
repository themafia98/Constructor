import React from 'react';
import PropTypes from 'prop-types';

import './list.scss';

import Item from './Item.jsx';

class List extends React.PureComponent {

    static propTypes = {
        children: PropTypes.shape({
            projects: PropTypes.array.isRequired,
           count: PropTypes.number.isRequired,
        })
    }

    state = {
        list: [...this.props.children.projects],
        listCount: this.props.children.count

    }

    makeList = (list) => {

        return list.map (project => {

            return <Item key = {project.id} id = {project.id} name = {project.title} />
        });
    }

    render(){
        return (
            <div className = 'projectsList__list'>
                {this.makeList([...this.state.list])}
            </div>
        )
    }
}

export default List;