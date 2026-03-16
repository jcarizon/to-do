importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCf-Go2-cPv8FfAjh6CIT6S00RI2AHuBbs',
  authDomain: 'techlint-todo-board.firebaseapp.com',
  projectId: 'techlint-todo-board',
  storageBucket: 'techlint-todo-board.firebasestorage.app',
  messagingSenderId: '428368238941',
  appId: '1:428368238941:web:9b2cc76e848ec5dc7f30b4',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title = 'TechLint', body = '' } = payload.notification ?? {};

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'techlint-expiry',
    data: payload.data,
  });
});