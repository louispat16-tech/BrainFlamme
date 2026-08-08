// ==========================================
// 🎵 GESTIONNAIRE AUDIO CENTRALISÉ
// ==========================================

// Volumes par défaut
let musicVol = 0.3;
let sfxVol = 0.7;
let globalMute = false;

// 📁 Chargement des Musiques
const sounds = {
    bgMusic: new Audio('audio/bg-music.mp3'),
    chronoMusic: new Audio('audio/chrono-music.mp3'),
    bonusMusic: new Audio('audio/bonus-music.mp3'),
    
    // 📁 Chargement des Effets Sonores (SFX)
    correct: new Audio('audio/correct.mp3'),
    wrong: new Audio('audio/wrong.mp3'),
    click: new Audio('audio/click.mp3'),
    buy: new Audio('audio/buy.mp3'),
    chestOpen: new Audio('audio/chest-open.mp3'),
    reward: new Audio('audio/reward.mp3'),
    levelUp: new Audio('audio/level-up.mp3'),
    tick: new Audio('audio/tick.mp3')
};

// Configuration des boucles pour les musiques
sounds.bgMusic.loop = true;
sounds.chronoMusic.loop = true;
sounds.bonusMusic.loop = true;

// 🔊 Fonction universelle pour jouer un SFX
function playSFX(soundName) {
    if (globalMute || sfxVol === 0) return;
    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.volume = sfxVol;
        sound.play().catch(() => {});
    }
}

// 🎼 Fonctions pour gérer les musiques de fond
let currentMusic = null;

function playMusic(musicName) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    currentMusic = sounds[musicName];
    if (currentMusic) {
        currentMusic.volume = globalMute ? 0 : musicVol;
        currentMusic.play().catch(() => {});
    }
}

function stopMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
        currentMusic = null;
    }
}

// 🎛️ Fonctions pour le Menu des Paramètres
function ajusterVolumeMusique(val) {
    musicVol = parseFloat(val);
    document.getElementById('music-vol-txt').textContent = Math.round(musicVol * 100) + '%';
    if (currentMusic && !globalMute) {
        currentMusic.volume = musicVol;
    }
}

function ajusterVolumeSFX(val) {
    sfxVol = parseFloat(val);
    document.getElementById('sfx-vol-txt').textContent = Math.round(sfxVol * 100) + '%';
}

function toggleMute(isMuted) {
    globalMute = isMuted;
    if (currentMusic) {
        currentMusic.volume = globalMute ? 0 : musicVol;
    }
}
