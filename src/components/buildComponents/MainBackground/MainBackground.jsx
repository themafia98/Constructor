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
    };

    state = {
        targetSection: this.props.id,
        editRedy: false,
        component: null,
        children: null,
    };

    changeMode = () => {
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
    };

    refSection = null;
    refSectionFunc = node => node ? this.refSection = {data: node.getBoundingClientRect(), node: node} : node;

    render() {
        let bg = this.props.currentProjectsData.components.find(item => item.targetSection === this.props.id) || null;
        let children = this.props.mainBuilderData.componentJSX.filter(item => item.targetSection === this.props.id)
        if (bg)
        return (
            <Fragment>
                <section data-id = {`${this.props.sectionNumber}`}  ref={this.refSectionFunc} 
                data-class = 'editable' onClick = {this.changeMode}>
                    <BackgroundComponent {...bg} >
                        {children.map(item => item.component) || null}
                    </BackgroundComponent>
                    {!this.state.editStart && <div className = 'warningEdit'><p>Click for start edit</p></div>}
                </section>
            </Fragment>
        );
        else return <Loader />;
    }
}
export default MainBackground;