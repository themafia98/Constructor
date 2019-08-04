import React, {useState} from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter';
import {withRouter, Redirect} from 'react-router-dom';

function Item(props) {

    const [path] = useState( `/Cabinet/Build/${props.id}`);
    const [productionPath] = useState(`/Cabinet/Build/${props.id}/Production/`);

    let [canBuild,setCanBuild] = useState(false);
    let [canProd, setCanProd] = useState(false);

    const [id] = useState(props.id);
    const [name] = useState(props.name);
    const [type] = useState(props.type);


    const build = event => {
        if(props.location.pathname !== path)
            setCanBuild(true);
        event.stopPropagation();
    };

    const showProduction = event => {
        if(props.location.pathname !== path)
        setCanProd(true);
        event.stopPropagation();
    };

    const deleteItem = event => {
        eventEmitter.emit('EventDeleteItem',{
            id: props.id,
            name: props.name,
            type: props.type
        });
        event.stopPropagation();
    };


    if (canBuild) return <Redirect to = {path} />
    else if (canProd) return <Redirect to = {productionPath} />
    else return (
            <div className = 'item' data-id = {id}>
                <p className = 'ProjectName'>{name}</p>
                <p className = 'ProjectType'>{type}</p>
                <div className = 'projectController'>
                    <input 
                        onClick = {build} 
                        className = 'projectControllerButton_enter' 
                        type = 'button' 
                        value = 'enter build' />
                    <input onClick = {deleteItem} 
                        className = 'projectControllerButton_delete' 
                        type = 'button' 
                        value = 'delete' />
                </div>
                <input onClick = {showProduction} 
                    className = 'productionButton' 
                    type = 'button' 
                    value = 'Production' />
            </div>
        )
}

Item.propTypes = {
    id: PropTypes.number.isRequired, // id item
    name: PropTypes.string.isRequired, // item name
    type: PropTypes.string.isRequired, // item type
}

export default withRouter(Item);