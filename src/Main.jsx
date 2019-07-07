import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from './components/header/Header';
import ProjectsSection from './components/ProjectsSection/ProjectsSection';

import './main.scss';

const title = require('./config.json').title;
const projects = require('./projects.json').projects;


class App extends React.Component {

  static propTypes = {
    title: PropTypes.string
  }

  state = {
    projects: {}

  }

  render(){

    return (
      <Fragment>
        <Header><h3>{title}</h3></Header>
        <ProjectsSection>{projects}</ProjectsSection>
      </Fragment>
    )
  }
}

export default connect()(App);
