import {LOAD_USER_CABINET, LOG_OUT_CABINET} from './actions';

const initialState = {
    idUser: null,
    logout: false,
    dateConnect: new Date(Date.now()).toLocaleString().replace(/\s/ig,'').split(','),
};

export default (state = initialState, action) => {
    switch(action.type) {
        case LOAD_USER_CABINET: {

            return {
                ...state,
                idUser: action.idUser ? action.idUser : null,
            }
        }
        case LOG_OUT_CABINET: {
            return {
                ...state,
                logout: state.logout,
                idUser: null
            }
        }
        default: return state;
    }
}

