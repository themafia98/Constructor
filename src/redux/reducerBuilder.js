import {SAVE_CHANGES, LOAD_PROJECTS} from './actions';

const initialState = {
    project: [],
};

export default (state = initialState, action) => {
    switch (action.type){
        case SAVE_CHANGES: {
            return {
                ...state,
                project: [...action.project]
            }
        }
        case LOAD_PROJECTS: {
            return {...state}
        }
        default: return state;
    }
};