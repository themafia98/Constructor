import {combineReducers} from 'redux';
import reducerBuilder from './reducerBuilder';
import reducerCabinet from './reducerCabinet';

export default combineReducers({
    builder: reducerBuilder,
    Cabinet: reducerCabinet,
});