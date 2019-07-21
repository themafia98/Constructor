import {LOAD_CURRENT,LOAD_UPDATE_PROJECT, EXIT_PROJECT} from './actions';

const initialState = {
    loadProject: false,
    haveUpdateLoading: true,
    idProject: null,
    typeProject: null,
    components: []
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
                components: [...action.components]
            }
        }

        case LOAD_UPDATE_PROJECT: {
            return {
                ...state,
                haveUpdateLoading: false,
                components: [...action.components]
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
                components: []
            }
            else return state;
        }
        default: return state;
    }
};