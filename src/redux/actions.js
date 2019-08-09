const CREATE_PROJECT = 'CREATE_PROJECT';
const LOAD_UPDATE_PROJECT = "LOAD_UPDATE_PROJECT";
const LOAD_CURRENT = 'LOAD_CURRENT';
const LOG_OUT_CABINET = 'LOG_OUT_CABINET';
const LOAD_USER_CABINET = 'LOAD_USER_CABINET';
const ERROR_CABINET = 'ERROR_CABINET';
const EXIT_PROJECT = 'EXIT_PROJECT';

const createProjectAction = (state) => {
    /** action for create project */
    return {
        type: CREATE_PROJECT,
        projects: state,
    }
}

const exitProjectAction = (state) => {
       /** action for exit from editable or prod project */
    return {
        type: EXIT_PROJECT,
        exit: state
    }
}

const loadCurrentProjectAction = (state) => {
    /** action for load current editable or prod project */
    return {
        type: LOAD_CURRENT,
        id: state.id,
        typeProject: state.typeProject,
        sectionsProject: state.sectionsProject,
        components: state.components
    }
}

const loadUpdateCurrentProject = (state) => {
    /** action for update editable project */
    return {
        type: LOAD_UPDATE_PROJECT,
        idProject: state.idProject,
        sectionsProject: [...state.sectionsProject],
        components: [...state.components]
    }
}

const loadUserAction = (state) => {
    /** action for load user data */
    return {
        type: LOAD_USER_CABINET,
        active: true,
        idUser: state.uid,
        error: '',
        projects: state.projects
    }
}

const logOutAction = (state) => {
    /** action for clear session */
    return {
        type: LOG_OUT_CABINET,
        active: false,
        idUser: null,
        error: '',
        projects: []
    }
}

const errorAction = (state) => {
    /** action catch errors */
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