import {LOAD_CURRENT} from './actions';

const initialState = {
    nameEditComponent: null,
    settingsEditComponent: {},
};
export default (state = initialState, action) => {
    switch (action.type){

        case LOAD_CURRENT: {
            return {
                ...state,
                currentEditable: {...action.currentEditable}
            }
        }
        default: return state;
    }
};