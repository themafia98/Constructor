import firebase from '@firebase/app';
const auth = require('firebase/auth');

// setings in root folder / firebase.env
const firebaseConfig = {
        apiKey: "AIzaSyBrLv9RyGWXCeEETRqBbBo3EVOcibmnJwU",
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_DATABASE_URL,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APPID
};

firebase.initializeApp(firebaseConfig);
export default firebase;

export { auth };

