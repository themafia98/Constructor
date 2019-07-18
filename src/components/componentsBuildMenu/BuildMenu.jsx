import React from 'react';
import PropTypes from 'prop-types';

import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

import eventEmitter from '../../EventEmitter';

import './buildMenu.scss';

class BuildMenu extends React.PureComponent {

    static propTypes = {
        component: PropTypes.object
    }

    state = {
        component: {...this.props.component},
        title: 'Title'
    }

    addText = event => {
        let id = this.props.countComponents;
        let component = [<TextComponent id = {id} key = {`text${id}`}>{this.state.title}</TextComponent>];
        eventEmitter.emit('EventBuildHeaderComponents',{target: 'Header', type: 'text', component: component});
        event.stopPropagation();
    }

    addBackground = event => {
        let id = this.props.countComponents;
        let background = [<BackgroundComponent id = {id} key = {`bg${id}`}/>];
        eventEmitter.emit('EventBuildHeaderComponents',{target: 'Header', type: 'background', component: background});

        event.stopPropagation();
    }

    render(){

        return (
            <div className = 'ComponentsMenu'>
                <button onClick = {this.addBackground} className = 'ImageTool CompoentnsMenu_button' ><span>Image</span></button>
                <button onClick = {this.addText} className = 'TextTool CompoentnsMenu_button' ><span>Text</span></button>
                <button 
                    disabled = {this.state.component.name !== 'Header' ? false : true}
                    className = 'ButtonTool CompoentnsMenu_button' >
                    <span>Button</span>
                </button>
                <button className = 'VideoTool CompoentnsMenu_button' ><span>Video</span></button>
            </div>
        )
    }
}

export default BuildMenu;