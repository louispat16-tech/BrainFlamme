// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyCzYz9-C-qnA8ZKd_E7aCBWOa9cCH_w24Y",
    databaseURL: "https://brainflamme-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "brainflamme",
    storageBucket: "brainflamme.firebasestorage.app",
    messagingSenderId: "200853989780",
    appId: "1:200853989780:web:94b21502105f8ae860c781"
};

// Initialisation Firebase (Version Compat)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const questionsData = [
    { question: "Quelle est la capitale de l'Australie ?", answers: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, info: "C'est Canberra qui a été choisie en 1908 comme compromis pour mettre fin à la rivalité entre Sydney et Melbourne." },
    { question: "Quel est l'organe le plus lourd du corps ?", answers: ["Cerveau", "Foie", "Coeur", "Poumons"], correct: 1, info: "Le foie est l'organe interne le plus massif, pesant environ 1,5 kg. Il assure plus de 500 fonctions vitales." },
    { question: "En quelle année l'Homme a marché pour la première fois sur la Lune ?", answers: ["1962", "1969", "1972", "1965"], correct: 1, info: "Le 21 juillet 1969, Neil Armstrong est devenu le premier humain à marcher sur la Lune lors de la mission Apollo 11." },
    { question: "Quel est le pays le plus grand pays du monde ?", answers: ["Canada", "USA", "Chine", "Russie"], correct: 3, info: "Avec plus de 17 millions de km², la Russie est le plus grand pays de la planète." },
    { question: "Qui a peint 'La Jeune Fille à la perle' ?", answers: ["Vermeer", "Rembrandt", "Van Gogh", "Da Vinci"], correct: 0, info: "Ce chef-d'œuvre a été peint par le Néerlandais Johannes Vermeer vers 1665." },
    { question: "Comment se nomme la monnaie du Japon ?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, info: "Le Yen est la monnaie officielle du Japon depuis 1871." },
    { question: "Quel est le plus long fleuve du monde ?", answers: ["Amazone", "Nil", "Mississippi", "Yangzi"], correct: 0, info: "L'Amazone est techniquement le plus long fleuve, mais surtout celui qui a le plus gros débit d'eau." },
    { question: "Combien y a-t-il d'os chez un adulte ?", answers: ["186", "206", "226", "256"], correct: 1, info: "Le squelette d'un adulte compte 206 os. À la naissance, les bébés en ont environ 270." },
    { question: "Quel est le symbole chimique de l'Or ?", answers: ["Ag", "Fe", "Au", "Pb"], correct: 2, info: "Le symbole 'Au' vient du mot latin 'Aurum', qui signifie 'aurore éclatante'." },
    { question: "Comment s'appelle la planète la plus chaude ?", answers: ["Mercure", "Vénus", "Mars", "Jupiter"], correct: 1, info: "Vénus est la plus chaude (460°C) car son atmosphère épaisse de CO2 piège la chaleur." },
    { question: "Qui a découvert la pénicilline ?", answers: ["Curie", "Pasteur", "Fleming", "Einstein"], correct: 2, info: "Alexander Fleming a découvert le premier antibiotique par erreur en 1928." },
    { question: "Quelle équipe a gagné la Coupe du Monde de football 2018 ?", answers: ["Allemagne", "Brésil", "France", "Argentine"], correct: 2, info: "L'équipe de France a remporté sa deuxième étoile en battant la Croatie 4-2." },
    { question: "Quelle est la langue la plus parlée dans le monde ?", answers: ["Anglais", "Espagnol", "Mandarin", "Hindi"], correct: 0, info: "L'anglais est la langue la plus parlée au monde (environ 1,5 milliard de locuteurs)." },
    { question: "Dans quel océan se trouve Madagascar ?", answers: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 1, info: "Madagascar est située au large de l'Afrique de l'Est, dans l'océan Indien." },
    { question: "Comment s'appelle le sommet le plus haut du monde ?", answers: ["K2", "Mont Blanc", "Annapurna", "Everest"], correct: 3, info: "Situé dans l'Himalaya, le mont Everest culmine à 8 848 mètres d'altitude." },
    { question: "Quel auteur connu a écrit les 'Misérables' ?", answers: ["Zola", "Hugo", "Flaubert", "Balzac"], correct: 1, info: "Victor Hugo a publié ce roman historique et social en 1862." },
    { question: "Quel est le numéro atomique de l'Hydrogène ?", answers: ["1", "2", "10", "12"], correct: 0, info: "L'Hydrogène est l'élément le plus simple de l'univers, avec un seul proton." },
    { question: "Comment s'apelle la capitale du Canada ?", answers: ["Toronto", "Montréal", "Ottawa", "Vancouver"], correct: 2, info: "Ottawa a été désignée capitale par la reine Victoria en 1857." },
    { question: "Sous quel nom est connue la cité ensevelie par le Vésuve ?", answers: ["Rome", "Athènes", "Pompéi", "Carthage"], correct: 2, info: "En l'an 79 après J.-C., l'éruption du Vésuve a figé la ville de Pompéi sous les cendres." },
    { question: "Parmis les propositions suivantes, quel oiseau ne peut pas voler ?", answers: ["Aigle", "Autruche", "Perroquet", "Faucon"], correct: 1, info: "L'autruche est le plus grand des oiseaux. Elle peut courir jusqu'à 70 km/h." },
    { question: "A quelle vitessela lumière se propage-t-elle?", answers: ["150k km/s", "300k km/s", "500k km/s", "1M km/s"], correct: 1, info: "La lumière voyage à environ 300 000 kilomètres par seconde." },
    { question: "Comment s'appelle le plus grand désert chaud du monde ?", answers: ["Gobi", "Sahara", "Atacama", "Kalahari"], correct: 1, info: "Le Sahara couvre 9 millions de km², soit presque la taille des États-Unis." },
    { question: "Sous quel nom connait-on le principal inventeur du téléphone ?", answers: ["Edison", "Tesla", "Graham Bell", "Newton"], correct: 2, info: "Alexander Graham Bell a déposé le premier brevet pour un téléphone électrique en 1876." },
    { question: "Quelle est la capitale de l'Italie ?", answers: ["Milan", "Florence", "Rome", "Naples"], correct: 2, info: "Surnommée la 'Ville Éternelle', Rome abrite en son sein le Vatican." },
    { question: "Combien de cœurs possède une pieuvre ?", answers: ["1", "2", "3", "4"], correct: 2, info: "La pieuvre possède trois cœurs pour pomper son sang bleu." },
    { question: "Quel est le plus petit pays du monde ?", answers: ["Monaco", "Vatican", "Malte", "San Marin"], correct: 1, info: "Le Vatican ne fait que 0,44 km²." },
    { question: "Comment se nomme la mer qui se situe entre Jordanie et Israël ?", answers: ["Mer Rouge", "Mer Noire", "Mer Morte", "Méditerranée"], correct: 2, info: "La Mer Morte est si salée qu'elle permet aux humains de flotter sans effort." },
    { question: "Dans quel groupe Freddie Mercury a-t-il joué ?", answers: ["Beatles", "Led Zep", "Queen", "U2"], correct: 2, info: "Freddie Mercury était le chanteur du groupe de rock britannique Queen." },
    { question: "Qui a peint la Chapelle Sixtine ?", answers: ["Picasso", "Michel-Ange", "Raphaël", "Donatello"], correct: 1, info: "Michel-Ange a mis quatre ans pour peindre les fresques du plafond." },
    { question: "Lequel de ces fruit est le plus produit au monde ?", answers: ["Banane", "Pomme", "Tomate", "Orange"], correct: 2, info: "La tomate est botaniquement un fruit. C'est la culture la plus produite sur Terre." },
    { question: "Combien de dents a un adulte ?", answers: ["28", "30", "32", "34"], correct: 2, info: "Un adulte possède normalement 32 dents, dents de sagesse incluses." },
    { question: "Comment s'appelle l'élément le plus abondant dans l'Univers ?", answers: ["Oxygène", "Carbone", "Hydrogène", "Azote"], correct: 2, info: "L'Hydrogène représente environ 75% de la masse de l'univers." },
    { question: "Quand a débuté la 1ère Guerre mondiale ?", answers: ["1912", "1914", "1916", "1918"], correct: 1, info: "Le conflit a été déclenché en juillet 1914 suite à l'attentat de Sarajevo." },
    { question: "Qui a réalisé 'Inception' ?", answers: ["Spielberg", "Tarantino", "Nolan", "Scorsese"], correct: 2, info: "Christopher Nolan a réalisé ce film complexe sur les rêves en 2010." },
    { question: "Dans quel pays se situe le Taj Mahal ?", answers: ["Pakistan", "Inde", "Thaïlande", "Iran"], correct: 1, info: "Ce mausolée de marbre blanc se situe à Agra, en Inde." },
    { question: "Comment s'appelle la capitale du Brésil ?", answers: ["Rio", "Sao Paulo", "Brasilia", "Salvador"], correct: 2, info: "Brasilia est une ville planifiée inaugurée en 1960." },
    { question: "Sous quel nom est connu le plus grand animal terrestre ?", answers: ["Girafe", "Éléphant", "Rhinocéros", "Hippopotame"], correct: 1, info: "L'éléphant d'Afrique peut peser jusqu'à 6 tonnes." },
    { question: "Qui a écrit la tragédie 'Roméo et Juliette' ?", answers: ["Molière", "Shakespeare", "Dante", "Goethe"], correct: 1, info: "William Shakespeare a écrit cette tragédie à la fin du XVIe siècle." },
    { question: "Quel est le principal composant du verre ?", answers: ["Sable", "Argile", "Calcaire", "Plomb"], correct: 0, info: "Le verre est fabriqué en faisant fondre du sable de silice à très haute température." },
    { question: "Quel est la capitale de l'Espagne ?", answers: ["Barcelone", "Séville", "Madrid", "Valence"], correct: 2, info: "Madrid est située en plein cœur géographique du pays." },
    { question: "Comment se nomme le métal le plus utilisé ?", answers: ["Or", "Aluminium", "Fer", "Cuivre"], correct: 2, info: "Le fer est le métal le plus utilisé, principalement pour produire de l'acier." },
    { question: "Combien y a-t-il de secondes dans une heure ?", answers: ["1200", "2400", "3600", "4800"], correct: 2, info: "Le calcul est simple : 60 minutes x 60 secondes = 3600." },
    { question: "Quel artiste a sculté le 'Penseur' ?", answers: ["Rodin", "Bernini", "Canova", "Donatello"], correct: 0, info: "Auguste Rodin a créé cette statue de bronze en 1880." },
    { question: "Lequels de ces pays a inventé les pâtes ?", answers: ["Italie", "Chine", "Grèce", "Égypte"], correct: 1, info: "Les plus vieilles traces de nouilles ont été découvertes en Chine (4 000 ans)." },
    { question: "Quel est le nom du fleuve qui traverse Paris ?", answers: ["Loire", "Rhône", "Seine", "Garonne"], correct: 2, info: "La Seine divise Paris en deux : la Rive Droite et la Rive Gauche." },
    { question: "Sous quel nom célèbre est connu le plus grand mammifère marin ?", answers: ["Requin baleine", "Baleine bleue", "Orque", "Cachalot"], correct: 1, info: "La baleine bleue (ou aussi 'Rorqual bleu') peut atteindre 30 mètres et 180 tonnes." },
    { question: "Comment s'appelle le dieu grec de la foudre ?", answers: ["Hades", "Poséidon", "Zeus", "Apollon"], correct: 2, info: "Zeus est le roi des dieux dans la mythologie grecque." },
    { question: "Quel gaz est majoritaire dans l'air ?", answers: ["Oxygène", "Argon", "Azote", "Hélium"], correct: 2, info: "L'air est composé à 78% d'azote et à 21% d'oxygène." },
    { question: "Quel est la capitale de l'Égypte ?", answers: ["Alexandrie", "Louxor", "Le Caire", "Gizeh"], correct: 2, info: "Le Caire est situé à proximité des pyramides de Gizeh." },
    { question: "En quel mois commence l'Oktoberfest ?", answers: ["Août", "Septembre", "Octobre", "Novembre"], correct: 1, info: "La fête de la bière commence en septembre mais se termine en octobre." },
    { question: "Qui est l'inventeur de l'imprimerie ?", answers: ["Gutenberg", "Léonard", "Franklin", "Newton"], correct: 0, info: "Gutenberg a inventé les caractères mobiles vers 1440." },
    { question: "Quel est la capitale de la Russie ?", answers: ["Pétersbourg", "Moscou", "Kiev", "Novosibirsk"], correct: 1, info: "Moscou abrite le célèbre Kremlin et la place Rouge." },
    { question: "Quel est l'étoile la plus proche de la Terre ?", answers: ["Sirius", "Proxima", "Soleil", "Vega"], correct: 2, info: "Le Soleil est notre étoile, située à 150 millions de km." },
    { question: "Qui a peint les 'Nymphéas' ?", answers: ["Manet", "Monet", "Renoir", "Degas"], correct: 1, info: "Claude Monet a peint cette série dans son jardin à Giverny." },
    { question: "Dans quel pays la Tour de Pise se situe-t-elle ?", answers: ["Espagne", "Grèce", "Italie", "France"], correct: 2, info: "La tour penchée se situe à Pise, en Toscane (Italie)." },
    { question: "Qui a écrit 'Le Petit Prince' ?", answers: ["Proust", "Antoine de Saint-Exupéry", "Camus", "Sartre"], correct: 1, info: "Antoine de Saint-Exupéry a publié ce conte poétique en 1943." },
    { question: "Quel est la capitale de l'Allemagne ?", answers: ["Munich", "Francfort", "Hambourg", "Berlin"], correct: 3, info: "Berlin est la capitale de l'Allemagne réunifiée depuis 1990." },
    { question: "Quel est la capitale du Portugal ?", answers: ["Lisbonne", "Porto", "Faro", "Coimbra"], correct: 0, info: "Lisbonne est l'une des plus vieilles villes d'Europe." },
    { question: "Quel planète est surnomée 'Planète rouge' ?", answers: ["Vénus", "Mars", "Saturne", "Neptune"], correct: 1, info: "Mars doit sa couleur à l'oxyde de fer (rouille) à sa surface." },
    { question: "Qui a peint 'La Cène' ?", answers: ["Michel-Ange", "Da Vinci", "Raphaël", "Titien"], correct: 1, info: "Léonard de Vinci a réalisé cette fresque célèbre à Milan." },
    { question: "Parmis les propositions suivantes, quel est le seul métal a pouvoir être liquide ?", answers: ["Plomb", "Mercure", "Étain", "Argent"], correct: 1, info: "Le mercure est le seul métal liquide à température ambiante." },
    { question: "Comment s'appelle la personne célèbre qui a inventé l'ampoule ?", answers: ["Tesla", "Edison", "Watt", "Faraday"], correct: 1, info: "Thomas Edison a perfectionné l'ampoule à filament de carbone en 1879 (même si Joseph Swan l'a faite avant!)." },
    { question: "Quel est la capitale de la Chine ?", answers: ["Shanghai", "Canton", "Pékin", "Shenzhen"], correct: 2, info: "Pékin est le cœur politique de la Chine et proche de la Grande Muraille." },
    { question: "Quel est la formule chimique de l'eau ?", answers: ["CO2", "O2", "H2O", "N2"], correct: 2, info: "H2O signifie 2 atomes d'hydrogène pour 1 d'oxygène." },
    { question: "Comment s'appelle l'océan le plus grand du monde ?", answers: ["Atlantique", "Indien", "Arctique", "Pacifique"], correct: 3, info: "Le Pacifique couvre un tiers de la surface de la Terre." },
    { question: "Qui a écrit la sage 'Harry Potter' ?", answers: ["Tolkien", "Martin", "J.K. Rowling", "King"], correct: 2, info: "J.K. Rowling a écrit le premier tome 'A l'école des sorciers' en 1997." },
    { question: "Quel est la capitale de la Grèce ?", answers: ["Athènes", "Thessalonique", "Patras", "Héraklion"], correct: 0, info: "Athènes est considérée comme le berceau de la démocratie." },
    { question: "Parmis ces animaux, lequel pond le plus gros oeuf?", answers: ["Dinosaure", "Autruche", "Baleine", "Condor"], correct: 1, info: "L'œuf d'autruche peut peser jusqu'à 1,5 kg." },
    { question: "Quel est la dernière lettre alphabet grec ?", answers: ["Alpha", "Zeta", "Omega", "Psi"], correct: 2, info: "Omega (Ω) est la 24ème et dernière lettre de cet alphabet." },
    { question: "Quel est la capitale de l'Inde ?", answers: ["Mumbai", "Calcutta", "New Delhi", "Bangalore"], correct: 2, info: "New Delhi est la capitale administrative de l'Inde." },
    { question: "Quel sport Roger Federer pratiquait-t-il ?", answers: ["Football", "Tennis", "Golf", "Basket"], correct: 1, info: "Federer a remporté 20 tournois du Grand Chelem." },
    { question: "Qui a découvert l'Amérique ?", answers: ["Magellan", "Gama", "Colomb", "Vespucci"], correct: 2, info: "Christophe Colomb a atteint les Bahamas en 1492." },
    { question: "Quel organe du corps humain filtre le sang ?", answers: ["Foie", "Pancréas", "Reins", "Rate"], correct: 2, info: "Les reins filtrent environ 200 litres de sang par jour." },
    { question: "Quel est la capitale de la Belgique ?", answers: ["Bruges", "Anvers", "Gand", "Bruxelles"], correct: 3, info: "Bruxelles est aussi le siège de l'Union Européenne." },
    { question: "Combien y a-t-il de continents ?", answers: ["5", "6", "7", "8"], correct: 2, info: "On en compte 7 : Afrique, Antarctique, Asie, Europe, Océanie, Amérique du Nord et du Sud." },
    { question: "Quel couleur obtient-on quand on mélange du bleu et du jaune ?", answers: ["Violet", "Vert", "Orange", "Marron"], correct: 1, info: "Le vert est une couleur secondaire obtenue avec ces deux primaires." },
    { question: "Quel est la capitale de la Turquie ?", answers: ["Istanbul", "Ankara", "Izmir", "Antalya"], correct: 1, info: "Ankara a été choisie comme capitale en 1923." },
    { question: "Comment est surnomée la ville New York ?", answers: ["Big Apple", "Windy City", "Sin City", "Angels"], correct: 0, info: "The Big Apple est devenu son surnom officielle dans les années 20." },
    { question: "Comment s'appelle la monnaie du Royaume-Uni ?", answers: ["Euro", "Dollar", "Livre", "Yen"], correct: 2, info: "La Livre Sterling est l'une des plus vieilles monnaies au monde." },
    { question: "Quel est la capitale de la Corée du Sud ?", answers: ["Busan", "Incheon", "Daegu", "Séoul"], correct: 3, info: "Séoul abrite environ 10 millions d'habitants." },
    { question: "Combien de pattes possède une araignée ?", answers: ["6", "8", "10", "12"], correct: 1, info: "Les araignées sont des arachnides, elles ont donc 8 pattes." },
    { question: "Comment s'appelle l'inventeur de Facebook ?", answers: ["Gates", "Jobs", "Zuckerberg", "Musk"], correct: 2, info: "Mark Zuckerberg l'a lancé depuis Harvard en 2004." },
    { question: "Quel est la capitale du Mexique ?", answers: ["Guadalajara", "Monterrey", "Mexico City", "Cancun"], correct: 2, info: "Mexico est l'une des plus grandes villes du monde." },
    { question: "Combien y a-t-il de planètes dans notre système solaire ?", answers: ["7", "8", "9", "10"], correct: 1, info: "Il y en a 8 depuis que Pluton est une planète naine." },
    { question: "Quel auteur a créé la pièce de théâtre 'Hamlet' ?", answers: ["Dante", "Shakespeare", "Goethe", "Verne"], correct: 1, info: "Cette pièce célèbre contient la réplique 'Être ou ne pas être'." },
    { question: "Comment se nomme la capitale de la Suède ?", answers: ["Oslo", "Copenhague", "Stockholm", "Helsinki"], correct: 2, info: "Stockholm est construite sur 14 îles reliées par des ponts." },
    { question: "Quel est l'instrument de Sherlock Holmes ?", answers: ["Piano", "Violon", "Flûte", "Harpe"], correct: 1, info: "Le célèbre détective joue du violon pour réfléchir." },
    { question: "Quel est le plus haut sommet d'Europe ?", answers: ["Mont Blanc", "Elbrouz", "Etna", "Olympe"], correct: 1, info: "L'Elbrouz (Caucase) est le plus haut sommet géographique d'Europe." },
    { question: "Qui a peint 'Guernica' ?", answers: ["Dalí", "Miró", "Picasso", "Goya"], correct: 2, info: "Picasso a peint cette œuvre pour dénoncer la guerre civile espagnole." },
    { question: "Comment s'appelle la capitale de la Thaïlande ?", answers: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya"], correct: 0, info: "Bangkok est célèbre pour ses temples et son animation." },
    { question: "Quelle est la langue officiel du Brésil ?", answers: ["Espagnol", "Portugais", "Brésilien", "Français"], correct: 1, info: "Le Brésil est le seul pays lusophone d'Amérique latine." },
    { question: "Combien y a-t-il de joueurs dans une équipe de Football ?", answers: ["7", "9", "11", "13"], correct: 2, info: "Le foot se joue à 11 contre 11 sur le terrain." },
    { question: "Quel est la capitale de l'Argentine ?", answers: ["Cordoba", "Rosario", "Buenos Aires", "Mendoza"], correct: 2, info: "Buenos Aires est le berceau du tango." },
    { question: "Parmis des réponses suivantes, laquel est appelé la cité interdite ?", answers: ["Kyoto", "Séoul", "Pékin", "Bangkok"], correct: 2, info: "Elle se trouve au cœur de Pékin, en Chine." },
    { question: "Qui a créé le vaccin contre la rage ?", answers: ["Fleming", "Pasteur", "Koch", "Jenner"], correct: 1, info: "Louis Pasteur l'a mis au point en 1885." },
    { question: "Comment s'appelle la capitale de l'Irlande ?", answers: ["Belfast", "Cork", "Galway", "Dublin"], correct: 3, info: "Dublin est située à l'embouchure de la rivière Liffey." },
    { question: "Quel est le métal blanc le plus précieux ?", answers: ["Or", "Rhodium", "Platine", "Argent"], correct: 1, info: "L'argent est utilisé depuis l'Antiquité pour les bijoux et monnaies." },
    { question: "Comment s'appellele plus grand poisson du monde ?", answers: ["Grand requin", "Requin baleine", "Espadon", "Thon"], correct: 1, info: "Le requin-baleine peut mesurer plus de 12 mètres." },
    { question: "Quel est la capitale de la Suisse ?", answers: ["Zurich", "Genève", "Berne", "Bâle"], correct: 2, info: "Berne est la ville fédérale de la Suisse." },
    { question: "Quel est la planète la plus proche du Soleil ?", answers: ["Vénus", "Mars", "Jupiter", "Mercure"], correct: 3, info: "Mercure est la planète la plus proche du Soleil." },
    { question: "Quelle est la température moyenne sur Terre?", answers: ["10°C", "15°C", "20°C", "30°C"], correct: 1, info: "Sans l'effet de serre naturel, la température moyenne de la Terre serait d'environ -18°C. C'est cet effet de serre qui permet à la vie d'exister !"}
];

const titles = ["Étincelle 🕯️", "Braise 🪵", "Brise-Glace ❄️", "Torche 🔦", "Brasier 🔥", "Maître 👑"];

let stats = { xp: 0, level: 1, streak: 0, shields: 0 }; // Ajoute shields: 0 ici
let current = 0, score = 0, timerInterval, timeLeft, currentQuestions = [], selectedMode = "";
let dailyTimerInterval;
let quizHistory = []; // AJOUT ICI : mémorise les réponses du joueur

// --- INITIALISATION AU CHARGEMENT ---
window.onload = () => {
    const savedUser = localStorage.getItem("brainflamme_user");
    if (savedUser) { 
        loadUserStatsFromCloud(savedUser); 
    } else {
        show("login-screen");
    }
};

// --- GESTION DU BOUTON CRÉER MON PROFIL (VERSION NETTOYÉE) ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.onclick = () => {
        const input = document.getElementById("username-input");
        const username = input ? input.value.trim() : "";
        
        if (username) {
            localStorage.setItem("brainflamme_user", username);
            loadUserStatsFromCloud(username); 
        } else {
            alert("Choisis un pseudo pour commencer ! 🔥");
        }
    };
}

