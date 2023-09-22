// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXTQTOUq1FaKVj5FEFHG0XaK_GUuENtEs",
  authDomain: "space-bars.firebaseapp.com",
  projectId: "space-bars",
  storageBucket: "space-bars.appspot.com",
  messagingSenderId: "47763528648",
  appId: "1:47763528648:web:065bebb69ea285b5b23efd",
  measurementId: "G-TKJ4TQ5E4W"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default db;