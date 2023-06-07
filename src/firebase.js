import { getAuth } from "firebase/auth";



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6A5Ti00XQDh0oqAPSSdSFdwtOmDJ9uC8",
  authDomain: "app-auth-90ee0.firebaseapp.com",
  projectId: "app-auth-90ee0",
  storageBucket: "app-auth-90ee0.appspot.com",
  messagingSenderId: "159711874584",
  appId: "1:159711874584:web:db52a83b487506e195bd6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app