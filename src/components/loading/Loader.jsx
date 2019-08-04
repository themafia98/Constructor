import React,{useState} from 'react';
import './Loader.scss';
export default function(props) {
    const [path] = useState(props.path ? props.path : '/img/loading.gif');
    const [mode] = useState(props.mode ? props.mode : false);
    return (
            <div className = {`loaderBox ${mode && 'specialMode'}`}>
                <img className = 'loader' src = {path} alt = 'loader'></img> 
                {!mode && <p>{`Loading ${props.type}`}</p>}
            </div>
    )
}