import React from 'react';
import PropTypes from 'prop-types';

import './buildMenu.scss';

class BuildMenu extends React.PureComponent {

    static propTypes = {
        component: PropTypes.object
    }

    state = {
        component: {...this.props.component}
    }

    render(){

        return (
            <div className = 'ComponentsMenu'>
                <button className = 'ImageTool CompoentnsMenu_button' ><span>Image</span></button>
                <button className = 'TextTool CompoentnsMenu_button' ><span>Text</span></button>
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