function saveUserStats() {
    const username = localStorage.getItem("brainflamme_user");
    if (!username) return;
    
    // Sauvegarde locale
    const allData = JSON.parse(localStorage.getItem("brainflamme_all_players")) || {};
    allData[username] = stats;
    localStorage.setItem("brainflamme_all_players", JSON.stringify(allData));
    
    // SAUVEGARDE CLOUD ☁️
    database.ref('joueurs/' + username).set(stats);
}

function loadUserStatsFromCloud(username) {
    database.ref('joueurs/' + username).once('value').then((snapshot) => {
        const cloudData = snapshot.val();
        
        if (cloudData) {
            stats = cloudData;
            
            // Sécurité : s'assurer que shields existe si le compte est vieux
            if (stats.shields === undefined) stats.shields = 0;

            // --- LOGIQUE DE RUPTURE DE FLAMME ---
            const lastDateStr = localStorage.getItem("daily_done_" + username);
            if (lastDateStr) {
                const lastDate = new Date(lastDateStr);
                const today = new Date();
                
                lastDate.setHours(0,0,0,0);
                today.setHours(0,0,0,0);
                
                const diffTime = today - lastDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                
                if (diffDays > 1) {
                    if (stats.shields > 0) {
                        stats.shields--; 
                        alert("🛡️ Ton bouclier a été utilisé ! Ta flamme est sauvée.");
                    } else {
                        stats.streak = 0; 
                        alert("🔥 Ta flamme s'est éteinte car tu n'as pas joué hier.");
                    }
                    saveUserStats(); 
                }
            }
        } else {
            // --- NOUVEAU JOUEUR OU LOCAL ---
            const allData = JSON.parse(localStorage.getItem("brainflamme_all_players")) || {};
            // TRÈS IMPORTANT : Ajoute shields: 0 ici aussi
            stats = allData[username] || { xp: 0, level: 1, streak: 0, shields: 0 };
        }
        
        updateHome(); 
        show("home-screen");
    });
}

