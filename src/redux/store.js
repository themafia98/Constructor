import {createStore, applyMiddleware, compose} from 'redux';
import firebase from  '../Firebase/Firebase';
import reduxCatch from 'redux-catch';
import thunk from 'redux-thunk';
import combineReducers from './reducers';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

    function errorHandler(error, getState, lastAction, dispatch) {
      console.error(error);
      console.debug('current state', getState());
      console.debug('last action was', lastAction);
      // optionally dispatch an action due to the error using the dispatch parameter
    }

const middleware = composeEnhancers(
  applyMiddleware(thunk.withExtraArgument({firebase})),
  applyMiddleware(reduxCatch(errorHandler))
);
const store = createStore(combineReducers, middleware);


export default store;