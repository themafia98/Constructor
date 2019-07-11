const SAVE_CHANGES = 'SAVE_CHANGES';
const LOAD_CURRENT = 'LOAD_CURRENT';
const LOG_OUT_CABINET = 'LOG_OUT_CABINET';
const LOAD_USER_CABINET = 'LOAD_USER_CABINET';


const saveChangesAction = (state) => {
    let copy = [...state];
    return {
        type: SAVE_CHANGES,
        project: copy,
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
    let copy = [...state.projects];
    return {
        type: LOAD_USER_CABINET,
        logout: false,
        idUser: state.hasOwnProperty('uid') ? state.uid : 'NO_USER',
        projects: copy
    }
}

const logOutAction = (state) => {
    return {
        type: LOG_OUT_CABINET,
        logout: state.logout,
        idUser: 'NO_USER'
    }
}


export {
    SAVE_CHANGES, saveChangesAction,
    LOAD_CURRENT, loadCurrentProjectAction,
    LOAD_USER_CABINET, loadUserAction,
    LOG_OUT_CABINET, logOutAction,
}