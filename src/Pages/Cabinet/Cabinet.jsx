import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';
import {Redirect} from 'react-router-dom';
import withFirebase from '../../components/firebaseHOC';

import {middlewareLoadUserData, middlewareLogOutUser} from '../../redux/middleware/loadUserMiddleware';
import Loader from '../../components/loading/Loader';
import {connect} from 'react-redux';

import Header from '../../components/header/Header';
import Modal from '../../components/modalWindow/ModalWindow';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';

import './Cabinet.scss';

const title = require('../../config.json').title;

class Cabinet extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    firebase: PropTypes.object.isRequired
  }

  state = {
    workMode: 'default',
    logOut: false,
    user: this.props.firebase.getCurrentUser()
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
          <Header title = {title} idUser = {this.props.idUser} />
          {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
            <ProjectsSection />
        </Fragment>
      )
    } else if (!this.state.user) return <Redirect to = '/' />
    else return <Loader path = '/img/loading.gif' type = 'Cabinet' />
    }


  componentDidMount = () => {
    if (this.state.user && !this.props.idUser) {
    this.props.dispatch(middlewareLoadUserData(this.state.user.uid));
    }

    eventStream.on('EventChangeWorkMode', this.changeWorkMode);
  }

  componentWillUnmount = () => {
    eventStream.off('EventChangeWorkMode', this.changeWorkMode);
  }
}

const mapStateToProps = (state) => {
  return {idUser: state.cabinet.idUser, projects: [...state.cabinet.projects]}
}



export default connect(mapStateToProps)(withFirebase(Cabinet));
