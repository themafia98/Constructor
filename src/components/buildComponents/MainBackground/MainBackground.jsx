import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import BackgroundComponent from '../components/Background';

import './MainBackground.scss';

class MainBackground extends React.PureComponent {

    static propTypes = {
        children: PropTypes.object.isRequired, /** @Object with name */
        countComponents: PropTypes.number.isRequired, /** @Number last project */
        menuActive: PropTypes.bool.isRequired, /** @Bool active menu or unactive */
        id: PropTypes.string.isRequired, /** @id current project */
    }

    state = {
        idProject: this.props.id,
        editRedy: false,
        components: {...this.props.children},
    }

    changeMode = event => {
        if (!this.state.editStart) {
            let rect = event.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            this.setState({
                ...this.state,
                editStart: true
            }, () =>
            eventEmitter.emit('EventModeEdit', {
                ...this.state,
                editStart: true,
                idProject: this.state.idProject,
                target: 'Header',
                width: width,
                height: height
            }));
        }
    }

    refBox = null;
    refBackground = node => this.refBox = node;

    render() {
        let bg = this.props.currentProjectsData.components.find(item => item.name === this.props.id) || {};
        let childrens = this.props.mainBuilderData.componentJSX.filter(item => item.name === this.props.id)
        .map(item => item.component);

        return (
            <Fragment>
                <section data-class = 'editable' onClick = {this.changeMode}>
                    <BackgroundComponent 
                        name = {this.state.idProject}
                        id = {bg.id}
                        background = {bg.color}  {...bg}>
                    {  childrens ?
                        childrens : null
                    }
                    </BackgroundComponent>
                    {!this.state.editStart ? <p className = 'warningEdit'>Click for start edit</p> : null}
                </section>
            </Fragment>
        )
    }
}
export default MainBackground;