import {    LOAD_USER_CABINET, LOG_OUT_CABINET,
            ERROR_CABINET, CREATE_PROJECT,
            LOAD_UPDATE_PROJECT
        } from './actions';

const initialState = { /** Cabinet reducer (root) */
    active: false,
    idUser: null,
    projects: [],
    error: null,
};

export default (state = initialState, action) => {
    switch(action.type) {
        case LOAD_USER_CABINET: {
            /** load user data if user auth - true */
            return {
                ...state,
                active: action.active,
                idUser: action.idUser,
                projects: [...action.projects]
            }
        }

        case CREATE_PROJECT: {
             /** create new project */
            return {
                ...state,
                projects: [...action.projects]
            }
        }

        case LOAD_UPDATE_PROJECT: {
              /** update project in cabinet */
            return {
                ...state,
                projects: state.projects.map(item => {
                    if (item.id === action.idProject)
                        item.components = [...action.components]
                return item;
                })
            }
        }

        case LOG_OUT_CABINET: {
            /** clear session */
            return {
                ...state,
                active: false,
                idUser: null,
                projects: []
            }
        }

        case ERROR_CABINET: {
            /** catch error in cabinet */
            return {
                ...state,
                error: action.error
            }
        }
        default: return state;
    }
}

