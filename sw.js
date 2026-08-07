// ==========================================
// ⚙️ SERVICE WORKER (Tourne en arrière-plan)
// ==========================================

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Met ici ta configuration Firebase (la même que dans script.js)
const firebaseConfig = {
    apiKey: "TES_CLEFS_FIREBASE",
    authDomain: "TON_PROJET.firebaseapp.com",
    databaseURL: "https://TON_PROJET.firebaseio.com",
    projectId: "TON_PROJET",
    storageBucket: "TON_PROJET.appspot.com",
    messagingSenderId: "TON_SENDER_ID",
    appId: "TON_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gestion des messages reçus quand l'application est FERMÉE
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Message reçu en arrière-plan :', payload);

    const notificationTitle = payload.notification.title || "🔥 BrainFlamme";
    const notificationOptions = {
        body: payload.notification.body || "N'oublie pas de jouer aujourd'hui !",
        icon: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
