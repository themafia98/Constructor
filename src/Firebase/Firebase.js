import * as firebase from 'firebase/app';
import firebaseConfig from './firebaseConfig';

const auth = require('firebase/auth');
const firestore = require('firebase/firestore');

class Firebase {

        constructor(firebaseConfig){
                firebase.initializeApp(firebaseConfig);
                this.auth = firebase.auth();
                this.db = firebase.firestore();
        }

        saveSession(rules){
                return this.auth.setPersistence(firebase.auth.Auth.Persistence[rules]);
        }

        login(email, password){
                try {
                return this.auth.signInWithEmailAndPassword(email, password);
                } catch (error) {
                console.error(error);
                return null;
                }
        }

        registration(email, password){
                return this.auth.createUserWithEmailAndPassword(email, password)
        }

        signOut(){
                return this.auth.signOut()
        }

        getCurrentUser() {
                return this.auth.currentUser
        }
}

let interfaceFirebase = new Firebase(firebaseConfig);
interfaceFirebase.saveSession('NONE');

export default interfaceFirebase;

export { auth, firestore };

