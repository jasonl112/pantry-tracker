// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDy2taCvIE1EN94PqN66JbO0gnAy8kLhBQ",
  authDomain: "pantry-838bc.firebaseapp.com",
  databaseURL: "https://pantry-838bc-default-rtdb.firebaseio.com",
  projectId: "pantry-838bc",
  storageBucket: "pantry-838bc.appspot.com",
  messagingSenderId: "132518380168",
  appId: "1:132518380168:web:fa1e930fc4f5f132dc553d",
  measurementId: "G-Q1X4EBFFXZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db };
