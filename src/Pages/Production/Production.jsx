import React from 'react';
import PropTypes from 'prop-types';
// import eventEmitter from '../../EventEmitter.js';
// import {Redirect} from 'react-router-dom';
import withFirebase from '../../components/firebaseHOC';
import {connect} from 'react-redux';

class Production extends React.PureComponent {

    static propTypes = {
        firebase: PropTypes.object,
    }

    render(){
        return (
        <div>PRODUCTION</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      idUser: state.cabinet.idUser,
      projects: [...state.cabinet.projects],
      active: state.cabinet.active
    }
  };

  export default connect(mapStateToProps)(withFirebase(Production));