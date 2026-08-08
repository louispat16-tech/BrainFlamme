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

// 🔉 VOLUMES
soundEffects.correct.volume = 0.15;   
soundEffects.wrong.volume = 0.15;     
soundEffects.chestOpen.volume = 0.20; 
soundEffects.reward.volume = 0.20;    
soundEffects.levelUp.volume = 0.25;   
soundEffects.click.volume = 0.30;     
soundEffects.tick.volume = 0.25;      

const backgroundMusics = {
    bgMusic: new Audio('bg-music.mp3.mp3'),
    chronoMusic: new Audio('chrono-music.mp3.mp3'),
    bonusMusic: new Audio('bonus-music.mp3.mp3')
};

Object.values(backgroundMusics).forEach(music => {
    music.loop = true;
    music.volume = 0.25;
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
// 🎵 DÉMARRAGE MUSIQUE (Au 1er clic obligatoire)
// ==========================================
function startBgMusicOnFirstInteraction() {
    playMusic('bgMusic');
    document.removeEventListener('click', startBgMusicOnFirstInteraction);
    document.removeEventListener('touchstart', startBgMusicOnFirstInteraction);
}

document.addEventListener('click', startBgMusicOnFirstInteraction);
document.addEventListener('touchstart', startBgMusicOnFirstInteraction);

// ==========================================
// 🎯 EFFET SONORE DES BOUTONS (EXCLUT LE QUIZ)
// ==========================================
document.addEventListener('click', (event) => {
    // 🛑 1. Si le clic est à l'intérieur de l'écran ou de la zone de Quiz : ON NE JOUE PAS "click"
    const isInsideQuiz = event.target.closest('#quiz, .quiz-container, #options-container, .options-grid, #quiz-screen');
    if (isInsideQuiz) {
        return; 
    }

    // 🟢 2. On joue "click" uniquement si c'est un bouton de menu / navigation
    const isMenuButton = event.target.closest('button, .nav-btn, .bottom-nav, .shop-btn, .menu-btn');
    if (isMenuButton) {
        playSFX('click');
    }
});
