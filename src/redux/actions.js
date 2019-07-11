const SAVE_CHANGES = 'SAVE_CHANGES';
const LOAD_CURRENT = 'LOAD_CURRENT';

const LOAD_USER_CABINET = 'LOAD_USER_CABINET';


const saveChangesAction = (state) => {
    return {
        type: SAVE_CHANGES,
        project: state,
    }
}

const loadCurrentProjectAction = (state) => {
    return {
        type: LOAD_CURRENT,
        currentEditable: state,
    }

}

const loadUserAction = (state) => {
    return {
        type: LOAD_USER_CABINET,
        idUser: state ? state.uid : 'NO_USER'
    }
}


export {
    SAVE_CHANGES, saveChangesAction,
    LOAD_CURRENT, loadCurrentProjectAction,
    LOAD_USER_CABINET, loadUserAction,
}