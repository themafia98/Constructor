import {LOAD_USER_CABINET, LOG_OUT_CABINET, ERROR_CABINET, CREATE_PROJECT} from './actions';

const initialState = {
    active: false,
    idUser: null,
    projects: [],
    error: null,
    dateConnect: new Date(Date.now()).toLocaleString().replace(/\s/ig,'').split(','),
};

export default (state = initialState, action) => {

    switch(action.type) {
        case LOAD_USER_CABINET: {

            return {
                ...state,
                active: action.active,
                idUser: action.idUser,
                projects: action.projects
            }
        }

        case CREATE_PROJECT: {
            return {
                ...state,
                projects: action.projects
            }
        }

        case LOG_OUT_CABINET: {
            return {
                ...state,
                active: false,
                idUser: null,
                projects: []
            }
        }

        case ERROR_CABINET: {
            return {
                ...state,
                error: action.error
            }
        }
        default: return state;
    }
}

