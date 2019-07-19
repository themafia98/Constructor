import {LOAD_CURRENT,LOAD_UPDATE_PROJECT, EXIT_PROJECT} from './actions';

const initialState = {
    loadProject: false,
    haveUpdateLoading: true,
    idProject: null,
    typeProject: null,
    component: []
};
export default (state = initialState, action) => {
    switch (action.type){

        case LOAD_CURRENT: {
            return {
                ...state,
                haveUpdateLoading: state.haveUpdateLoading ? false : true,
                loadProject: true,
                idProject: action.id,
                typeProject: action.typeProject,
                component: [...action.component]
            }
        }

        case LOAD_UPDATE_PROJECT: {
            return {
                ...state,
                haveUpdateLoading: false,
                component: [...action.component]
            }
        }

        case EXIT_PROJECT: {
            if (action.exit)
            return {
                ...state,
                haveUpdateLoading: true,
                loadProject: false,
                idProject: null,
                typeProject: null,
                component: []
            }
            else return state;
        }
        default: return state;
    }
};