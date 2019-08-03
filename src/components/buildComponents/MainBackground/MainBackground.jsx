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
        menuActive: PropTypes.bool, /** @Bool active menu or unactive */
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

        if (this.props.mode === 'dev'){
            let props = this.props.currentProjectsData.components.find(item => item.targetSection === this.props.id) || null;
            let children = this.props.componentJSX.filter(item => item.targetSection === this.props.id)
            
            if (props)
            return (
                <Fragment>
                    <section className = {`element${this.props.sectionNumber}`} ref={this.refSectionFunc}
                    data-class = 'editable' onClick = {this.changeMode}>
                        <BackgroundComponent 
                            mode = {this.props.mode} 
                            {...props} sectionNumber = {this.props.sectionNumber} 
                        >
                            {children.map(item => item.component) || null}
                        </BackgroundComponent>
                        {!this.state.editStart && 
                            <div className = 'warningEdit'><p>Click for start edit</p></div>
                        }
                    </section>
                </Fragment>
            );
        } else if (this.props.mode === 'production'){
            let props = this.props.currentProjectsData.components.find(item => item.targetSection === this.props.id) || null;
            let children = this.props.componentJSX.filter(item => item.targetSection === this.props.id);

            if (props)
            return (
                <Fragment>
                    <section ref={this.refSectionFunc} data-class = 'production'>
                        <BackgroundComponent {...props}
                            mode = {this.props.mode}
                            sectionNumber = {this.props.sectionNumber} 
                        >
                            {children.map(item => item.component) || null}
                        </BackgroundComponent>
                    </section>
                </Fragment>
            );
        }
        else return <Loader type = {`${this.props.mode} components`} />;
    }
}
export default MainBackground;