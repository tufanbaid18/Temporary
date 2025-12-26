// Import the firebase app module
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDOyxNCEw28eOW26gm-wvyXXAvCjCNboCU",
  authDomain: "notification-myneuron.firebaseapp.com",
  databaseURL: "https://notification-myneuron-default-rtdb.firebaseio.com",
  projectId: "notification-myneuron",
  storageBucket: "notification-myneuron.appspot.com",
  messagingSenderId: "939658171334",
  appId: "1:939658171334:web:596e2ae978b5c77536d8c7"
};
export default firebaseConfig;

//const app = initializeApp(firebaseConfig);
//export const db = getDatabase(app);
