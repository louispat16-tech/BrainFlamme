const questionsData = [
    { question: "Capitale de l'Australie ?", answers: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, info: "C'est Canberra qui a été choisie en 1908 comme compromis pour mettre fin à la rivalité entre Sydney et Melbourne." },
    { question: "Organe le plus lourd du corps ?", answers: ["Cerveau", "Foie", "Coeur", "Poumons"], correct: 1, info: "Le foie est l'organe interne le plus massif, pesant environ 1,5 kg. Il assure plus de 500 fonctions vitales." },
    { question: "Année du premier pas sur la Lune ?", answers: ["1962", "1969", "1972", "1965"], correct: 1, info: "Le 21 juillet 1969, Neil Armstrong est devenu le premier humain à marcher sur la Lune lors de la mission Apollo 11." },
    { question: "Plus grand pays du monde ?", answers: ["Canada", "USA", "Chine", "Russie"], correct: 3, info: "Avec plus de 17 millions de km², la Russie est le plus grand pays de la planète." },
    { question: "Peintre de 'La Jeune Fille à la perle' ?", answers: ["Vermeer", "Rembrandt", "Van Gogh", "Da Vinci"], correct: 0, info: "Ce chef-d'œuvre a été peint par le Néerlandais Johannes Vermeer vers 1665." },
    { question: "Monnaie du Japon ?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, info: "Le Yen est la monnaie officielle du Japon depuis 1871." },
    { question: "Plus long fleuve du monde ?", answers: ["Amazone", "Nil", "Mississippi", "Yangzi"], correct: 0, info: "L'Amazone est techniquement le plus long fleuve, mais surtout celui qui a le plus gros débit d'eau." },
    { question: "Nombre d'os chez l'adulte ?", answers: ["186", "206", "226", "256"], correct: 1, info: "Le squelette d'un adulte compte 206 os. À la naissance, les bébés en ont environ 270." },
    { question: "Symbole chimique de l'Or ?", answers: ["Ag", "Fe", "Au", "Pb"], correct: 2, info: "Le symbole 'Au' vient du mot latin 'Aurum', qui signifie 'aurore éclatante'." },
    { question: "Planète la plus chaude ?", answers: ["Mercure", "Vénus", "Mars", "Jupiter"], correct: 1, info: "Vénus est la plus chaude (460°C) car son atmosphère épaisse de CO2 piège la chaleur." },
    { question: "Découvreur de la pénicilline ?", answers: ["Curie", "Pasteur", "Fleming", "Einstein"], correct: 2, info: "Alexander Fleming a découvert le premier antibiotique par erreur en 1928." },
    { question: "Vainqueur CDM foot 2018 ?", answers: ["Allemagne", "Brésil", "France", "Argentine"], correct: 2, info: "L'équipe de France a remporté sa deuxième étoile en battant la Croatie 4-2." },
    { question: "Langue la plus parlée ?", answers: ["Anglais", "Espagnol", "Mandarin", "Hindi"], correct: 0, info: "L'anglais est la langue la plus parlée au monde (environ 1,5 milliard de locuteurs)." },
    { question: "Océan entourant Madagascar ?", answers: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 1, info: "Madagascar est située au large de l'Afrique de l'Est, dans l'océan Indien." },
    { question: "Plus haut sommet du monde ?", answers: ["K2", "Mont Blanc", "Annapurna", "Everest"], correct: 3, info: "Situé dans l'Himalaya, le mont Everest culmine à 8 848 mètres d'altitude." },
    { question: "Auteur des 'Misérables' ?", answers: ["Zola", "Hugo", "Flaubert", "Balzac"], correct: 1, info: "Victor Hugo a publié ce roman historique et social en 1862." },
    { question: "Numéro atomique de l'Hydrogène ?", answers: ["1", "2", "10", "12"], correct: 0, info: "L'Hydrogène est l'élément le plus simple de l'univers, avec un seul proton." },
    { question: "Capitale du Canada ?", answers: ["Toronto", "Montréal", "Ottawa", "Vancouver"], correct: 2, info: "Ottawa a été désignée capitale par la reine Victoria en 1857." },
    { question: "Cité ensevelie par le Vésuve ?", answers: ["Rome", "Athènes", "Pompéi", "Carthage"], correct: 2, info: "En l'an 79 après J.-C., l'éruption du Vésuve a figé la ville de Pompéi sous les cendres." },
    { question: "Oiseau qui ne vole pas ?", answers: ["Aigle", "Autruche", "Perroquet", "Faucon"], correct: 1, info: "L'autruche est le plus grand des oiseaux. Elle peut courir jusqu'à 70 km/h." },
    { question: "Vitesse de la lumière ?", answers: ["150k km/s", "300k km/s", "500k km/s", "1M km/s"], correct: 1, info: "La lumière voyage à environ 300 000 kilomètres par seconde." },
    { question: "Plus grand désert chaud ?", answers: ["Gobi", "Sahara", "Atacama", "Kalahari"], correct: 1, info: "Le Sahara couvre 9 millions de km², soit presque la taille des États-Unis." },
    { question: "Inventeur du téléphone ?", answers: ["Edison", "Tesla", "Graham Bell", "Newton"], correct: 2, info: "Alexander Graham Bell a déposé le premier brevet pour un téléphone électrique en 1876." },
    { question: "Capitale de l'Italie ?", answers: ["Milan", "Florence", "Rome", "Naples"], correct: 2, info: "Surnommée la 'Ville Éternelle', Rome abrite en son sein le Vatican." },
    { question: "Nombre de cœurs d'une pieuvre ?", answers: ["1", "2", "3", "4"], correct: 2, info: "La pieuvre possède trois cœurs pour pomper son sang bleu." },
    { question: "Plus petit pays du monde ?", answers: ["Monaco", "Vatican", "Malte", "San Marin"], correct: 1, info: "Le Vatican ne fait que 0,44 km²." },
    { question: "Mer entre Jordanie et Israël ?", answers: ["Mer Rouge", "Mer Noire", "Mer Morte", "Méditerranée"], correct: 2, info: "La Mer Morte est si salée qu'elle permet aux humains de flotter sans effort." },
    { question: "Groupe de Freddie Mercury ?", answers: ["Beatles", "Led Zep", "Queen", "U2"], correct: 2, info: "Freddie Mercury était le chanteur du groupe de rock britannique Queen." },
    { question: "Peintre de la Chapelle Sixtine ?", answers: ["Picasso", "Michel-Ange", "Raphaël", "Donatello"], correct: 1, info: "Michel-Ange a mis quatre ans pour peindre les fresques du plafond." },
    { question: "Fruit le plus produit au monde ?", answers: ["Banane", "Pomme", "Tomate", "Orange"], correct: 2, info: "La tomate est botaniquement un fruit. C'est la culture la plus produite sur Terre." },
    { question: "Nombre de dents d'un adulte ?", answers: ["28", "30", "32", "34"], correct: 2, info: "Un adulte possède normalement 32 dents, dents de sagesse incluses." },
    { question: "Élément le plus abondant ?", answers: ["Oxygène", "Carbone", "Hydrogène", "Azote"], correct: 2, info: "L'Hydrogène représente environ 75% de la masse de l'univers." },
    { question: "Début de la 1ère Guerre mondiale ?", answers: ["1912", "1914", "1916", "1918"], correct: 1, info: "Le conflit a été déclenché en juillet 1914 suite à l'attentat de Sarajevo." },
    { question: "Réalisateur d'Inception ?", answers: ["Spielberg", "Tarantino", "Nolan", "Scorsese"], correct: 2, info: "Christopher Nolan a réalisé ce film complexe sur les rêves en 2010." },
    { question: "Pays du Taj Mahal ?", answers: ["Pakistan", "Inde", "Thaïlande", "Iran"], correct: 1, info: "Ce mausolée de marbre blanc se situe à Agra, en Inde." },
    { question: "Capitale du Brésil ?", answers: ["Rio", "Sao Paulo", "Brasilia", "Salvador"], correct: 2, info: "Brasilia est une ville planifiée inaugurée en 1960." },
    { question: "Plus grand animal terrestre ?", answers: ["Girafe", "Éléphant", "Rhinocéros", "Hippopotame"], correct: 1, info: "L'éléphant d'Afrique peut peser jusqu'à 6 tonnes." },
    { question: "Auteur de 'Roméo et Juliette' ?", answers: ["Molière", "Shakespeare", "Dante", "Goethe"], correct: 1, info: "William Shakespeare a écrit cette tragédie à la fin du XVIe siècle." },
    { question: "Composant principal du verre ?", answers: ["Sable", "Argile", "Calcaire", "Plomb"], correct: 0, info: "Le verre est fabriqué en faisant fondre du sable de silice à très haute température." },
    { question: "Capitale de l'Espagne ?", answers: ["Barcelone", "Séville", "Madrid", "Valence"], correct: 2, info: "Madrid est située en plein cœur géographique du pays." },
    { question: "Métal le plus utilisé ?", answers: ["Or", "Aluminium", "Fer", "Cuivre"], correct: 2, info: "Le fer est le métal le plus utilisé, principalement pour produire de l'acier." },
    { question: "Secondes dans une heure ?", answers: ["1200", "2400", "3600", "4800"], correct: 2, info: "Le calcul est simple : 60 minutes x 60 secondes = 3600." },
    { question: "Sculpteur du 'Penseur' ?", answers: ["Rodin", "Bernini", "Canova", "Donatello"], correct: 0, info: "Auguste Rodin a créé cette statue de bronze en 1880." },
    { question: "Pays inventeur des pâtes ?", answers: ["Italie", "Chine", "Grèce", "Égypte"], correct: 1, info: "Les plus vieilles traces de nouilles ont été découvertes en Chine (4 000 ans)." },
    { question: "Fleuve traversant Paris ?", answers: ["Loire", "Rhône", "Seine", "Garonne"], correct: 2, info: "La Seine divise Paris en deux : la Rive Droite et la Rive Gauche." },
    { question: "Plus grand mammifère marin ?", answers: ["Requin baleine", "Baleine bleue", "Orque", "Cachalot"], correct: 1, info: "La baleine bleue peut atteindre 30 mètres et 180 tonnes." },
    { question: "Dieu grec de la foudre ?", answers: ["Hades", "Poséidon", "Zeus", "Apollon"], correct: 2, info: "Zeus est le roi des dieux dans la mythologie grecque." },
    { question: "Gaz majoritaire dans l'air ?", answers: ["Oxygène", "Argon", "Azote", "Hélium"], correct: 2, info: "L'air est composé à 78% d'azote et à 21% d'oxygène." },
    { question: "Capitale de l'Égypte ?", answers: ["Alexandrie", "Louxor", "Le Caire", "Gizeh"], correct: 2, info: "Le Caire est situé à proximité des pyramides de Gizeh." },
    { question: "Mois de l'Oktoberfest ?", answers: ["Août", "Septembre", "Octobre", "Novembre"], correct: 1, info: "Elle commence en septembre pour profiter d'une météo plus clémente." },
    { question: "Inventeur de l'imprimerie ?", answers: ["Gutenberg", "Léonard", "Franklin", "Newton"], correct: 0, info: "Gutenberg a inventé les caractères mobiles vers 1440." },
    { question: "Capitale de la Russie ?", answers: ["Pétersbourg", "Moscou", "Kiev", "Novosibirsk"], correct: 1, info: "Moscou abrite le célèbre Kremlin et la place Rouge." },
    { question: "Étoile la plus proche ?", answers: ["Sirius", "Proxima", "Soleil", "Vega"], correct: 2, info: "Le Soleil est notre étoile, située à 150 millions de km." },
    { question: "Peintre des 'Nymphéas' ?", answers: ["Manet", "Monet", "Renoir", "Degas"], correct: 1, info: "Claude Monet a peint cette série dans son jardin à Giverny." },
    { question: "Pays de la Tour de Pise ?", answers: ["Espagne", "Grèce", "Italie", "France"], correct: 2, info: "La tour penchée se situe à Pise, en Toscane (Italie)." },
    { question: "Qui a écrit 'Le Petit Prince' ?", answers: ["Proust", "Saint-Exupéry", "Camus", "Sartre"], correct: 1, info: "Antoine de Saint-Exupéry a publié ce conte poétique en 1943." },
    { question: "Capitale de l'Allemagne ?", answers: ["Munich", "Francfort", "Hambourg", "Berlin"], correct: 3, info: "Berlin est la capitale de l'Allemagne réunifiée depuis 1990." },
    { question: "Capitale du Portugal ?", answers: ["Lisbonne", "Porto", "Faro", "Coimbra"], correct: 0, info: "Lisbonne est l'une des plus vieilles villes d'Europe." },
    { question: "Planète rouge ?", answers: ["Vénus", "Mars", "Saturne", "Neptune"], correct: 1, info: "Mars doit sa couleur à l'oxyde de fer (rouille) à sa surface." },
    { question: "Qui a peint 'La Cène' ?", answers: ["Michel-Ange", "Da Vinci", "Raphaël", "Titien"], correct: 1, info: "Léonard de Vinci a réalisé cette fresque célèbre à Milan." },
    { question: "Métal liquide ?", answers: ["Plomb", "Mercure", "Étain", "Argent"], correct: 1, info: "Le mercure est le seul métal liquide à température ambiante." },
    { question: "Inventeur de l'ampoule ?", answers: ["Tesla", "Edison", "Watt", "Faraday"], correct: 1, info: "Thomas Edison a perfectionné l'ampoule à filament de carbone en 1879." },
    { question: "Capitale de la Chine ?", answers: ["Shanghai", "Canton", "Pékin", "Shenzhen"], correct: 2, info: "Pékin est le cœur politique de la Chine et proche de la Grande Muraille." },
    { question: "Symbole de l'eau ?", answers: ["CO2", "O2", "H2O", "N2"], correct: 2, info: "H2O signifie 2 atomes d'hydrogène pour 1 d'oxygène." },
    { question: "Plus grand océan ?", answers: ["Atlantique", "Indien", "Arctique", "Pacifique"], correct: 3, info: "Le Pacifique couvre un tiers de la surface de la Terre." },
    { question: "Auteur de 'Harry Potter' ?", answers: ["Tolkien", "Martin", "Rowling", "King"], correct: 2, info: "J.K. Rowling a écrit le premier tome en 1997." },
    { question: "Capitale de la Grèce ?", answers: ["Athènes", "Thessalonique", "Patras", "Héraklion"], correct: 0, info: "Athènes est considérée comme le berceau de la démocratie." },
    { question: "Animal qui pond le plus gros ?", answers: ["Dinosaure", "Autruche", "Baleine", "Condor"], correct: 1, info: "L'œuf d'autruche peut peser jusqu'à 1,5 kg." },
    { question: "Dernière lettre alphabet grec ?", answers: ["Alpha", "Zeta", "Omega", "Psi"], correct: 2, info: "Omega (Ω) est la 24ème et dernière lettre de cet alphabet." },
    { question: "Capitale de l'Inde ?", answers: ["Mumbai", "Calcutta", "New Delhi", "Bangalore"], correct: 2, info: "New Delhi est la capitale administrative de l'Inde." },
    { question: "Sport de Roger Federer ?", answers: ["Football", "Tennis", "Golf", "Basket"], correct: 1, info: "Federer a remporté 20 tournois du Grand Chelem." },
    { question: "Qui a découvert l'Amérique ?", answers: ["Magellan", "Gama", "Colomb", "Vespucci"], correct: 2, info: "Christophe Colomb a atteint les Bahamas en 1492." },
    { question: "Quel organe filtre le sang ?", answers: ["Foie", "Pancréas", "Reins", "Rate"], correct: 2, info: "Les reins filtrent environ 200 litres de sang par jour." },
    { question: "Capitale de la Belgique ?", answers: ["Bruges", "Anvers", "Gand", "Bruxelles"], correct: 3, info: "Bruxelles est aussi le siège de l'Union Européenne." },
    { question: "Combien de continents ?", answers: ["5", "6", "7", "8"], correct: 2, info: "On en compte 7 : Afrique, Antarctique, Asie, Europe, Océanie, Amérique du Nord et du Sud." },
    { question: "Couleur (Bleu + Jaune) ?", answers: ["Violet", "Vert", "Orange", "Marron"], correct: 1, info: "Le vert est une couleur secondaire obtenue avec ces deux primaires." },
    { question: "Capitale de la Turquie ?", answers: ["Istanbul", "Ankara", "Izmir", "Antalya"], correct: 1, info: "Ankara a été choisie comme capitale en 1923." },
    { question: "Surnom de New York ?", answers: ["Big Apple", "Windy City", "Sin City", "Angels"], correct: 0, info: "The Big Apple est devenu son surnom officiel dans les années 20." },
    { question: "Monnaie du Royaume-Uni ?", answers: ["Euro", "Dollar", "Livre", "Yen"], correct: 2, info: "La Livre Sterling est l'une des plus vieilles monnaies au monde." },
    { question: "Capitale de la Corée du Sud ?", answers: ["Busan", "Incheon", "Daegu", "Séoul"], correct: 3, info: "Séoul abrite environ 10 millions d'habitants." },
    { question: "Pattes d'une araignée ?", answers: ["6", "8", "10", "12"], correct: 1, info: "Les araignées sont des arachnides, elles ont donc 8 pattes." },
    { question: "Inventeur de Facebook ?", answers: ["Gates", "Jobs", "Zuckerberg", "Musk"], correct: 2, info: "Mark Zuckerberg l'a lancé depuis Harvard en 2004." },
    { question: "Capitale du Mexique ?", answers: ["Guadalajara", "Monterrey", "Mexico City", "Cancun"], correct: 2, info: "Mexico est l'une des plus grandes villes du monde." },
    { question: "Nombre de planètes ?", answers: ["7", "8", "9", "10"], correct: 1, info: "Il y en a 8 depuis que Pluton est une planète naine." },
    { question: "Auteur de 'Hamlet' ?", answers: ["Dante", "Shakespeare", "Goethe", "Verne"], correct: 1, info: "Cette pièce célèbre contient la réplique 'Être ou ne pas être'." },
    { question: "Capitale de la Suède ?", answers: ["Oslo", "Copenhague", "Stockholm", "Helsinki"], correct: 2, info: "Stockholm est construite sur 14 îles reliées par des ponts." },
    { question: "Instrument de Sherlock Holmes ?", answers: ["Piano", "Violon", "Flûte", "Harpe"], correct: 1, info: "Le célèbre détective joue du violon pour réfléchir." },
    { question: "Sommet de l'Europe ?", answers: ["Mont Blanc", "Elbrouz", "Etna", "Olympe"], correct: 1, info: "L'Elbrouz (Caucase) est le plus haut sommet géographique d'Europe." },
    { question: "Peintre de 'Guernica' ?", answers: ["Dalí", "Miró", "Picasso", "Goya"], correct: 2, info: "Picasso a peint cette œuvre pour dénoncer la guerre civile espagnole." },
    { question: "Capitale de la Thaïlande ?", answers: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya"], correct: 0, info: "Bangkok est célèbre pour ses temples et son animation." },
    { question: "Langue du Brésil ?", answers: ["Espagnol", "Portugais", "Brésilien", "Français"], correct: 1, info: "Le Brésil est le seul pays lusophone d'Amérique latine." },
    { question: "Joueurs équipe Foot ?", answers: ["7", "9", "11", "13"], correct: 2, info: "Le foot se joue à 11 contre 11 sur le terrain." },
    { question: "Capitale de l'Argentine ?", answers: ["Cordoba", "Rosario", "Buenos Aires", "Mendoza"], correct: 2, info: "Buenos Aires est le berceau du tango." },
    { question: "Cité interdite ?", answers: ["Kyoto", "Séoul", "Pékin", "Bangkok"], correct: 2, info: "Elle se trouve au cœur de Pékin, en Chine." },
    { question: "Vaccin contre la rage ?", answers: ["Fleming", "Pasteur", "Koch", "Jenner"], correct: 1, info: "Louis Pasteur l'a mis au point en 1885." },
    { question: "Capitale de l'Irlande ?", answers: ["Belfast", "Cork", "Galway", "Dublin"], correct: 3, info: "Dublin est située à l'embouchure de la rivière Liffey." },
    { question: "Métal précieux blanc ?", answers: ["Or", "Argent", "Platine", "Cuivre"], correct: 1, info: "L'argent est utilisé depuis l'Antiquité pour les bijoux et monnaies." },
    { question: "Plus grand poisson ?", answers: ["Grand requin", "Requin baleine", "Espadon", "Thon"], correct: 1, info: "Le requin-baleine peut mesurer plus de 12 mètres." },
    { question: "Capitale de la Suisse ?", answers: ["Zurich", "Genève", "Berne", "Bâle"], correct: 2, info: "Berne est la ville fédérale de la Suisse." },
    { question: "Planète la plus proche ?", answers: ["Vénus", "Mars", "Soleil", "Mercure"], correct: 3, info: "Mercure est la planète la plus proche du Soleil." }
];

const titles = ["Étincelle 🕯️", "Braise 🪵", "Brise-Glace ❄️", "Torche 🔦", "Brasier 🔥", "Maître 👑"];

// --- MODIFICATION : LES STATS SONT MAINTENANT UN OBJET VIDE AU DÉPART ---
let stats = { xp: 0, level: 1, streak: 0 };
let current = 0, score = 0, timerInterval, timeLeft, currentQuestions = [], selectedMode = "";

// Vérification au chargement
const savedUser = localStorage.getItem("brainflamme_user");
if (savedUser) { 
    loadUserStats(savedUser); // Charger les stats du joueur
    updateHome(); 
    show("home-screen"); 
}

// Bouton Créer mon profil
document.getElementById("loginBtn").onclick = () => {
    let v = document.getElementById("username-input").value.trim();
    if (v.length > 2) { 
        localStorage.setItem("brainflamme_user", v); 
        loadUserStats(v); // Charger les stats spécifiques à ce nom
        updateHome(); 
        show("home-screen"); 
    }
};

// --- NOUVELLE FONCTION : CHARGER LES STATS D'UN JOUEUR PRÉCIS ---
function loadUserStats(username) {
    const allData = JSON.parse(localStorage.getItem("brainflamme_all_players")) || {};
    if (allData[username]) {
        stats = allData[username];
    } else {
        // Nouveau joueur : stats à zéro
        stats = { xp: 0, level: 1, streak: 0 };
    }
}

// --- NOUVELLE FONCTION : SAUVEGARDER LES STATS DU JOUEUR ACTUEL ---
function saveUserStats() {
    const username = localStorage.getItem("brainflamme_user");
    if (!username) return;
    const allData = JSON.parse(localStorage.getItem("brainflamme_all_players")) || {};
    allData[username] = stats;
    localStorage.setItem("brainflamme_all_players", JSON.stringify(allData));
}

document.getElementById("startBtn").onclick = () => show("modeSelection");
document.getElementById("dailyMode").onclick = () => startQuiz("Quotidien");
document.getElementById("chronoMode").onclick = () => startQuiz("Chrono");

function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    const target = document.getElementById(id);
    if(target) target.style.display = "block";
}

function updateHome() {
    const xpNext = stats.level * 100;
    const titleIndex = Math.min(Math.floor(stats.level / 10), 5);
    const user = localStorage.getItem("brainflamme_user");
    document.getElementById("welcome-user").textContent = "Salut, " + user;
    document.getElementById("player-level").textContent = "Niveau " + stats.level + " - " + titles[titleIndex];
    document.getElementById("xp-bar-fill").style.width = (stats.xp / xpNext * 100) + "%";
    document.getElementById("streak-number").textContent = stats.streak;
}

function startQuiz(mode) {
    selectedMode = mode; current = 0; score = 0;
    currentQuestions = [...questionsData].sort(() => Math.random() - 0.5);
    if (mode === "Quotidien") {
        currentQuestions = currentQuestions.slice(0, 5);
        document.getElementById("timerContainer").style.display = "none";
    } else {
        document.getElementById("timerContainer").style.display = "block";
        timeLeft = 30; 
        updateTimerUI();
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft -= 0.1; 
            updateTimerUI();
            if (timeLeft <= 0) endQuiz();
        }, 100);
    }
    show("quiz");
    showQuestion();
}

