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
        targetSection: this.props.id,
        editRedy: false,
        component: null,
        children: null,
    }

    changeMode = event => {
        if (!this.state.editStart || this.state.idProject !== this.props.editComponentName) {
            this.setState({
                ...this.state,
                editStart: true
            }, () =>
            eventEmitter.emit('EventModeEdit', {
                ...this.state,
                editStart: true,
                targetSection: this.state.targetSection,
            }));
        }
    }

    refBox = null;
    refBackground = node => this.refBox = node;

    render() {

        let bg = this.props.currentProjectsData.components.find(item => item.targetSection === this.props.id) || null;
        let childrens = this.props.mainBuilderData.componentJSX.filter(item => item.targetSection === this.props.id)
        .map(item => item.component) || null;

        if (bg)
        return (
            <Fragment>
                <section data-class = 'editable' onClick = {this.changeMode}>
                    <BackgroundComponent {...bg} >
                        {childrens}
                    </BackgroundComponent>
                    {!this.state.editStart && <div className = 'warningEdit'><p>Click for start edit</p></div>}
                </section>
            </Fragment>
        )
        else return <Loader />;
    }
}
export default MainBackground;