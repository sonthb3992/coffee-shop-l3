import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducer/cartSlice';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvxL6FLhbF74FHr5CV-gEc_Resc63PKhg",
    authDomain: "gemo-lab3.firebaseapp.com",
    projectId: "gemo-lab3",
    storageBucket: "gemo-lab3.appspot.com",
    messagingSenderId: "64160194781",
    appId: "1:64160194781:web:b4ffa7d8cb6a68d9613b34",
    measurementId: "G-3L8FEXV404"
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export { app, auth }
