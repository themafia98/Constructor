const SAVE_CHANGES = 'SAVE_CHANGES';
const LOAD_PROJECTS = 'LOAD_PROJECTS';


const saveChangesAction = (state) => {
    return {
        type: SAVE_CHANGES,
        project: state,
    }
}

const loadProjectsAction = (state) => {
    return {
        type: LOAD_PROJECTS,
    }

}


export {
    SAVE_CHANGES, saveChangesAction,
    LOAD_PROJECTS, loadProjectsAction
}