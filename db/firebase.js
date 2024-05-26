// import "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
export const firebaseConfig = {
    apiKey: "AIzaSyDMJw-rHaJX-Julr9ARTX5wBexQovSPN1U",
    authDomain: "webvelop-balajihotel.firebaseapp.com",
    projectId: "webvelop-balajihotel",
    storageBucket: "webvelop-balajihotel.appspot.com",
    messagingSenderId: "115945048369",
    appId: "1:115945048369:web:b7abe818ae269b4c0e4810",
    measurementId: "G-44NFL20QD5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export default { firebase };