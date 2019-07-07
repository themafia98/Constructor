import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from './components/header/Header';
import ProjectsSection from './components/ProjectsSection/ProjectsSection';

import './main.scss';

const title = require('./config.json').title;

class App extends React.Component {

  static propTypes = {
    title: PropTypes.string
  }

  state = {

  }

  render(){

    return (
      <Fragment>
        <Header><h3>{title}</h3></Header>
          <ProjectsSection />
      </Fragment>
    )
  }
}

export default connect()(App);
