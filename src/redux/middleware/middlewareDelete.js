
import {errorAction, loadUserAction} from '../actions';

const middlewareDelete = item => async (dispatch,getState, {firebase}) => {
    console.log('middleware');
    await firebase.db.collection('users').doc(item.uid).get()
    .then(user => user.data())
    .then(data => {
        return {id: data.id, projects: data.projects.filter(itemdb => itemdb.id !== item.id)};
    })
    .then(data => {
        firebase.db.collection("users").doc(item.uid).update({
            "projects": data.projects
        })
        .then(response => {
            dispatch(loadUserAction({uid: data.id, projects: data.projects}));
        });
    })
    .catch((error) => {
        console.error(error.message);
        dispatch(errorAction(error.message));
    });
}

export default middlewareDelete;
