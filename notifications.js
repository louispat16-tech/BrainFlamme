// ==========================================
// 🔔 GESTION DES NOTIFICATIONS PUSH CLOUD
// ==========================================

function demanderPermissionNotification() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        
        // 1. Enregistrer le fichier arrière-plan sw.js
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré avec succès !', registration);
            })
            .catch((err) => {
                console.error('❌ Erreur d'enregistrement du Service Worker :', err);
            });

        // 2. Demander la permission
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log("🔔 Notifications autorisées !"); 
            }
        });
    }
}
