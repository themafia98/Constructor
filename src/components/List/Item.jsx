import React, {useState} from 'react';

function Item(props) {
    const [id] = useState(props.id);
    const [item] = useState({...props.item});
    return (
        <div className = 'item' data-id = {id}>{props.name}</div>
    )
}

export default Item;