// --- LOGIQUE DU JEU (RESTE INCHANGÉE) ---

document.getElementById("startBtn").onclick = () => {
    show("modeSelection");
    checkDailyStatus();
};

document.getElementById("dailyMode").onclick = () => startQuiz("Quotidien");
document.getElementById("chronoMode").onclick = () => startQuiz("Chrono");

function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    const target = document.getElementById(id);
    if(target) target.style.display = "block";

    const nav = document.getElementById("main-nav");
    if (!nav) return;

    // Si on est sur l'écran de login, on cache TOUJOURS la nav
    if (id === "login-screen" || id === "quiz") {
        nav.style.display = "none";
    } else {
        // On affiche la nav uniquement si un utilisateur est enregistré
        const user = localStorage.getItem("brainflamme_user");
        if (user) {
            nav.style.display = "flex";
        }
    }
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

function checkDailyStatus() {
    const user = localStorage.getItem("brainflamme_user");
    const lastDate = localStorage.getItem("daily_done_" + user);
    const today = new Date().toLocaleDateString();
    const btn = document.getElementById("dailyMode");

    clearInterval(dailyTimerInterval);

    if (lastDate === today) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        
        dailyTimerInterval = setInterval(() => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;

            if (diff <= 0) {
                clearInterval(dailyTimerInterval);
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.innerText = "Mode Quotidien 📅";
            } else {
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                btn.innerText = `Reviens dans ${h}h ${m}m ${s}s`;
            }
        }, 1000);
    } else {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerText = "Mode Quotidien 📅";
    }
}

