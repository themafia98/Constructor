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

export {firebaseConfig}