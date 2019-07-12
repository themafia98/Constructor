const CREATE_PROJECT = 'CREATE_PROJECT';
const LOAD_CURRENT = 'LOAD_CURRENT';
const LOG_OUT_CABINET = 'LOG_OUT_CABINET';
const LOAD_USER_CABINET = 'LOAD_USER_CABINET';
const ERROR_CABINET = 'ERROR_CABINET';


const createProjectAction = (state) => {
    console.log(state);
    return {
        type: CREATE_PROJECT,
        projects: [...state],
    }
}

const loadCurrentProjectAction = (state) => {
    return {
        type: LOAD_CURRENT,
        currentEditable: state,
    }

}

const loadUserAction = (state) => {
    console.log(state);
    return {
        type: LOAD_USER_CABINET,
        active: true,
        idUser: state.uid,
        projects: [...state.projects]
    }
}

const logOutAction = (state) => {

    return {
        type: LOG_OUT_CABINET,
        active: false,
        idUser: null,
        projects: []
    }
}

const errorAction = (state) => {
    return {
        type: ERROR_CABINET,
        error: state
    }
}

export {
    CREATE_PROJECT, createProjectAction, /* cabinet */
    LOAD_USER_CABINET, loadUserAction, /* cabinet */
    LOG_OUT_CABINET, logOutAction, /* cabinet */
    LOAD_CURRENT, loadCurrentProjectAction, /* builder */
    ERROR_CABINET, errorAction, /* both */
}