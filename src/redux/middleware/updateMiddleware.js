import {errorAction, loadUpdateCurrentProject} from '../actions';
const updateMiddleware = (item) => async (dispatch,getState, {firebase}) => {
    let newProjects = item.projects.map(project => {
        if (project.id === item.idProject) {
            project.components = [...item.components]
            project.sectionTitleProject = [...item.sectionTitleProject]
        }
        return project;
    });
    await firebase.db.collection("users").doc(item.uid).update({
        'projects': JSON.parse(JSON.stringify(newProjects))
    })
    .then(response => {
        let project = item.projects.find(itemdb => itemdb.id === item.idProject);
        dispatch(loadUpdateCurrentProject({
            components: [...project.components],
            idProject: item.idProject,
            sectionTitleProject: item.sectionTitleProject,
        }))
    })
    .catch(error => dispatch(errorAction(error.message)));
};

export default updateMiddleware;