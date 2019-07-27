import React,{Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Icon from '../Icon/icon';
import BuildMenu from '../componentsBuildMenu/BuildMenu';


// const ControllersBox = styled.div
//     .attrs(props =>({
//         style: {
//                 left: props.coordX,
//                 top: props.coordY,
//         }
//     })) `
//     position: 'fixed',
//     left: 50%;
//     top: 10%;
//     display: ${props => props.shadowDisplay}
//     `;

class Controllers extends React.PureComponent {

    static propTypes = {
        countComponents: PropTypes.number.isRequired, /** @number last project id */
        sizeParenBox: PropTypes.object, /** @Object with width and height parent(bg) */
        menuActive: PropTypes.bool, /** @Bool value active menu or unactive */
    }

    state = {
        viewComponentMenu: false,
        shiftX: 0,
        shiftY: 0,
        coordsX: '50%',
        coordsY: '0',
        shadowDisplay: 'block'
    }

    componentMenu = event => {
        this.setState({viewComponentMenu: this.state.viewComponentMenu ? false : true});
        event.stopPropagation();
    }

    saveCoords = event => {
        let left = this.controlBox.getBoundingClientRect().left;
        let top = this.controlBox.getBoundingClientRect().top;
        this.setState({...this.state, shiftX: event.pageX - left, 
        shiftY: event.pageY - top });

        event.stopPropagation();
    }

    drag = event => {
        if (!this.state.viewComponentMenu)
            this.setState({
                ...this.state,
                coordsX: event.pageX - this.state.shiftX + 'px', 
                coordsY: event.pageY - this.state.shiftY + 'px',
                shadowDisplay: event.type === 'drag' ? 'none' : 'block'
            });
        event.stopPropagation();
    }

    controlBox = null;
    refControll = (node) => this.controlBox = node;


    render(){
        console.log('controllers');
        return (
            <Fragment>
            {
                <div
                ref = {this.refControll}
                className = 'ControllersEditComponent'
                onClick = {this.componentMenu}
                >
                    <Icon
                        draggable = {true}
                        onClick = {this.componentMenu}
                        className = 'addButton'
                        path = '/img/addButton.png'
                    />
                    { this.state.viewComponentMenu ?
                        <BuildMenu
                            key = {`buildMenu ${this.props.mode}`}
                            mode = 'build'
                            editComponentName = {this.props.editComponentName}
                            sizeParenBox = {this.props.sizeParenBox}
                            countComponents = {this.props.countComponents}
                        /> : null
                    }
                </div>
            }
            </Fragment>
        )
    }

}

export default Controllers;