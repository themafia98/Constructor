import firebase from '../../Firebase/Firebase';
import {loadUserAction, errorAction, logOutAction} from '../actions';

const middlewareLogin = (email,password) => async dispatch => {
        await firebase.login(email,password)
        .then(response =>{
            firebase.db.collection("users").doc(response.user.uid).get()
            .then(docUser => {
                let user = docUser.data();
                dispatch(loadUserAction({uid: docUser.id, projects: [...user.projects]}))
            })
        })
        .catch((error) => dispatch(errorAction(error.message)));
    }

const middlewareLoadUserData = (uid) => async dispatch => {
        await firebase.db.collection("users").doc(uid).get()
        .then(docUser => {
            let user = docUser.data();
            dispatch(loadUserAction({uid: uid, projects: [...user.projects]}))
        })
        .catch(error => dispatch(errorAction(error.message)));
    }

const middlewareLogOutUser = (uid) => async dispatch => {
    await firebase.signOut()
    .then (response => {
        dispatch(logOutAction());
    })
    .catch(error => dispatch(errorAction(error.message)));
}
export {
    middlewareLogin,middlewareLoadUserData, middlewareLogOutUser
}