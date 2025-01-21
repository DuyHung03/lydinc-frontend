// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCZEkbRbtlAi8oYMxMboAYR0a6rnETnEGk',
    authDomain: 'chat-app-1000a.firebaseapp.com',
    databaseURL: 'https://chat-app-1000a-default-rtdb.firebaseio.com',
    projectId: 'chat-app-1000a',
    storageBucket: 'chat-app-1000a.appspot.com',
    messagingSenderId: '592971248489',
    appId: '1:592971248489:web:be464f0ea19ae0bf1b43f8',
    measurementId: 'G-6RH4FS2HDM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