function startQuiz(mode) {
    quizHistory = []; // Vide l'historique
    selectedMode = mode; 
    current = 0; 
    score = 0;
    
    // Mélange des questions
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
    
    const expl = document.getElementById("explanation-container");
    if(expl) expl.innerHTML = ""; 

    const q = currentQuestions[current];
    document.getElementById("question").textContent = q.question;
    
    const area = document.getElementById("answers"); 
    area.innerHTML = "";

    let mappedAnswers = q.answers.map((text, index) => {
        return { text: text, isCorrect: index === q.correct };
    });

    mappedAnswers.sort(() => Math.random() - 0.5);

    mappedAnswers.forEach((answerObj) => {
        const b = document.createElement("button");
        b.className = "answer"; 
        b.textContent = answerObj.text;
        
        b.onclick = () => {
            const allBtns = document.querySelectorAll(".answer");
            allBtns.forEach(btn => btn.disabled = true);
            // --- DEBUT BLOC ENREGISTREMENT RECAP ---
            quizHistory.push({
                question: q.question,
                userAns: answerObj.text,
                correctAns: q.answers[q.correct],
                isCorrect: answerObj.isCorrect
            });
            // --- FIN BLOC ENREGISTREMENT RECAP ---
            if (answerObj.isCorrect) { 
                b.classList.add("correct"); 
                score++; 
            } else { 
                b.classList.add("wrong");
                allBtns.forEach(btn => {
                    const originalCorrectText = q.answers[q.correct];
                    if (btn.textContent === originalCorrectText) btn.classList.add("correct");
                });
            }
            
            if (selectedMode === "Chrono") {
                setTimeout(() => {
                    current++;
                    showQuestion();
                }, 1200);
            } else {
                if(expl) {
                    expl.innerHTML = `
                        <div style="background:#1e293b; border:2px solid #f97316; padding:15px; border-radius:15px; margin-top:20px; text-align:left;">
                            <h4 style="color:#f97316; margin-bottom:5px;">💡 Le sais-tu ?</h4>
                            <p style="margin-bottom:15px;">${q.info}</p>
                            <div style="text-align:center;">
                                <button id="nextBtnInside" class="play" style="padding:10px 30px; font-size:18px; margin-top:0;">SUIVANT</button>
                            </div>
                        </div>`;
                    
                    document.getElementById("nextBtnInside").onclick = () => { 
                        current++; 
                        showQuestion(); 
                    };
                }
            }
        }; // Fermeture du b.onclick
        area.appendChild(b);
    }); // Fermeture du forEach
} // Fermeture de showQuestion

