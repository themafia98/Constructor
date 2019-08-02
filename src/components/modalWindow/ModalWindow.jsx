import React,{Fragment} from 'react';

import isFetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import eventEmitter from '../../EventEmitter.js';

import ImageItem from '../imageViewer/imageItem';
import Icon from '../Icon/icon';

import CreateProject from './createProject/createProject';
import SearchImage from './Search/searchModal';
import './modal.scss';

require('es6-promise').polyfill();
console.log('asd');
class ModalWindow extends React.PureComponent {

    static propTypes = {
        workMode: PropTypes.string.isRequired, /** @Mode for modal */
        // idComponent: PropTypes.string || PropTypes.number /** @Id current user project */
    }

    state = {
        workMode: this.props.workMode,
        images: {
            buttonSearchDisabled: false,
            selectedItem: null, 
            showUrl: null, 
            images: null,
            urlFull: null,
            imageBoxView: false, 
            error: ''
        },
        newProject: {
            validateName: false,
            validateType: false,
            disabled: true,
            name: '',
            type: 'empty'
        },
        imageMenuActive: false,
        warning: {
            lengthMax: 'Max length: 20 symbols',
            lengthMin: 'Min length: 4 symbol',
            type: 'Select type of webpage',
        }
    }

    inputSearch = null;
    inputSelect = null;

    searchBackground = (event,value) => {
        const mode = 'search/photos/?page=1&per_page=40&query=';
        const api = `https://api.unsplash.com/${mode}`;
        let search = null;
        if (value) search = value;
        else search = this.inputSearch.value;

        this.setState({...this.state, images: {...this.state.inages, buttonSearchDisabled: true}})

        isFetch(`${api + search}&client_id=${process.env.REACT_APP_UNSPLASH_TOKEN}`)
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
                    images: [...results],
                    buttonSearchDisabled: false
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
                buttonSearchDisabled: false
            });
        });
    }

    showMenuImage = event => {
        this.setState({
            ...this.state, 
            imageMenuActive: true,
            images: {
                ...this.state.images,
                selectedItem: event.id, 
                showUrl: event.url,
                urlFull: event.urlFull

            }
        });
    }

    showImage = event => {

        const {showUrl} = this.state.images;
        eventEmitter.emit("EventImageView", {action: true, target: showUrl ? showUrl : null});
        event.stopPropagation();
    }

    setSelectedImage = event => {

        let images = {...this.state.images};
        if (this.props.modalSearchMode !== 'image'){
            eventEmitter.emit(`EventSetBackgroundImage${this.props.idComponent}`,images);
            eventEmitter.emit(`EventSetBImageInstumentPanel`,{images: images, mode: this.props.modalSearchMode});
        } else {
            eventEmitter.emit(`EventSetCurrentImage${this.props.idComponent}`, images);
            eventEmitter.emit(`EventSetBImageInstumentPanel`, {images: images,  mode: this.props.modalSearchMode });
        }
        
        event.stopPropagation();
    };

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

    addNewProject = event => {
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

    selectOption = event => {

        let inputs = {...this.state[this.state.workMode]};
        inputs.type = event.target.value;
        inputs.validateType = inputs.type !== 'empty';
        inputs.disabled = inputs.validateType && inputs.validateName ? false : true;
        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        });
    }

    validateName = event => {

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

    cancel = event => {

        if (this.state.workMode === 'Search')
            eventEmitter.emit("EventModalSearchOn", {action: 'offline', mode: null});
        else  eventEmitter.emit('EventChangeWorkMode',{action: 'default'});
    }

    refSelect = (node) => this.inputSelect = node;
    refSearch = node => this.inputSearch = node;

    render(){
        switch (this.state.workMode){
            case 'newProject':
                return <CreateProject
                            dissabled = {this.state[this.state.workMode].disabled}
                            nameLength = {this.state[this.state.workMode].name.length}
                            name = {this.state[this.state.workMode].name}
                            validType = {this.state[this.state.workMode].validateType}
                            warningType = {this.state.warning.type}
                            typeClassName = {this.state[this.state.workMode].validateName}
                            warningLengthMin = {this.state.warning.lengthMin}
                            warningLengthMax = {this.state.warning.lengthMax}
                            cbValidateName = {this.validateName}
                            cbSelectOption = {this.selectOption}
                            cbAddNewProject = {this.addNewProject}
                            cbCancel = {this.cancel}
                        />
            case 'Search':
                    return (
                        <SearchImage
                            images = {this.state.images['images']}
                            view = {this.state.images.imageBoxView}
                            dissabled = {this.state.images.buttonSearchDisabled}
                            error = {this.state.images.error}
                            cbCancel = {this.cancel}
                            menuActive = {this.state.imageMenuActive}
                            cbMakeImageResultBox = {this.makeImageResultBox}
                            cbShowImage = {this.showImage}
                            cbSetSelectedImage = {this.setSelectedImage}
                            modalSearchMode = {this.props.modalSearchMode}
                            cbSearchBackground = {this.searchBackground}
                        />
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

