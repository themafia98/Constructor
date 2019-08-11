import {LOAD_CURRENT,LOAD_UPDATE_PROJECT, EXIT_PROJECT} from './actions';

const initialState = { /** @Builder reducer for build mode */
    loadProject: false,
    idProject: null,
    typeProject: null,
    components: [],
    sectionsProject: [],
};

export default (state = initialState, action) => {
    switch (action.type){

        case LOAD_CURRENT: {
            /** load data */
            return {
                ...state,
                loadProject: true,
                idProject: action.id,
                typeProject: action.typeProject,
                components: [...action.components],
                sectionsProject: [...action.sectionsProject]
            }
        }

        case LOAD_UPDATE_PROJECT: {
             /** load update for project */
            return {
                ...state,
                components: [...action.components],
                sectionsProject: [...action.sectionsProject]
            }
        }

        case EXIT_PROJECT: {
             /** if user exit from edit mode */
            if (action.exit)
            return {
                ...state,
                loadProject: false,
                idProject: null,
                typeProject: null,
                components: [],
                sectionsProject: []
            }
            else return state;
        }
        default: return state;
    }
};