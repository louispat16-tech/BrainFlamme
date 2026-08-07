// ==========================================
// 🔔 GESTIONNAIRE DE NOTIFICATIONS LOCALES
// ==========================================

// 1. Demander l'autorisation à l'utilisateur
function demanderPermissionNotification() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("🔔 Notifications autorisées !");
            }
        });
    }
}

// 2. Programmer le rappel du soir (20h) et du matin (09h)
function programmerNotifications(nbFlammes, aJoueAujourdhui) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return; // Si le navigateur ne le supporte pas ou n'a pas la permission, on arrête
    }

    const maintenant = new Date();

    // ----------------------------------------------------
    // A. RAPPEL DU SOIR (À 20h00, si le joueur n'a PAS joué)
    // ----------------------------------------------------
    if (!aJoueAujourdhui) {
        const ceSoir20h = new Date();
        ceSoir20h.setHours(20, 0, 0, 0);

        const tempsAttente20h = ceSoir20h.getTime() - maintenant.getTime();

        // Si 20h00 n'est pas encore passé aujourd'hui
        if (tempsAttente20h > 0) {
            setTimeout(() => {
                let titre = nbFlammes > 0 ? "⚠️ Ta flamme va bientôt s'éteindre !" : "🎯 Le quiz du jour t'attend !";
                let message = nbFlammes > 0 
                    ? `Il ne te reste que quelques heures avant minuit pour sauver ta série de ${nbFlammes} jours !`
                    : "Fais le mode quotidien avant minuit pour allumer ta première flamme !";

                new Notification(titre, {
                    body: message,
                    icon: "icon.png" // Utilise l'icône de ton projet
                });
            }, tempsAttente20h);
        }
    }

    // ----------------------------------------------------
    // B. RAPPEL DU MATIN (Pour demain à 09h00)
    // ----------------------------------------------------
    const demain9h = new Date();
    demain9h.setDate(demain9h.getDate() + 1);
    demain9h.setHours(9, 0, 0, 0);

    const tempsAttenteDemain9h = demain9h.getTime() - maintenant.getTime();

    setTimeout(() => {
        let titre = nbFlammes > 0 ? "⚡ N'oublie pas ta flamme aujourd'hui !" : "🔥 Allume ta première flamme !";
        let message = nbFlammes > 0 
            ? `Joue au mode quotidien pour maintenir ta série de ${nbFlammes} jours.`
            : "Fais le mode quotidien et commence ta première série !";

        new Notification(titre, {
            body: message,
            icon: "icon.png"
        });
    }, tempsAttenteDemain9h);
}
