import React,{useState, useEffect} from 'react';


function ImageViewer(props){

    const effect = event => {
        return () => {};
    };

    useEffect(effect);

    let [path] = useState(props.path);

    return (
        <div className = 'ImageViewer'>
            <img src = {path} alt = 'fullImage' />
        </div>
    )
}

export default ImageViewer;