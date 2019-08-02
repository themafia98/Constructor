import React,{Fragment} from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';
import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';

import Section from '../../components/buildComponents/section';
import BuilderComponents from '../../components/componentsBuilder/BuilderComponents';
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

class Production extends React.PureComponent {

    static propTypes = {
        firebase: PropTypes.object,
    }

    state = {
        idProject: parseInt(this.props.match.params.param),
        mode: 'production',
        projectEmpty: false,
        isLoadComponents: true,
        componentsProdJSX: []
    }

    makeProduction = array => {

        let {componentsProdJSX} = this.state;
        let _components = [];

        array.forEach(item => {

                let sizeParentBox = {
                    width: this.prodRef.data.width,
                    height: this.prodRef.data.height,
                    top: this.prodRef.data.top,
                    left: this.prodRef.data.left,
                }
                let component =
                    <BuilderComponents
                        sizeParentBox = {{...sizeParentBox}}
                        mode = {this.state.mode}
                        {...item}
                        key = {`${item.type}${item.id}`}
                    />;

                const patternJSX = {
                    id: item.id,
                    targetSection: item.targetSection,
                    component: component
                };
                _components.push(patternJSX);
        });
            this.setState({
                ...this.state,
                isLoadComponents: false,
                componentsProdJSX: [...componentsProdJSX, ..._components],
            });
    };

    prodRef = null;
    mainProductionRef  = node => node ?
    this.prodRef = {data: node.getBoundingClientRect(), node: node} : node;

    render(){

        const {userData} = this.props;
        const {currentProjectsData} = userData;
        const section = currentProjectsData.sectionsProject;

        if (this.state.projectEmpty) return <Redirect to = '/Cabinet' />

        if (userData.active && currentProjectsData.loadProject){
            return (
            <Fragment>
                <Header key = 'Header' title = "Constructor" />
                <div
                    ref = {this.mainProductionRef}
                    className = 'Production'
                    key = 'Production'
                    >
                    {!this.state.isLoadComponents ?
                        section.length &&
                            <Section 
                                key = 'section'
                                mode = {this.state.mode}
                                currentProjectsData = {currentProjectsData}
                                componentsProdJSX = {this.state.componentsProdJSX}
                                section = {section}
                            />
                        : null
                    }
                </div>
            </Fragment>
            )
        } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = '/' />
        else return <Loader  key = 'Loader' path = '/img/loading.gif' type = 'production' />
    }

    componentDidUpdate = (prevProps, prevState) => {
        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            if (current)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                sectionsProject: [...current.sectionsProject],
                components: [...current.components]
            }))
            else this.setState({...this.state, projectEmpty: true});
        }

        if (this.state.isLoadComponents && currentProjectsData.loadProject) 
            this.makeProduction(currentProjectsData.components);

    }


    componentDidMount = () => {
        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject) {
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                sectionsProject: [...current.sectionsProject],
                typeProject: current.type,
                components: [...current.components]
            }));
        };

    }

    componentWillUnmount = () => {

        let {userData} = this.props;
        if (userData.active)  this.props.dispatch(exitProjectAction(true));
    }

}

const mapStateToProps = (state) => {
    return {
        userData: {
            active: state.cabinet.active,
            idUser: state.cabinet.idUser,
            projects: [...state.cabinet.projects],
           currentProjectsData: {...state.builder}
        },
    }
};

  export default connect(mapStateToProps)(withFirebase(Production));