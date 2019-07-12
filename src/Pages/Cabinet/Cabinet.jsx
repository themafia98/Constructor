import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';
import {Redirect} from 'react-router-dom';

import {middlewareLoadUserData, middlewareLogOutUser} from '../../redux/middleware/loadUserMiddleware';
import Loader from '../../components/loading/Loader';
import {connect} from 'react-redux';

import firebase from '../../components/Firebase/Firebase.js';

import Header from '../../components/header/Header';
import Modal from '../../components/modalWindow/ModalWindow';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';

import './Cabinet.scss';

const title = require('../../config.json').title;

class Cabinet extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string,
    mode: PropTypes.string,
  }

  state = {
    workMode: 'default',
    logOut: false,
    user: firebase.getCurrentUser()
  }

  logOut = (event) => {
    console.log(event);
    this.props.dispatch(middlewareLogOutUser(this.props.idUser));
  }

  changeWorkMode = (event) => {
    this.setState ({
      ...this.state,
      workMode: event.action,
    });
  }

  render(){
    if (this.props.idUser){
      return (
        <Fragment>
          <Header title = {title} />
          {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
            <ProjectsSection />
        </Fragment>
      )
    } else if (!this.state.user) return <Redirect to = '/' />
    else return <Loader path = '/img/loading.gif' type = 'Cabinet' />
    }


  componentDidMount = () => {
    console.log('Cabinet componentDidMount');
    if (this.state.user && !this.props.idUser) {
      console.log('Cabinet dispatch');
    this.props.dispatch(middlewareLoadUserData(this.state.user.uid));
    }

    eventStream.on('EventChangeWorkMode', this.changeWorkMode);
    eventStream.on('EventLogOut', this.logOut);
  }

  componentWillUnmount = () => {
    eventStream.off('EventChangeWorkMode', this.changeWorkMode);
    eventStream.off('EventLogOut', this.logOut);
  }
}

const mapStateToProps = (state) => {
  return {idUser: state.cabinet.idUser, projects: [...state.cabinet.projects]}
}



export default connect(mapStateToProps)(Cabinet);
