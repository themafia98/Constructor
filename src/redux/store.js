import {createStore} from 'redux';
import combineReducers from './reducers';

let broswerPluginDev = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(combineReducers,broswerPluginDev);
export default store;