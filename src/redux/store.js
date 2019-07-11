import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import combineReducers from './reducers';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

    let email = null;
    let password = null;
const enhancer = composeEnhancers(
  applyMiddleware(thunk.withExtraArgument({email,password})
  // other store enhancers if any
));
const store = createStore(combineReducers, enhancer);

store.subscribe(() => {
    console.log(store.getState());
  });

export default store;