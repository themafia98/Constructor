import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';

import store from '../../redux/store';
import Header from '../../components/header/Header';
import Modal from '../../components/modalWindow/ModalWindow';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';

import './main.scss';
const title = require('../../config.json').title;

class Main extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    mode: PropTypes.string,
  }

  state = {
    workMode: 'default',
    information: store.getState().main
  }

  changeWorkMode = (event) => {
    this.setState ({
      ...this.state,
      workMode: event.action,
      information: store.getState().main
    });
  }

  render(){
    console.log(this.state);
    return (
      <Fragment>
        <Header title = {title} />
        {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
          <ProjectsSection />
      </Fragment>
    )
  }

  componentDidMount = () => {
    eventStream.on('EventChangeWorkMode', this.changeWorkMode);
  }

  componentWillUnmount = () => {
    eventStream.off('EventChangeWorkMode', this.changeWorkMode);
  }
}


export default Main;
