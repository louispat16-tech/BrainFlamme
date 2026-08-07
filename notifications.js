// ==========================================
// 🔔 GESTION DES NOTIFICATIONS PUSH CLOUD
// ==========================================

function demanderPermissionNotification() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        
        // 1. Enregistrer le fichier arrière-plan sw.js
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré avec succès !', registration);

                // 2. Demander la permission et récupérer le Token de l'appareil
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log("🔔 Notifications autorisées !");

                        // 3. Récupérer le token FCM pour Firebase
                        const messaging = firebase.messaging();
                        messaging.getToken({ serviceWorkerRegistration: registration })
                            .then((currentToken) => {
                                if (currentToken) {
                                    console.log('🔑 Ton Token FCM appareil :', currentToken);
                                } else {
                                    console.log('⚠️ Aucun token disponible.');
                                }
                            }).catch((err) => {
                                console.error('❌ Erreur lors de la récupération du token :', err);
                            });
                    }
                });
            })
            .catch((err) => {
                console.error("❌ Erreur d'enregistrement du Service Worker :", err);
            });
    }
}
