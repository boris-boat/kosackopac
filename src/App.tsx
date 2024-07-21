import "./App.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import "react-datepicker/dist/react-datepicker.css";
import { getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/"
);
import moment from "moment";
import "moment/dist/locale/sr";
import Login from "./Pages/Login/Login";
import { Home } from "./Pages/Home/Home";
import { useSelector } from "react-redux";
import { useEffect } from "react";
moment.locale("sr");
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(function (error) {
      console.log("Service Worker registration failed:", error);
    });
}

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

function App() {
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");

        const token = await getToken(messaging, {
          vapidKey:
            "BGw1RPdgphcP5WNq7mqECE-vJh1vQoAVoHMZIE_BnWDZjVHud-YixdVQH8TaKOk3eu_poxuGQEmjH9QeU1oToa0",
        });
        console.log("FCM Token:", token);

        // You would typically send this token to your server here
      } else {
        console.log("Unable to get permission to notify.");
      }
    };

    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Received foreground message:", payload);
      // Handle the message as needed
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const userData = useSelector((state) => state.userData.userData);
  if (!userData) {
    return <Login />;
  }
  return <Home />;
}

export default App;
