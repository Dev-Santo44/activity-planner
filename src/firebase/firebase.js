import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuqSR2ht-In8AAcOSEj4iSEfRbTYI-Yn8",
    authDomain: "activity-planner-2490d.firebaseapp.com",
    databaseURL: "https://activity-planner-2490d-default-rtdb.firebaseio.com",
    projectId: "activity-planner-2490d",
    storageBucket: "activity-planner-2490d.firebasestorage.app",
    messagingSenderId: "658199171586",
    appId: "1:658199171586:web:a2136127415837ea014d1b",
    measurementId: "G-W31Y5B0YCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export {app, auth};