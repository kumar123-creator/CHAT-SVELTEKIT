// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';

// Firebase configuration (replace with your own values)
const firebaseConfig = {
  apiKey: 'AIzaSyCKmOylWL1JPX8SRtShn2Cx1QaqmcDERaM',
  databaseURL: 'https://chat-app-dd642-default-rtdb.firebaseio.com',
  projectId: 'chat-app-dd642',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export { database, ref, push, onValue };
