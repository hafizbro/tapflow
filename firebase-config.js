// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your web app's configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkqlmjRHStXlzpvPA8baMjw5qSCiGg3QQ",
    authDomain: "tapflow-solutions.firebaseapp.com",
    projectId: "tapflow-solutions",
    storageBucket: "tapflow-solutions.firebasestorage.app",
    messagingSenderId: "1676801204",
    appId: "1:1676801204:web:ecb4eb73c2a01c04f993e1",
    measurementId: "G-0BJLR6MYTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };