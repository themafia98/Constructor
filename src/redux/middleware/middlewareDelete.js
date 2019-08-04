
import {errorAction, loadUserAction, loadUpdateCurrentProject} from '../actions';

const middlewareDelete = item => async (dispatch,getState, {firebase}) => {

    await firebase.db.collection('users').doc(item.uid).get()
    .then(user => user.data())
    .then(data => {
        return {id: item.uid, projects: data.projects.filter(itemdb => itemdb.id !== item.id)};
    })
    .then(data => {
        firebase.db.collection("users").doc(item.uid).update({
            "projects": data.projects
        })
        .then(response => {
            dispatch(loadUserAction({uid: item.uid, projects: data.projects}));
        });
    })
    .catch((error) => {
        console.error(error.message);
        dispatch(errorAction(error.message));
    });
}

const middlewareDeleteProjectComponent = item => async (dispatch, getState, {firebase}) => {
    await firebase.db.collection('users').doc(item.uid).get()
    .then(user => user.data())
    .then(data => {
        const userProjects = [...data.projects];
        const findProject = userProjects.find(project => item.id === project.id);
        if (!findProject) throw new Error('No found project');
        findProject.components = findProject.components.filter(component =>
            component.id !== item.idComponent
        );
        return {dataUpdate: data, findProject: findProject};
    })
    .then(data => {
        let {dataUpdate} = data;
        let {findProject} = data;
        firebase.db.collection("users").doc(item.uid).update({
            "projects": dataUpdate.projects
        })
        .then(response => {
            dispatch(loadUpdateCurrentProject({
                components: [...findProject.components],
                idProject: item.id,
                sectionsProject: [...item.sectionsProject],
            }))
        });
    })
    .catch(error => {
        console.error(error.message);
        dispatch(errorAction(error.message));
        return null;
    });

    return item.idComponent;
}

export {middlewareDeleteProjectComponent};
export default middlewareDelete;
