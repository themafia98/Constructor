import firebase from '../../components/Firebase/Firebase';
import {loadUserAction} from '../actions';

const middleware = (email,password) => async dispatch => {

        await firebase.login(email,password)
        .then(response =>{
            firebase.db.collection("users").doc(response.user.uid).get()
            .then(docUser => {
                let user = docUser.data();
                console.log(user);
                dispatch(loadUserAction({uid: docUser.id, projects: [...user.projects]}))
            })
        })
        .catch((error) => {
        console.log(error);
        });
    }


export default middleware;