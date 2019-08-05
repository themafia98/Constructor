import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../../EventEmitter';
import Icon from '../../Icon/icon';
import Loader from '../../loading/Loader';

class  SearchModal extends React.PureComponent {

    static propTypes = {
        modalSearchMode: PropTypes.string.isRequired, // search mode
        error: PropTypes.string, // about error
        dissabled: PropTypes.bool, // dissabled buttons
        images: PropTypes.array, // array of images
        cbCancel: PropTypes.func.isRequired, // callback cancel
        cbShowImage: PropTypes.func.isRequired, // callback show image
        cbSetSelectedImage: PropTypes.func.isRequired, // callback show image
    }

    state = {
        mode: this.props.modalSearchMode,
        items: this.props.images,
    }

    search = event => {
        const value = this.refSearch ? this.refSearch.value : null;
        this.props.cbSearch(event,value, this.props.modalSearchMode);
        event.stopPropagation();
    }

    refSearch = null;
    refSearchFunc = node => this.refSearch = node;

    render(){
        return (
            <React.Fragment>
                <div className = 'Modal Modal-search'>
                <h3>{`Search ${this.props.modalSearchMode}`}</h3>
                { this.props.error ?
                    <span className = 'error'>{this.props.error}</span> : null
                }
                    <input ref = {this.refSearchFunc} type = 'text' placeholder = "name" />
                        <input
                            disabled = {this.props.dissabled}
                            className = 'acceptButton'
                            type = 'button'
                            value = 'Search'
                            onClick = {this.search}
                        />
                    <input onClick = {this.props.cbCancel} type ='button' value = 'Cancel' />
                <div className = 'searchResultBox'>
                    {this.state.items}
                    {this.props.loading ? <Loader type = 'images' /> : null}
                </div>
                </div>
                {  this.props.menuActive ?
                    <div className = 'ActionModalSearch'>
                    <button onClick = {this.props.cbShowImage} className = 'actionModalSearch__view'>
                        <Icon path = '/img/view.png' />
                    </button>
                    <button onClick = {this.props.cbSetSelectedImage} className = 'actionModalSearch__settings'>
                        <Icon path = '/img/settings.png' />
                    </button>
                    </div>
                    : null
                }
            </React.Fragment>
        )
    }

    componentDidUpdate = (prevProps) => {
        const haveUpdate = prevProps.images !== this.props.images && this.props.images;
        const isSelected = prevProps.selectedId !== this.props.selectedId;

        if (haveUpdate || isSelected){
            this.setState({
                ...this.state,
                items: this.props.cbMakeImageResultBox(this.props.images)
            });
        }
    }

    componentDidMount = () => {
        eventEmitter.emit('EventBlockScroll', 'window');
    }

    componentWillUnmount = () => {
        eventEmitter.emit('EventBlockScroll', 'default');
    }
}

export default SearchModal;