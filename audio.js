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
    tick: new Audio('tick.mp3.mp3') // ou tick.mp3 selon ton fichier
};

// 🔉 RÉGLAGE DES VOLUMES DES EFFETS SONORES (de 0.0 à 1.0)
soundEffects.correct.volume = 0.015;  // 🔉 Ajusté à 1.5% (très doux)
soundEffects.wrong.volume = 0.015;    // 🔉 Ajusté à 1.5% (très doux)
soundEffects.chestOpen.volume = 0.20; // 🔉 Baissé à 20%
soundEffects.reward.volume = 0.20;    // 🔉 Baissé à 20%
soundEffects.levelUp.volume = 0.25;   // 🔉 Baissé à 25%
soundEffects.click.volume = 0.3;      // Clics boutons (30%)
soundEffects.tick.volume = 0.25;      // Tic-tac chrono (25%)

const backgroundMusics = {
    bgMusic: new Audio('bg-music.mp3.mp3'),
    chronoMusic: new Audio('chrono-music.mp3.mp3'),
    bonusMusic: new Audio('bonus-music.mp3.mp3')
};

// Configuration des musiques de fond en boucle
Object.values(backgroundMusics).forEach(music => {
    music.loop = true;
    music.volume = 0.25; // Volume global de la musique de fond à 25%
});

let currentMusic = null;

function playSFX(name) {
    if (soundEffects[name]) {
        soundEffects[name].currentTime = 0;
        soundEffects[name].play().catch(e => {
            console.log("Lecture du son bloquée ou fichier introuvable:", name, e);
        });
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
// 🎵 DÉMARRAGE AUTOMATIQUE DE LA MUSIQUE
// ==========================================

function startBgMusicOnFirstInteraction() {
    playMusic('bgMusic');
    document.removeEventListener('click', startBgMusicOnFirstInteraction);
    document.removeEventListener('touchstart', startBgMusicOnFirstInteraction);
}

// ==========================================
// 🎯 EFFET SONORE AUTOMATIQUE POUR TOUS LES BOUTONS
// ==========================================
document.addEventListener('click', (event) => {
    const target = event.target.closest('button, .nav-btn, [onclick]');
    if (!target) return;

    // 🛑 VÉRIFICATION PAR DÉTECTION LARGE DES RÉPONSES
    // Si l'élément cliqué ou son parent contient un de ces termes :
    const isAnswerBtn = target.closest(
        '#quiz, .quiz-screen, #options, #answers, .option, .answer, [class*="option"], [class*="btn-option"], [id*="option"]'
    );

    // Si c'est un bouton de réponse -> On NE JOUE PAS "click"
    if (isAnswerBtn) {
        return; 
    }

    // Sinon -> C'est un bouton de menu/navigation/shop, on joue "click"
    playSFX('click');
});
