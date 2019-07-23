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
        components: {...this.props.components},
        sizeParenBox: {...this.props.sizeParenBox},
        title: 'Title'
    }

    addText = event => {
        let id = this.props.countComponents;
        eventEmitter.emit('EventBuildComponents',{
            target: this.state.components.name,
            type: 'text',
            component: <BuilderComponents
                            target = {this.state.components.name}
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
            target: this.state.components.name,
            type: 'background',
            component: <BuilderComponents
                            target = {this.state.components.name}
                            key = {`bg${id}`}
                            id = {id}
                            type = 'background' />
        });

        event.stopPropagation();
    }

    render(){
        console.log('menu');
        return (
            <div className = 'ComponentsMenu'>
                <button onClick = {this.addBackground} className = 'ImageTool CompoentnsMenu_button' ><span>Image</span></button>
                <button onClick = {this.addText} className = 'TextTool CompoentnsMenu_button' ><span>Text</span></button>
                <button 
                    disabled = {this.state.components.name !== 'Header' ? false : true}
                    className = 'ButtonTool CompoentnsMenu_button' >
                    <span>Button</span>
                </button>
                <button className = 'VideoTool CompoentnsMenu_button' ><span>Video</span></button>
            </div>
        )
    }
}

export default BuildMenu;