// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQLvgvw69oj0ZcGi-7p2oCAtwpxe4RY08",
  authDomain: "smart-helpdesk-8c1a0.firebaseapp.com",
  projectId: "smart-helpdesk-8c1a0",
  storageBucket: "smart-helpdesk-8c1a0.firebasestorage.app",
  messagingSenderId: "157086199696",
  appId: "1:157086199696:web:51d74aa3450f812f3a4d15",
  measurementId: "G-0CPJSWEQQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db }; // ✅ make sure this line is included
