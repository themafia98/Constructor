import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import withFirebase from '../../components/firebaseHOC';
import Header from '../../components/header/Header';

import './about.scss';

class About extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object.isRequired,
        firebase: PropTypes.object.isRequired,
    }

    state = {
        user: this.props.firebase.getCurrentUser()
    };

    render(){
        console.log('About render');
        if (this.state.user) {
            const { config } = this.props;
            return (
                <Fragment>
                    <Header title = {config.title} />
                    <section className = 'About'>
                        <div className = 'container'>
                            <div className = 'col-12'>
                                <div className = 'information'>
                                <img alt = 'img' className = 'logoAbout' src = {process.env.PUBLIC_URL + '/img/about.jpg'}/>
                                    <p className ='developer'><span>Developer:</span> {config.about.developer}</p>
                                    <p className = 'year'><span>Year:</span> {config.about.year}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </Fragment>
            )
        } else return <Redirect to = '/' />

    }

}

export default withFirebase(About);