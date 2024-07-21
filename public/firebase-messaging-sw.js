/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDOtPe1zeHyrPHV8X_bLrx7jWCflnpRVI8",
  authDomain: "kosackopacmsg.firebaseapp.com",
  projectId: "kosackopacmsg",
  storageBucket: "kosackopacmsg.appspot.com",
  messagingSenderId: "222799519709",
  appId: "1:222799519709:web:74ddada324c72fea862034",
});

const messaging = firebase.messaging();
console.log("Service Worker Loaded");

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
