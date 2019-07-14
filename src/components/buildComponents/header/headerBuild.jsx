import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';

import Icon from '../../Icon/icon';
import BuildMenu from '../../componentsBuildMenu/BuildMenu';
import './headerBuild.scss';

class HeaderBuild extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
    }

    state = {
        idProject: this.props.id,
        viewComponentMenu: false,
        component: {...this.props.children}
        }


    changeMode = (event) => {
        eventEmitter.emit('EventModeEdit', {...this.state})
    }

    componentMenu = (event) => {
        this.setState({viewComponentMenu: this.state.viewComponentMenu ? false : true})
    }

    startMode = () => {
        return (
            <Fragment>
            { this.props.menuActive ?
                <div className = 'ControllersEditComponent'>
                    <Icon
                        onClick = {this.componentMenu}
                        className = 'addButton'
                        path = '/img/addButton.png'
                    />
                    {this.state.viewComponentMenu ? <BuildMenu component = {{...this.state.component}} /> : null}
                </div>
                : null
            }
            </Fragment>
        )
    }

    // componentDidUpdate = (oldProps, oldState) => {

    //     if (oldProps.children.edit !== this.props.children.edit){
    //         this.setState({
    //             ...this.state,
    //             component: {...this.props.children}
    //         })
    //     }
    // }



    render() {

        console.log('headerBuild');
        console.log(this.props.children);
        return (
            <div onClick = {this.changeMode} className = 'Header'>
                <h2 className = 'titleCompoentBuild'>Header</h2>
                {  this.props.children.build.component ?
                    this.props.children.build.component : null
                }
                {!this.props.editStart ? <p className = 'warningEdit'>Click for start edit</p> : null}
                {!this.state.readyBuild ? this.startMode() : null}
            </div>
        )
    }
}
export default HeaderBuild;