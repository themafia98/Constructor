import React,{Fragment} from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/icon';
import BuildMenu from '../componentsBuildMenu/BuildMenu';


class Controllers extends React.PureComponent {

    static propTypes = {
        countComponents: PropTypes.number.isRequired, /** @number last project id */
        sizeParentBox: PropTypes.object, /** @Object with width and height parent(bg) */
        eventStreamBuild: PropTypes.object, /** @Events stream */
        menuActive: PropTypes.bool, /** @Bool value active menu or unactive */
    }

    state = {
        viewComponentMenu: false,
        editComponentName: this.props.editComponentName,
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

    render(){
        return (
            <Fragment>
            {
                <div
                ref = {this.refControll}
                className = 'ControllersEditComponent'
                onClick = {this.componentMenu}
                >
                    <Icon
                        onClick = {this.componentMenu}
                        className = 'addButton'
                        path = '/img/addButton.png'
                    />
                    { this.state.viewComponentMenu ?
                        <BuildMenu
                            key = {`buildMenu ${this.state.editComponentName}`}
                            mode = 'build'
                            eventStreamBuild = {this.props.eventStreamBuild}
                            editComponentName = {this.state.editComponentName}
                            sizeParentBox = {this.props.sizeParentBox}
                            countComponents = {this.props.countComponents}
                        /> : null
                    }
                </div>
            }
            </Fragment>
        )
    }

    componentDidUpdate = () => {
        if (this.props.editComponentName !== this.state.editComponentName)
            this.setState({
                ...this.state,
                editComponentName: this.props.editComponentName
            })
    }

}

export default Controllers;