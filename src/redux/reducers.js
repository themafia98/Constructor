import {combineReducers} from 'redux';
import reducerBuilder from './reducerBuilder';

export default combineReducers({
    buildState: reducerBuilder,
});