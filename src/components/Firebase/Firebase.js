import firebase from '@firebase/app';
import eventStream from '../../EventEmitter';
const auth = require('firebase/auth');
const firestore = require('firebase/firestore');


// setings in root folder / firebase.env
const firebaseConfig = {
        apiKey: "AIzaSyBrLv9RyGWXCeEETRqBbBo3EVOcibmnJwU",
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_DATABASE_URL,
        projectId: "constructor-acb61",
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APPID
};



class Firebase {
        constructor(){
                firebase.initializeApp(firebaseConfig);
                this.auth = firebase.auth();
                this.db = firebase.firestore();
        }

        login(email, password){
                console.log('login');
                return this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
                .then(() =>{
                return this.auth.signInWithEmailAndPassword(email, password);
                });
        }

        registration(email, password){
                return this.auth.createUserWithEmailAndPassword(email, password)
        }

        logout(){
                return this.auth.signOut()
        }

        getCurrentUser() {
                return this.auth.currentUser
        }
}

let fireBase = new Firebase();
fireBase.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
fireBase.auth.onAuthStateChanged((user) => {
        if (user) {
          console.log(user.uid);
         eventStream.emit('EventRefresh', {'user': user, ses: true});
        } else eventStream.emit('EventRefresh', {ses: false, redirect: true});
      });

export default fireBase;

export { auth, firestore };

