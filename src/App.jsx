import React from 'react';
import PropTypes from 'prop-types';

import {Route, Switch} from 'react-router-dom';

import {middlewareLoadUserData} from './redux/middleware/loadUserMiddleware';
import {connect} from 'react-redux';
import withFirebase from './components/firebaseHOC';
import Loader from './components/loading/Loader';

import Index from './Pages/Index/Index';
import Cabinet from './Pages/Cabinet/Cabinet';
import Production from './Pages/Production/Production';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';
import ErrorPage from './components/ErrorCatch/ErrorPage';
import ScrollMove from './components/scroll/ScrollMove';

class App extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object.isRequired, /** @Config app */
        firebase: PropTypes.object.isRequired, /** @firebase class for use firebase functions */
        dispatch: PropTypes.func.isRequired, /** @dispatch - redux */
    }

    state = {
        firebase: this.props.firebase,
        firebaseLoadState: false,
    }

    componentDidMount(){

        this.props.firebase.auth.onAuthStateChanged((user) => {

            if (!this.state.firebaseLoadState){
                if (user) this.props.dispatch(middlewareLoadUserData(user.uid));
                this.setState({...this.state, firebaseLoadState: true});
            }
        });
    }

    render(){
        if (this.state.firebaseLoadState){
            return (
                <Switch>
                    <Route
                        path = {'/'} exact
                        render = {(props) => <Index {...props} />}
                    />
                    <Route path = '/Cabinet/' exact component = {Cabinet}/>
                    <Route
                        path = {'/Cabinet/About'}
                        render = {(props) => <About {...props} config = {this.props.config} />}
                    />
                    <Route path = {'/Cabinet/Build/:param'} exact 
                        render = {(props) => <ScrollMove><Build {...props}></Build></ScrollMove>}
                    />
                    <Route path = {'/Cabinet/Build/:param/Production'} exact component = {Production} />
                    <Route path = {'*'} component = {Index} />
                    <Route path = {'/crashPage'} component = {ErrorPage} />
                </Switch>
            )
        } else return <Loader path = { '/img/loading.gif'} type = 'application' />
    }
}

export default connect()(withFirebase(App));