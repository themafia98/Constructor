import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import BackgroundComponent from '../../buildComponents/components/Background';
import Controllers from '../../controllers/controllers';
import './headerBuild.scss';

class HeaderBuild extends React.PureComponent {

    static propTypes = {
        children: PropTypes.object.isRequired, /** @Object with data about components */
        countComponents: PropTypes.number.isRequired, /** @Number last project */
        editStart: PropTypes.bool.isRequired, /** @Bool start edit mode */
        menuActive: PropTypes.bool.isRequired, /** @Bool active menu or unactive */
        id: PropTypes.number.isRequired, /** @id current project */
    }

    state = {
        idProject: this.props.id,
        components: {...this.props.children},
        sizeParenBox: null,
    }

    saveWidth = eventItem => {
        this.setState({sizeParenBox: {...eventItem}});
    };


    changeMode = event => {
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
                            components = {{...this.state.components}}
                            sizeParenBox = {this.state.sizeParenBox}

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