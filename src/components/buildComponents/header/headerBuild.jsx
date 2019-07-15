import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import {BackgroundComponent} from '../../buildComponents/header/components/headerComponents';
import Controllers from '../../controllers/controllers';

import Icon from '../../Icon/icon';
import BuildMenu from '../../componentsBuildMenu/BuildMenu';
import './headerBuild.scss';

class HeaderBuild extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
    }

    state = {
        idProject: this.props.id,
        component: {...this.props.children}
        }


    changeMode = (event) => {
        if (!this.props.editStart)
        eventEmitter.emit('EventModeEdit', {...this.state});

        console.log(event.target);
    }

    render() {
        console.log('header');
        return (
            <Fragment>
                <div onClick = {this.changeMode} className = 'Header'>
                    <BackgroundComponent background = 'grey'>
                    {  this.props.children.build.component && this.props.children.build.type === 'text'  ?
                            this.props.children.build.component : null
                    }
                    </BackgroundComponent>
                    {!this.props.editStart ? <p className = 'warningEdit'>Click for start edit</p> : null}
                    {!this.state.readyBuild ? 
                        <Controllers
                            menuActive = {this.props.menuActive}
                            component = {{...this.state.component}}

                        />
                        : null}
                </div>
            </Fragment>
        )
    }
}
export default HeaderBuild;