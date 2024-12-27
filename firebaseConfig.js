// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// 1. import the firestore service
import { getFirestore } from "firebase/firestore";


import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZJQDP5dgxlZr8snQbBFkeMM_m8As819w",
  authDomain: "finalproject-c803f.firebaseapp.com",
  projectId: "finalproject-c803f",
  storageBucket: "finalproject-c803f.firebasestorage.app",
  messagingSenderId: "898035242114",
  appId: "1:898035242114:web:5a57b15c9b9fa7906b109b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. initialize Firestore service
const db = getFirestore(app)

const auth = getAuth(app)

// 3. export the Firestore service from this js file so other parts of your app can use it
export { db , auth}
