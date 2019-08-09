import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
/** Redux actions */
import {loadCurrentProjectAction, exitProjectAction} from '../../redux/actions';
/* ------- Child components ------- */
import Section from '../../components/buildComponents/section';
import builderHOC from '../../components/builderHOC';
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
/* HOC */
import withFirebase from '../../components/withFirebase';
import './production.scss';

class Production extends React.PureComponent {

    static propTypes = {
        firebase: PropTypes.object,
    }

    state = {
        idProject: parseInt(this.props.match.params.param), /** @Id project */
        mode: 'production', /** @workMode */
        projectEmpty: false, /** @Bool detected project undefiend */
        isLoadComponents: true, /** @Bool load all necessary components  */
        componentsProdJSX: [] /** @Array with JSX */
    }

    makeProduction = (array) => {
        /* build components */
        let {componentsProdJSX} = this.state;
        let _components = [];

        array.forEach(item => {

            const itemHash = {
                props: {
                    ...item,
                    mode: 'production',
                },
                type: item.type,
                id: item.id,
            }
            const patternJSX = {
                id: item.id,
                targetSection: item.targetSection,
                component: builderHOC(itemHash)(Fragment)
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
                    <Header key = 'Header' title = "Constructor" idUser = {userData.idUser} />
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

    componentDidUpdate = () => {
        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject) {
            /** load current project of user session active and load project - false */
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            if (current)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                typeProject: current.type,
                sectionsProject: [...current.sectionsProject],
                components: [...current.components]
            })) /* else redirect */
            else this.setState({...this.state, projectEmpty: true});
        }

        if (this.state.isLoadComponents && currentProjectsData.loadProject)
            /* if all components load build our JSX */
            this.makeProduction(currentProjectsData.components);

    }


    componentDidMount = () => {
        let {userData} = this.props;
        let {currentProjectsData} = userData;

        if (userData.active && !currentProjectsData.loadProject) {
            /** if user active and project load - false */
            const current =  userData.projects.find(item => item.id === this.state.idProject)
            this.props.dispatch(loadCurrentProjectAction({
                id: current.id,
                sectionsProject: [...current.sectionsProject],
                typeProject: current.type,
                components: [...current.components]
            })); /** else render loader */
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