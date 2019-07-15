import React,{Fragment} from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/icon';
import BuildMenu from '../componentsBuildMenu/BuildMenu';

import styled from 'styled-components';

const ControllersBox = styled.div`
    position: absolute;
    left: ${props => props.x};
    top: ${props => props.y};
`;

class Controllers extends React.PureComponent {

    static propTypes = {
        menuActive: PropTypes.bool,
    }

    state = {
        viewComponentMenu: false,
        coordsX: '50%',
        coordsY: '0'
    }

    componentMenu = (event) => {
        this.setState({viewComponentMenu: this.state.viewComponentMenu ? false : true})
    }

    drag = event => {
        if (!this.state.viewComponentMenu)
        this.setState({...this.state, coordsX: event.pageX - event.target.offsetWidth+ 'px', 
                    coordsY: event.pageY - event.target.offsetHeight  + 'px'})
        event.stopPropagation();
    }

    dragStart = event => {
        return false;
    }

    controlBox = null;
    refControll = (node) => this.controlBox = node;


    render(){
        console.log('controllers');
        return (
            <Fragment>
            { this.props.menuActive ?
                <ControllersBox
                ref = {this.refControll}
                className = 'ControllersEditComponent'
                x = {this.state.coordsX}
                y = {this.state.coordsY}
                draggable = {!this.state.viewComponentMenu}
                onClick = {this.componentMenu}
                onDrag   = {this.drag}
                onDragStart = {this.dragStart}
                onDragEnd = {this.drag}
                >
                    <Icon
                        draggable = {true}
                        onClick = {this.componentMenu}
                        className = 'addButton'
                        path = '/img/addButton.png'
                    />
                    {this.state.viewComponentMenu ? <BuildMenu component = {{...this.props.component}} /> : null}
                </ControllersBox>
                : null
            }
            </Fragment>
        )
    }
}

export default Controllers;