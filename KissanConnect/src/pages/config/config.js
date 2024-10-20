import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyApSz11Fy1G1-RKHSrLdQ_OP68TrZr5Z5U",
    authDomain: "kissan-connect-33f10.firebaseapp.com",
    projectId: "kissan-connect-33f10",
    storageBucket: "kissan-connect-33f10.appspot.com",
    messagingSenderId: "745440975310",
    appId: "1:745440975310:android:016d39b3dfa765d69af39f",
};

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { app,auth, db, storage }