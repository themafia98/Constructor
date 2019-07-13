import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';

function Item(props) {
    const [id] = useState(props.id);
    const [name] = useState(props.name);
    const [type] = useState(props.type);

    const build = (event) => {
        props.history.push(`/Cabinet/Build/${id}`);
        event.stopPropagation();
    };
    return (
        <div onClick = {build} className = 'item' data-id = {id}>
            <p className = 'ProjectName'>{name}</p>
            <p className = 'ProjectType'>{type}</p>
        </div>
    )
}

export default withRouter(Item);