import {LOAD_CURRENT} from './actions';

const initialState = {
    currentEditable: null,
};
export default (state = initialState, action) => {
    switch (action.type){
        // case SAVE_CHANGES: {
        //     return {
        //         ...state,
        //     }
        // }
        case LOAD_CURRENT: {
            return {
                ...state,
                currentEditable: {...action.currentEditable}
            }
        }
        default: return state;
    }
};