function endQuiz() {
    // 1. STOP IMMEDIAT des chronos pour bloquer tout double appel
    clearInterval(timerInterval);
    clearInterval(dailyTimerInterval);

    // 2. Affichage de l'écran score
    show("score");
    const scoreScreen = document.getElementById("score");
    if (!scoreScreen) return;

    // 3. Calcul XP et Niveau
    let gain = score * 10;
    stats.xp += gain;
    while(stats.xp >= stats.level * 100) {
        stats.xp -= stats.level * 100;
        stats.level++;
    }
  if (selectedMode === "Quotidien") {
    const user = localStorage.getItem("brainflamme_user");
    localStorage.setItem("daily_done_" + user, new Date().toLocaleDateString());
    checkDailyStatus(); // Met à jour le bouton immédiatement
}
    saveUserStats();

   // 4. Préparation des infos
    // Si c'est le mode Quotidien, on sait que c'est 5. 
    // Si c'est le Chrono, on prend 'current' (le compteur de questions actuel)
    let nbQuestionsPosees = (selectedMode === "Quotidien") ? 5 : current;

    // Petit ajustement : si le chrono s'arrête pile au moment où une question apparaît 
    // mais qu'on n'y répond pas, on s'assure que le total est logique
    if (selectedMode === "Chrono" && score > nbQuestionsPosees) {
        nbQuestionsPosees = score; 
    }

    let comment = (score >= (nbQuestionsPosees * 0.8)) ? "INCROYABLE ! 🔥" : (score >= (nbQuestionsPosees * 0.5) ? "BIEN JOUÉ ! 👏" : "ESSAIE ENCORE ! 🐢")

    // 5. Injection directe (On arrête les animations complexes qui font bugger)
    scoreScreen.innerHTML = `
        <h2 style="font-size:40px; margin-bottom:10px;">Résultat</h2>
        <div class="final-score-box" style="background:#1e293b; padding:25px; border-radius:20px; border:2px solid #f97316; max-width:400px; margin:auto;">
            <p style="font-size:20px; font-weight:bold;">Niveau ${stats.level}</p>
            <div style="width:100%; height:15px; background:#334155; border-radius:10px; margin:15px 0; overflow:hidden;">
                <div id="anim-fill" style="width:0%; height:100%; background:#f97316; transition: width 1s ease-out;"></div>
            </div>
            <p style="font-size:24px; color:#22c55e; font-weight:bold;">+${gain} XP</p>
            
            <hr style="border:0; border-top:1px solid #334155; margin:20px 0;">
            
            <h3 style="font-size:35px; color:#f97316; margin-bottom:5px;">${comment}</h3>
            <p style="font-size:20px;">${score} / ${nbQuestionsPosees} correctes</p>
            
            <div style="margin-top:20px;">
                <button class="mode-btn" style="width:100%; margin-bottom:10px; background:#334155; border:1px solid #f97316;" onclick="showRecap()">VOIR LE RÉCAPITULATIF 📋</button>
                <button class="play pulse-btn" style="width:100%; padding:15px;" onclick="show('home-screen'); updateHome();">RETOUR</button>
            </div>
        </div>
    `;

    // 6. Animation de la barre (simple et robuste)
    setTimeout(() => {
        const bar = document.getElementById("anim-fill");
        if(bar) {
            const pct = (stats.xp / (stats.level * 100) * 100);
            bar.style.width = pct + "%";
        }
    }, 100);

    // Dans ta fonction endQuiz, remplace la partie confetti par :
if (score === 5 && selectedMode === "Quotidien") { // Changé currentMode par selectedMode
    lancerConfettis();
}
}

