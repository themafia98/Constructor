import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';

function Item(props) {
    const [id] = useState(props.id);
    const build = (event) => props.history.push(`/Build/${id}`);
    return (
        <div onClick = {build} className = 'item' data-id = {id}>{props.name}</div>
    )
}

export default withRouter(Item);