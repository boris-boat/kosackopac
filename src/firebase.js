import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDOtPe1zeHyrPHV8X_bLrx7jWCflnpRVI8",
  authDomain: "kosackopacmsg.firebaseapp.com",
  projectId: "kosackopacmsg",
  storageBucket: "kosackopacmsg.appspot.com",
  messagingSenderId: "222799519709",
  appId: "1:222799519709:web:74ddada324c72fea862034",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
