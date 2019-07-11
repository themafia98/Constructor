import {LOAD_USER_CABINET} from './actions';

const initialState = {
    idUser: null,
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
        default: return state;
    }
}

