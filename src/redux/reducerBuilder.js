import {SAVE_CHANGES} from './actions';

const initialState = {
    idUser: 'id' + (Math.random() * 10),
    project: {
        components:{

        }
    },
};

export default (state = initialState, action) => {

    switch (action.type){

        case SAVE_CHANGES: {
            return {
                ...state,
                project: {...state.project}
            }
        }
        default: return state;
    }
};