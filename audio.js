// ==========================================
// 🔊 GESTIONNAIRE D'AUDIO ET VOLUMES
// ==========================================

const soundEffects = {
    click: null, // 🔇 Son de clic désactivé (fichier supprimé)
    correct: new Audio('correct.mp3.mp3'),
    wrong: new Audio('wrong.mp3.mp3'),
    buy: new Audio('buy.mp3.mp3'),
    levelUp: new Audio('level-up.mp3.mp3'),
    chestOpen: new Audio('chest-open.mp3.mp3'),
    reward: new Audio('reward.mp3.mp3'),
    tick: new Audio('tick.mp3.mp3')
};

// 🔉 RÉGLAGES DES VOLUMES DES EFFETS SONORES
soundEffects.correct.volume = 0.09;   
soundEffects.wrong.volume = 0.05;     
soundEffects.chestOpen.volume = 0.20; 
soundEffects.reward.volume = 0.15;    
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
        soundEffects[name].play().catch(e => console.log("Son SFX bloqué:", name));
    }
}

// 🎵 Fonction unifiée pour lancer les musiques sans bug d'ID HTML
function playMusic(musicName) {
    // Normalise les noms au cas où on appelle 'bg-music' au lieu de 'bgMusic'
    if (musicName === 'bg-music') musicName = 'bgMusic';

    const targetMusic = backgroundMusics[musicName];

    if (targetMusic) {
        // Si une autre musique joue, on l'arrête proprement
        if (currentMusic && currentMusic !== targetMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }

        // Si la musique demandée est déjà en train de jouer, on ne fait rien
        if (!targetMusic.paused) {
            return; 
        }
        
        // Lancement de la musique
        targetMusic.play().then(() => {
            currentMusic = targetMusic;
        }).catch(error => {
            console.log("Lecture audio bloquée par le navigateur : ", error);
        });
    } else {
        console.warn("Musique introuvable dans l'objet backgroundMusics :", musicName);
    }
}

// ==========================================
// 🎵 DÉMARRAGE DE LA MUSIQUE AU PREMIER CLIC
// ==========================================

function startBgMusicOnFirstInteraction() {
    playMusic('bgMusic');
    
    // Si la musique a réussi à se lancer, on retire les écouteurs
    if (backgroundMusics.bgMusic && !backgroundMusics.bgMusic.paused) {
        document.removeEventListener('click', startBgMusicOnFirstInteraction);
        document.removeEventListener('touchstart', startBgMusicOnFirstInteraction);
    }
}

// Active la musique au tout premier clic/tap du joueur
document.addEventListener('click', startBgMusicOnFirstInteraction);
document.addEventListener('touchstart', startBgMusicOnFirstInteraction);
