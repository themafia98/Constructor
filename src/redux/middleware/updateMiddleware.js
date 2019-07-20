import {errorAction, loadUpdateCurrentProject} from '../actions';

const updateMiddleware = (item) => async (dispatch,getState, {firebase}) => {
    console.log('update');

    let newProjects = item.projects.map(project => {
        if (project.id === item.idProject) { project.component = [...item.component] }
        return project;
    });
    await firebase.db.collection("users").doc(item.uid).update({
        'projects': JSON.parse(JSON.stringify(newProjects))
    })
    .then(response => {
        let project = item.projects.find(itemdb => itemdb.id === item.idProject);
        dispatch(loadUpdateCurrentProject({component: [...project.component], idProject: item.idProject}))
    })
    .catch(error => dispatch(errorAction(error.message)));
};

export default updateMiddleware;