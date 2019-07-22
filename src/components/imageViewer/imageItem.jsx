import React, {useState} from 'react';
import eventEmitter from '../../EventEmitter';

const ImageItem = props => {

    const [id] = useState(props.id);
    const [urlRegular] = useState(props.urls.regular);
    const [urlFull] = useState(props.urls.full);
    const [isFull] = useState(props.isFull);

    const showImageMenu = event => {
       eventEmitter.emit("EventShowMenuImage", {id: id, url: urlRegular, urlFull: urlFull});
    }


    return (
        <div className = {props.selected ? 'ItemBox selected' : 'ItemBox'}>
            <img
                className = 'ImageItem'
                onClick = {showImageMenu}
                src = {isFull ? urlFull : urlRegular}
                alt = 'item'
            />
        </div>
    )
}

export default ImageItem;