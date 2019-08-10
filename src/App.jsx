import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
/* ------- Moddlewares ------- */
import {middlewareLoadUserData} from './redux/middleware/loadUserMiddleware';
/* ------- Child components ------- */
import withFirebase from './components/withFirebase';
import Loader from './components/loading/Loader';
import Index from './Pages/Index/Index';
import Cabinet from './Pages/Cabinet/Cabinet';
import Production from './Pages/Production/Production';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';
import Guide from './Pages/Guide/Guide';
import ErrorPage from './components/ErrorCatch/ErrorPage';
import './root.scss';

class App extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object.isRequired, /** @Config app */
        firebase: PropTypes.object.isRequired, /** @firebase class for use firebase functions */
        dispatch: PropTypes.func.isRequired, /** @dispatch - redux */
    }

    state = {
        firebase: this.props.firebase,
        firebaseLoadState: false,
        config: this.props.config,
    }

    componentDidMount(){
        /** Listening firebase answer after first load app */
        this.props.firebase.auth.onAuthStateChanged((user) => {
            if (!this.state.firebaseLoadState){
                /** if user - true, loading data in store */
                if (user) this.props.dispatch(middlewareLoadUserData(user.uid))
                .then((res) =>  { /** show loader */
                    this.setState({...this.state, firebaseLoadState: res});
                }); /** if loading = redirect */
                else  this.setState({...this.state, firebaseLoadState: true});
            }
        });
    }

    render(){
        if (this.state.firebaseLoadState){
            return (
                <Switch>
                        <Route
                            path = {'/'} exact
                            render = {(props) => <Index {...props} config = {this.state.config} />}
                        />
                        <Route 
                            path = '/Cabinet/' exact 
                            render = {(props) => <Cabinet {...props} config = {this.state.config} />}
                        />
                        <Route
                            path = {'/Cabinet/About'}
                            render = {(props) => <About {...props} config = {this.state.config} />}
                        />
                        <Route path = {'/Cabinet/Build/:param'} exact
                            render = {(props) => <Build {...props} />}
                        />
                        <Route path = {'/Cabinet/Build/:param/Production'} exact component = {Production} />
                        <Route path = {'/Cabinet/Guide'} exact 
                        render = {(props) => <Guide {...props} config = {this.state.config} />}
                        />
                        <Route path = {'*'} component = {Index} />
                        <Route path = {'/crashPage'} component = {ErrorPage} />
                </Switch>

            )
        } else return <Loader path = { '/img/loading.gif'} type = 'application' />
    }
}

export default connect()(withFirebase(App));