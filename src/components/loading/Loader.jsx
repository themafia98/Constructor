import React,{useState} from 'react';

export default function(props) {
    const [path] = useState(props.path);
    return (
            <div className = 'loaderBox'>
                <img className = 'loader' src = {path} alt = 'loader'></img> 
                <p>Loading {props.type}</p>
            </div>
    )
}