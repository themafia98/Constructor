import React, {Fragment} from 'react';
import {NavLink} from 'react-router-dom';
import Header from '../components/header/Header';


const config = require('../config.json');

class About extends React.Component {

    render(){

        return (
            <Fragment>
                <Header><NavLink to = '/'><h3>{config.title}</h3></NavLink></Header>
                <section className = 'About'>
                    <div className = 'container'>
                        <div className = 'col-12'>
                            <p>Developer: {config.about.developer}</p>
                            <p>Year: {config.about.year}</p>
                        </div>
                    </div>
                </section>
            </Fragment>
        )
    }
}

export default About;