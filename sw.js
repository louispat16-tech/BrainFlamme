// Import des scripts Firebase dans le Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// ⚠️ Remplace par ton objet firebaseConfig si ce n'est pas déjà fait
firebase.initializeApp({
    apiKey: "TON_API_KEY",
    authDomain: "TON_PROJECT.firebaseapp.com",
    projectId: "TON_PROJECT_ID",
    storageBucket: "TON_PROJECT.appspot.com",
    messagingSenderId: "200853989780",
    appId: "TON_APP_ID"
});

const messaging = firebase.messaging();

// Intercepter le message en arrière-plan et AFFICHER la notification
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Message reçu en arrière-plan :', payload);

    const notificationTitle = payload.notification?.title || "BrainFlamme 🔥";
    const notificationOptions = {
        body: payload.notification?.body || "Reviens jouer pour garder ta série !",
        icon: '/icon.png' // Mets le chemin de ton icône si tu en as une
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
