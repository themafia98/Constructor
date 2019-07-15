import React, {useState} from 'react';


function Icon(props){
    const [path] = useState(props.path);
    const [className] = useState(props.className ? props.className : null);
    const [draggable] = useState(props.draggable ? true : false);

    return (
    <img
        draggable = {draggable}
        onClick = {props.onClick ? props.onClick : null}
        className = {className}
        title = {props.title ? props.title : null}
        src = {path} alt = 'icon'>
    </img>
    )
}

export default Icon;