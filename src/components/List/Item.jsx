import React, {useState} from 'react';

function Item(props) {
    const [id] = useState(props.id);
    const [item] = useState({...props.item});
    return (
        <div className = 'item' data-id = {id}>{item.name}</div>
    )
}

export default Item;