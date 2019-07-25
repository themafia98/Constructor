import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import BackgroundComponent from '../components/Background';
import Controllers from '../../controllers/controllers';
import './MainBackground.scss';

class MainBackground extends React.PureComponent {

    static propTypes = {
        children: PropTypes.object.isRequired, /** @Object with name */
        countComponents: PropTypes.number.isRequired, /** @Number last project */
        editStart: PropTypes.bool.isRequired, /** @Bool start edit mode */
        menuActive: PropTypes.bool.isRequired, /** @Bool active menu or unactive */
        id: PropTypes.string.isRequired, /** @id current project */
    }

    state = {
        idProject: this.props.id,
        components: {...this.props.children},
    }

    changeMode = event => {
        console.log(event);
        if (!this.props.editStart) {
            let rect = event.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            eventEmitter.emit('EventModeEdit', {
                ...this.state,
                idProject: this.state.idProject,
                target: 'Header',
                width: width,
                height: height
            });
        }
    }

    refBox = null;
    refBackground = node => this.refBox = node;

    render() {

        let that = this.props.editComponentName === this.state.idProject;
        let bg = this.props.mainBuilderData.components.find(item => item.id === "MainBackgroundHeader");
        if (bg === undefined) bg = {};
        return (
            <Fragment>
                <div onClick = {this.changeMode} className = 'Header'>
                    <BackgroundComponent 
                        name = {this.state.idProject}
                        id = {`MainBackgroundHeader`}
                        background = {bg.color}  {...bg}>
                    {  this.props.mainBuilderData.componentJSX ?
                            this.props.mainBuilderData.componentJSX : null
                    }
                    </BackgroundComponent>
                    {!this.props.editStart ? <p className = 'warningEdit'>Click for start edit</p> : null}
                    {!this.state.readyBuild ? 
                        <Controllers
                            editComponentName = {this.props.editComponentName}
                            countComponents = {this.props.countComponents}
                            menuActive = {this.props.menuActive}
                            components = {{...this.state.components}}
                            sizeParenBox = {this.props.sizeParenBox}

                        />
                        : null}
                </div>
            </Fragment>
        )
    }
}
export default MainBackground;