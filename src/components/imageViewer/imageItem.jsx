import React, {useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter';

const ImageItem = props => {

    const [id] = useState(props.id);
    const [urlRegular] = useState(props.urls.regular);
    const [urlFull] = useState(props.urls.full);
    const [isFull] = useState(props.isFull);
    const [urlContent] = useState(props.urlContent);
    const [selected,setSelected] = useState(false);

    const showImageMenu = event => {
        setSelected(true);
       eventEmitter.emit("EventShowMenuImage", {id: id, url: urlRegular, urlFull: urlFull, iframe: urlContent});
    }
    console.log(props.selected);

    return (
        <div className = {selected ? 'ItemBox selected' : 'ItemBox'}>
            <img
                className = 'ImageItem'
                onClick = {showImageMenu}
                src = {isFull ? urlFull : urlRegular}
                alt = 'item'
            />
        </div>
    )
}

ImageItem.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    urls: PropTypes.object, // data with image path
    isFull: PropTypes.bool, // mode view
    urlContent: PropTypes.string // content path
}

export default ImageItem;