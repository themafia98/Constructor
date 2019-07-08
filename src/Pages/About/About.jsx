import React, {Fragment} from 'react';
import Header from '../../components/header/Header';

import './about.scss';

const config = require('../../config.json');

class About extends React.Component {

    render(){

        return (
            <Fragment>
                <Header title = {config.title} />
                <section className = 'About'>
                    <div className = 'container'>
                        <div className = 'col-12'>
                            <div className = 'information'>
                            <img alt = 'img' className = 'logoAbout' src = {process.env.PUBLIC_URL + '/img/about.jpg'}></img>
                                <p className ='developer'><span>Developer:</span> {config.about.developer}</p>
                                <p className = 'year'><span>Year:</span> {config.about.year}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Fragment>
        )
    }
}

export default About;