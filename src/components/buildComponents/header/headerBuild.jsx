import React from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';

import './headerBuild.scss';

class HeaderBuild extends React.PureComponent {

    static propTypes = {
        id: PropTypes.string.isRequired,
    }

    state = {
        idProject: this.props.id,
        component: {...this.props.children}
        }


    changeMode = (event) => {
        eventEmitter.emit('EventModeEdit', {...this.state})
    }

    componentDidUpdate = (oldProps, oldState) => {

        if (oldProps.children.edit !== this.props.children.edit){
            this.setState({
                ...this.state,
                component: {...this.props.children}
            })
        }
    }

    render() {
        console.log('header');
        console.log(this.state);
        return (
            <div onClick = {this.changeMode} className = 'Header'>
                <h2 className = 'titleCompoentBuild'>Header</h2>
                {
                    this.state.component.edit ? null :
                    <p className = 'warningEdit'>Click for start edit</p>
                }
            </div>
        )
    }
}
export default HeaderBuild;