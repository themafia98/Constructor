import React from 'react';
import PropTypes from 'prop-types';

import BuilderComponents from '../componentsBuilder/BuilderComponents';

import eventEmitter from '../../EventEmitter';
import './buildMenu.scss';

class BuildMenu extends React.PureComponent {

    static propTypes = {
        mode: PropTypes.string.isRequired, /** @String work mode component */
        editComponentName: PropTypes.string,
        countSection: PropTypes.number, /** @Number for new section id */
        countComponents: PropTypes.number, /** @Number last project */
        sizeParentBox: PropTypes.object /** @Object with width and height parent(bg) */
    }


    state = {
        mode: this.props.mode,
        componentsPatternBackground: {
            id: null,
            targetSection: null,
            type: 'background',
            color: null,
            backgroundImage: null,
        },
        componentsPatternText: {
            id: null,
            targetSection: null,
            type: 'text',
            color: null,
            fontSize: null,
            content: null,
            coords: {x: null, y: null}, // x, y
        },
        componentsPatternImage: {
            id: null,
            targetSection: null,
            type: 'image',
            borderRadius: null,
            opacity: null,
            zIndex: null,
            image: '/img/photoPattern.svg',
            coords: {x: null, y: null}, // x, y
        },
        componentsPatternMedia: {
            id: null,
            targetSection: null,
            type: 'media',
            size: null,
            content: null,
            coords: {x: null, y: null}, // x, y
        },
        sizeParentBox: {...this.props.sizeParentBox},
        title: 'Title'
    }

    addText = event => {
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            componentsPatternText: {
                ...this.state.componentsPatternText,
                id: id,
                targetSection: this.props.editComponentName,
            },
            type: this.state.componentsPatternText.type,
            component: <BuilderComponents
                            key = {`text${id}`}
                            sizeParentBox = {this.props.sizeParentBox}
                            targetSection = {this.props.editComponentName}
                            content = 'Title'
                            id = {id}
                            type = 'text' 
                        />
        });
        event.stopPropagation();
    }

    addBackground = event => {
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            componentsPatternBackground: {
                ...this.state.componentsPatternBackground,
                targetSection: this.state.editComponentName,
            },
            type: this.state.componentsPatternBackground.type,
            component: <BuilderComponents
                            targetSection = {this.props.editComponentName}
                            key = {`bg${id}`}
                            id = {id}
                            type = 'background'
                        />
        });

        event.stopPropagation();
    }

    addImage = event => {
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            componentsPatternImage: {
                ...this.state.componentsPatternImage,
                id: id,
                targetSection: this.props.editComponentName,
            },
            type: this.state.componentsPatternImage.type,
            component: <BuilderComponents
                            key = {`text${id}`}
                            targetSection = {this.props.editComponentName}
                            sizeParentBox = {this.props.sizeParentBox}
                            id = {id}
                            coords = {{...this.state.componentsPatternImage.coords}}
                            path = {'/img/photoPattern.svg'}
                            type = 'image' />
        });
        event.stopPropagation();
    }

    addMedia = event => {
        let id = Math.random().toFixed(3);
        console.log(event);
        eventEmitter.emit('EventBuildComponents', {
            componentsPatternMedia: {
                ...this.state.componentsPatternMedia,
                id: id,
                targetSection: this.props.editComponentName,
            },
            type: this.state.componentsPatternMedia.type,
            component: <BuilderComponents
                            key = {`media${id}`}
                            targetSection = {this.props.editComponentName}
                            sizeParentBox = {this.props.sizeParentBox}
                            id = {id}
                            coords = {{...this.state.componentsPatternMedia.coords}}
                            path = {'/img/photoPattern.mp4'}
                            type = 'media' 
                        />
        });
        event.stopPropagation();
    }

    addSection = event => {
        let id = Math.random().toFixed(3);
        eventEmitter.emit('EventNewSection', {
            componentsPatternBackground: {
                ...this.state.componentsPatternBackground,
                targetSection: `Section${id}`,
                id: `Section${id}`,
                type: 'background',
            },
            component: <BuilderComponents
                            targetSection = {this.props.editComponentName}
                            key = {`bg${id}`}
                            id = {id}
                            width = '100%'
                            height = '800px'
                            type = 'background'
                        />
        });
        event.stopPropagation();
    }

    render(){
        if (this.state.mode === 'build'){
            return (
                <div className = 'ComponentsMenu'>
                    <button 
                        onClick = {this.addImage} 
                        className = 'ImageTool CompoentnsMenu_button' 
                    >
                        <span>Image</span>
                    </button>
                    <button 
                        onClick = {this.addText} 
                        className = 'TextTool CompoentnsMenu_button' >
                        <span>Text</span>
                    </button>
                    <button
                        disabled = {this.props.editComponentName !== 'Header' ? false : true}
                        className = 'ButtonTool CompoentnsMenu_button' >
                        <span>Button</span>
                    </button>
                    <button onClick = {this.addMedia}
                        className = 'VideoTool CompoentnsMenu_button'
                    >
                        <span>Video</span>
                    </button>
                </div>
            )
        } else if (this.state.mode === 'section') {
            return (
                <div className = 'sectionMode'>
                    <button
                        onClick = {this.addSection}
                        className = 'newSectionTool CompoentnsMenu_button'
                    >
                        <span>New section</span>
                    </button>
                </div>
            )
        }
    }
}

export default BuildMenu;