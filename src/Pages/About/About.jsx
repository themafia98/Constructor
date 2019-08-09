import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';


import withFirebase from '../../components/withFirebase';
import Header from '../../components/header/Header';
import Loader from '../../components/loading/Loader';

import './about.scss';

class About extends React.PureComponent {

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
                    <section className = 'About'>
                        <div className = 'container'>
                            <div className = 'col-12'>
                                <div className = 'About__information'>
                                <img alt = 'img'
                                    className = 'information__logoAbout' 
                                    src = {process.env.PUBLIC_URL + '/img/about.jpg'}
                                />
                                    <p className ='developer'><span>Developer:</span>
                                                            {config.about.developer}
                                    </p>
                                    <p className = 'year'><span>Year:</span> {config.about.year}</p>
                                </div>
                            </div>
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

export default connect(mapStateToProps)(withFirebase(About));