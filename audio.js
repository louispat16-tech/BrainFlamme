// ==========================================
// 🔊 GESTIONNAIRE D'AUDIO ET VOLUMES
// ==========================================

const soundEffects = {
    click: new Audio('click.mp3.mp3'),
    correct: new Audio('correct.mp3.mp3'),
    wrong: new Audio('wrong.mp3.mp3'),
    buy: new Audio('buy.mp3.mp3'),
    levelUp: new Audio('level-up.mp3.mp3'),
    chestOpen: new Audio('chest-open.mp3.mp3'),
    reward: new Audio('reward.mp3.mp3'),
    tick: new Audio('tick.mp3.mp3')
};

// 🔉 RÉGLAGE DES VOLUMES
soundEffects.correct.volume = 0.10;   // Volume réponse juste
soundEffects.wrong.volume = 0.10;     // Volume réponse fausse
soundEffects.chestOpen.volume = 0.20; // Volume coffre
soundEffects.reward.volume = 0.20;    // Volume récompense
soundEffects.levelUp.volume = 0.25;   // Volume niveau supérieur
soundEffects.click.volume = 0.30;     // Volume clic (si appelé manuellement)
soundEffects.tick.volume = 0.25;      // Volume chrono

const backgroundMusics = {
    bgMusic: new Audio('bg-music.mp3.mp3'),
    chronoMusic: new Audio('chrono-music.mp3.mp3'),
    bonusMusic: new Audio('bonus-music.mp3.mp3')
};

// Configuration des musiques de fond
Object.values(backgroundMusics).forEach(music => {
    music.loop = true;
    music.volume = 0.20>;
});

let currentMusic = null;

function playSFX(name) {
    if (soundEffects[name]) {
        soundEffects[name].currentTime = 0;
        soundEffects[name].play().catch(e => console.log("Son bloqué:", name));
    }
}

function playMusic(name) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    if (backgroundMusics[name]) {
        currentMusic = backgroundMusics[name];
        currentMusic.play().catch(e => console.log("Musique bloquée:", e));
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
