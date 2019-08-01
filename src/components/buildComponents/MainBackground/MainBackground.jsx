import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';

import BackgroundComponent from '../components/Background';
import Loader from '../../loading/Loader';

import './MainBackground.scss';
import { log } from 'util';

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
        if (!this.state.editStart || this.props.id !== this.props.editComponentName) {
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
        let props = this.props.currentProjectsData.components.find(item => item.targetSection === this.props.id) || null;
        let children = this.props.mainBuilderData.componentJSX.filter(item => item.targetSection === this.props.id)
        
        if (props)
        return (
            <Fragment>
                <section className = {`element${this.props.sectionNumber}`} ref={this.refSectionFunc}
                data-class = 'editable' onClick = {this.changeMode}>
                    <BackgroundComponent {...props} sectionNumber = {this.props.sectionNumber} >
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