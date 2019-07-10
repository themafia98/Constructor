import {SAVE_CHANGES, LOAD_CURRENT} from './actions';

const initialState = {
    currentEditable: null,
    project: [],
};
console.log('reducerB');
export default (state = initialState, action) => {
    switch (action.type){
        case SAVE_CHANGES: {
            return {
                ...state,
                project: [...action.project]
            }
        }
        case LOAD_CURRENT: {
            return {
                ...state,
                currentEditable: {...action.currentEditable}
            }
        }
        default: return state;
    }
};