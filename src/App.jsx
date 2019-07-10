import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Provider} from 'react-redux';
import store from './redux/store';

import Index from './Pages/Index/Index';
import Cabinet from './Pages/Cabinet/Cabinet';
import About from './Pages/About/About';
import Build from './Pages/Build/Build';

function App(props){

    // const [firebase] = useState(props.firebase);
    return (
        <Provider store = {store}>
        <BrowserRouter>
                <Switch>
                    <Route path = "/" exact component = {
                    () => <Index  config = {props.config} />
                    } />
                    <Route path = '/Cabinet' exact component = {Cabinet}/>
                    <Route path = '/Cabinet/About' component = {About}/>
                    <Route path = '/Cabinet/Build/:param' component = {Build}/>
                </Switch>
        </BrowserRouter>
    </Provider>
    )
}

export default App;