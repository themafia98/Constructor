import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';
import {Redirect} from 'react-router-dom';

import {loadUserAction, logOutAction} from '../../redux/actions';
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
    this.props.dispatch(logOutAction({logout: true}));
    firebase.logout();
  }

  changeWorkMode = (event) => {
    this.setState ({
      ...this.state,
      workMode: event.action,
    });
  }

  render(){
    if (this.props.idUser && this.props.idUser !== 'NO_USER'){
      return (
        <Fragment>
          <Header title = {title} />
          {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
            <ProjectsSection />
        </Fragment>
      )
    } else if (this.props.idUser === 'NO_USER' || this.state.logOut) return <Redirect to = '/' />
    else return <Loader path = '/img/loading.gif' type = 'Cabinet' />
    }

    // shouldComponentUpdate = (nProps, nState) => {
    //   console.log('shouldComponentUpdate');
    //   if (nProps.idUser !== this.props.idUser || this.props.redirect !== nProps.redirect)
    //     return true;
    //   else return false;
    // }

  componentDidMount = () => {
    console.log('Cabinet componentDidMount');
    if (!this.props.idUser) {
    this.props.dispatch(loadUserAction(this.state.user));
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
  return {idUser: state.Cabinet.idUser}
}



export default connect(mapStateToProps)(Cabinet);
