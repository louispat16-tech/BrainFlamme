// ==========================================
// 🔔 GESTION DES NOTIFICATIONS PUSH CLOUD (FCM)
// ==========================================

function demanderPermissionNotification() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        
        // 1. Enregistrer le Service Worker sw.js
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré avec succès !', registration);

                // 2. Demander la permission à l'utilisateur
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log("🔔 Notifications autorisées !");

                        // 3. Obtenir le Token FCM pour Firebase
                        const messaging = firebase.messaging();
                        messaging.getToken({ serviceWorkerRegistration: registration })
                            .then((currentToken) => {
                                if (currentToken) {
                                    console.log('🔑 Ton Token FCM appareil :', currentToken);
                                } else {
                                    console.log('⚠️ Aucun token disponible.');
                                }
                            }).catch((err) => {
                                console.error('❌ Erreur récupération Token :', err);
                            });
                    }
                });
            })
            .catch((err) => {
                console.error("❌ Erreur d'enregistrement du Service Worker :", err);
            });
    }
}

// Lancer automatiquement au chargement
demanderPermissionNotification();
