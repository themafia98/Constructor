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
        let component = <BuilderComponents 
            sizeParenBox = {this.props.sizeParenBox} 
            key = {`text${id}`} 
            content = "Title" 
            id = {id} 
            target = 'Header' type = 'text' />
        eventEmitter.emit('EventBuildComponents',{target: 'Header', type: 'text', component: component});
        event.stopPropagation();
    }

    addBackground = event => {
        let id = this.props.countComponents;
        let background = <BuilderComponents key = {`bg${id}`} id = {id} target = 'Header' type = 'background' />
        eventEmitter.emit('EventBuildComponents',{target: 'Header', type: 'background', component: background});

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