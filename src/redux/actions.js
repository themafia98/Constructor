const SAVE_CHANGES = 'SAVE_CHANGES';
const LOAD_CURRENT = 'LOAD_CURRENT';


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


export {
    SAVE_CHANGES, saveChangesAction,
    LOAD_CURRENT, loadCurrentProjectAction
}