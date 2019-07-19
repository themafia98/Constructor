import {loadUserAction, errorAction, logOutAction} from '../actions';

const middlewareLogin = (email,password) => async (dispatch,getState, {firebase}) => {
        await firebase.login(email,password)
        .then(response =>{
            firebase.db.collection("users").doc(response.user.uid).get()
            .then(docUser => {
                let user = docUser.data();
                dispatch(loadUserAction({uid: docUser.id, projects: [...user.projects]}))
            })
        })
        .catch((error) => {
            console.error(error.message);
            dispatch(errorAction(error.message));
        });
    }

const middlewareLoadUserData = (uid) => async (dispatch,getState, {firebase}) => {
        await firebase.db.collection("users").doc(uid).get()
        .then(docUser => {
            let user = docUser.data();
            dispatch(loadUserAction({uid: uid, projects: [...user.projects]}))
        })
        .catch((error) => {
            console.error(error.message);
            dispatch(errorAction(error.message));
        });
    }

const middlewareLogOutUser = (uid) => async (dispatch,getState, {firebase}) => {
    await firebase.signOut()
    .then (response => {
        dispatch(logOutAction());
    })
    .catch((error) => {
        console.error(error.message);
        dispatch(errorAction(error.message));
    });
}
export {
    middlewareLogin,middlewareLoadUserData, middlewareLogOutUser
}