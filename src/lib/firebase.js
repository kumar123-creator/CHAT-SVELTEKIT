import { initializeApp } from 'firebase/app';

const firebaseConfig = {
      apiKey: 'AIzaSyCKmOylWL1JPX8SRtShn2Cx1QaqmcDERaM',
	  databaseURL: 'https://chat-app-dd642-default-rtdb.firebaseio.com',
	  projectId: 'chat-app-dd642',
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
