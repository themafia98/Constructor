import React,{useState} from 'react';

export default function(props) {
    const [path] = useState(props.path ? props.path : '/img/loading.gif');
    return (
            <div className = 'loaderBox'>
                <img className = 'loader' src = {path} alt = 'loader'></img> 
                <p>Loading {props.type}</p>
            </div>
    )
}