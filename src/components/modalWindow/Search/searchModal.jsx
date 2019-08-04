import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Icon/icon';
import Loader from '../../loading/Loader';

const SearchModal = props => {

    const refSearch = React.createRef();

    const search = event => {
        let value = null;
        refSearch.current.focus();
        value = refSearch.current.value;

        props.cbSearch(event,value,props.modalSearchMode);
        event.stopPropagation();
    }
    return (

        <React.Fragment>
            <div className = 'Modal Modal-search'>
            <h3>{`Search ${props.modalSearchMode}`}</h3>
            { props.error ?
                <span className = 'error'>{props.error}</span> : null
            }
                <input ref = {refSearch} type = 'text' placeholder = "name" />
                    <input
                        disabled = {props.dissabled}
                        className = 'acceptButton'
                        type = 'button'
                        value = 'Search'
                        onClick = {search}
                    />
                <input onClick = {props.cbCancel} type ='button' value = 'Cancel' />
            <div className = 'searchResultBox'>
                {props.view ? props.cbMakeImageResultBox([...props.images]) : null}
                {props.loading ? <Loader type = 'images' /> : null}
            </div>
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

SearchModal.propTypes = {
    modalSearchMode: PropTypes.string.isRequired, // search mode
    error: PropTypes.string, // about error
    dissabled: PropTypes.bool, // dissabled buttons
    images: PropTypes.array, // array of images
    cbCancel: PropTypes.func.isRequired, // callback cancel
    cbShowImage: PropTypes.func.isRequired, // callback show image
    cbSetSelectedImage: PropTypes.func.isRequired, // callback show image
};

export default SearchModal;