function updateTimerUI() {
    const bar = document.getElementById("timerBar");
    const text = document.getElementById("timerText");
    const pct = (timeLeft / 30) * 100;
    bar.style.width = pct + "%";
    text.textContent = Math.ceil(timeLeft);
    if (timeLeft > 23) bar.style.backgroundColor = "#22c55e";
    else if (timeLeft > 15) bar.style.backgroundColor = "#84cc16";
    else if (timeLeft > 10) bar.style.backgroundColor = "#eab308";
    else if (timeLeft > 5) bar.style.backgroundColor = "#f97316";
    else bar.style.backgroundColor = "#ef4444";
}

function showQuestion() {
    if (current >= currentQuestions.length) return endQuiz();
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("explanation-container").innerHTML = ""; 
    const q = currentQuestions[current];
    document.getElementById("question").textContent = q.question;
    const area = document.getElementById("answers"); area.innerHTML = "";
    q.answers.forEach((a, i) => {
        const b = document.createElement("button");
        b.className = "answer"; b.textContent = a;
        b.onclick = () => {
            document.querySelectorAll(".answer").forEach(btn => btn.disabled = true);
            if (i === q.correct) { b.classList.add("correct"); score++; }
            else { b.classList.add("wrong"); document.querySelectorAll(".answer")[q.correct].classList.add("correct"); }
            if (selectedMode === "Quotidien") {
                document.getElementById("explanation-container").innerHTML = `<div style="background:#1e293b; border:2px solid #f97316; padding:15px; border-radius:15px; margin-top:20px; text-align:left;"><h4 style="color:#f97316; margin-bottom:5px;">💡 Le sais-tu ?</h4><p>${q.info}</p></div>`;
                document.getElementById("nextBtn").style.display = "inline-block";
                document.getElementById("nextBtn").onclick = () => { current++; showQuestion(); };
            } else { setTimeout(() => { current++; showQuestion(); }, 600); }
        };
        area.appendChild(b);
    });
}

