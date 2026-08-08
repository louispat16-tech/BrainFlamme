// ==========================================
// 🔊 GESTIONNAIRE D'AUDIO
// ==========================================

const soundEffects = {
    click: new Audio('click.mp3.mp3'),
    correct: new Audio('correct.mp3.mp3'),
    wrong: new Audio('wrong.mp3.mp3'), // pense à uploader wrong.mp3 sur github
    buy: new Audio('buy.mp3.mp3'),
    levelUp: new Audio('level-up.mp3.mp3'),
    chestOpen: new Audio('chest-open.mp3.mp3'),
    reward: new Audio('reward.mp3.mp3'),
    tick: new Audio('tick.mp3') // ou tick.mp3.mp3 selon comment tu l'envoies
};

const backgroundMusics = {
    bgMusic: new Audio('bg-music.mp3.mp3'),
    chronoMusic: new Audio('chrono-music.mp3.mp3'),
    bonusMusic: new Audio('bonus-music.mp3.mp3')
};

// Configuration des musiques en boucle
Object.values(backgroundMusics).forEach(music => {
    music.loop = true;
    music.volume = 0.4;
});

let currentMusic = null;

function playSFX(name) {
    if (soundEffects[name]) {
        soundEffects[name].currentTime = 0;
        soundEffects[name].play().catch(e => console.log("Audio bloqué ou introuvable:", e));
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
