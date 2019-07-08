import React, {useState} from 'react';

function Icon(props){
    const [path] = useState(process.env.PUBLIC_URL);
    const [className] = useState(props.className ? props.className : null);
    return (
    <img
        onClick = {props.onClick ? props.onClick : null}
        className = {className}
        title = {props.title ? props.title : null}
        src = {path + props.path} alt = 'icon'>
    </img>
    )
}

export default Icon;