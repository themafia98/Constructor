import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';
import {Redirect} from 'react-router-dom';
import withFirebase from '../../components/firebaseHOC';

import {middlewareLogOutUser} from '../../redux/middleware/loadUserMiddleware';
import middlewareDelete from '../../redux/middleware/middlewareDelete';
import Loader from '../../components/loading/Loader';
import {connect} from 'react-redux';

import Header from '../../components/header/Header';
import Modal from '../../components/modalWindow/ModalWindow';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';

import './Cabinet.scss';

const title = require('../../config.json').title;

class Cabinet extends React.PureComponent {

  static propTypes = {
    firebase: PropTypes.object.isRequired
  }

  state = {
    workMode: 'default',
  }

  logOut = event => {
    this.props.dispatch(middlewareLogOutUser(this.props.idUser));
  }

  deletItem = event => {
    this.props.dispatch(middlewareDelete({...event, uid: this.props.firebase.getCurrentUser().uid}));
  }

  changeWorkMode = event => {
    this.setState ({
      ...this.state,
      workMode: event.action,
    });
  }

  render(){
    if (this.props.active){
      return (
        <Fragment>
          <Header title = {title} idUser = {this.props.idUser} />
          {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
            <ProjectsSection />
        </Fragment>
      )
    } else if (!this.props.firebase.getCurrentUser()) return <Redirect to = '/' />
    else return <Loader path = '/img/loading.gif' type = 'Cabinet' />
    }


  componentDidMount = () => {
    eventStream.on('EventDeleteItem', this.deletItem);
    eventStream.on('EventChangeWorkMode', this.changeWorkMode);
  }

  componentWillUnmount = () => {
    eventStream.off('EventDeleteItem', this.deletItem);
    eventStream.off('EventChangeWorkMode', this.changeWorkMode);
  }
}

const mapStateToProps = (state) => {
  return {
    idUser: state.cabinet.idUser,
    projects: [...state.cabinet.projects],
    active: state.cabinet.active
  }
}



export default connect(mapStateToProps)(withFirebase(Cabinet));
