import React,{Fragment} from 'react';
import PropTypes from 'prop-types';

import eventStream from '../../EventEmitter.js';

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
  }

  changeWorkMode = (event) => {
    console.log(event.action);
    this.setState ({
      ...this.state,
      workMode: event.action
    });
  }

  render(){

    return (
      <Fragment>
        <Header title = {title} />
        {(this.state.workMode === 'newProject') ? <Modal workMode = {this.state.workMode} /> : null}
          <ProjectsSection />
      </Fragment>
    )
  }

  componentDidMount(){
    eventStream.on('EventChangeWorkMode', this.changeWorkMode);
  }

  componentWillUnmount(){
    eventStream.off('EventChangeWorkMode', this.changeWorkMode);
  }
}

export default Main;