function logout() {
    localStorage.removeItem("brainflamme_user");
    document.getElementById("username-input").value = "";
    stats = { xp: 0, level: 1, streak: 0 };
    show("login-screen");
}

function lancerConfettis() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5, // Plus de particules par "tir"
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            // On ne définit pas de couleurs précises pour laisser le mode multicolore par défaut
            // ou on en met une grande liste :
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f97316']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f97316']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function showStep(stepId) {
    // Cache toutes les étapes de l'inscription
    document.querySelectorAll('.auth-step').forEach(step => step.classList.remove('active'));
    // Affiche l'étape demandée
    const target = document.getElementById(stepId);
    if(target) target.classList.add('active');
}
function showRecap() {
    let recapHTML = `
        <div id="recap-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.98); z-index:9999; overflow-y:auto; padding:20px; font-family:sans-serif;">
            <div style="max-width:500px; margin:40px auto;">
                <h2 style="color:#f97316; text-align:center; font-size:32px; margin-bottom:30px;">Tes neurones en action 🧠</h2>
    `;

    quizHistory.forEach((item, index) => {
        const color = item.isCorrect ? '#22c55e' : '#ef4444';
        const icon = item.isCorrect ? '✅' : '❌';
        
        recapHTML += `
            <div style="background:#1e293b; padding:15px; border-radius:15px; margin-bottom:15px; border-left:6px solid ${color};">
                <p style="font-weight:bold; color:white; margin:0 0 8px 0; font-size:16px;">${index + 1}. ${item.question}</p>
                <p style="color:${color}; font-weight:bold; margin:0; font-size:15px;">
                    ${icon} Ta réponse : ${item.userAns}
                </p>
                ${!item.isCorrect ? `<p style="color:#94a3b8; font-size:14px; margin-top:8px;">La réponse était : <span style="color:#22c55e">${item.correctAns}</span></p>` : ''}
            </div>
        `;
    });

    recapHTML += `
                <button class="play" onclick="document.getElementById('recap-modal').remove()" style="width:100%; margin-top:30px; padding:15px; font-weight:bold; cursor:pointer; background:#f97316; color:white; border:none; border-radius:10px;">FERMER LE RÉCAP</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', recapHTML);
}
function buyItem(name, price) {
    if (stats.xp >= price) {
        stats.xp -= price;
        
        // On donne les boucliers selon le pack
        if (name === 'bronze') stats.shields += 1;
        if (name === 'silver') stats.shields += 3;
        // On pourrait ajouter des cadeaux pour Or et Émeraude plus tard
        
        saveUserStats(); // Sauvegarde Cloud
        updateHome();    // Met à jour l'accueil
        
        // Met à jour l'affichage de la boutique
        const shopXp = document.getElementById("shop-xp");
        if(shopXp) shopXp.textContent = stats.xp;
        
        alert(`Achat réussi ! Tu as ${stats.shields} bouclier(s) en réserve. 🛡️`);
    } else {
        alert("XP insuffisant pour cet article ! ❌");
    }
}
function checkDailyStatus() {
    const user = localStorage.getItem("brainflamme_user");
    const lastDate = localStorage.getItem("daily_done_" + user);
    const today = new Date().toLocaleDateString();
    const btn = document.getElementById("dailyMode");

    if (!btn) return;

    // On efface l'ancien intervalle s'il existe pour éviter les bugs de vitesse
    clearInterval(dailyTimerInterval);

    if (lastDate === today) {
        // LE BOUTON EST GRISÉ
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";

        // LANCEMENT DU COMPTE À REBOURS
        dailyTimerInterval = setInterval(() => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0); // Définit minuit pile (00:00)

            const diff = midnight - now;

            if (diff <= 0) {
                // C'EST MINUIT ! On débloque.
                clearInterval(dailyTimerInterval);
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.innerText = "Mode Quotidien 📅";
            } else {
                // AFFICHAGE DU TEMPS RESTANT
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                btn.innerText = `Disponible dans ${h}h ${m}m ${s}s`;
            }
        }, 1000);
    } else {
        // LE BOUTON EST DISPONIBLE
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.innerText = "Mode Quotidien 📅";
    }
}
