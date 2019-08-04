import React, {Fragment} from 'react';
import eventEmitter from '../../../EventEmitter';
import PropTypes from 'prop-types';

import BackgroundComponent from '../components/Background';
import Loader from '../../loading/Loader';

import './MainBackground.scss';


class MainBackground extends React.PureComponent {

    static propTypes = {
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

        if (this.props.mode === 'dev' && this.state.component){
            return (
                <Fragment>
                    <section
                        key = {this.props.sectionNumber}
                        className = {`element${this.props.sectionNumber}`} 
                        ref={this.refSectionFunc}
                        data-class = 'editable' 
                        onClick = {this.changeMode}
                    >
                        <BackgroundComponent 
                            mode = {this.props.mode}
                            sectionNumber = {this.props.sectionNumber}
                            {...this.state.component}
                        >
                            {this.state.children || null}
                        </BackgroundComponent>
                        {!this.state.editStart &&
                            <div className = 'warningEdit'><p>Click for start edit</p></div>
                        }
                    </section>
                </Fragment>
            );
        } else if (this.props.mode === 'production' && this.state.component){
            return (
                <Fragment>
                    <section 
                        key = {this.props.sectionNumber}
                        ref={this.refSectionFunc} 
                        data-class = 'production'
                    >
                        <BackgroundComponent
                            key = {this.props.sectionNumber*2}
                            mode = {this.props.mode}
                            sectionNumber = {this.props.sectionNumber}
                            {...this.state.component}
                        >
                        {this.state.children || null}
                        </BackgroundComponent>
                    </section>
                </Fragment>
            );
        }
        else return <Loader type = {`${this.props.mode} components`} />;
    }

    componentDidUpdate = (prevProps) => {
        const needUpdate = this.props.countComponents !== prevProps.countComponents;
        if (!this.state.component){
            let component = this.props.currentProjectsData.components.find(item =>
                                            item.targetSection === this.props.id);
            const children = this.props.componentJSX.filter(item => item.targetSection === this.props.id)
                            .map(item => item.component);
           this.setState({
               ...this.state,
               component: component,
               children: children,
           });
        }

        if (needUpdate){
            const children = this.props.componentJSX.filter(item => item.targetSection === this.props.id)
            children && this.setState({...this.state,children: children.map(item => item.component) });
        }
    }
}
export default MainBackground;