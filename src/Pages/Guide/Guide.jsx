import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import SwitchContainer from '../../components/SwitchContainer/SwitchContainer';
import withFirebase from '../../components/withFirebase';
import Header from '../../components/header/Header';
import Loader from '../../components/loading/Loader';

import './guide.scss';
class Guide extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object.isRequired, /** @Config app */
        firebase: PropTypes.object.isRequired, /** @firebase class for use firebase functions */
        history: PropTypes.object, /** @Router HTML5 history */
        location: PropTypes.object, /** @Router */
        match: PropTypes.object, /** @Router */
    }

    state = {
        config: this.props.config
    };

    render(){

        let user = this.props.firebase.getCurrentUser();
        if (user && this.props.idUser) {
            const { config } = this.state;
            return (
                <Fragment>
                    <Header title = {config.title} idUser = {user.uid} />
                    <section className = 'Guide'>
                        <div className = 'container guide--flex'>
                            <div className = 'Guide__about'>
                                <h2>Documentation</h2>
                                <p>Get started with {config.title}</p>
                                <p className = 'Guide__about__rev'>
                                    The Constructor guides are step-by-step walkthroughs
                                    that help you get started using Constructor.
                                </p>
                            </div>
                            <SwitchContainer />
                        </div>
                    </section>
                </Fragment>
            )
        } else if (!user) return <Redirect to = { '/'} />
        else return <Loader path = '/img/loading.gif' type = 'About' />

    }
}

const mapStateToProps = (state) => {
    return {
      idUser: state.cabinet.idUser,
    }
  };

export default connect(mapStateToProps)(withFirebase(Guide));