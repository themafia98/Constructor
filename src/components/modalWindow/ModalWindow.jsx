import React,{Fragment} from 'react';
import isFetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter.js';

import './modal.scss';

class ModalWindow extends React.PureComponent {

    static propTypes = {
        mode: PropTypes.string
    }

    state = {
        workMode: this.props.workMode,
        images: {images: null, imageBoxView: false},
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

    inputSelect = null;

    searchBackground = event => {
        const token = "421b12ae729e1f6e4a0cac207496874099ab8a738378ec07a8e2598b11201802";
        isFetch(`https://api.unsplash.com/photos/?client_id=${token}`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                ...this.state,
                images: {
                    ...this.state.images,
                    imageBoxView: true,
                    images: {...response}
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    makeImageResultBox = (items) => {
        if (!items) return null;

        let box = [];
        let keys = Object.keys(items);

        for (let i = 0; i < keys.length; i++){
            box.push(
                <div key = {`item${i}`} className = 'ItemBox'>
                    <img src = {items[keys[i]].urls.regular} alt = 'item' />
                </div>
                )
        }

        return box;
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

    render(){
        console.log('modal');
        switch (this.state.workMode){

            case 'newProject': {
                return (
                        <div className = 'Modal'>
                            <h3>Create new Project</h3>
                            {
                                this.state[this.state.workMode].name.length <= 3 ?
                                <span className = 'warning'>{this.state.warning.lengthMin}</span> : null
                            }
                            {
                                this.state[this.state.workMode].name.length >= 20 ?
                                <span className = 'warning'>{this.state.warning.lengthMax}</span> : null
                            }
                            <input
                                className = {this.state[this.state.workMode].validateName ? 'ready' : 'wrong'}
                                value = {this.state[this.state.workMode].name}
                                onChange = {this.validateName}
                                type = 'text'
                                placeholder = "Project name"
                            />
                            {
                                !this.state[this.state.workMode].validateType ?
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
            }
            case 'Search': {
                return (
                    <Fragment>
                    <div className = 'Modal Modal-search'>
                    <h3>Search background image</h3>
                    <input
                        type = 'text'
                        placeholder = "Photo name"
                    />
                    <input 
                        className = 'acceptButton'
                        type = 'button'
                        value = 'Search'
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
                    </Fragment>
                )
            }
            default: {
                return (
                    <Fragment></Fragment>
                )
            }
        }
    }
}

export default ModalWindow;

