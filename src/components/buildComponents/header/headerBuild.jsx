import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import BackgroundComponent from '../../buildComponents/components/Background';
import Controllers from '../../controllers/controllers';


import './headerBuild.scss';

class HeaderBuild extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
    }

    state = {
        idProject: this.props.id,
        component: {...this.props.children},
        sizeParenBox: null,
    }

    saveWidth = eventItem => {
        this.setState({sizeParenBox: {...eventItem}});
    };


    changeMode = (event) => {
        if (!this.props.editStart) {
            let rect = event.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
        eventEmitter.emit('EventModeEdit', {...this.state, width: width, height: height});
        }
    }

    refBox = null;
    refBackground = node => this.refBox = node;

    render() {

        console.log('header');
        console.log(this.props);
        return (
            <Fragment>
                <div onClick = {this.changeMode} className = 'Header'>
                    <BackgroundComponent id = 'MainBackgroundHeader' background = 'grey'>
                    {  this.props.children.build.componentJSX && this.props.children.build.type === 'text'  ?
                            this.props.children.build.componentJSX : null
                    }
                    </BackgroundComponent>
                    {!this.props.editStart ? <p className = 'warningEdit'>Click for start edit</p> : null}
                    {!this.state.readyBuild ? 
                        <Controllers
                            countComponents = {this.props.countComponents}
                            menuActive = {this.props.menuActive}
                            component = {{...this.state.component}}
                            sizeParenBox = {this.state.sizeParenBox}
                            mainWidth = {this.props.children.mainBoxWidth}
                            mainHeight = {this.props.children.mainBoxHeight}

                        />
                        : null}
                </div>
            </Fragment>
        )
    }

    componentDidMount = event => {
        eventEmitter.on('EventSaveWidth', this.saveWidth);
    }

    componentWillUnmount = event => {
        eventEmitter.off('EventSaveWidth', this.saveWidth);
    }
}
export default HeaderBuild;