// ==========================================
// 🔊 GESTIONNAIRE D'AUDIO ET VOLUMES
// ==========================================

const soundEffects = {
    click: null, // 🔇 Son de clic désactivé (fichier supprimé)
    correct: new Audio('correct.mp3.mp3'),
    wrong: new Audio('wrong.mp3.mp3'),
    buy: new Audio('buy.mp3.mp3'),
    levelUp: new Audio('level-up.mp3.mp3'),
    // 🎺 Ta nouvelle fanfare épique pour le coffre ! (met le vrai nom de ton fichier GitHub)
    chestOpen: new Audio('chest-open.mp3.mp3'),
    reward: new Audio('reward.mp3.mp3'),
    tick: new Audio('tick.mp3.mp3')
};

// 🔉 RÉGLAGE ULTRA-DOUX POUR NE PAS DÉCONCENTRER
soundEffects.correct.volume = 0.05;   // 🔉 Baissé à 5% (très discret mais audible)
soundEffects.wrong.volume = 0.05;     // 🔉 Baissé à 5% (très discret mais audible)
soundEffects.chestOpen.volume = 0.20; // 🎺 Volume parfait pour la fanfare !
soundEffects.reward.volume = 0.15;    // Baissé à 15%
soundEffects.levelUp.volume = 0.20;   
soundEffects.tick.volume = 0.15;      

const backgroundMusics = {
    bgMusic: new Audio('bg-music.mp3.mp3'),
    chronoMusic: new Audio('chrono-music.mp3.mp3'),
    bonusMusic: new Audio('bonus-music.mp3.mp3')
};

// Configuration des musiques de fond
Object.values(backgroundMusics).forEach(music => {
    music.loop = true;
    music.volume = 0.15; // 🎵 Fond sonore doux à 15%
});

let currentMusic = null;

function playSFX(name) {
    if (soundEffects[name]) {
        soundEffects[name].currentTime = 0;
        soundEffects[name].play().catch(e => console.log("Son bloqué:", name));
    }
}

function playMusic(musicName) {
    const audio = document.getElementById(musicName);
    
    if (audio) {
        // 🛑 SÉCURITÉ : Si la musique est DÉJÀ en train de jouer, on ne fait STRICTEMENT RIEN !
        // Ça évite qu'elle ne reparte de zéro quand un autre script l'appelle par erreur.
        if (!audio.paused) {
            return; 
        }
        
        // Sinon, on la lance normalement
        audio.play().catch(error => {
            console.log("Lecture audio bloquée par le navigateur : ", error);
        });
    }
}

// ==========================================
// 🎵 DÉMARRAGE DE LA MUSIQUE AU PREMIER CLIC
// ==========================================

function startBgMusicOnFirstInteraction() {
    playMusic('bgMusic');
    document.removeEventListener('click', startBgMusicOnFirstInteraction);
    document.removeEventListener('touchstart', startBgMusicOnFirstInteraction);
}

// Active la musique au tout premier clic/tap du joueur
document.addEventListener('click', startBgMusicOnFirstInteraction);
document.addEventListener('touchstart', startBgMusicOnFirstInteraction);
