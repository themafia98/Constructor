import React from 'react';
import PropTypes from 'prop-types';

import Title from '../buildComponents/header/components/Title';

import eventStream from '../../EventEmitter';

import './buildMenu.scss';

class BuildMenu extends React.PureComponent {

    static propTypes = {
        component: PropTypes.object
    }

    state = {
        component: {...this.props.component}
    }

    addText = event => {

        let componentArrayWrapper = [];
        componentArrayWrapper.push(<Title key = 'header' title = 'test' className = 'headerBuild' />);
        eventStream.emit('EventTextBox',{target: 'Header', type: 'text', component: componentArrayWrapper});
        event.stopPropagation();
    }

    render(){

        return (
            <div className = 'ComponentsMenu'>
                <button className = 'ImageTool CompoentnsMenu_button' ><span>Image</span></button>
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