import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';


import BackgroundComponent from '../components/Background';
import Loader from '../../loading/Loader';

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
        component: null,
        children: null,
    }

    changeMode = event => {
        if (!this.state.editStart || this.state.idProject !== this.props.editComponentName) {
            console.log(this.state.idProject);
            this.setState({
                ...this.state,
                editStart: true
            }, () =>
            eventEmitter.emit('EventModeEdit', {
                ...this.state,
                editStart: true,
                idProject: this.state.idProject,
                target: 'Header',
            }));
        }
    }

    refBox = null;
    refBackground = node => this.refBox = node;

    render() {

        if (this.state.component)
        return (
            <Fragment>
                <section data-class = 'editable' onClick = {this.changeMode}>
                    <BackgroundComponent 
                        name = {this.state.idProject}
                        id = {this.state.component.id}
                        background = {this.state.component.color}  {...this.state.component}
                    >
                    {this.state.childrens && this.state.childrens}
                    </BackgroundComponent>
                    {!this.state.editStart && <p className = 'warningEdit'>Click for start edit</p>}
                </section>
            </Fragment>
        )
        else return <Loader type = 'components' />;
    }


    componentDidUpdate = (nextProps, nextState) => {
        if (this.props.id !== nextProps.id){
        const bg = this.props.currentProjectsData.components.find(item => item.name === this.props.id) || null;
        const childrens = this.props.mainBuilderData.componentJSX.filter(item => item.name === this.props.id)
        .map(item => item.component);
        if (!this.state.component)
        this.setState({
            ...this.state,
            component: bg,
            childrens: childrens
        })
    }
    }

    componentDidMount = () => {

        const bg = this.props.currentProjectsData.components.find(item => item.name === this.props.id) || null;
        const childrens = this.props.mainBuilderData.componentJSX.filter(item => item.name === this.props.id)
        .map(item => item.component);
        if (!this.state.component)
        this.setState({
            ...this.state,
            component: bg,
            childrens: childrens
        })
    }
}
export default MainBackground;