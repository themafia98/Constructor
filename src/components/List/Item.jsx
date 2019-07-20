import React, {useState} from 'react';
import eventEmitter from '../../EventEmitter';
import {withRouter, Redirect} from 'react-router-dom';

function Item(props) {

    const [path] = useState( `/Cabinet/Build/${props.id}`);

    let [canBuild,setCanBuild] = useState(false);

    const [id] = useState(props.id);
    const [name] = useState(props.name);
    const [type] = useState(props.type);


    const build = event => {
        if(props.location.pathname !== path)
            setCanBuild(true);
        event.stopPropagation();
    };

    const deleteItem = event => {
        eventEmitter.emit('EventDeleteItem',{id: props.id, name: props.name, type: props.type});
        event.stopPropagation();
    };

    if (canBuild) return <Redirect to = {path} />
    else return (
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