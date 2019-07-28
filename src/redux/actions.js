const CREATE_PROJECT = 'CREATE_PROJECT';
const LOAD_UPDATE_PROJECT = "LOAD_UPDATE_PROJECT";
const LOAD_CURRENT = 'LOAD_CURRENT';
const LOG_OUT_CABINET = 'LOG_OUT_CABINET';
const LOAD_USER_CABINET = 'LOAD_USER_CABINET';
const ERROR_CABINET = 'ERROR_CABINET';
const EXIT_PROJECT = 'EXIT_PROJECT';

const createProjectAction = (state) => {
    return {
        type: CREATE_PROJECT,
        projects: state,
    }
}

const exitProjectAction = (state) => {
    return {
        type: EXIT_PROJECT,
        exit: state
    }
}

const loadCurrentProjectAction = (state) => {
    return {
        type: LOAD_CURRENT,
        id: state.id,
        typeProject: state.typeProject,
        sectionTitleProject: state.sectionTitleProject,
        components: state.components
    }
}

const loadUpdateCurrentProject = (state) => {
    return {
        type: LOAD_UPDATE_PROJECT,
        idProject: state.idProject,
        sectionTitleProject: state.sectionTitleProject,
        components: state.components
    }
}

const loadUserAction = (state) => {
    return {
        type: LOAD_USER_CABINET,
        active: true,
        idUser: state.uid,
        error: '',
        projects: state.projects
    }
}

const logOutAction = (state) => {

    return {
        type: LOG_OUT_CABINET,
        active: false,
        idUser: null,
        error: '',
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
    LOAD_UPDATE_PROJECT, loadUpdateCurrentProject,
    EXIT_PROJECT, exitProjectAction,
    ERROR_CABINET, errorAction, /* both */
}