import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';
import {Redirect} from 'react-router-dom';


import firebase from '../../components/Firebase/Firebase.js';
import store from '../../redux/store';

import Header from '../../components/header/Header';
import Modal from '../../components/modalWindow/ModalWindow';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';

import './Cabinet.scss';
const title = require('../../config.json').title;

class Cabinet extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    mode: PropTypes.string,
  }

  state = {
    workMode: 'default',
    information: store.getState().Cabinet,
    user: firebase.getCurrentUser()
  }

  changeWorkMode = (event) => {
    this.setState ({
      ...this.state,
      workMode: event.action,
      information: store.getState().Cabinet
    });
  }

  render(){

    if (this.state.user){
      return (
        <Fragment>
          <Header title = {title} />
          {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
            <ProjectsSection />
        </Fragment>
      )
    } else return <Redirect to = '/' />
    }

  componentDidMount = () => {
    eventStream.on('EventChangeWorkMode', this.changeWorkMode);
  }

  componentWillUnmount = () => {
    eventStream.off('EventChangeWorkMode', this.changeWorkMode);
  }
}

export default Cabinet;
