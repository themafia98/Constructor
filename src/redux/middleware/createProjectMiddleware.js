import {createProjectAction, errorAction} from '../actions';


function random(min,max){
    return `${Math.floor(min + Math.random() * (max-min))}`
}


const middlewareCreateProject = (uid, list, title, type) => async (dispatch,getState, {firebase}) => {
    let lastProject = [...list];
    const lastIndex = lastProject.length  ? lastProject[lastProject.length-1].id + 1 : 0;
    const sectionsProject = [];
    if (type === 'portfolio') sectionsProject.push("Header");
    else sectionsProject.push("Header");
    const header = {
        backgroundImage: null,
        color: null,
        id: `MainBackgroundHeader${random(0,10000)}`,
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