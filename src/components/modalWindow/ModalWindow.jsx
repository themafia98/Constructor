import React,{Fragment} from 'react';
import isFetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter.js';

import ImageItem from '../imageViewer/imageItem';
import Icon from '../Icon/icon';

import './modal.scss';

class ModalWindow extends React.PureComponent {

    static propTypes = {
        mode: PropTypes.string
    }

    state = {
        workMode: this.props.workMode,
        images: {selectedItem: null, showUrl: null, images: null, imageBoxView: false, error: ''},
        imageMenuActive: false,
        newProject: {
            validateName: false,
            validateType: false,
            disabled: true,
            name: '',
            type: 'empty'
        },
        warning: {
            lengthMax: 'Max length: 20 symbols',
            lengthMin: 'Min length: 4 symbol',
            type: 'Select type of webpage',
        }
    }

    inputSearch = null;
    inputSelect = null;

    searchBackground = event => {

        const api = 'https://api.unsplash.com/search/photos/?page=1&per_page=40&query=';
        const search = this.inputSearch.value;
        const token = "421b12ae729e1f6e4a0cac207496874099ab8a738378ec07a8e2598b11201802";

        isFetch(`${api + search}&client_id=${token}`)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('request invalid');
        })
        .then(response => {

            let {results} = response;
            if (results.length)
            this.setState({
                ...this.state,
                images: {
                    ...this.state.images,
                    imageBoxView: true,
                    error: '',
                    images: [...results]
                },
            });
            else throw new Error('Photos not found');
        })
        .catch(error => {
            console.error(error.message);
            this.setState({
                ...this.state,
                 images: {...this.state.images, error: error.message},
                 imageBoxView: false,
                });
        });
    }

    showMenuImage = event => {
        this.setState({
            ...this.state, 
            imageMenuActive: true,
            images: {...this.state.images, selectedItem: event.id, showUrl: event.url}
        });
    }

    showImage = event => {

        const {showUrl} = this.state.images;
        // if (event.type === 'mouseenter')
        eventEmitter.emit("EventImageView", {action: true, target: showUrl ? showUrl : null});
        // else  eventEmitter.emit("EventImageView", {action: false, target: null});
        event.stopPropagation();
    }

    makeImageResultBox = (items) => {
        if (!items) return null;

        return items.map((item,i) =>{
           return <ImageItem 
                key = {`item${i}`} 
                id = {i}
                selected = {this.state.images.selectedItem === i ? true : false} 
                isFull = {false}
                urls = {{...item.urls}} 
            />
        });
    }

    addNewProject = (event) => {
        let mode = this.state[this.state.workMode];
        if (mode.validateType &&  mode.validateName) {
            eventEmitter.emit('EventAddProject',
            {
                title: this.state[this.state.workMode].name,
                type: this.state[this.state.workMode].type
            });

            eventEmitter.emit('EventChangeWorkMode',{action: 'default'});
        }
    }

    selectOption = (event) => {

        let inputs = {...this.state[this.state.workMode]};
        inputs.type = event.target.value;
        inputs.validateType = inputs.type !== 'empty';
        inputs.disabled = inputs.validateType && inputs.validateName ? false : true;
        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        });
    }

    validateName = (event) => {

        let inputs = {...this.state[this.state.workMode]};
        inputs.name = event.target.value;
        let lengthInput = inputs.name.length;
        inputs.validateName = lengthInput >= 4 && lengthInput < 20 ? true : false;
        inputs.disabled = inputs.validateType && inputs.validateName ? false : true;

        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        })
    };

    cancel = (event) => {

        if (this.state.workMode === 'Search')
            eventEmitter.emit("EventModalSearchOn");
        else  eventEmitter.emit('EventChangeWorkMode',{action: 'default'});
    }

    refSelect = (node) => this.inputSelect = node;
    refSearch = node => this.inputSearch = node;

    render(){

        switch (this.state.workMode){
            case 'newProject':
                return (
                    <div className = 'Modal'>
                        <h3>Create new Project</h3>
                        { this.state[this.state.workMode].name.length <= 3 ?
                            <span className = 'warning'>{this.state.warning.lengthMin}</span> : null
                        }
                        { this.state[this.state.workMode].name.length >= 20 ?
                            <span className = 'warning'>{this.state.warning.lengthMax}</span> : null
                        }
                        <input
                            className = {this.state[this.state.workMode].validateName ? 'ready' : 'wrong'}
                            value = {this.state[this.state.workMode].name}
                            onChange = {this.validateName}
                            type = 'text'
                            placeholder = "Project name"
                        />
                        { !this.state[this.state.workMode].validateType ?
                            <span className = 'warning'>{this.state.warning.type}</span> : null
                        }
                        <select onChange = {this.selectOption} >
                            <option value = 'empty'>--------</option>
                            <option value = 'landing'>Landing</option>
                            <option value = 'portfolio'>Portfolio</option>
                        </select>
                        <input 
                            onClick = {this.addNewProject}
                            className = 'acceptButton'
                            disabled = {this.state[this.state.workMode].disabled}
                            type = 'button'
                            value = 'Submit'
                        />
                            <input onClick = {this.cancel} type ='button' value = 'Cancel' />
                    </div>
                )
            case 'Search':
                return (
                    <Fragment>
                        <div className = 'Modal Modal-search'>
                            <h3>Search background image</h3>
                            { this.state.images.error ?
                                <span className = 'error'>{this.state.images.error}</span> : null
                            }
                            <input ref = {this.refSearch} type = 'text' placeholder = "Photo name" />
                            <input className = 'acceptButton' type = 'button' value = 'Search'
                                onClick = {this.searchBackground}
                            />
                            <input onClick = {this.cancel} type ='button' value = 'Cancel' />
                            {
                                this.state.images.imageBoxView ?
                                <div className = 'searchResultBox'>
                                    {this.makeImageResultBox(this.state.images['images'])}
                                </div>
                                : null
                            }
                        </div>
                        {  this.state.imageMenuActive ?
                            <div className = 'ActionModalSearch'>
                            <button onClick = {this.showImage} className = 'actionModalSearch__view'>
                                <Icon path = '/img/view.png' />
                            </button>
                            <button className = 'actionModalSearch__settings'>
                                <Icon path = '/img/settings.png' />
                            </button>
                            </div>
                            : null
                        }
                    </Fragment>
                )
            default: return <Fragment></Fragment>
        }
    }

    componentDidMount = event => {
        if (this.state.workMode === 'Search')
            eventEmitter.on('EventShowMenuImage', this.showMenuImage);
    }

    componentWillUnmount = event => {
        if (this.state.workMode === 'Search')
            eventEmitter.off('EventShowMenuImage', this.showMenuImage);
    }
}

export default ModalWindow;

