import React from 'react';
import PropTypes from 'prop-types';

import './list.scss';

import Item from './Item.jsx';

class List extends React.PureComponent {

    static propTypes = {
        children: PropTypes.object,
    }

    state = {
        listCount: this.props.children.count

    }

    makeList = (count = 0) => {

        let items = [];
        for (let i = 0; i < count; i++){
            items.push(
                <Item id = {i} item = {{name: 'Project 1'}} />
            )
        }

        return items;
    }

    render(){
        return (
            <div className = 'projectsList__list'>
                {this.makeList(this.state.listCount)}
            </div>
        )
    }
}

export default List;