import {combineReducers} from 'redux';
import reducerBuilder from './reducerBuilder';
import reducerMain from './reducerMain';

export default combineReducers({
    builder: reducerBuilder,
    main: reducerMain,
});