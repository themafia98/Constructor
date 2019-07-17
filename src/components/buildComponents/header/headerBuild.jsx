import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import {BackgroundComponent} from '../../buildComponents/header/components/headerComponents';
import Controllers from '../../controllers/controllers';


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
        if (!this.props.editStart) {
            let rect = event.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
        eventEmitter.emit('EventModeEdit', {...this.state, width: width, height: height});
        }
    }

    render() {
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
                            mainWidth = {this.props.children.mainBoxWidth}
                            mainHeight = {this.props.children.mainBoxHeight}

                        />
                        : null}
                </div>
            </Fragment>
        )
    }
}
export default HeaderBuild;