import * as firebase from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import config from '../config.json';
const auth = require('firebase/auth');
const firestore = require('firebase/firestore');

class Firebase {

    constructor(firebaseConfig){
        /** Init firebase */

        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.firestore();

        if (config.firebase.lowConnection === 'true'){
        this.db.enablePersistence() /** if user use low internet connection */
            .catch(function(err) {
                if (err.code === 'failed-precondition') {
                    console.error('failed-precondition: Multiple tabs open,' +
                                'persistence can only be enabled in one tab at a a time.');
                } else if (err.code === 'unimplemented') {
                    console.error('failed-precondition: The current browser does not support');
                }
            });
        }
    }

    saveSession(rules){
        /** Set forebase type session */
        return this.auth.setPersistence(firebase.auth.Auth.Persistence[rules]);
    }

    login(email, password){
        /** login firebase */
        try {
            return this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    registration(email, password){
        /** create new user */
        return this.auth.createUserWithEmailAndPassword(email, password)
    }

    signOut(){
        /** destroy session */
        return this.auth.signOut()
    }

    getCurrentUser() {
        /** get current user */
        return this.auth.currentUser
    }
}
let firebaseInterface = new Firebase(firebaseConfig);
firebaseInterface.saveSession(config.firebase.session);

export default firebaseInterface;
export { auth, firestore };

