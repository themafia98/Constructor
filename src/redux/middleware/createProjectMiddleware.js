import {createProjectAction, errorAction} from '../actions';


const middlewareCreateProject = (uid, list, title, type) => async (dispatch,getState, {firebase}) => {
    let lastProject = [...list];
    const lastIndex = lastProject.length  ? lastProject[lastProject.length-1].id + 1 : 0;
    lastProject.push({"id": lastIndex, "title": title, "type": type, component: []});

    await firebase.db.collection("users").doc(uid).update({
        'projects': lastProject,
    })
    .then (() => dispatch(createProjectAction(lastProject)))
    .catch(error => {
        console.error(error.message);
        dispatch(errorAction(error.message));
    })
};

export {
    middlewareCreateProject
}