import React from 'react';
import Icon from '../../Icon/icon';

const SearchImageModal = props => {

    const refSearch = React.createRef();
    console.log('search image');
    const searchBackground = event => {
        refSearch.current.focus();
        let value = refSearch.current;
        props.cbSearchBackground(event,value);
        event.stopPropagation();
    }
     console.log('search image');
    return (

        <React.Fragment>
            <div className = 'Modal Modal-search'>
            <h3>{`Search ${props.modalSearchMode !== 'image' ? 'background image' : 'image'}`}</h3>
            { props.error ?
                <span className = 'error'>{props.error}</span> : null
            }
            <input ref = {refSearch} type = 'text' placeholder = "Photo name" />
            <input
                disabled = {props.dissabled}
                className = 'acceptButton'
                type = 'button'
                value = 'Search'
                onClick = {searchBackground}
            />
            <input onClick = {props.cbCancel} type ='button' value = 'Cancel' />
            {
                props.view ?
                <div className = 'searchResultBox'>
                    {props.cbMakeImageResultBox([...props.images])}
                </div>
                : null
            }
        </div>
        {  props.menuActive ?
            <div className = 'ActionModalSearch'>
            <button onClick = {props.cbShowImage} className = 'actionModalSearch__view'>
                <Icon path = '/img/view.png' />
            </button>
            <button onClick = {props.cbSetSelectedImage} className = 'actionModalSearch__settings'>
                <Icon path = '/img/settings.png' />
            </button>
            </div>
            : null
        }
    </React.Fragment>

    )
}

export default SearchImageModal;