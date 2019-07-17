import React, {useState} from 'react';
import eventEmitter from '../../EventEmitter';
import {withRouter} from 'react-router-dom';

function Item(props) {
    const [id] = useState(props.id);
    const [name] = useState(props.name);
    const [type] = useState(props.type);


    const build = event => {
        props.history.push(`/Cabinet/Build/${id}`);
        event.stopPropagation();
    };

    const deleteItem = event => {
        eventEmitter.emit('EventDeleteItem',{id: props.id, name: props.name, type: props.type});
        event.stopPropagation();
    };

    return (
        <div className = 'item' data-id = {id}>
            <p className = 'ProjectName'>{name}</p>
            <p className = 'ProjectType'>{type}</p>
            <div className = 'projectController'>
            <input onClick = {build} className = 'projectControllerButton_enter' type = 'button' value = 'enter build' />
            <input onClick = {deleteItem} className = 'projectControllerButton_delete' type = 'button' value = 'delete' />
            </div>
        </div>
    )
}

export default withRouter(Item);