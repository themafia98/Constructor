import firebase from '@firebase/app';
import {firebaseConfig} from './firebaseConfig';

import eventStream from '../EventEmitter';

const auth = require('firebase/auth');
const firestore = require('firebase/firestore');

class Firebase {

        constructor(){
                firebase.initializeApp(firebaseConfig);
                this.auth = firebase.auth();
                this.db = firebase.firestore();
        }

        saveSession(rules){
                return this.auth.setPersistence(firebase.auth.Auth.Persistence[rules]);
        }

        login(email, password){
                return this.auth.signInWithEmailAndPassword(email, password);
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

let fireBase = new Firebase();
fireBase.saveSession('SESSION');

export default fireBase;

export { auth, firestore };

