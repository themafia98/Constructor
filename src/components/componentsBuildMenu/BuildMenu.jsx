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
        sizeParenBox: PropTypes.object /** @Object with width and height parent(bg) */
    }

    state = {
        mode: this.props.mode,
        componentsPatternStatus: {
            id: null,
            name: null,
            type: null,
            content: null,
            fontSize: null,
            color: null,
            backgroundImage: null,
            image: null,
            coords: {left: null, top: null}, // x, y
        },
        sizeParenBox: {...this.props.sizeParenBox},
        title: 'Title'
    }

    addText = event => {
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            componentsPatternStatus: {
                ...this.state.componentsPatternStatus,
                id: id,
                name: this.props.editComponentName,
                type: 'text',
            },
            component: <BuilderComponents
                            target = {this.props.editComponentName}
                            key = {`text${id}`}
                            sizeParenBox = {this.props.sizeParenBox}
                            content = "Title"
                            id = {id}
                            type = 'text' />
        });
        event.stopPropagation();
    }

    addBackground = event => {
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            componentsPatternStatus: {
                ...this.state.componentsPatternStatus,
                name: this.state.editComponentName,
                type: 'background',
            },
            component: <BuilderComponents
                            target = {this.props.editComponentName}
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
            componentsPatternStatus: {
                ...this.state.componentsPatternStatus,
                id: id,
                name: this.props.editComponentName,
                type: 'image',
            },
            component: <BuilderComponents
                            target = {this.props.editComponentName}
                            key = {`text${id}`}
                            sizeParenBox = {this.props.sizeParenBox}
                            id = {id}
                            coords = {{...this.state.componentsPatternStatus.coords}}
                            path = {'/img/test.jpg'}
                            type = 'image' />
        });
        event.stopPropagation();
    }

    addSection = event => {
        let id = Math.random().toFixed(3);
        eventEmitter.emit('EventNewSection', {
            componentsPatternStatus: {
                ...this.state.componentsPatternStatus,
                name:  `Section${id}`,
                id: `Section${id}`,
                type: 'background',
            },
           
            type:'section',
            component: <BuilderComponents
            target = {this.props.editComponentName}
            key = {`bg${id}`}
            id = {id}
            type = 'background'
        />
        });
        event.stopPropagation();
    }

    render(){
        console.log('buildMenu');
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
                    <button
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