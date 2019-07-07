import React, {useState} from 'react';

function Icon(props){
    const [path] = useState(process.env.PUBLIC_URL);
    return <img src = {path + props.path} alt = 'icon'></img>;
}

export default Icon;