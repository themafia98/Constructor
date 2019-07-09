const SAVE_CHANGES = 'SAVE_CHANGES';


const saveChangesAction = function(state){
    return {
        type: SAVE_CHANGES,
        buildState: state
    }
}


export {
    SAVE_CHANGES, saveChangesAction
}