import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBvxL6FLhbF74FHr5CV-gEc_Resc63PKhg',
//   authDomain: 'gemo-lab3.firebaseapp.com',
//   projectId: 'gemo-lab3',
//   storageBucket: 'gemo-lab3.appspot.com',
//   messagingSenderId: '64160194781',
//   appId: '1:64160194781:web:b4ffa7d8cb6a68d9613b34',
//   measurementId: 'G-3L8FEXV404',
// };

const firebaseConfig = {
  apiKey: "AIzaSyCHLaPZ6gmDpTc8cZasRPgWfEBubXvrOHQ",
  authDomain: "pictchdaydemo.firebaseapp.com",
  projectId: "pictchdaydemo",
  storageBucket: "pictchdaydemo.appspot.com",
  messagingSenderId: "579299089124",
  appId: "1:579299089124:web:53666184516cd119dc6af1"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export { app, auth };
