// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjM3qMykGI07150pbDsqQODdX6ynXTpLA",
  authDomain: "checkin-if.firebaseapp.com",
  projectId: "checkin-if",
  storageBucket: "checkin-if.appspot.com",
  messagingSenderId: "766335719780",
  appId: "1:766335719780:web:6b7a64a21a50eab7af4271",
  measurementId: "G-L0PV3MB3PQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
export { firebaseConfig };