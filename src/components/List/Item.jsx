import React, {useState} from 'react';

function Item(props) {
    const [id] = useState(props.id);
    return (
        <div className = 'item' data-id = {id}>{props.name}</div>
    )
}

export default Item;