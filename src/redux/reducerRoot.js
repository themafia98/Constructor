import {ROOT_INIT} from './actions';
const initialState = {
    test: 0,
};

export default (state = initialState, action) => {

    switch (action.type){

        case ROOT_INIT: {
            return {
                ...state,
                test: state.test + 1,
            }
        }
        default: return state;
    }
};