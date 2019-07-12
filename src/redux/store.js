import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import combineReducers from './reducers';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const middleware = composeEnhancers(
  applyMiddleware(thunk)
  // other store enhancers if any
);
const store = createStore(combineReducers, middleware);

// store.subscribe(() => {
//     console.log(store.getState());
//   });

export default store;