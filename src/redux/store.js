import {createStore, applyMiddleware, compose} from 'redux';
import firebase from  '../Firebase/Firebase';
import thunk from 'redux-thunk';
import combineReducers from './reducers';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const middleware = composeEnhancers(
  applyMiddleware(thunk.withExtraArgument({firebase})));

const store = createStore(combineReducers, middleware);
export default store;