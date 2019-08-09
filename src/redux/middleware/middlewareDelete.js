
import {errorAction, loadUserAction, loadUpdateCurrentProject} from '../actions';
console.log('test');
const middlewareDelete = item => async (dispatch,getState, {firebase}) => {
    /** Delete some components from project */
    await firebase.db.collection('users').doc(item.uid).get()
    .then(user => user.data())
    .then(data => {
        return {id: item.uid, projects: data.projects.filter(itemdb => itemdb.id !== item.id)};
    })
    .then(data => {
        /** Load update in database */
        firebase.db.collection("users").doc(item.uid).update({
            "projects": data.projects
        })
        .then(response => {
            /** update user data */
            dispatch(loadUserAction({uid: item.uid, projects: data.projects}));
        });
    })
    .catch((error) => {
        console.error(error.message);
        dispatch(errorAction(error.message));
    });
}

const middlewareDeleteProjectComponent = item => async (dispatch, getState, {firebase}) => {
    /** Delete project */
    await firebase.db.collection('users').doc(item.uid).get()
    .then(user => user.data())
    .then(data => {
        const userProjects = [...data.projects];
        const findProject = userProjects.find(project => item.id === project.id);
        if (!findProject) throw new Error('No found project');
        findProject.components = findProject.components.filter(component =>
            component.id !== item.idComponent
        );

        if (item && item.type === 'background'){
            findProject.sectionsProject = findProject.sectionsProject.filter(section => {
                return section !== item.idComponent;
            });
        }
        return {dataUpdate: data, findProject: findProject};
    })
    .then(data => {
        let {dataUpdate} = data;
        let {findProject} = data;
        /** update data in database */
        firebase.db.collection("users").doc(item.uid).update({
            "projects": dataUpdate.projects
        })
        .then(response => {
            /** update user data */
            dispatch(loadUpdateCurrentProject({
                components: [...findProject.components],
                idProject: item.id,
                sectionsProject: [...findProject.sectionsProject],
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
