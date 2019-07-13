import React from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import withFirebase from './components/firebaseHOC';
import Loader from './components/loading/Loader';

import Index from './Pages/Index/Index';
import Cabinet from './Pages/Cabinet/Cabinet';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';


class App extends React.PureComponent {

    static propTypes = {
        config: PropTypes.object.isRequired,
        firebase: PropTypes.object.isRequired,
    }

    state = {
        firebase: this.props.firebase,
        session: false,
        firebaseLoadState: false,
    }

    componentDidMount(){
        if (this.props.firebase)
        this.props.firebase.auth.onAuthStateChanged((user) => {
            if (user) return this.setState({firebaseLoadState: true, session: true});
            else return this.setState({firebaseLoadState: true, session: false});
        });
    }

    render(){
        console.log('app');
        if (this.state.firebaseLoadState){
        return (
            <BrowserRouter>
                    <Switch>
                        <Route
                            path = '/' exact
                            render = {(props) => <Index {...props} session = {this.state.session} />}
                        />
                        <Route path = '/Cabinet/' exact component = {Cabinet}/>
                        <Route
                            path = '/Cabinet/About'
                            render = {(props) => <About {...props} config = {this.props.config} />}
                        />
                        <Route path = '/Cabinet/Build/:param' component = {Build}/>
                    </Switch>
            </BrowserRouter>
        )
        } else return <Loader path = '/img/loading.gif' type = 'application' />
    }
}

export default withFirebase(App);