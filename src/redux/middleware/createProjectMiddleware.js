import {createProjectAction, errorAction} from '../actions';


function random(min){ /** Generate keys */
    return `${Math.floor(min + Math.random() * (10000-min))}`
}


const middlewareCreateProject = (uid, list, title, type) => async (dispatch,getState, {firebase}) => {
    /** Create new project */
    let lastProject = [...list];
    const lastIndex = lastProject.length  ? lastProject[lastProject.length-1].id + 1 : 0;
    const sectionsProject = [];
    if (type === 'portfolio') sectionsProject.push("Header");
    else sectionsProject.push("Header");
    const header = {
        backgroundImage: null,
        backgroundColor: null,
        id: `MainBackgroundHeader${random(0)}`,
        targetSection: "Header",
        type: "background"
    }

    lastProject.push({
        id: lastIndex,
        title: title,
        type: type,
        components: [header],
        sectionsProject: [...sectionsProject],
    });
    /** Load project in database */
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