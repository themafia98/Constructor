import React from 'react';
import PropTypes from 'prop-types';

import BuilderComponents from '../componentsBuilder/BuilderComponents';

import eventEmitter from '../../EventEmitter';
import './buildMenu.scss';

class BuildMenu extends React.PureComponent {

    static propTypes = {
        components: PropTypes.object.isRequired, /** @Object with components data */
        countComponents: PropTypes.number.isRequired, /** @Number last project */
        sizeParenBox: PropTypes.object.isRequired /** @Object with width and height parent(bg) */
    }

    state = {
        editComponentName: this.props.editComponentName,
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
        console.log('add');
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            componentsPatternStatus: {
                ...this.state.componentsPatternStatus,
                id: id,
                name: this.state.editComponentName,
                type: 'text',
            },
            component: <BuilderComponents
                            target = {this.state.editComponentName}
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
                            target = {this.state.editComponentName}
                            key = {`bg${id}`}
                            id = {id}
                            type = 'background' />
        });

        event.stopPropagation();
    }

    render(){

        if (this.props.mode !== 'section'){
            return (
                <div className = 'ComponentsMenu'>
                    <button onClick = {this.addBackground} className = 'ImageTool CompoentnsMenu_button' ><span>Image</span></button>
                    <button onClick = {this.addText} className = 'TextTool CompoentnsMenu_button' ><span>Text</span></button>
                    <button 
                        disabled = {this.state.editComponentName !== 'Header' ? false : true}
                        className = 'ButtonTool CompoentnsMenu_button' >
                        <span>Button</span>
                    </button>
                    <button className = 'VideoTool CompoentnsMenu_button' ><span>Video</span></button>
                </div>
            )
        } else {
            return (
                <div className = 'sectionMode'>
                    <button  className = 'ImageTool CompoentnsMenu_button' ><span>Section</span></button>
                    <button className = 'VideoTool CompoentnsMenu_button' ><span>Sestion</span></button>
                </div>
            )
        }
    }
}

export default BuildMenu;