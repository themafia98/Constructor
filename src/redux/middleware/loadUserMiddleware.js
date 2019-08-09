import {loadUserAction, errorAction, logOutAction} from '../actions';

const middlewareLogin = (email,password) => async (dispatch,getState, {firebase}) => {
    /** Auth */
    let isLogin = true;
        await firebase.login(email,password)
        .then(response =>{
            firebase.db.collection("users").doc(response.user.uid).get()
            .then(docUser => {
                let user = docUser.data();
                /** Load user if auth - true */
                dispatch(loadUserAction({uid: docUser.id, projects: [...user.projects]}))
            })
        })
        .catch((error) => {
            console.error(error.message);
            dispatch(errorAction(error.message));
        });
        return isLogin;
    }

const middlewareLoadUserData = (uid) => async (dispatch,getState, {firebase}) => {
    /** Load user data */
        let isError = null;
        await firebase.db.collection("users").doc(uid).get()
        .then(docUser => {
            let user = docUser.data();
            /** load if user data found */
            dispatch(loadUserAction({uid: uid, projects: [...user.projects]}))
        })
        .catch((error) => {
            console.error(error.message);
            dispatch(errorAction(error.message));
            isError = true;
        });

        if (!isError) return true;
        else return false;
    }

const middlewareLogOutUser = (uid) => async (dispatch,getState, {firebase}) => {
    /** disconnect from session */
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