function endQuiz() {
    clearInterval(timerInterval);
    const gain = score * 20;
    stats.xp += gain;
    if (selectedMode === "Quotidien" && score === 5) { stats.streak++; launchConfetti(); }
    while (stats.xp >= stats.level * 100) { stats.xp -= (stats.level * 100); stats.level++; }
    
    // SAUVEGARDE DES STATS LIÉES AU NOM
    saveUserStats();
    
    show("score");
    const scoreScreen = document.getElementById("score");
    scoreScreen.innerHTML = `<h2 style="font-size:40px; margin-bottom:10px;">Résultat</h2><div id="final-xp-zone" class="xp-section-permanent"><p style="font-size:20px; font-weight:bold;">Niveau ${stats.level}</p><div class="xp-bar-bg" style="margin:10px auto;"><div id="anim-fill"></div></div><p style="font-size:24px; color:#22c55e; margin-top:10px; font-weight:bold;">+${gain} XP</p></div><div id="final-stats-area"></div>`;
    setTimeout(() => {
        const bar = document.getElementById("anim-fill");
        if(bar) bar.style.width = (stats.xp / (stats.level * 100) * 100) + "%";
        setTimeout(() => {
            const zone = document.getElementById("final-xp-zone");
            if(zone) zone.classList.add("xp-inhale");
            setTimeout(() => { 
                if(zone) zone.style.display = "none"; 
                let comment = (selectedMode === "Quotidien") ? "BRAVO ! ✨" : (score >= 20 ? "LÉGENDAIRE ⚡" : (score >= 12 ? "PAS MAL ! 🔥" : (score >= 6 ? "BIEN JOUÉ 👏" : "ESSAIE ENCORE 🐢")));
                document.getElementById("final-stats-area").innerHTML = `<div class="final-message"><h3 style="font-size:50px; color:#f97316; margin-bottom:10px;">${comment}</h3><p style="font-size:22px; font-weight:bold; margin-bottom:30px;">${score} réponses justes sur ${selectedMode === "Quotidien" ? 5 : current}</p><button class="play pulse-btn" onclick="show('home-screen'); updateHome();">RETOUR</button></div>`;
            }, 700);
        }, 1500);
    }, 100);
}

function logout() {
    localStorage.removeItem("brainflamme_user");
    document.getElementById("username-input").value = "";
    // On remet les stats locales par défaut avant de changer d'écran
    stats = { xp: 0, level: 1, streak: 0 };
    show("login-screen");
}

function launchConfetti() {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#f97316", "#ffffff"];
    for (let i = 0; i < 80; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * 100 + "vw";
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 5 + "px";
        c.style.width = size;
        c.style.height = size;
        c.style.animationDuration = (Math.random() * 2 + 2) + "s";
        c.style.animationDelay = (Math.random() * 1.5) + "s";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5000);
    }
}
