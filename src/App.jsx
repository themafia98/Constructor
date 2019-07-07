import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {testRedux} from './redux/actions';

class App extends React.Component {

  static propTypes = {
    title: PropTypes.string
  }

  state = {

  }

  componentWillMount = () => {

    this.props.dispatch(testRedux());
  }

  render(){

    return <div>Root</div>
  }
}

export default connect()(App);
