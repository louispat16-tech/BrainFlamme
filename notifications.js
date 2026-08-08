// ==========================================
// 🔔 GESTION DE LA BANNIÈRE & PERMISSIONS FCM
// ==========================================

// Vérifie si l'utilisateur doit voir le message au chargement
window.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        // L'utilisateur n'a ni accepté ni refusé : on montre le message !
        document.getElementById('notif-banner').style.display = 'block';
    }
});

// Appelée quand le joueur clique sur "Activer les rappels"
function accepterNotifsViaBanniere() {
    fermerBanniereNotif();

    if ('serviceWorker' in navigator && 'Notification' in window) {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log("🔔 Notifications autorisées !");
                        
                        // Obtenir le Token FCM
                        const messaging = firebase.messaging();
                        messaging.getToken({ serviceWorkerRegistration: registration })
                            .then((currentToken) => {
                                if (currentToken) {
                                    console.log('🔑 Token FCM enregistre avec succes !');
                                }
                            });
                    }
                });
            });
    }
}

function fermerBanniereNotif() {
    document.getElementById('notif-banner').style.display = 'none';
}
