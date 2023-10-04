// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKmOylWL1JPX8SRtShn2Cx1QaqmcDERaM",
  authDomain: "chat-app-dd642.firebaseapp.com",
  databaseURL: "https://chat-app-dd642-default-rtdb.firebaseio.com",
  projectId: "chat-app-dd642",
  storageBucket: "chat-app-dd642.appspot.com",
  messagingSenderId: "200716491161",
  appId: "1:200716491161:web:a1228d980888145c785b08",
  measurementId: "G-XPTYQTECWD"
};

// Initialize Firebase
const firebaseApp= initializeApp(firebaseConfig);
export default firebaseApp;

