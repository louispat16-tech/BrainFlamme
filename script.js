// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyCzYz9-C-qnA8ZKd_E7aCBWOa9cCH_w24Y",
    databaseURL: "https://brainflamme-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "brainflamme",
    storageBucket: "brainflamme.firebasestorage.app",
    messagingSenderId: "200853989780",
    appId: "1:200853989780:web:94b21502105f8ae860c781"
};

// 1. Initialisation de Firebase d'abord
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); 
}

// 2. Initialisation des services (Firestore, Database, Auth)
const database = firebase.database(); // ✅ Utilisez Realtime Database 
const auth = firebase.auth(); 

// --- ÉCOUTEUR DE CONNEXION ---
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Utilisateur connecté :", user.displayName || user.uid);
        // On charge et rafraîchit le profil dès que Firebase confirme la connexion
        if (typeof renderProfile === "function") renderProfile();
    } else {
        console.log("Aucun utilisateur connecté");
    }
});

const questionsData = [
    { question: "Quelle est la capitale de l'Australie ?", answers: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, info: "C'est Canberra qui a été choisie en 1908 comme compromis pour mettre fin à la rivalité entre Sydney et Melbourne." },
    { question: "Quel est l'organe le plus lourd du corps ?", answers: ["Cerveau", "Foie", "Cœur", "Poumons"], correct: 1, info: "Le foie est l'organe interne le plus massif, pesant environ 1,5 kg. Il assure plus de 500 fonctions vitales." },
    { question: "En quelle année l'Homme a marché pour la première fois sur la Lune ?", answers: ["1962", "1969", "1972", "1965"], correct: 1, info: "Le 21 juillet 1969, Neil Armstrong est devenu le premier humain à marcher sur la Lune lors de la mission Apollo 11." },
    { question: "Quel est le pluriel du mot 'hibou' ?", answers: ["Hibous", "Hiboux", "Hibaux", "Hibes"], correct: 1, info: "Il fait partie des 7 mots en '-ou' qui prennent un 'x' au pluriel (bijou, caillou, chou, genou, hibou, joujou, pou)." },
    { question: "Combien y a-t-il de lettres dans l'alphabet français ?", answers: ["24", "25", "26", "28"], correct: 2, info: "L'alphabet français utilise les 26 lettres de l'alphabet latin de base." },
    { question: "Quel est le participe passé du verbe 'résoudre' ?", answers: ["Résolu", "Résoudra", "Résous", "Résolvant"], correct: 0, info: "On dit 'j'ai résolu ce problème' (et non pas 'résous')." },
    { question: "Dans la phrase 'Les pommes que j'ai mangées', pourquoi 'mangées' s'accorde-t-il ?", answers: ["Car le sujet est après", "Car le COD est placé avant l'auxiliaire avoir", "Car le verbe est à l'imparfait", "Il ne s'accorde pas"], correct: 1, info: "Avec l'auxiliaire avoir, le participe passé s'accorde avec le COD s'il est placé devant le verbe ('que' mis pour 'les pommes')." },
    { question: "Quel est le synonyme du mot 'éphémère' ?", answers: ["Éternel", "Durable", "Fugace", "Lourd"], correct: 2, info: "Un événement éphémère est quelque chose qui ne dure que très peu de temps." },
    { question: "Quel mot est un antonyme de 'sombre' ?", answers: ["Obscur", "Lumineux", "Ténébreux", "Opaque"], correct: 1, info: "Un antonyme désigne un mot de sens contraire." },
    { question: "Parmi ces mots, lequel est un pléonasme ?", answers: ["Monter en haut", "Grand arbre", "Courir vite", "Regarder attentivement"], correct: 0, info: "Monter implique déjà le fait d'aller vers le haut, ajouter 'en haut' est une redondance inutile." },
    { question: "Quelle est la figure de style utilisée dans : 'Je me meurs, je suis mort, je suis enterré' ?", answers: ["Une métaphore", "Une hyperbole", "Un oxymore", "Une anaphore"], correct: 1, info: "L'hyperbole consiste à exagérer fortement la réalité pour accentuer une idée." },
    { question: "Comment s'appelle un mot qui se lit de la même façon de gauche à droite et de droite à gauche (ex: 'radar') ?", answers: ["Un anagramme", "Un acronyme", "Un palindrome", "Un homonyme"], correct: 2, info: "'KAYAK', 'RESSASSER' ou 'RADAR' sont des exemples célèbres de palindromes." },
    { question: "Quelle est la nature du mot 'lentement' ?", answers: ["Adjectif", "Adverbe", "Nom commun", "Verbe"], correct: 1, info: "Les mots se terminant par '-ment' sont généralement des adverbes de manière." },
    { question: "Combien de notes de musique de base composent la gamme diatonique ?", answers: ["5", "7", "8", "12"], correct: 1, info: "Il y a 7 notes de base : Do, Ré, Mi, Fa, Sol, La, Si." },
    { question: "Quel groupe de rock britannique a chanté 'Bohemian Rhapsody' ?", answers: ["The Beatles", "Rolling Stones", "Queen", "Pink Floyd"], correct: 2, info: "Chantée par Freddie Mercury, cette chanson mythique est sortie en 1975." },
    { question: "Quel instrument à cordes frottées est le plus petit et le plus aigu de son ensemble ?", answers: ["Le Violoncelle", "L'Alto", "Le Violon", "La Contrebasse"], correct: 2, info: "Le violon est le plus petit instrument de la famille des cordes frottées." },
    { question: "Quel chanteur américain était surnommé le 'Roi de la Pop' ?", answers: ["Elvis Presley", "Prince", "Michael Jackson", "Stevie Wonder"], correct: 2, info: "Michael Jackson a marqué l'histoire de la musique avec l'album 'Thriller', le plus vendu de tous les temps." },
    { question: "Quel style de musique est né à La Nouvelle-Orléans au début du XXe siècle ?", answers: ["Le Rock'n'Roll", "Le Jazz", "Le Reggae", "La Techno"], correct: 1, info: "Le Jazz est né du croisement entre le blues, les spirituals et la musique européenne." },
    { question: "Quel est le groupe de K-POP le plus connu dans le monde ?", answers: ["Stray Kids", "BTS", "SEVENTEEN", "BlackPink"], correct: 1, info: " Ce groupe composé de 7 membres Sud-Coréen a participé au Show de la mi-temps de la finale de la Coupe du Monde 2026." },
    { question: "Qui a peint 'La Jeune Fille à la perle' ?", answers: ["Vermeer", "Rembrandt", "Van Gogh", "Da Vinci"], correct: 0, info: "Ce chef-d'œuvre a été peint par le Néerlandais Johannes Vermeer vers 1665." },
    { question: "Comment se nomme la monnaie du Japon ?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, info: "Le Yen est la monnaie officielle du Japon depuis 1871." },
    { question: "Combien de dents un adulte possède-t-il en général (dents de sagesse incluses) ?", answers: ["28", "30", "32", "36"], correct: 2, info: "Une dentition adulte complète comporte 32 dents : 8 incisives, 4 canines, 8 prémolaires et 12 molaires." },
    { question: "En quelle année le Titanic a-t-il coulé ?", answers: ["1912", "1905", "1918", "1923"], correct: 0, info: "Le Titanic a heurté un iceberg dans la nuit du 14 au 15 avril 1912 lors de son voyage inaugural." },
    { question: "Quel est l'élément chimique représenté par le symbole 'O' ?", answers: ["Or", "Oxygène", "Osmium", "Ozone"], correct: 1, info: "L'oxygène constitue environ 21% de l'air que nous respirons sur Terre." },
    { question: "Qui a peint la Joconde ?", answers: ["Vincent van Gogh", "Claude Monet", "Léonard de Vinci", "Pablo Picasso"], correct: 2, info: "Léonard de Vinci a commencé à peindre La Joconde au début du XVIe siècle." },
    { question: "Quel est le plus long fleuve du monde ?", answers: ["Le Nil", "L'Amazone", "Le Mississippi", "Le Yangtze"], correct: 1, info: "L'Amazone est le fleuve le plus long (environ 6 992 km) et le plus puissant en terme de débit." },
    { question: "Combien d'os compte le corps humain adulte ?", answers: ["206", "300", "150", "250"], correct: 0, info: "À la naissance, les bébés ont environ 270 os, mais beaucoup fusionnent en grandissant pour atteindre 206." },
    { question: "Dans quel pays se trouvent les Pyramides de Gizeh ?", answers: ["Mexique", "Égypte", "Pérou", "Grèce"], correct: 1, info: "Ces pyramides ont été construites sous la IVe dynastie égyptienne, il y a plus de 4 500 ans." },
    { question: "Quel est l'oiseau le plus rapide du monde en piqué ?", answers: ["L'Aigle royal", "Le Faucon pèlerin", "Le Colibri", "Le Martinet"], correct: 1, info: "Le Faucon pèlerin peut dépasser les 380 km/h lorsqu'il fonce en piqué sur sa proie." },
    { question: "Quel est l'animal terrestre le plus rapide au monde ?", answers: ["Le Lion", "Le Guépard", "La Gazelle", "Le Léopard"], correct: 1, info: "Le guépard peut atteindre des vitesses de pointe d'environ 110 à 120 km/h sur de courtes distances." },
    { question: "Quelle est la capitale du Japon ?", answers: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct: 2, info: "Le grand Tokyo est la zone urbaine la plus peuplée au monde avec plus de 37 millions d'habitants." },
    { question: "Quel organe filtre le sang pour produire l'urine ?", answers: ["Le Foie", "Les Rois", "Le Poumon", "La Rate"], correct: 1, info: "Les reins filtrent environ 180 litres de sang par jour pour éliminer les déchets métaboliques." },
    { question: "Quelle est la devise monétaire officielle du Royaume-Uni ?", answers: ["L'Euro", "Le Dollar", "La Livre Sterling", "Le Franc"], correct: 2, info: "La livre sterling est l'une des plus anciennes monnaies encore utilisées dans le monde." },
    { question: "Quel est le plus petit continent de la Terre par sa superficie ?", answers: ["L'Europe", "L'Océanie", "L'Antarctique", "L'Afrique"], correct: 1, info: "L'Océanie couvre environ 8,5 millions de km²." },
    { question: "Qui est le créateur du système d'exploitation Windows ?", answers: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], correct: 1, info: "Bill Gates a fondé Microsoft avec Paul Allen en 1975." },
    { question: "Quel est le nombre pi (π) arrondi à deux decimales ?", answers: ["3,12", "3,14", "3,16", "3,18"], correct: 1, info: "Pi est une constante mathématique irrationnelle approximée par 3,14159..." },
    { question: "Combien de côtés possède un octogone ?", answers: ["6", "7", "8", "10"], correct: 2, info: "Un octogone a 8 côtés et 8 angles." },
    { question: "Quelle est la plus grande forêt tropicale de la planète ?", answers: ["La forêt du Congo", "L'Amazonie", "La forêt de Taïga", "La forêt de Bornéo"], correct: 1, info: "L'Amazonie abrite environ 10% de la biodiversité connue dans le monde." },
    { question: "Qui a réalisé le film 'Titanic' et 'Avatar' ?", answers: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Quentin Tarantino"], correct: 2, info: "James Cameron détient plusieurs records du box-office mondial grâce à ces deux films." },
    { question: "Combien de cœurs possède une pieuvre ?", answers: ["1", "2", "3", "4"], correct: 2, info: "Une pieuvre possède 3 cœurs : deux pour irriguer les branchies et un pour le reste du corps." },
    { question: "En quelle année a eu lieu la Révolution Française ?", answers: ["1789", "1799", "1815", "1776"], correct: 0, info: "La prise de la Bastille le 14 juillet 1789 est un événement emblématique de cette révolution." },
    { question: "Quel est le dessert traditonnel italien à base de café et de mascarpone ?", answers: ["Le Panna Cotta", "Le Tiramisu", "Le Cannoli", "Le Gelato"], correct: 1, info: "'Tiramisù' signifie littéralement 'redonne-moi du peps' ou 'remonte-moi le moral' en italien." },
    { question: "Quel est l'instrument à vent le plus grand de l'orchestre symphonique ?", answers: ["La Flûte traversière", "Le Tuba", "Le Claricorne", "Le Trombone"], correct: 1, info: "Le tuba est le membre le plus grave et le plus massif de la famille des cuivres." },
    { question: "Combien de couleurs contient un arc-en-ciel traditionnel ?", answers: ["5", "6", "7", "8"], correct: 2, info: "Isaac Newton a identifié 7 couleurs : rouge, orange, jaune, vert, bleu, indigo et violet." },
    { question: "Qui est le dieu grec de la mer ?", answers: ["Zeus", "Poséidon", "Hadès", "Ares"], correct: 1, info: "Son équivalent dans la mythologie romaine est le dieu Neptune." },
    { question: "Quelle vitamine est principalement synthétisée par le corps grâce à l'exposition au soleil ?", answers: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine K"], correct: 2, info: "Les rayons UVB du soleil transforment le cholestérol de la peau en vitamine D." },
    { question: "Quel pays est surnommé 'Le pays du soleil levant' ?", answers: ["La Chine", "Le Japon", "La Corée du Sud", "La Thaïlande"], correct: 1, info: "Ce surnom provient du fait que le Japon se situe à l'est de la Chine continentale." },
    { question: "Dans quel sport s'est illustré Michael Jordan ?", answers: ["Le Baseball", "Le Basketball", "Le Football Américain", "L'Athlétisme"], correct: 1, info: "Considéré comme l'un des plus grands sportifs de tous les temps, il a remporté 6 titres NBA avec les Chicago Bulls." },
    { question: "Quel auteur français a écrit 'Les Misérables' ?", answers: ["Émile Zola", "Victor Hugo", "Gustave Flaubert", "Molière"], correct: 1, info: "Ce roman monumental publié en 1862 décrit la vie de miséreux dans le Paris du XIXe siècle." },
    { question: "Combien de semaines y a-t-il dans une année civile classique ?", answers: ["48", "50", "52", "54"], correct: 2, info: "Une année compte 365 jours, soit 52 semaines complètes plus 1 jour (ou 2 en année bissextile)." },
    { question: "Quel célèbre physicien a développé la théorie de la relativité ?", answers: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Stephen Hawking"], correct: 1, info: "Sa célèbre formule E=mc² décrit l'équivalence entre la masse et l'énergie." },
    { question: "Quelle est la capitale du Canada ?", answers: ["Toronto", "Montréal", "Ottawa", "Vancouver"], correct: 2, info: "Ottawa a été choisie par la reine Victoria en 1857 pour des raisons stratégiques et linguistiques." },
    { question: "Quelle est la boisson la plus consommée au monde après l'eau ?", answers: ["Le Café", "Le Thé", "Le Coca-Cola", "La Bière"], correct: 1, info: "Des milliards de tasses de thé sont bues chaque jour à travers le globe." },
    { question: "Quel élément chimique a pour symbole 'Fe' ?", answers: ["Le Fluor", "Le Fer", "Le Francium", "L'Étain"], correct: 1, info: "Le symbole vient du mot latin pour le fer : 'Ferrum'." },
    { question: "Combien y a-t-il d'os chez un adulte ?", answers: ["186", "206", "226", "256"], correct: 1, info: "Le squelette d'un adulte compte 206 os. À la naissance, les bébés en ont environ 270." },
    { question: "Comment s'appelle la planète la plus chaude ?", answers: ["Mercure", "Vénus", "Mars", "Jupiter"], correct: 1, info: "Vénus est la plus chaude (460°C) car son atmosphère épaisse de CO2 piège la chaleur." },
    { question: "Qui a découvert la pénicilline ?", answers: ["Curie", "Pasteur", "Fleming", "Einstein"], correct: 2, info: "Alexander Fleming a découvert le premier antibiotique par erreur en 1928." },
    { question: "Quelle est la langue la plus parlée dans le monde (nombre total) ?", answers: ["Anglais", "Espagnol", "Mandarin", "Hindi"], correct: 0, info: "L'anglais est la langue la plus parlée au monde avec plus de 1,4 milliard de locuteurs." },
    { question: "Dans quel océan se trouve Madagascar ?", answers: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 1, info: "Madagascar est située au large de l'Afrique de l'Est, dans l'océan Indien." },
    { question: "Comment s'appelle le sommet le plus haut du monde ?", answers: ["K2", "Mont Blanc", "Annapurna", "Everest"], correct: 3, info: "Situé dans l'Himalaya, le mont Everest culmine à 8 848 mètres d'altitude." },
    { question: "Quel est le numéro atomique de l'Hydrogène ?", answers: ["1", "2", "10", "12"], correct: 0, info: "L'Hydrogène est l'élément le plus simple de l'univers, avec un seul proton." },
    { question: "Sous quel nom est connue la cité ensevelie par le Vésuve ?", answers: ["Rome", "Athènes", "Pompéi", "Carthage"], correct: 2, info: "En l'an 79 après J.-C., l'éruption du Vésuve a figé la ville de Pompéi sous les cendres." },
    { question: "Parmi les propositions suivantes, quel oiseau ne peut pas voler ?", answers: ["Aigle", "Autruche", "Perroquet", "Faucon"], correct: 1, info: "L'autruche est le plus grand des oiseaux. Elle peut courir jusqu'à 70 km/h." },
    { question: "À quelle vitesse la lumière se propage-t-elle ?", answers: ["150k km/s", "300k km/s", "500k km/s", "1M km/s"], correct: 1, info: "La lumière voyage à environ 300 000 kilomètres par seconde." },
    { question: "Comment s'appelle le plus grand désert chaud du monde ?", answers: ["Gobi", "Sahara", "Atacama", "Kalahari"], correct: 1, info: "Le Sahara couvre 9 millions de km², soit presque la taille des États-Unis." },
    { question: "Sous quel nom connaît-on le principal inventeur du téléphone ?", answers: ["Edison", "Tesla", "Graham Bell", "Newton"], correct: 2, info: "Alexander Graham Bell a déposé le premier brevet pour un téléphone électrique en 1876." },
    { question: "Quelle est la capitale de l'Italie ?", answers: ["Milan", "Florence", "Rome", "Naples"], correct: 2, info: "Surnommée la 'Ville Éternelle', Rome abrite en son sein le Vatican." },
    { question: "Quel est le plus petit pays du monde ?", answers: ["Monaco", "Vatican", "Malte", "San Marin"], correct: 1, info: "Le Vatican ne fait que 0,44 km²." },
    { question: "Comment se nomme la mer qui se situe entre Jordanie et Israël ?", answers: ["Mer Rouge", "Mer Noire", "Mer Morte", "Méditerranée"], correct: 2, info: "La Mer Morte est si salée qu'elle permet aux humains de flotter sans effort." },
    { question: "Qui a peint la Chapelle Sixtine ?", answers: ["Picasso", "Michel-Ange", "Raphaël", "Donatello"], correct: 1, info: "Michel-Ange a mis quatre ans pour peindre les fresques du plafond." },
    { question: "Lequel de ces fruits est le plus produit au monde ?", answers: ["Banane", "Pomme", "Tomate", "Orange"], correct: 2, info: "La tomate est botaniquement un fruit. C'est la culture la plus produite sur Terre." },
    { question: "Comment s'appelle l'élément le plus abondant dans l'Univers ?", answers: ["Oxygène", "Carbone", "Hydrogène", "Azote"], correct: 2, info: "L'Hydrogène représente environ 75% de la masse de l'univers." },
    { question: "Quand a débuté la 1ère Guerre mondiale ?", answers: ["1912", "1914", "1916", "1918"], correct: 1, info: "Le conflit a été déclenché en juillet 1914 suite à l'attentat de Sarajevo." },
    { question: "Qui a réalisé 'Inception' ?", answers: ["Spielberg", "Tarantino", "Nolan", "Scorsese"], correct: 2, info: "Christopher Nolan a réalisé ce film complexe sur les rêves en 2010." },
    { question: "Dans quel pays se situe le Taj Mahal ?", answers: ["Pakistan", "Inde", "Thaïlande", "Iran"], correct: 1, info: "Ce mausolée de marbre blanc se situe à Agra, en Inde." },
    { question: "Comment s'appelle la capitale du Brésil ?", answers: ["Rio", "Sao Paulo", "Brasilia", "Salvador"], correct: 2, info: "Brasilia est une ville planifiée inaugurée en 1960." },
    { question: "Quel est le plus grand animal terrestre ?", answers: ["Girafe", "Éléphant", "Rhinocéros", "Hippopotame"], correct: 1, info: "L'éléphant d'Afrique peut peser jusqu'à 6 tonnes." },
    { question: "Qui a écrit la tragédie 'Roméo et Juliette' ?", answers: ["Molière", "Shakespeare", "Dante", "Goethe"], correct: 1, info: "William Shakespeare a écrit cette tragédie à la fin du XVIe siècle." },
    { question: "Quel est le principal composant du verre ?", answers: ["Sable", "Argile", "Calcaire", "Plomb"], correct: 0, info: "Le verre est fabriqué en faisant fondre du sable de silice à très haute température." },
    { question: "Quelle est la capitale de l'Espagne ?", answers: ["Barcelone", "Séville", "Madrid", "Valence"], correct: 2, info: "Madrid est située en plein cœur géographique du pays." },
    { question: "Comment se nomme le métal le plus utilisé ?", answers: ["Or", "Aluminium", "Fer", "Cuivre"], correct: 2, info: "Le fer est le métal le plus utilisé, principalement pour produire de l'acier." },
    { question: "Combien y a-t-il de secondes dans une heure ?", answers: ["1200", "2400", "3600", "4800"], correct: 2, info: "Le calcul est simple : 60 minutes x 60 secondes = 3600." },
    { question: "Quel artiste a sculpté le 'Penseur' ?", answers: ["Rodin", "Bernini", "Canova", "Donatello"], correct: 0, info: "Auguste Rodin a créé cette statue de bronze en 1880." },
    { question: "Lequel de ces pays a inventé les pâtes ?", answers: ["Italie", "Chine", "Grèce", "Égypte"], correct: 1, info: "Les plus vieilles traces de nouilles ont été découvertes en Chine (4 000 ans)." },
    { question: "Quel est le nom du fleuve qui traverse Paris ?", answers: ["Loire", "Rhône", "Seine", "Garonne"], correct: 2, info: "La Seine divise Paris en deux : la Rive Droite et la Rive Gauche." },
    { question: "Quel est le plus grand mammifère marin ?", answers: ["Requin baleine", "Baleine bleue", "Orque", "Cachalot"], correct: 1, info: "La baleine bleue (ou Rorqual bleu) peut atteindre 30 mètres et 180 tonnes." },
    { question: "Comment s'appelle le dieu grec de la foudre ?", answers: ["Hadès", "Poséidon", "Zeus", "Apollon"], correct: 2, info: "Zeus est le roi des dieux dans la mythologie grecque." },
    { question: "Quel gaz est majoritaire dans l'air ?", answers: ["Oxygène", "Argon", "Azote", "Hélium"], correct: 2, info: "L'air est composé à 78% d'azote et à 21% d'oxygène." },
    { question: "Quelle est la capitale de l'Égypte ?", answers: ["Alexandrie", "Louxor", "Le Caire", "Gizeh"], correct: 2, info: "Le Caire est situé à proximité des pyramides de Gizeh." },
    { question: "En quel mois commence l'Oktoberfest ?", answers: ["Août", "Septembre", "Octobre", "Novembre"], correct: 1, info: "La fête de la bière commence en septembre mais se termine en octobre." },
    { question: "Qui est l'inventeur de l'imprimerie ?", answers: ["Gutenberg", "Léonard", "Franklin", "Newton"], correct: 0, info: "Gutenberg a inventé les caractères mobiles vers 1440." },
    { question: "Quelle est la capitale de la Russie ?", answers: ["Pétersbourg", "Moscou", "Kiev", "Novosibirsk"], correct: 1, info: "Moscou abrite le célèbre Kremlin et la place Rouge." },
    { question: "Quelle est l'étoile la plus proche de la Terre ?", answers: ["Sirius", "Proxima", "Soleil", "Vega"], correct: 2, info: "Le Soleil est notre étoile, située à 150 millions de km." },
    { question: "Qui a peint les 'Nymphéas' ?", answers: ["Manet", "Monet", "Renoir", "Degas"], correct: 1, info: "Claude Monet a peint cette série dans son jardin à Giverny." },
    { question: "Dans quel pays la Tour de Pise se situe-t-elle ?", answers: ["Espagne", "Grèce", "Italie", "France"], correct: 2, info: "La tour penchée se situe à Pise, en Toscane (Italie)." },
    { question: "Qui a écrit 'Le Petit Prince' ?", answers: ["Proust", "Saint-Exupéry", "Camus", "Sartre"], correct: 1, info: "Antoine de Saint-Exupéry a publié ce conte poétique en 1943." },
    { question: "Quel pays a remporté la Coupe du Monde de football en 2018 ?", answers: ["Brésil", "Allemagne", "France", "Argentine"], correct: 2, info: "La France a battu la Croatie 4-2 en finale à Moscou pour décrocher sa deuxième étoile." },
    { question: "Quel joueur détient le record du nombre de Ballons d'Or ?", answers: ["Cristiano Ronaldo", "Lionel Messi", "Johan Cruyff", "Michel Platini"], correct: 1, info: "Lionel Messi a remporté 8 Ballons d'Or au cours de sa carrière." },
    { question: "Quel club a remporté le plus de Ligues des Champions UEFA ?", answers: ["FC Barcelone", "Bayern Munich", "AC Milan", "Real Madrid"], correct: 3, info: "Le Real Madrid domine largement la compétition avec plus de 14 titres." },
    { question: "Combien de temps dure un match de football réglementaire (hors prolongations) ?", answers: ["80 minutes", "90 minutes", "100 minutes", "60 minutes"], correct: 1, info: "Un match se divise en deux mi-temps de 45 minutes, hors temps additionnel." },
    { question: "Quel pays a accueilli la Coupe du Monde en 2014 ?", answers: ["Afrique du Sud", "Russie", "Brésil", "Qatar"], correct: 2, info: "L'Allemagne a remporté cette édition historique organisée sur le sol brésilien." },
    { question: "Dans quel club brésilien Pelé a-t-il passé la majeure partie de sa carrière ?", answers: ["Flamengo", "Santos FC", "Palmeiras", "São Paulo FC"], correct: 1, info: "Pelé a joué près de 20 ans au Santos FC avant de terminer sa carrière au Cosmos de New York." },
    { question: "Quel joueur international est surnommé 'CR7' ?", answers: ["Cristiano Ronaldo", "Ronaldo Nazário", "Ronaldinho", "Karim Benzema"], correct: 0, info: "Ce surnom associe ses initiales à son numéro de maillot fétiche, le 7." },
    { question: "Quelle nation a remporté la toute première Coupe du Monde en 1930 ?", answers: ["Argentine", "Uruguay", "Italie", "Brésil"], correct: 1, info: "L'Uruguay a remporté la première édition à domicile en battant l'Argentine en finale." },
    { question: "Dans quelle équipe nationale joue Kylian Mbappé ?", answers: ["L'Équipe de France", "L'Équipe d'Espagne", "L'Équipe du Cameroun", "L'Équipe d'Algérie"], correct: 0, info: "Il a fait ses débuts en équipe de France A en mars 2017." },
    { question: "Quel est le jeu vidéo le plus vendu de tous les temps ?", answers: ["Tetris", "Minecraft", "GTA V", "Wii Sports"], correct: 1, info: "Minecraft dépasse les 300 millions d'exemplaires vendus à travers le monde." },
    { question: "Quel personnage est la mascotte officielle de Nintendo ?", answers: ["Link", "Donkey Kong", "Mario", "Pikachu"], correct: 2, info: "Créé par Shigeru Miyamoto, Mario est apparu pour la première fois en 1981 dans Donkey Kong." },
    { question: "Dans quelle franchise de jeu vidéo incarne-t-on le personnage de Link ?", answers: ["Final Fantasy", "The Legend of Zelda", "Dragon Quest", "Fire Emblem"], correct: 1, info: "Le héros vêtu de vert cherche toujours à sauver la princesse Zelda et le royaume d'Hyrule." },
    { question: "Quel jeu de Battle Royale phénomène a été développé par Epic Games ?", answers: ["PUBG", "Apex Legends", "Fortnite", "Warzone"], correct: 2, info: "Sorti en 2017, Fortnite est devenu un véritable phénomène culturel mondial." },
    { question: "Quel est le nom du hérisson bleu mascotte de SEGA ?", answers: ["Shadow", "Sonic", "Tails", "Knuckles"], correct: 1, info: "Sonic a été conçu en 1991 pour rivaliser directement avec le succès de Mario chez Nintendo." },
    { question: "Sur quelle console la série de jeux 'Uncharted' a-t-elle fait ses débuts ?", answers: ["PlayStation 2", "PlayStation 3", "Xbox 360", "PlayStation 4"], correct: 1, info: "Uncharted: Drake's Fortune est sorti en 2007 sur PlayStation 3." },
    { question: "Quelle est la capitale de l'Allemagne ?", answers: ["Munich", "Francfort", "Hambourg", "Berlin"], correct: 3, info: "Berlin est la capitale de l'Allemagne réunifiée depuis 1990." },
    { question: "Quelle est la capitale du Portugal ?", answers: ["Lisbonne", "Porto", "Faro", "Coimbra"], correct: 0, info: "Lisbonne est l'une des plus vieilles villes d'Europe." },
    { question: "Quelle planète est surnommée 'Planète rouge' ?", answers: ["Vénus", "Mars", "Saturne", "Neptune"], correct: 1, info: "Mars doit sa couleur à l'oxyde de fer (rouille) à sa surface." },
    { question: "Qui a peint 'La Cène' ?", answers: ["Michel-Ange", "Da Vinci", "Raphaël", "Titien"], correct: 1, info: "Léonard de Vinci a réalisé cette fresque célèbre à Milan." },
    { question: "Quel est le seul métal liquide à température ambiante ?", answers: ["Plomb", "Mercure", "Étain", "Argent"], correct: 1, info: "Le mercure est le seul métal liquide à température ambiante." },
    { question: "Quelle est la formule chimique de l'eau ?", answers: ["CO2", "O2", "H2O", "N2"], correct: 2, info: "H2O signifie 2 atomes d'hydrogène pour 1 d'oxygène." },
    { question: "Quel est l'océan le plus grand du monde ?", answers: ["Atlantique", "Indien", "Arctique", "Pacifique"], correct: 3, info: "Le Pacifique couvre un tiers de la surface de la Terre." },
    { question: "Qui a écrit la saga 'Harry Potter' ?", answers: ["Tolkien", "Martin", "J.K. Rowling", "King"], correct: 2, info: "J.K. Rowling a écrit le premier tome 'À l'école des sorciers' en 1997." },
    { question: "Quelle est la capitale de la Grèce ?", answers: ["Athènes", "Thessalonique", "Patras", "Héraklion"], correct: 0, info: "Athènes est considérée comme le berceau de la démocratie." },
    { question: "Quelle est la dernière lettre de l'alphabet grec ?", answers: ["Alpha", "Zeta", "Omega", "Psi"], correct: 2, info: "Omega (Ω) est la 24ème et dernière lettre de cet alphabet." },
    { question: "Quelle est la capitale de l'Inde ?", answers: ["Mumbai", "Calcutta", "New Delhi", "Bangalore"], correct: 2, info: "New Delhi est la capitale administrative de l'Inde." },
    { question: "Quel sport Roger Federer pratiquait-il ?", answers: ["Football", "Tennis", "Golf", "Basket"], correct: 1, info: "Federer a remporté 20 tournois du Grand Chelem." },
    { question: "Qui a découvert l'Amérique ?", answers: ["Magellan", "Gama", "Colomb", "Vespucci"], correct: 2, info: "Christophe Colomb a atteint les Bahamas en 1492." },
    { question: "Quel organe du corps humain filtre le sang ?", answers: ["Foie", "Pancréas", "Reins", "Rate"], correct: 2, info: "Les reins filtrent environ 200 litres de sang par jour." },
    { question: "Quelle est la capitale de la Belgique ?", answers: ["Bruges", "Anvers", "Gand", "Bruxelles"], correct: 3, info: "Bruxelles est aussi le siège de l'Union Européenne." },
    { question: "Combien y a-t-il de continents ?", answers: ["5", "6", "7", "8"], correct: 2, info: "On en compte 7 : Afrique, Antarctique, Asie, Europe, Océanie, Amérique du Nord et du Sud." },
    { question: "Quelle couleur obtient-on en mélangeant du bleu et du jaune ?", answers: ["Violet", "Vert", "Orange", "Marron"], correct: 1, info: "Le vert est une couleur secondaire obtenue avec ces deux primaires." },
    { question: "Quelle est la capitale de la Turquie ?", answers: ["Istanbul", "Ankara", "Izmir", "Antalya"], correct: 1, info: "Ankara a été choisie comme capitale en 1923." },
    { question: "Quel est le surnom de la ville de New York ?", answers: ["Big Apple", "Windy City", "Sin City", "Angels"], correct: 0, info: "The Big Apple est devenu son surnom officiel dans les années 20." },
    { question: "Comment s'appelle la monnaie du Royaume-Uni ?", answers: ["Euro", "Dollar", "Livre Sterling", "Yen"], correct: 2, info: "La Livre Sterling est l'une des plus vieilles monnaies au monde." },
    { question: "Quelle est la capitale de la Corée du Sud ?", answers: ["Busan", "Incheon", "Daegu", "Séoul"], correct: 3, info: "Séoul abrite environ 10 millions d'habitants." },
    { question: "Combien de pattes possède une araignée ?", answers: ["6", "8", "10", "12"], correct: 1, info: "Les araignées sont des arachnides, elles ont donc 8 pattes." },
    { question: "Comment s'appelle le fondateur de Facebook ?", answers: ["Gates", "Jobs", "Zuckerberg", "Musk"], correct: 2, info: "Mark Zuckerberg l'a lancé depuis Harvard en 2004." },
    { question: "Quelle est la capitale du Mexique ?", answers: ["Guadalajara", "Monterrey", "Mexico City", "Cancun"], correct: 2, info: "Mexico est l'une des plus grandes villes du monde." },
    { question: "Combien y a-t-il de planètes dans notre système solaire ?", answers: ["7", "8", "9", "10"], correct: 1, info: "Il y en a 8 depuis que Pluton est classée comme planète naine." },
    { question: "Quel auteur a créé la pièce de théâtre 'Hamlet' ?", answers: ["Dante", "Shakespeare", "Goethe", "Verne"], correct: 1, info: "Cette pièce célèbre contient la réplique 'Être ou ne pas être'." },
    { question: "Quelle est la capitale de la Suède ?", answers: ["Oslo", "Copenhague", "Stockholm", "Helsinki"], correct: 2, info: "Stockholm est construite sur 14 îles reliées par des ponts." },
    { question: "De quel instrument joue Sherlock Holmes ?", answers: ["Piano", "Violon", "Flûte", "Harpe"], correct: 1, info: "Le célèbre détective joue du violon pour réfléchir." },
    { question: "Quel est le plus haut sommet d'Europe ?", answers: ["Mont Blanc", "Elbrouz", "Etna", "Olympe"], correct: 1, info: "L'Elbrouz (Caucase) est le plus haut sommet géographique d'Europe." },
    { question: "Qui a peint 'Guernica' ?", answers: ["Dalí", "Miró", "Picasso", "Goya"], correct: 2, info: "Picasso a peint cette œuvre pour dénoncer la guerre civile espagnole." },
    { question: "Quelle est la capitale de la Thaïlande ?", answers: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya"], correct: 0, info: "Bangkok est célèbre pour ses temples et son animation." },
    { question: "Quelle est la langue officielle du Brésil ?", answers: ["Espagnol", "Portugais", "Brésilien", "Français"], correct: 1, info: "Le Brésil est le seul pays lusophone d'Amérique latine." },
    { question: "Combien de joueurs composent une équipe de football sur le terrain ?", answers: ["7", "9", "11", "13"], correct: 2, info: "Le foot se joue à 11 contre 11 sur le terrain." },
    { question: "Quelle est la capitale de l'Argentine ?", answers: ["Cordoba", "Rosario", "Buenos Aires", "Mendoza"], correct: 2, info: "Buenos Aires est le berceau du tango." },
    { question: "Dans quelle ville se trouve la Cité Interdite ?", answers: ["Kyoto", "Séoul", "Pékin", "Bangkok"], correct: 2, info: "Elle se trouve au cœur de Pékin, en Chine." },
    { question: "Qui a créé le vaccin contre la rage ?", answers: ["Fleming", "Pasteur", "Koch", "Jenner"], correct: 1, info: "Louis Pasteur l'a mis au point en 1885." },
    { question: "Quelle est la capitale de l'Irlande ?", answers: ["Belfast", "Cork", "Galway", "Dublin"], correct: 3, info: "Dublin est située à l'embouchure de la rivière Liffey." },
    { question: "Quelle est la capitale de la Suisse ?", answers: ["Zurich", "Genève", "Berne", "Bâle"], correct: 2, info: "Berne est la ville fédérale de la Suisse." },
    { question: "Quel pays a remporté la Coupe du Monde de football en 2010 ?", answers: ["Espagne", "Pays-Bas", "Allemagne", "Brésil"], correct: 0, info: "L'Espagne a gagné grâce à un but d'Andrés Iniesta à la 116ème minute contre les Pays-Bas." },
    { question: "Qui est l'auteur de '1984' ?", answers: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Albert Camus"], correct: 0, info: "George Orwell a écrit ce roman en 1948." },
    { question: "Dans quel pays se trouve la ville de Tombouctou ?", answers: ["Mali", "Sénégal", "Niger", "Algérie"], correct: 0, info: "Ancienne plaque tournante du commerce transsaharien, elle est classée au patrimoine mondial de l'UNESCO." },
    { question: "Quel est le film le plus récompensé aux Oscars (11 statuettes) ?", answers: ["Titanic", "Avatar", "Le Parrain", "La Liste de Schindler"], correct: 0, info: "Titanic partage ce record avec 'Ben-Hur' (1959) et 'Le Seigneur des Anneaux : Le Retour du Roi' (2003)." },
    { question: "Quel gaz les plantes absorbent-elles pour la photosynthèse ?", answers: ["Dioxyde de carbone", "Oxygène", "Azote", "Méthane"], correct: 0, info: "Elles transforment le CO2 et l'eau en glucose grâce à l'énergie de la lumière." },
    { question: "Qui était le dieu grec du commerce ?", answers: ["Hermès", "Apollon", "Arès", "Poséidon"], correct: 0, info: "Hermès était aussi le messager des dieux et le protecteur des voyageurs." },
    { question: "En quel siècle a vécu Jeanne d'Arc ?", answers: ["15ème", "13ème", "17ème", "14ème"], correct: 0, info: "Héroïne française de la guerre de Cent Ans, elle est morte en 1431." },
    { question: "Quel pays possède le plus de pyramides ?", answers: ["Soudan", "Égypte", "Mexique", "Pérou"], correct: 0, info: "Le Soudan en compte environ 220, soit presque le double de l'Égypte !" },
    { question: "Quelle est la distance Terre-Soleil (environ) ?", answers: ["150 millions km", "50 millions km", "300 millions km", "10 millions km"], correct: 0, info: "La lumière du Soleil met environ 8 minutes et 20 secondes pour nous parvenir." },
    { question: "Quelle est la capitale de l'Islande ?", answers: ["Reykjavik", "Oslo", "Helsinki", "Copenhague"], correct: 0, info: "C'est la capitale la plus septentrionale du monde." },
    { question: "Quel pays a offert la Statue de la Liberté aux États-Unis ?", answers: ["France", "Royaume-Uni", "Allemagne", "Italie"], correct: 0, info: "C'était un cadeau pour célébrer le centenaire de la Déclaration d'Indépendance américaine." },
    { question: "Qui est le dieu romain de la guerre ?", answers: ["Mars", "Jupiter", "Neptune", "Vulcain"], correct: 0, info: "Il a donné son nom au mois de mars et à la planète rouge." },
    { question: "Dans quelle galaxie se trouve la Terre ?", answers: ["La Voie Lactée", "Andromède", "Sombrero", "Messier 87"], correct: 0, info: "C'est une galaxie spirale barrée contenant entre 200 et 400 milliards d'étoiles." },
    { question: "Quel est le compositeur de 'La 5ème Symphonie' ?", answers: ["Beethoven", "Mozart", "Bach", "Chopin"], correct: 0, info: "Il a commencé à devenir sourd juste après avoir composé ses premières œuvres majeures." },
    { question: "Quel est l'ingrédient principal du houmous ?", answers: ["Pois chiche", "Lentilles", "Fèves", "Haricots blancs"], correct: 0, info: "Le mot 'houmous' signifie simplement 'pois chiche' en arabe." },
    { question: "Quel est le point culminant de l'Afrique ?", answers: ["Kilimandjaro", "Mont Kenya", "Mont Toubkal", "Everest"], correct: 0, info: "Situé en Tanzanie, c'est un volcan éteint isolé." },
    { question: "Qui a créé le personnage de Sherlock Holmes ?", answers: ["Arthur Conan Doyle", "Agatha Christie", "Edgar Allan Poe", "Maurice Leblanc"], correct: 0, info: "Conan Doyle s'est inspiré d'un de ses professeurs de médecine." },
    { question: "Quelle est la température moyenne sur Terre ?", answers: ["10°C", "15°C", "20°C", "30°C"], correct: 1, info: "L'effet de serre naturel permet de maintenir une moyenne d'environ 15°C." },
    { question: "Quel constructeur automobile produit la célèbre voiture 'Mustang' ?", answers: ["Chevrolet", "Ford", "Dodge", "Tesla"], correct: 1, info: "La Ford Mustang est produite sans interruption par Ford depuis 1964." },
    { question: "Quel constructeur italien a pour emblème un cheval cabré ?", answers: ["Lamborghini", "Maserati", "Ferrari", "Alfa Romeo"], correct: 2, info: "Le symbole provient de l'emblème peint sur l'avion de chasse du pilote italien Francesco Baracca." },
    { question: "Dans quel pays la marque d'automobiles 'Volvo' a-t-elle été fondée ?", answers: ["Allemagne", "Suède", "Japon", "Suisse"], correct: 1, info: "Volvo a été fondée à Göteborg en Suède en 1927 et est célèbre pour ses innovations en sécurité." },
    { question: "Quel célèbre circuit accueille la course d'endurance des '24 Heures' ?", answers: ["Circuit de Spa", "Circuit du Mans", "Circuit de Silverstone", "Circuit de Monza"], correct: 1, info: "Les 24 Heures du Mans existent depuis 1923 et forment la plus ancienne course d'endurance au monde." },
    { question: "Quel constructeur a commercialisé la première voiture produite en grande série, la 'Model T' ?", answers: ["General Motors", "Ford", "Chrysler", "Volkswagen"], correct: 1, info: "Henry Ford a révolutionné l'industrie avec le travail à la chaîne pour la Model T en 1908." },
    { question: "Que signifie le sigle 'SUV' pour un type de voiture ?", answers: ["Super Utility Van", "Sport Utility Vehicle", "Speed Urban Vehicle", "Standard Urban Van"], correct: 1, info: "Le terme désigne un véhicule de loisir bicorps à allure de tout-terrain." },
    { question: "Quelle est la marque automobile allemande surnommée la 'marque aux quatre anneaux' ?", answers: ["BMW", "Mercedes-Benz", "Audi", "Porsche"], correct: 2, info: "Les quatre anneaux représentent la fusion en 1932 de quatre constructeurs allemands (Auto Union)." },
    { question: "Comment s'appelle le fondateur de la marque emblématique 'Porsche' ?", answers: ["Enzo Porsche", "Ferdinand Porsche", "Karl Porsche", "Henry Porsche"], correct: 1, info: "Ferdinand Porsche a créé l'entreprise en 1931 et a également conçu la Coccinelle de Volkswagen." },
    { question: "En quelle année a eu lieu la Révolution française ?", answers: ["1789", "1799", "1804", "1815"], correct: 0, info: "Elle débute en 1789 avec la prise de la Bastille le 14 juillet." },
    { question: "Dans quel pays actuel se trouve le site archéologique de Petra ?", answers: ["Jordanie", "Égypte", "Liban", "Irak"], correct: 0, info: "Petra est une célèbre cité nabatéenne taillée directement dans la roche." },
    { question: "En quelle année a commencé la Première Guerre mondiale ?", answers: ["1912", "1914", "1918", "1939"], correct: 1, info: "Le conflit s'est déclenché au cours de l'été 1914 suite à l'attentat de Sarajevo." },
    { question: "Quel célèbre navigateur a réalisé la première circumnavigation (tour du monde) ?", answers: ["Christophe Colomb", "Fernand de Magellan", "Vasco de Gama", "Jacques Cartier"], correct: 1, info: "Bien que mort en cours de route, son expédition a achevé le premier tour du monde." },
    { question: "Quelle reine d'Égypte antique s'est alliée à Jules César et Marc Antoine ?", answers: ["Nefertiti", "Hatchepsout", "Cléopâtre VII", "Tiyi"], correct: 2, info: "Cléopâtre VII fut la dernière souveraine de la dynastie des Ptolémées." },
    { question: "Quelle éruption volcanique a détruit la ville de Pompéi en 79 apr. J.-C. ?", answers: ["Le Vésuve", "L'Etna", "Le Krakatoa", "Le volcan Pélé"], correct: 0, info: "L'éruption du Vésuve a figé la ville sous une épaisse couche de cendres." },
    { question: "Qui a écrit la Déclaration des Droits de la Femme et de la Citoyenne en 1791 ?", answers: ["Olympe de Gouges", "Madame de Staël", "George Sand", "Louise Michel"], correct: 0, info: "Pionnière du féminisme, elle a milité pour l'égalité sous la Révolution." },
    { question: "Quel Pharaon a vu son tombeau intact découvert en 1922 par Howard Carter ?", answers: ["Ramsès II", "Toutânkhamon", "Khéops", "Akhenaton"], correct: 1, info: "La découverte de son trésor est l'une des plus grandes avancées archéologiques." },
    { question: "Quel traité signé en 1919 a officiellement mis fin à la Première Guerre mondiale ?", answers: ["Traité de Rome", "Traité de Versailles", "Traité d'Utrecht", "Traité de Vienne"], correct: 1, info: "Il a été signé dans la Galerie des Glaces du château de Versailles." },
    { question: "Qui fut le dernier empereur des Français ?", answers: ["Napoléon Ier", "Napoléon II", "Napoléon III", "Louis-Philippe Ier"], correct: 2, info: "Napoléon III a régné pendant le Second Empire jusqu'en 1870." },
    { question: "Sur quelle île l'empereur Napoléon Ier est-il mort en exil ?", answers: ["Élbe", "Sainte-Hélène", "Corse", "Majorque"], correct: 1, info: "Il y est décédé en 1821 après son exil imposé par les Britanniques." },
    { question: "Quel mur séparait les blocs de l'Est et de l'Ouest à Berlin jusqu'en 1989 ?", answers: ["Le Mur de fer", "Le Mur de Berlin", "La Ligne Maginot", "Le Mur d'Hadrien"], correct: 1, info: "Construit en 1961, il symbolisait la séparation durant la Guerre Froide." },
    { question: "Quel nom portait l'ancienne capitale de l'Empire romain d'Orient ?", answers: ["Constantinople", "Athènes", "Alexandrie", "Carthage"], correct: 0, info: "Renommée Istanbul plus tard, elle a été fondée par l'empereur Constantin." },
    { question: "Qui a dirigé la France pendant la majeure partie de la Seconde Guerre mondiale depuis Londres ?", answers: ["Jean Moulin", "Charles de Gaulle", "Philippe Pétain", "Georges Clemenceau"], correct: 1, info: "Il est l'auteur du célèbre appel du 18 juin 1940." },
    { question: "Quel pays détient le plus grand nombre d'îles au monde ?", answers: ["La Norvège", "La Suède", "L'Indonésie", "Les Philippines"], correct: 1, info: "La Suède compte plus de 267 000 îles recensées." },
    { question: "Quel est le plus grand désert chaud du monde ?", answers: ["Le désert de Gobi", "Le Sahara", "Le désert d'Atacama", "Le désert du Kalahari"], correct: 1, info: "Le Sahara couvre plus de 9 millions de kilomètres carrés." },
    { question: "Quel est le plus petit État indépendant du monde en superficie ?", answers: ["Monaco", "Le Vatican", "Saint-Marin", "Nauru"], correct: 1, info: "Le Vatican couvre environ 0,49 $km^2$ au cœur de la ville de Rome." },
    { question: "Quelle est la capitale du Japon ?", answers: ["Osaka", "Kyoto", "Tokyo", "Yokohama"], correct: 2, info: "Tokyo est la métropole la plus peuplée du monde." },
    { question: "Quel détroit sépare l'Espagne du Maroc ?", answers: ["Détroit de Gibraltar", "Détroit du Bosphore", "Détroit de Béring", "Détroit de Messine"], correct: 0, info: "Il fait environ 14 km de large au point le plus étroit." },
    { question: "Quel est le plus grand lac naturel d'eau douce d'Europe ?", answers: ["Le lac Léman", "Le lac Ladoga", "Le lac Balaton", "Le lac Onega"], correct: 1, info: "Situé en Russie, le lac Ladoga couvre plus de 17 000 $km^2$." },
    { question: "Dans quel pays se trouve le mont Fuji ?", answers: ["Chine", "Japon", "Indonésie", "Philippines"], correct: 1, info: "C'est un volcan toujours considéré comme actif et le point culminant du Japon." },
    { question: "Quel est le plus long fleuve d'Europe ?", answers: ["Le Danube", "La Volga", "Le Rhin", "L'Elbe"], correct: 1, info: "La Volga mesure environ 3 530 kilomètres et se jette dans la mer Caspienne." },
    { question: "Quelle est la capitale de la Grèce ?", answers: ["Sparte", "Athènes", "Thessalonique", "Héraklion"], correct: 1, info: "Athènes est l'une des plus anciennes villes du monde encore habitées." },
    { question: "Dans quel pays peut-on visiter les ruines de la cité de Chichén Itzá ?", answers: ["Pérou", "Mexique", "Guatemala", "Colombie"], correct: 1, info: "Cette ancienne cité maya est située dans la péninsule du Yucatán." },
    { question: "Quelle est la capitale de la Chine ?", answers: ["Shanghai", "Guangzhou", "Pékin", "Shenzhen"], correct: 2, info: "Aussi appelée Beijing, elle abrite la Cité Interdite." },
    { question: "Quel pays est le plus grand producteur de café au monde ?", answers: ["Colombie", "Brésil", "Vietnam", "Éthiopie"], correct: 1, info: "Le Brésil produit environ un tiers de l'approvisionnement mondial." },
    { question: "Sur quel continent se situe la chaîne de montagnes de l'Himalaya ?", answers: ["Amérique", "Afrique", "Asie", "Europe"], correct: 2, info: "Elle abrite le mont Everest, le plus haut sommet du monde." },
    { question: "Quel est le plus grand océan de la planète ?", answers: ["Océan Atlantique", "Océan Pacifique", "Océan Indien", "Océan Arctique"], correct: 1, info: "Il couvre un tiers de la surface totale de la Terre." },
    { question: "Quelle est la capitale de l'Italie ?", answers: ["Milan", "Florence", "Naples", "Rome"], correct: 3, info: "Surnommée la Ville Éternelle, elle abrite le Colisée." },
    { question: "Quel symbole chimique désigne l'Or dans le tableau périodique ?", answers: ["Or", "Au", "Ag", "Fe"], correct: 1, info: "Le symbole Au provient du mot latin 'Aurum'." },
    { question: "Quelle particule subatomique possède une charge électrique négative ?", answers: ["Le proton", "Le neutron", "L'électron", "Le quark"], correct: 2, info: "Les électrons gravitent autour du noyau atomique." },
    { question: "Quelle force fondamentale maintient les planètes en orbite ?", answers: ["Le magnétisme", "La gravitation", "La force nucléaire", "La pression"], correct: 1, info: "Isaac Newton a formulé les premières lois de la gravitation." },
    { question: "Quel est le matériau naturel le plus dur au monde ?", answers: ["Le quartz", "Le diamant", "Le titane", "Le saphir"], correct: 1, info: "Le diamant est constitué d'atomes de carbone pur." },
    { question: "Quel instrument sert à mesurer la pression atmosphérique ?", answers: ["Un thermomètre", "Un baromètre", "Un hygromètre", "Un anémomètre"], correct: 1, info: "Le baromètre a été inventé au XVIIe siècle par Torricelli." },
    { question: "Quelle planète de notre système solaire est surnommée la 'planète rouge' ?", answers: ["Vénus", "Mars", "Jupiter", "Mercure"], correct: 1, info: "Sa couleur est due à la présence d'oxyde de fer à sa surface." },
    { question: "Quelle couche de l'atmosphère absorbe la majorité des rayons UV solaires ?", answers: ["La troposphère", "La couche d'ozone", "La thermosphère", "La mésosphère"], correct: 1, info: "L'ozone ($O_3$) joue un rôle de bouclier indispensable à la vie." },
    { question: "Comment s'appelle l'étude des fossiles ?", answers: ["L'archéologie", "La paléontologie", "La géologie", "La biologie"], correct: 1, info: "Elle permet de reconstituer l'histoire de la vie sur Terre." },
    { question: "Quel scientifique a énoncé la théorie de la relativité restreinte et générale ?", answers: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Max Planck"], correct: 1, info: "Albert Einstein a révolutionné notre compréhension de l'espace et du temps." },
    { question: "Quelle particule élémentaire compose la lumière ?", answers: ["Le photon", "Le proton", "Le neutrino", "L'électron"], correct: 0, info: "Le photon est le quantum d'énergie du rayonnement électromagnétique." },
    { question: "Combien d'éléments chimiques composent le tableau périodique actuel ?", answers: ["92", "108", "118", "124"], correct: 2, info: "Il contient 118 éléments confirmés, du plus léger au plus lourd." },
    { question: "Quelle est l'unité de mesure SI de la fréquence d'une onde ?", answers: ["Le Watt", "Le Joule", "Le Hertz", "Le Pascal"], correct: 2, info: "Un Hertz (Hz) correspond à un cycle par seconde." },
    { question: "Quel est le plus long os du squelette humain ?", answers: ["Le tibia", "Le fémur", "L'humérus", "Le péroné"], correct: 1, info: "Le fémur est situé dans la cuisse et résiste à de très fortes pressions." },
    { question: "Combien de cavités (chambres) comprend le cœur humain ?", answers: ["2", "3", "4", "6"], correct: 2, info: "Il est composé de 2 oreillettes et de 2 ventricules." },
    { question: "Quel est le plus petit os du corps humain ?", answers: ["L'étrier", "L'enclume", "Le marteau", "La rotule"], correct: 0, info: "Situé dans l'oreille moyenne, l'étrier ne mesure que 3 mm environ." },
    { question: "Quel pigment donne sa couleur à la peau humaine ?", answers: ["La kératine", "La mélanine", "Le carotène", "Le collagène"], correct: 1, info: "La mélanine protège les cellules contre les rayons ultraviolets." },
    { question: "Quelle grande artère part directement du ventricule gauche du cœur ?", answers: ["L'artère pulmonaire", "L'aorte", "La veine cave", "La carotide"], correct: 1, info: "L'aorte propulse le sang oxygéné vers tout le reste du corps." },
    { question: "Quelle protéine transporte l'oxygène dans les globules rouges ?", answers: ["La myoglobine", "L'hémoglobine", "L'insuline", "L'albumine"], correct: 1, info: "L'hémoglobine fixe les molécules d'oxygène dans les poumons." },
    { question: "Quel est le plus gros organe interne du corps humain ?", answers: ["L'estomac", "Le foie", "Le cerveau", "Les poumons"], correct: 1, info: "Le foie effectue plus de 500 fonctions vitales chez l'adulte." },
    { question: "Combien de paires de chromosomes compte une cellule humaine normale ?", answers: ["21", "22", "23", "24"], correct: 2, info: "Cela donne un total de 46 chromosomes par cellule." },
    { question: "Quelle partie de l'œil régule la quantité de lumière entrant dans la pupille ?", answers: ["La rétine", "La cornée", "L'iris", "Le cristallin"], correct: 2, info: "L'iris s'ouvre ou se ferme en fonction de la luminosité ambiante." },
    { question: "Quel type de vaisseau sanguin ramène le sang vers le cœur ?", answers: ["Les artères", "Les veines", "Les capillaires", "Les artérioles"], correct: 1, info: "Les veines sont équipées de valvules anti-retour." },
    { question: "Comment s'appellent les unités individuelles de filtration du sang dans les reins ?", answers: ["Les neurones", "Les néphrons", "Les alvéoles", "Les hépatocytes"], correct: 1, info: "Chaque rein en abrite environ 1 million." },
    { question: "Quelle membrane séreuse enveloppe les poumons ?", answers: ["Le péritoine", "La plèvre", "Le péricarde", "Les méninges"], correct: 1, info: "La plèvre réduit les frottements lors de la respiration." },
    { question: "Quelle vitamine est synthétisée par le corps grâce à l'exposition au soleil ?", answers: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine E"], correct: 2, info: "La vitamine D favorise la fixation du calcium sur les os." },
    { question: "Quel est le seul mammifère capable de réaliser un vol battu prolongé ?", answers: ["La chauve-souris", "L'écureuil volant", "Le lémurien", "L'ornithorynque"], correct: 0, info: "Ses ailes sont formées d'une membrane reliée à ses membres." },
    { question: "Quel félin ne peut pas rétracter entièrement ses griffes ?", answers: ["Le lion", "Le guépard", "Le léopard", "Le tigre"], correct: 1, info: "Cette particularité lui garantit une meilleure adhérence lors de la course." },
    { question: "Dans quel groupe classe-t-on les animaux portant leurs petits dans une poche ventrale ?", answers: ["Les rongeurs", "Les marsupiaux", "Les primates", "Les cétacés"], correct: 1, info: "Ce groupe inclut les kangourous, les koalas et les opossums." },
    { question: "Quel arbre produit des glands ?", answers: ["Le hêtre", "Le chêne", "Le châtaignier", "Le bouleau"], correct: 1, info: "Le chêne est emblématique des forêts tempérées." },
    { question: "Quel animal aquatique est célèbre pour fabriquer des barrages en bois ?", answers: ["La loutre", "Le castor", "Le rat musqué", "Le capybara"], correct: 1, info: "Le castor régule le cours d'eau pour aménager son habitat." },
    { question: "Quel est le plus grand primate vivant au monde ?", answers: ["L'orang-outan", "Le gorille", "Le chimpanzé", "Le babouin"], correct: 1, info: "Un gorille mâle adulte peut dépasser les 180 kilogrammes." },
    { question: "Quel est le plus grand animal de la planète, toutes époques confondues ?", answers: ["L'éléphant d'Afrique", "La baleine bleue", "Le diplodocus", "Le grand requin blanc"], correct: 1, info: "Elle peut mesurer jusqu'à 30 mètres et peser 180 tonnes." },
    { question: "Combien de bras possède une pieuvre classique ?", answers: ["6", "8", "10", "12"], correct: 1, info: "Elle utilise ses 8 bras pour se déplacer et capturer des proies." },
    { question: "Quel est le mammifère terrestre le plus rapide du monde ?", answers: ["La gazelle", "Le guépard", "Le lion", "L'antilope"], correct: 1, info: "Le guépard peut atteindre des pics à 110 km/h." },
    { question: "Quel insecte fabrique du miel en ruche ?", answers: ["La guêpe", "L'abeille mellifère", "Le bourdon", "Le frelon"], correct: 1, info: "L'abeille collecte le nectar des fleurs pour produire le miel." },
    { question: "Comment nomme-t-on les poissons dont le squelette est composé de cartilage ?", answers: ["Poissons osseux", "Poissons cartilagineux", "Reptiles", "Amphibiens"], correct: 1, info: "Cette famille inclut notamment les requins et les raies." },
    { question: "Quel oiseau originaire de Nouvelle-Zélande ne sait pas voler ?", answers: ["L'émeu", "Le kiwi", "L'autruche", "Le cassowary"], correct: 1, info: "Le kiwi est devenu l'emblème national de la Nouvelle-Zélande." },
    { question: "Quel auteur dramatique a écrit 'L'Avare' et 'Le Misanthrope' ?", answers: ["Racine", "Molière", "Corneille", "Marivaux"], correct: 1, info: "Molière est l'auteur le plus joué de la comédie française." },
    { question: "Quel peintre espagnol est réputé pour 'La Persistance de la mémoire' ?", answers: ["Pablo Picasso", "Salvador Dalí", "Joan Miró", "Francisco de Goya"], correct: 1, info: "Salvador Dalí est l'un des artistes phares du mouvement surréaliste." },
    { question: "Quel compositeur de musique classique est l'auteur des 'Quatre Saisons' ?", answers: ["Bach", "Vivaldi", "Mozart", "Beethoven"], correct: 1, info: "Vivaldi a écrit ce groupe de quatre concertos au XVIIIe siècle." },
    { question: "Quel opéra célèbre a été composé par Georges Bizet ?", answers: ["La Traviata", "Carmen", "La Flûte Enchantée", "Le Barbier de Séville"], correct: 1, info: "Créé en 1875, Carmen est l'un des opéras les plus célèbres au monde." },
    { question: "Quel écrivain a inventé la célèbre détective âgée Miss Marple ?", answers: ["Arthur Conan Doyle", "Agatha Christie", "Edgar Allan Poe", "Gaston Leroux"], correct: 1, info: "Agatha Christie a écrit 12 romans mettant en scène Miss Marple." },
    { question: "Quel mouvement artistique rassemble Monet, Degas et Renoir ?", answers: ["Le Cubisme", "Le Surréalisme", "L'Impressionnisme", "Le Romantisme"], correct: 2, info: "Ce mouvement cherchait à capturer la lumière et la brièveté de l'instant." },
    { question: "Quel poète français est l'auteur des 'Fleurs du mal' ?", answers: ["Arthur Rimbaud", "Charles Baudelaire", "Paul Verlaine", "Stéphane Mallarmé"], correct: 1, info: "Publié en 1857, ce recueil a influencé la poésie moderne." },
    { question: "Quel roman de Saint-Exupéry met en scène un petit garçon venu de l'astéroïde B612 ?", answers: ["Vol de nuit", "Le Petit Prince", "Terre des hommes", "Courrier sud"], correct: 1, info: "C'est l'un des ouvrages les plus traduits à travers le globe." },
    { question: "Quel groupe de rock a sorti l'album 'The Dark Side of the Moon' ?", answers: ["Led Zeppelin", "Pink Floyd", "Deep Purple", "The Doors"], correct: 1, info: "Sorti en 1973, cet album de Pink Floyd a battu des records de vente." },
    { question: "Qui a peint 'La Jeune Fille à la perle' au XVIIe siècle ?", answers: ["Rembrandt", "Johannes Vermeer", "Rubens", "Van Dyck"], correct: 1, info: "Vermeer est un maître incontournable de l'Âge d'or néerlandais." },
    { question: "Quel compositeur autrichien a écrit l'opéra 'La Flûte Enchantée' ?", answers: ["Beethoven", "Mozart", "Haydn", "Schubert"], correct: 1, info: "Mozart l'a composé en 1791, peu avant sa disparition." },
    { question: "Quel roman de Mary Shelley raconte la création d'un être fait de pièces détachées ?", answers: ["Dracula", "Frankenstein", "Dr Jekyll et Mr Hyde", "Le Portrait de Dorian Gray"], correct: 1, info: "Publié en 1818, il est considéré comme une œuvre pionnière de la SF." },
    { question: "Quel peintre impressionniste a réalisé la célèbre série des 'Nymphéas' ?", answers: ["Paul Cézanne", "Claude Monet", "Paul Gauguin", "Édouard Manet"], correct: 1, info: "Monet les a peints au sein du jardin de sa demeure à Giverny." },
    { question: "Quel auteur romain a composé l'épopée mythique de 'L'Énéide' ?", answers: ["Ovide", "Virgile", "Horace", "Cicéron"], correct: 1, info: "Ce texte épique célèbre les origines légendaires de Rome." },
    { question: "Quelle comédie musicale oppose les gangs des Jets et des Sharks ?", answers: ["Grease", "West Side Story", "Chicago", "Les Misérables"], correct: 1, info: "L’œuvre s'inspire du drame de Roméo et Juliette." },
    { question: "Qui est l'auteur de la trilogie littéraire 'Le Seigneur des Anneaux' ?", answers: ["J.K. Rowling", "J.R.R. Tolkien", "George R.R. Martin", "C.S. Lewis"], correct: 1, info: "Tolkien a façonné la Terre du Milieu dans les années 1950." },
    { question: "Quel chanteur mythique était le leader du groupe de rock Queen ?", answers: ["David Bowie", "Freddie Mercury", "Mick Jagger", "Robert Plant"], correct: 1, info: "Freddie Mercury marquait les esprits par sa voix exceptionnelle et son charisme." },
    { question: "Dans 'Matrix', quelle pilule Neo choisit-il d'avaler pour s'éveiller ?", answers: ["La pilule bleue", "La pilule rouge", "La pilule verte", "La pilule jaune"], correct: 1, info: "La pilule rouge lui dévoile la vérité sur la matrice." },
    { question: "Quel manga raconte l'aventure de Luffy pour dénicher un trésor géant ?", answers: ["Naruto", "Bleach", "One Piece", "Dragon Ball"], correct: 2, info: "Eiichiro Oda a créé la bande dessinée la plus vendue au monde." },
    { question: "Quel acteur incarne le capitaine Jack Sparrow dans 'Pirates des Caraïbes' ?", answers: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Colin Farrell"], correct: 1, info: "Son rôle lui a valu une nomination pour les Oscars." },
    { question: "Dans quel film d'animation Pixar croise-t-on le petit robot nettoyeur Wall-E ?", answers: ["Robots", "Wall-E", "Les Indestructibles", "Là-haut"], correct: 1, info: "Le film traite d'un petit robot resté seul sur une Terre abandonnée." },
    { question: "Dans la série 'Game of Thrones', que signifie l'expression 'Valar Morghulis' ?", answers: ["Tous les hommes doivent servir", "Tous les hommes doivent mourir", "Le feu et le sang", "L'hiver vient"], correct: 1, info: "Cette devise haut-valyrienne est récurrente dans la série." },
    { question: "Quel acteur américain joue le rôle principal de 'Forrest Gump' ?", answers: ["Brad Pitt", "Tom Hanks", "Robin Williams", "Keanu Reeves"], correct: 1, info: "Tom Hanks a obtenu l'Oscar du Meilleur Acteur en 1995." },
    { question: "Quel est le nom de psychiatre d'origine de la super-vilaine Harley Quinn ?", answers: ["Pamela Isley", "Harleen Quinzel", "Selina Kyle", "Barbara Gordon"], correct: 1, info: "Elle exerçait à l'asile d'Arkham avant sa rencontre avec le Joker." },
    { question: "Dans la série 'Stranger Things', à quel jeu de rôle plateau jouent les enfants ?", answers: ["Warhammer", "Donjons et Dragons", "L'Appel de Cthulhu", "Cyberpunk"], correct: 1, info: "Les monstres de l'Upside Down sont baptisés d'après ce jeu." },
    { question: "Quel film d'animation Disney met en avant les sœurs Anna et Elsa ?", answers: ["Raiponce", "La Reine des Neiges", "Vaiana", "Encanto"], correct: 1, info: "La Reine des Neiges est sorti au cinéma en 2013." },
    { question: "Quel réalisateur a mis en scène la trilogie 'The Dark Knight' ?", answers: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Ridley Scott"], correct: 1, info: "Christopher Nolan a apporté un ton plus sombre à Batman." },
    { question: "Dans 'Dragon Ball Z', à quel peuple d'enfer appartient Son Goku ?", answers: ["Namek", "Saiyan", "Kryptonien", "Viltrumite"], correct: 1, info: "Goku est un guerrier Saiyan envoyé sur la Terre durant son enfance." },
    { question: "Quelle est la boisson de prédilection de l'agent secret James Bond ?", answers: ["Whisky Coca", "Vodka Martini", "Mojito", "Gin Tonic"], correct: 1, info: "Il la préfère traditionnellement 'au shaker, pas à la cuillère'." },
    { question: "Quel film Pixar explore la Joie, la Tristesse et la Colère chez une jeune fille ?", answers: ["Vice-Versa", "Soul", "En avant", "Coco"], correct: 0, info: "Le film personnifie l'ensemble des émotions qui régissent nos cerveaux." },
    { question: "Dans quel univers littéraire trouve-t-on la ville fortifiée de Minas Tirith ?", answers: ["Harry Potter", "Le Seigneur des Anneaux", "Narnia", "The Witcher"], correct: 1, info: "C'est la capitale du royaume de Gondor." },
    { question: "Quel acteur interprète Iron Man dans le Marvel Cinematic Universe ?", answers: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 1, info: "Robert Downey Jr. a incarné Tony Stark de 2008 à 2019." },
    { question: "Dans 'Star Wars', quel maître Jedi verdâtre entraîne Luke Skywalker sur Dagobah ?", answers: ["Mace Windu", "Yoda", "Obi-Wan Kenobi", "Qui-Gon Jinn"], correct: 1, info: "Yoda a formé les Jedi pendant plus de 800 ans." },
    { question: "Quel film a remporté l'Oscar du Meilleur Film en 1998 en racontant le naufrage d'un paquebot ?", answers: ["Titanic", "Avatar", "Gladiator", "Braveheart"], correct: 0, info: "Réalisé par James Cameron, il a glané 11 statuettes au total." },
    { question: "Qui est le principal antagoniste masqué de la trilogie originale 'Star Wars' ?", answers: ["Darth Maul", "Darth Vador", "Palpatine", "Kylo Ren"], correct: 1, info: "Darth Vador est l'ancien Jedi Anakin Skywalker." },
    { question: "Quel était le nom de code de la console Nintendo GameCube ?", answers: ["Project Reality", "Dolphin", "Ultra 64", "Revolution"], correct: 1, info: "Ce nom de projet a inspiré le créateur de l'émulateur Dolphin." },
    { question: "Dans 'The Witcher', quel est le titre/surnom donné à Geralt de Riv ?", answers: ["Le Loup Blanc", "Le Lion du Nord", "Le Corbeau Noir", "Le Dragon d'Argent"], correct: 0, info: "Son surnom découle de ses cheveux intégralement blanchis par les mutations." },
    { question: "En quelle année l'encyclopédie en ligne Wikipedia a-t-elle été lancée ?", answers: ["1998", "2001", "2004", "2007"], correct: 1, info: "La plateforme a été lancée en janvier 2001." },
    { question: "Quel composant traite les instructions centrales dans un ordinateur ?", answers: ["Le GPU", "La mémoire RAM", "Le CPU", "Le disque dur"], correct: 2, info: "Le CPU (processeur) effectue les calculs indispensables au système." },
    { question: "Dans la série 'Halo', quel est le nom du super-soldat principal ?", answers: ["Master Chief", "Commander Shepard", "Marcus Fenix", "Doomguy"], correct: 0, info: "Master Chief (John-117) porte une armure futuriste Mjolnir." },
    { question: "Quelle entreprise fabrique les cartes graphiques 'GeForce RTX' ?", answers: ["AMD", "Intel", "Nvidia", "Qualcomm"], correct: 2, info: "Nvidia produit ces puces graphiques axées sur le ray-tracing." },
    { question: "Quel personnage rose de Nintendo est capable d'aspirer ses ennemis ?", answers: ["Rayman", "Kirby", "Yoshi", "Spyro"], correct: 1, info: "Kirby vole le pouvoir des monstres qu'il avale." },
    { question: "Quel hérisson bleu mascotte de SEGA court à une vitesse surhumaine ?", answers: ["Sonic", "Tails", "Knuckles", "Shadow"], correct: 0, info: "Sonic est né en 1991 pour faire face à la concurrence de Mario." },
    { question: "Quel jeu de construction constitué de blocs est le plus vendu au monde ?", answers: ["Tetris", "Minecraft", "GTA V", "Roblox"], correct: 1, info: "Minecraft a été imaginé par le développeur Markus Persson." },
    { question: "Dans quel jeu vidéo contrôle-t-on le scientifique Gordon Freeman ?", answers: ["Doom", "Half-Life", "Quake", "Halo"], correct: 1, info: "Half-Life est sorti sur PC en 1998 par le studio Valve." },
    { question: "Quel langage informatique est utilisé pour appliquer des styles visuels sur le Web ?", answers: ["Python", "CSS", "C++", "Java"], correct: 1, info: "Le CSS régit l'habillage graphique de la structure HTML." },
    { question: "Quel navigateur internet populaire a vu le jour au début des années 1990 ?", answers: ["Internet Explorer", "NCSA Mosaic", "Netscape Navigator", "Opera"], correct: 1, info: "Mosaic a largement ouvert l'utilisation du Web au grand public." },
    { question: "Dans 'The Legend of Zelda', comment s'appelle l'épée magique du héros ?", answers: ["L'Épée de Légende (Master Sword)", "Excalibur", "Glamdring", "Frostmourne"], correct: 0, info: "Cette épée sacrée détruit le mal depuis les premiers épisodes." },
    { question: "Quelle console Sony lancée en 1994 a démocratisé l'utilisation du disque CD-ROM ?", answers: ["PlayStation", "Sega Saturn", "Nintendo 64", "Dreamcast"], correct: 0, info: "Cette console a ouvert l'ère moderne du jeu vidéo de salon en 3D." },
    { question: "Dans quelle ville fictive se déroule l'histoire principale de 'GTA V' ?", answers: ["Liberty City", "Vice City", "Los Santos", "San Fierro"], correct: 2, info: "Cette ville est une parodie directe de Los Angeles." },
    { question: "Quel service cloud de stockage de données appartient à la firme Microsoft ?", answers: ["Google Drive", "iCloud", "OneDrive", "Dropbox"], correct: 2, info: "Il s'intègre nativement dans le système d'exploitation Windows." },
    { question: "Quel jeu de tir à la première personne emblématique sorti en 1993 opposait le joueur à des démons sur Mars ?", answers: ["Doom", "Wolfenstein 3D", "Duke Nukem", "Unreal"], correct: 0, info: "Doom a révolutionné la catégorie du First-Person Shooter." },
    { question: "Quel célèbre jeu vidéo de briques empilables a été créé par Alekseï Pajitnov en 1984 ?", answers: ["Pac-Man", "Tetris", "Pong", "Space Invaders"], correct: 1, info: "Tetris repose sur l'assemblage géométrique de tétrominos." },
    { question: "Comment s'appelle la console de jeux hybride salon/portable lancée par Nintendo en 2017 ?", answers: ["Wii U", "Nintendo Switch", "Nintendo 3DS", "Game Boy"], correct: 1, info: "Elle permet de passer instantanément du téléviseur au mode nomade." },
    { question: "Quel réseau social axé sur la photo a été racheté par Meta (Facebook) en 2012 ?", answers: ["TikTok", "Instagram", "Snapchat", "Pinterest"], correct: 1, info: "Instagram a été lancé à l'origine en 2010 par Kevin Systrom." },
    { question: "Dans quel pays le cocktail à la menthe 'Mojito' trouve-t-il ses origines ?", answers: ["Mexique", "Cuba", "Brésil", "Espagne"], correct: 1, info: "Il est composé de rhum blanc, de citron vert, de menthe et d'eau gazeuse." },
    { question: "Quel plat japonais traditionnel associe du riz vinaigré et du poisson ?", answers: ["Les ramen", "Les sushis", "Les gyozas", "Les tempuras"], correct: 1, info: "Le terme sushi désigne la préparation du riz assaisonné au vinaigre." },
    { question: "Quel pays détient la victoire lors de la Coupe du Monde de rugby à XV 2023 ?", answers: ["Nouvelle-Zélande", "Afrique du Sud", "Angleterre", "France"], correct: 1, info: "Les Springboks ont décroché leur 4e titre mondial en France." },
    { question: "Dans quel pays sont nés les Jeux Olympiques de l'Antiquité ?", answers: ["Italie", "Grèce", "Égypte", "Turquie"], correct: 1, info: "Ils se déroulaient dans la cité sacrée d'Olympie." },
    { question: "Quelle grande course nautique se dispute autour du monde en solitaire et sans escale ?", answers: ["Route du Rhum", "Vendée Globe", "Solitaire du Figaro", "Coupe de l'America"], correct: 1, info: "Cette épreuve mythique s'élance depuis Les Sables-d'Olonne." },
    { question: "Combien de points vaut un panier marqué au-delà de la ligne des 6m75 au basket ?", answers: ["1 point", "2 points", "3 points", "4 points"], correct: 2, info: "Les tirs à longue distance récompensent l'équipe de 3 points." },
    { question: "Quel nageur américain est le sportif le plus médaillé de l'histoire des JO ?", answers: ["Ian Thorpe", "Michael Phelps", "Ryan Lochte", "Caeleb Dressel"], correct: 1, info: "Michael Phelps rassemble un palmarès d'exception de 28 médailles olympiques." },
    { question: "Au bowling, quel terme désigne le renversement des 10 quilles au premier lancer ?", answers: ["Un Spare", "Un Strike", "Un Turkey", "Un Perfect"], correct: 1, info: "Un strike ajoute la valeur des deux lancers suivants au compteur." },
    { question: "Dans quel sport utilise-t-on les termes de score 'Birdie', 'Eagle' et 'Par' ?", answers: ["Le Tennis", "Le Golf", "Le Polo", "Le Cricket"], correct: 1, info: "Ces termes mesurent l'efficacité sur un parcours de golf." },
    { question: "Quelle boisson est obtenue par fermentation d'orge, de houblon et d'eau ?", answers: ["Le cidre", "La bière", "Le vin", "Le kombucha"], correct: 1, info: "Le houblon confère à la bière sa saveur amère." },
    { question: "Quel fromage à pâte pressée cuite français est moulé sous forme de lourdes meules ?", answers: ["Le Comté", "Le Saint-Nectaire", "Le Munster", "Le Camembert"], correct: 0, info: "Une meule de Comté requiert la traite de nombreuses vaches." },
    { question: "Combien d'athlètes composent une équipe sur le terrain lors d'un match de volley-ball ?", answers: ["5", "6", "7", "11"], correct: 1, info: "Chaque formation aligne 6 joueurs actifs sur la surface de jeu." },
    { question: "Dans quelle grande ville américaine court-on le célèbre marathon traversant Central Park ?", answers: ["Londres", "New York", "Paris", "Berlin"], correct: 1, info: "Le marathon de New York rassemble des dizaines de milliers de coureurs." },
    { question: "Quel est le nom de la pâtisserie viennoise aux pommes, à la cannelle et aux raisins ?", answers: ["Strudel aux pommes", "Forêt-Noire", "Kouglof", "Mille-feuille"], correct: 0, info: "L'Apfelstrudel est le dessert emblématique d'Autriche." },
    { question: "Quel cocktail brésilien traditionnel est préparé avec de la cachaça et du citron vert ?", answers: ["Margarita", "Caïpirinha", "Pina Colada", "Daiquiri"], correct: 1, info: "La cachaça est un eau-de-vie élaborée à partir de jus de canne à sucre." },
    { question: "Quelle sauce italienne traditionnelle est préparée avec du basilic, du parmesan et des pignons de pin ?", answers: ["La sauce Arrabbiata", "Le Pesto alla genovese", "La Bolognese", "La Carbonara"], correct: 1, info: "Le pesto est historiquement originaire de la ville de Gênes." },
    { question: "Dans quel sport s’illustre-t-on sur la glace avec des pierres de granit et des balais ?", answers: ["Le Hockey", "Le Curling", "Le Bobsleigh", "Le Patinage artistique"], correct: 1, info: "Le curling exige une grande précision sur la glace." },
    { question: "Quel tournoi de tennis du Grand Chelem se joue sur une surface en gazon à Londres ?", answers: ["L'Open d'Australie", "Wimbledon", "US Open", "Roland-Garros"], correct: 1, info: "Wimbledon est le plus ancien tournoi de tennis au monde." },
    { question: "Quel alcool produit en Normandie est obtenu par distillation du cidre ?", answers: ["Le Cognac", "Le Calvados", "L'Armagnac", "Le Kirsch"], correct: 1, info: "Le Calvados est une eau-de-vie AOP élaborée à partir de pommes à cidre." },
    { question: "Quel condiment asiatique est fabriqué à base de graines de soja fermentées ?", answers: ["La sauce Soja", "La sauce Sriracha", "Le Wasabi", "L'huile de sésame"], correct: 0, info: "C'est l'un des condiments les plus anciens d'Asie." }
];

const titles = ["Étincelle 🕯️", "Braise 🪵", "Brise-Glace ❄️", "Torche 🔦", "Brasier 🔥", "Or 🏆", "Diamant 💎"]; // Ajout Or et Diamant

// ==========================================
// 📌 VARIABLES GLOBALES ET OBJET STATS INITIAL
// ==========================================
let stats = {
    xp: 0,
    progression: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    lastDailyDate: "",
    shields: 0,
    friends: [],
    hasAura: false
};

let current = 0;
let score = 0;
let timerInterval = null;
let dailyTimerInterval = null;
let timeLeft = 0;
let currentQuestions = [];
let selectedMode = "";
let quizHistory = [];

// --- INITIALISATION AU CHARGEMENT ---
window.onload = () => {
    setupLogin(); // On prépare le bouton quoi qu'il arrive
    setupPasswordToggle(); // 👈 Ajoute l'appel ici
    
    const savedUser = localStorage.getItem("brainflamme_user");
    if (savedUser) { 
        loadUserStatsFromCloud(savedUser); 
    } else {
        show("login-screen");
    }
    
    // 🎵 Lance la musique de fond au premier clic de l'utilisateur (contourne la restriction navigateur)
    document.body.addEventListener('click', () => {
        playMusic('bgMusic');
    }, { once: true });
};

function setupLogin() {
    const loginBtn = document.getElementById("loginBtn");
    const userInput = document.getElementById("username-input");
    const passInput = document.getElementById("password-input");

    if (loginBtn && userInput && passInput) {
        loginBtn.onclick = () => {
            const username = userInput.value.trim();
            const password = passInput.value;

            if (!username || !password) {
                alert("Entre un pseudo et un mot de passe ! 🔥");
                return;
            }

            // ➔ On garde le pseudo exact (avec les majuscules) pour Firebase
            const targetKey = username;

            // 🧹 RESET CRUCIAL : On remet l'objet stats à zéro
            stats = {
                username: username,
                password: password,
                xp: 0,
                progression: 0,
                level: 1,
                streak: 0,
                maxStreak: 0,
                lastDailyDate: "",
                shields: 0,
                friends: [],
                hasAura: false
            };
            
            if (typeof database !== "undefined" && database) {
                database.ref('joueurs/' + targetKey).once('value').then((snapshot) => {
                    if (snapshot.exists()) {
                        const val = snapshot.val();

                        // 🔒 SÉCURITÉ MOT DE PASSE : Si l'ancien compte n'a pas encore de mot de passe
                        if (!val.password) {
                            database.ref('joueurs/' + targetKey).update({ password: password });
                            val.password = password;
                        }

                        // Vérification du mot de passe
                        if (val.password !== password) {
                            alert("❌ Mot de passe incorrect pour ce pseudo !");
                            return; // Stoppe la connexion
                        }

                        // Si le mot de passe est bon, on charge les stats
                        stats = Object.assign({}, stats, val);
                        stats.hasAura = val.hasAura === true;
                    } else {
                        // Nouveau compte : on l'enregistre direct avec son mot de passe
                        database.ref('joueurs/' + targetKey).set(stats);
                    }
                    
                    // Succès de la connexion
                    localStorage.setItem("brainflamme_user", username);
                    updateHome();
                    checkDailyStatus();
                    
                    // Utilise switchTab ou show selon ton code (ici switchTab)
                    if (typeof switchTab === 'function') {
                        switchTab('home-screen');
                    } else if (typeof show === 'function') {
                        show('home-screen');
                    }

                    // ➔ Force l'affichage de la barre du bas DIRECTEMENT ICI dans le succès
                    const bottomNav = document.querySelector('.bottom-nav');
                    if (bottomNav) {
                        bottomNav.style.display = 'flex';
                    }

                }).catch(err => {
                    console.error("Erreur Firebase:", err);
                    alert("Erreur de connexion avec le serveur.");
                });
            } else {
                alert("Erreur : Base de données non disponible.");
            }
        };
    }
}

function setupPasswordToggle() {
    const passwordInput = document.getElementById("password-input");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.onclick = () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePassword.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
        };
    }
}

function chargerStatsLocales(username) {
    if (!username) return;

    const localData = localStorage.getItem("brainflamme_stats_" + username);

    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            // Fusionne proprement les données locales avec l'objet stats de base
            stats = Object.assign({
                xp: 0,
                progression: 0,
                level: 1,
                streak: 0,
                shields: 0,
                friends: []
            }, parsed);
        } catch (e) {
            console.error("Erreur de lecture des stats locales :", e);
        }
    }

    // Sécurités fondamentales
    if (isNaN(stats.xp)) stats.xp = 0;
    if (isNaN(stats.progression)) stats.progression = 0;
    if (isNaN(stats.level) || !stats.level) stats.level = 1;

    // Met à jour l'affichage et le statut du mode quotidien
    updateHome();
    checkDailyStatus();
}

function saveUserStats() {
    const username = localStorage.getItem("brainflamme_user");
    if (!username || !stats) return; 
    
    if (typeof database !== "undefined" && database) {
        database.ref('joueurs/' + username).set(stats)
            .then(() => console.log("🔥 Stats synchronisées sur Firebase !"))
            .catch(err => console.error("Erreur Firebase :", err));
    }
        
    localStorage.setItem("brainflamme_stats_" + username, JSON.stringify(stats));
}

// ==========================================
// 🔄 CHARGEMENT DES STATISTIQUES (FIREBASE / LOCAL)
// ==========================================
function loadUserStatsFromCloud(username) {
    if (typeof database === "undefined" || !database) {
        chargerStatsLocales(username);
        return;
    }

    database.ref('joueurs/' + username).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const cloudData = snapshot.val();
            
            // Charge les données cloud dans l'objet global
            stats = Object.assign({}, stats, cloudData);
            
            // 🛡️ SÉCURITÉ AURA : Force FALSE si le compte ne l'a pas achetée
            stats.hasAura = cloudData.hasAura === true; 

            if (stats.shields === undefined) stats.shields = 0;
            if (stats.progression === undefined) stats.progression = stats.xp || 0;

            // 🎯 VÉRIFICATION DE LA FLAMME (Sécurisée)
            const lastDateStr = stats.lastDailyDate || localStorage.getItem("daily_done_" + username);

            if (lastDateStr) {
                const lastDate = new Date(lastDateStr);
                const today = new Date();
                
                // Réinitialisation des heures pour comparer UNIQUEMENT les jours
                lastDate.setHours(0,0,0,0);
                today.setHours(0,0,0,0);
                
                const diffTime = today.getTime() - lastDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                
                // Se déclenche uniquement si 2 jours ou plus sont passés
                if (diffDays > 1) {
                    if (stats.shields && stats.shields > 0) {
                        stats.shields--; 
                        alert("🛡️ Ton bouclier a été utilisé ! Ta flamme est sauvée.");
                        saveUserStats(); 
                    } else if (stats.streak > 0) {
                        stats.streak = 0; 
                        alert("🔥 Ta flamme s'est éteinte car tu n'as pas joué hier.");
                        saveUserStats(); 
                    }
                }
            }

            // 🖼️ Remet l'avatar à l'écran si disponible
            if (stats.avatar && document.getElementById("avatarImg")) {
                document.getElementById("avatarImg").src = stats.avatar;
            }

        } else {
            chargerStatsLocales(username);
        }
        
        updateHome(); 
        checkDailyStatus(); // Met à jour le bouton après réception
        show("home-screen");

    }).catch(err => {
        console.error("Erreur Cloud:", err);
        chargerStatsLocales(username);
        checkDailyStatus();
    });
}

// ==========================================
// 🎮 LOGIQUE DE DÉMARRAGE DES QUIZ
// ==========================================

// Clic sur "Jouer" (Menu Principal)
const startBtn = document.getElementById("startBtn");
if (startBtn) {
    startBtn.onclick = () => {
        show("modeSelection");
        checkDailyStatus();
    };
}

// Clic sur "Mode Chrono"
const chronoBtn = document.getElementById("chronoMode");
if (chronoBtn) {
    chronoBtn.onclick = () => {
        playMusic('chronoMusic'); // 🎵 LANCE LA MUSIQUE INTENSE DU CHRONO
        selectedMode = "Chrono";
        quizHistory = [];
        score = 0;
        current = 0;
        bonusSuccess = false;
        
        const timerBox = document.getElementById("timerContainer");
        if (timerBox) timerBox.style.display = "block";
        
        currentQuestions = [...questionsData].sort(() => Math.random() - 0.5);

        // Temps de base + Bonus éventuel
        let durance = 30;
        if (stats.chronoBonus && stats.chronoBonus > 0) {
            durance += stats.chronoBonus;
            stats.chronoBonus = 0;
            saveUserStats();
        }

        startChronoTimer(durance);
        show("quiz");
        showQuestion();
    };
}

// ==========================================
// 🎮 DÉMARRAGE DES MODES DE JEU
// ==========================================

const dailyBtn = document.getElementById("dailyMode");
if (dailyBtn) {
    dailyBtn.onclick = () => {
        const user = localStorage.getItem("brainflamme_user");
        const todayStr = new Date().toISOString().split('T')[0];
        const lastDone = (stats && stats.lastDailyDate) ? stats.lastDailyDate : localStorage.getItem("daily_done_" + user);

        // 🔒 VERROU ABSOLU : Si déjà fait aujourd'hui, on refuse l'accès !
        if (lastDone === todayStr) {
            checkDailyStatus(); // Remet le texte avec le compte à rebours
            return; // Bloque le lancement du quiz
        }

        selectedMode = "Quotidien";
        playMusic('bgMusic'); // 🎵 MUSIQUE CALME DU QUOTIDIEN
        quizHistory = [];
        score = 0;
        current = 0;
        
        const timerBox = document.getElementById("timerContainer");
        if (timerBox) timerBox.style.display = "none";
        
        currentQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, 8);

        show("quiz");
        showQuestion();
    };
}

function updateTimerUI() {
    const bar = document.getElementById("timerBar");
    const text = document.getElementById("timerText");
    if (!bar || !text) return;

    const pct = (timeLeft / maxChronoTime) * 100;
    bar.style.width = Math.max(0, pct) + "%";
    text.textContent = Math.ceil(timeLeft);

    // ✅ On utilise .background pour être sûr d'écraser les gradients CSS
    if (timeLeft > 20) bar.style.background = "#22c55e";      // Vert
    else if (timeLeft > 12) bar.style.background = "#eab308"; // Jaune
    else if (timeLeft > 5) bar.style.background = "#f97316";  // Orange
    else bar.style.background = "#ef4444";                    // Rouge
}

let maxChronoTime = 30;
let lastTickSecond = -1; // 👈 Variable pour éviter la répétition en boucle

function startChronoTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    maxChronoTime = seconds;
    lastTickSecond = -1; // Réinitialisation
    
    updateTimerUI();

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        updateTimerUI();

        // ⏱️ 🔊 JOUER LE SON TICK TOUTES LES SECONDES SI <= 5
        const currentSecond = Math.ceil(timeLeft);
        if (currentSecond <= 5 && currentSecond > 0 && currentSecond !== lastTickSecond) {
            playSFX('tick');
            lastTickSecond = currentSecond; // On retient la seconde jouée
        }

        // ⏱️ Quand le temps est écoulé :
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // Si le joueur a l'item bonus en réserve
            if (stats.bonusQuestion && stats.bonusQuestion > 0) {
                stats.bonusQuestion--;
                saveUserStats();
                lancerQuestionBonus(); // 👈 On lance la prolongation bonus !
            } else {
                // 🎵 Le temps est fini, retour à la musique de fond
        if (typeof playMusic === 'function') playMusic('bgMusic');
                endQuiz();
            }
        }
    }, 100);
}

function show(id) {
    // 1. Masquer tous les écrans (gère la classe .hidden et style.display pour éviter tout conflit)
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
        s.style.display = "none";
    });
    
    // 2. Recherche de l'écran cible (prend en compte "quiz" ou "screen-quiz")
    let target = document.getElementById(id);
    if (!target && !id.startsWith("screen-")) {
        target = document.getElementById("screen-" + id);
    }
    
    // 3. Afficher l'écran si trouvé
    if (target) {
        target.classList.remove("hidden");
        target.style.display = "block";
    } else {
        console.warn(`L'écran avec l'ID "${id}" n'a pas été trouvé dans le DOM.`);
    }

    // 🛍️ Mettre à jour la boutique si ouverte
    if ((id === "shop-screen" || id === "shop") && typeof updateShopDisplay === "function") { 
        updateShopDisplay();
    }

    // 🏆 Si on ouvre le classement, charger les vrais joueurs Firebase
if ((id === "leaderboard" || id === "leaderboard-screen") && typeof loadRealLeaderboard === "function") {
    loadRealLeaderboard();
}

    // 📅 Mettre à jour le statut quotidien sur la sélection de mode ou l'accueil
    if ((id === "modeSelection" || id === "home-screen" || id === "home") && typeof checkDailyStatus === "function") {
        checkDailyStatus();
    }

    // ✨ Effet Aura sur le pseudo de l'utilisateur
    const welcomeUser = document.getElementById("welcome-user");
    if (welcomeUser) {
        if (typeof stats !== "undefined" && stats && stats.hasAura === true) {
            welcomeUser.style.textShadow = "0 0 15px #22d3ee, 0 0 25px #22d3ee";
            welcomeUser.style.color = "#22d3ee";
        } else {
            welcomeUser.style.textShadow = "none";
            welcomeUser.style.color = "inherit";
        }
    }

    // 🧭 Gestion intelligente de la barre de navigation du bas (.bottom-nav)
    const nav = document.querySelector(".bottom-nav") || document.getElementById("main-nav");
    if (nav) {
        // Liste complète des écrans où la navigation doit être masquée (jeu en cours, coffres, login)
        const screensWithoutNav = [
            "login-screen", "login", 
            "quiz", "screen-quiz", 
            "chrono", "screen-chrono", 
            "game", "screen-game",
            "chest-screen", "chest"
        ];

        if (screensWithoutNav.includes(id)) {
            nav.style.display = "none";
            document.body.classList.add("game-active");
        } else {
            nav.style.display = "flex";
            document.body.classList.remove("game-active");
        }
    }
}

function showQuestion() {
    if (current >= currentQuestions.length) {
        const quizScreen = document.getElementById("quiz");
        if (quizScreen) quizScreen.classList.remove("bonus-mode-active");
        endQuiz();
        return;
    }
    
    const expl = document.getElementById("explanation-container");
    if (expl) expl.innerHTML = ""; 

    const q = currentQuestions[current];
    const qText = document.getElementById("question");
    const area = document.getElementById("answers"); 
    const quizScreen = document.getElementById("quiz");

    // Décoration si question bonus (Double XP)
    if (quizScreen) {
        if (q.isBonus) {
            quizScreen.classList.add("bonus-mode-active");
            qText.innerHTML = "✨ QUESTION BONUS ✨<br><small style='font-size:16px;'>(Double XP !)</small><br><br>" + q.question;
        } else {
            quizScreen.classList.remove("bonus-mode-active");
            qText.textContent = q.question;
        }
    }
    
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
            
            // Historique de réponse
            quizHistory.push({
                question: q.question,
                userAns: answerObj.text,
                correctAns: q.answers[q.correct],
                isCorrect: answerObj.isCorrect
            });
            
            // Vérification de la réponse
            if (answerObj.isCorrect) { 
                b.classList.add("correct"); 
                playSFX('correct'); // 🎉 SON BONNE RÉPONSE
                score += 1;
                
                if (q.isBonus) {
                    bonusSuccess = true;
                }
            } else { 
                b.classList.add("wrong");
                playSFX('wrong'); // ❌ SON MAUVAISE RÉPONSE
                allBtns.forEach(btn => {
                    const originalCorrectText = q.answers[q.correct];
                    if (btn.textContent === originalCorrectText) btn.classList.add("correct");
                });
            }
            
            // ⚡ MODE CHRONO
            if (selectedMode === "Chrono") {
                setTimeout(() => {
                    current++;
                    if (q.isBonus) {
                        endQuiz();
                    } else {
                        showQuestion();
                    }
                }, 300);
            } 
            // 📅 MODE QUOTIDIEN
            else {
                if (expl) {
                    expl.innerHTML = `
                        <div style="background:#1e293b; border:2px solid #f97316; padding:15px; border-radius:15px; margin-top:20px; text-align:left;">
                            <h4 style="color:#f97316; margin-bottom:5px;">💡 Le sais-tu ?</h4>
                            <p style="margin-bottom:15px; color:white;">${q.info}</p>
                            <div style="text-align:center;">
                                <button id="nextBtnInside" class="play" style="padding:10px 30px; font-size:18px; margin-top:0; cursor:pointer;">SUIVANT</button>
                            </div>
                        </div>`;
                    
                    document.getElementById("nextBtnInside").onclick = () => { 
                        current++; 
                        showQuestion();
                    };
                }
            }
        };
        area.appendChild(b);
    });
}

// ==========================================
// 2. DÉCOMPTE & VERROUILLAGE BOUTON QUOTIDIEN
// ==========================================

function checkDailyStatus() {
    const user = localStorage.getItem("brainflamme_user");
    const btn = document.getElementById("dailyMode");
    if (!btn || !user) return;

    // 1. Récupération et nettoyage de la date
    let lastDone = (stats && stats.lastDailyDate) ? stats.lastDailyDate : localStorage.getItem("daily_done_" + user);

    if (lastDone && lastDone.includes("T")) {
        lastDone = lastDone.split("T")[0];
    }

    // 2. Date d'aujourd'hui au format YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (typeof dailyTimerInterval !== "undefined" && dailyTimerInterval) {
        clearInterval(dailyTimerInterval);
    }

    // 🔒 SI LE QUIZ A DÉJÀ ÉTÉ FAIT AUJOURD'HUI
    if (lastDone === todayStr) {
        btn.disabled = true;
        
        // Style visuel grisé forcé !
        btn.style.setProperty("background", "#475569", "important"); // Gris foncé
        btn.style.setProperty("opacity", "0.6", "important");
        btn.style.setProperty("cursor", "not-allowed", "important");
        btn.style.setProperty("pointer-events", "none", "important");

        const updateTimer = () => {
            const currentTime = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);

            const diff = midnight - currentTime;

            if (diff <= 0) {
                if (typeof dailyTimerInterval !== "undefined") clearInterval(dailyTimerInterval);
                btn.disabled = false;
                btn.style.removeProperty("background");
                btn.style.removeProperty("opacity");
                btn.style.removeProperty("cursor");
                btn.style.removeProperty("pointer-events");
                btn.innerText = "Mode Quotidien 📅";
            } else {
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);

                const formatH = String(h).padStart(2, '0');
                const formatM = String(m).padStart(2, '0');
                const formatS = String(s).padStart(2, '0');

                btn.innerText = `⏳ Disponible dans ${formatH}h ${formatM}m ${formatS}s`;
            }
        };

        updateTimer();
        dailyTimerInterval = setInterval(updateTimer, 1000);

    } else {
        // 🟢 QUIZ DISPONIBLE
        btn.disabled = false;
        btn.style.removeProperty("background");
        btn.style.removeProperty("opacity");
        btn.style.removeProperty("cursor");
        btn.style.removeProperty("pointer-events");
        btn.innerText = "Mode Quotidien 📅";
    }
}

function endQuiz() {
    // 🎵 On stoppe la musique du chrono et on remet la musique de fond !
    if (typeof playMusic === 'function') {
        playMusic('bgMusic');
    }
    clearInterval(timerInterval);

    if (isNaN(stats.xp) || stats.xp === undefined) stats.xp = 0;
    if (isNaN(stats.progression) || stats.progression === undefined) stats.progression = 0;
    if (isNaN(stats.level) || !stats.level) stats.level = 1;

    let gain = score * 10; 

    if (typeof bonusSuccess !== "undefined" && bonusSuccess) {
        gain += 10; 
        bonusSuccess = false;
    }
        
    stats.xp += gain;
    stats.progression += gain;

    while (stats.progression >= stats.level * 100) {
        stats.level++;
    playSFX('levelUp'); // 🏆 FANFARE POUR MONTER DE NIVEAU
    }

    // 📅 GESTION DU MODE QUOTIDIEN
    if (selectedMode === "Quotidien") {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        stats.streak = (stats.streak || 0) + 1;

        if (!stats.maxStreak || stats.streak > stats.maxStreak) {
            stats.maxStreak = stats.streak;
        }

        stats.lastDailyDate = todayStr;
        const user = localStorage.getItem("brainflamme_user");
        if (user) {
            localStorage.setItem("daily_done_" + user, todayStr);
        }

        saveUserStats();
        checkDailyStatus(); // Grise le bouton direct !
    } else {
        saveUserStats();
    }

    // 🎉 CONFETTIS (Uniquement si 5/5 à la fin du quiz)
    if (score === 8 && typeof confetti === "function") {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    continuerAffichageScore(gain);
}

// ==========================================
// 3. AJOUT D'AMI AVEC VÉRIFICATION FIREBASE
// ==========================================
function addFriend() {
    const friendInput = document.getElementById("friendInput");
    if (!friendInput) return;

    const friendName = friendInput.value.trim();
    const currentUser = localStorage.getItem("brainflamme_user");

    if (!friendName) {
        alert("⚠️ Merci de saisir un pseudo.");
        return;
    }

    if (currentUser && friendName.toLowerCase() === currentUser.toLowerCase()) {
        alert("⚠️ Tu ne peux pas t'ajouter toi-même en ami !");
        return;
    }

    if (!stats.friends) stats.friends = [];

    if (stats.friends.includes(friendName)) {
        alert("⚠️ Ce joueur est déjà dans ta liste d'amis.");
        return;
    }

    // 🔍 VÉRIFICATION DANS FIREBASE REALTIME DB
    if (typeof database !== "undefined" && database) {
        database.ref('joueurs/' + friendName).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                // ✅ LE JOUEUR EXISTE VRAIMENT !
                stats.friends.push(friendName);
                saveUserStats();
                friendInput.value = "";
                alert(`✅ ${friendName} a été ajouté à tes amis !`);
                if (typeof renderFriendsList === "function") renderFriendsList();
            } else {
                // ❌ LE JOUEUR N'EXISTE PAS DANS LA BASE
                alert(`❌ Le joueur "${friendName}" n'existe pas !`);
            }
        }).catch(err => {
            console.error("Erreur Firebase Ami :", err);
            alert("Erreur de recherche du joueur sur le serveur.");
        });
    } else {
        alert("Erreur : Connexion à la base de données impossible.");
    }
}

function continuerAffichageScore(gain) {
    let nbQuestionsPosees = quizHistory.length || 1;
    let comment = (score >= (nbQuestionsPosees * 0.8)) 
        ? "INCROYABLE ! 🔥" 
        : (score >= (nbQuestionsPosees * 0.5) ? "BIEN JOUÉ ! 👏" : "ESSAIE ENCORE ! 🐢");

    const lvlElem = document.getElementById("score-level");
    const xpElem = document.getElementById("score-xp");
    const commElem = document.getElementById("score-comment");
    const textElem = document.getElementById("score-text");

    if (lvlElem) lvlElem.textContent = "Niveau " + stats.level;
    if (xpElem) xpElem.textContent = "+" + gain + " XP";
    if (commElem) commElem.textContent = comment;
    if (textElem) textElem.textContent = score + " / " + nbQuestionsPosees + " correctes";

    if (typeof updateShopDisplay === "function") updateShopDisplay();

    setTimeout(() => {
        const bar = document.getElementById("anim-fill");
        if (bar) {
            const currentLevelXP = (stats.progression || 0) % 100; 
            bar.style.width = currentLevelXP + "%";
        }
    }, 100);

    updateHome();

    if (score === nbQuestionsPosees && selectedMode === "Quotidien" && typeof lancerConfettis === "function") {
        lancerConfettis();
    }

    let aUnCoffre = false;
    if (typeof preparerCoffre === "function") {
        aUnCoffre = preparerCoffre();
    }

    if (!aUnCoffre) {
        show("score");
    }
}

function logout() {
    localStorage.removeItem("brainflamme_user");
    
   // Vide les cases de l'écran de connexion
const userInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
if (userInput) userInput.value = "";
if (passwordInput) passwordInput.value = "";
    
    stats = { 
        xp: 0, 
        progression: 0,
        level: 1, 
        streak: 0,
        maxStreak: 0,
        lastDailyDate: "",
        shields: 0,
        friends: [],
        hasAura: false
    };

    if (typeof dailyTimerInterval !== "undefined" && dailyTimerInterval) {
        clearInterval(dailyTimerInterval);
    }

    show("login-screen");
}

function lancerConfettis() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
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
    document.querySelectorAll('.auth-step').forEach(step => step.classList.remove('active'));
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
    playSFX('buy'); // 🪙 SON D'ACHAT (BOUTIQUE)
        
        if (name === 'chrono_bonus') {
            stats.chronoBonus = (stats.chronoBonus || 0) + 5;
            alert("⏳ Sablier activé ! +5s au prochain Chrono.");
        } 
        else if (name === 'shield') {
            stats.shields = (stats.shields || 0) + 1;
            alert("🛡️ Bouclier d'argent obtenu !");
        } 
        else if (name === 'name_color') {
            const chosenColor = prompt("Entre une couleur (ex: gold, cyan, #ff00ea) :");
            if (chosenColor) stats.nameColor = chosenColor;
            alert("🎨 Pseudo mis à jour !");
        } 
        else if (name === 'rank_color') {
            const chosenColor = prompt("Entre une couleur pour ton titre (ex: lime, red, #f97316) :");
            if (chosenColor) stats.rankColor = chosenColor;
            alert("✨ Rang mis à jour !");
        }
        else if (name === 'xp_boost') {
            stats.hasXpBoost = true; 
            alert("💜 Élixir Violet activé ! Ton prochain quiz rapportera double XP.");
        }
        else if (name === 'streak_bonus') {
            stats.streak = (stats.streak || 0) + 5;
            alert("🏮 Relique de Feu utilisée ! +5 Flammes.");
        }
        else if (name === 'aura_effect') {
            stats.hasAura = true;
            alert("💎 Aura Céleste débloquée !");
        }
        else if (name === 'bonus_question' || name === 'bonusQuestion') {
            stats.bonusQuestion = (stats.bonusQuestion || 0) + 1;
            alert("🎲 Dé Chanceux ! Une question bonus sera ajoutée dans ton prochain quiz quotidien.");
        }
        
        saveUserStats();
        updateShopDisplay();
        updateHome();
    } else {
        alert("Tu n'as pas assez de points ! 🪙");
    }
}

// 🛡️ REMPLACÉ ET SUPPRIMÉ LA RE-DÉCLARATION EN DOUBLON DE checkDailyStatus !

function updateShopDisplay() {
    const shopXp = document.getElementById("shop-xp");
    if (shopXp) {
        shopXp.textContent = stats.xp; 
    }
}

function updateHome() {
    const titleIndex = Math.min(Math.floor((stats.level || 1) / 10), 6);
    const user = localStorage.getItem("brainflamme_user") || "Joueur";
    
    const welcomeElem = document.getElementById("welcome-user");
    const rankElem = document.getElementById("player-level");
    const streakElem = document.getElementById("streak-number");
    const xpBar = document.getElementById("xp-bar-fill");

    if (welcomeElem) {
        welcomeElem.textContent = "Salut, " + user;
        
        if (stats.nameColor) {
            welcomeElem.style.webkitTextFillColor = stats.nameColor; 
            welcomeElem.style.color = stats.nameColor;
        }

        // 🛡️ SEIN ET DÉSACTIVATION NETTE DE L'AURA
        if (stats.hasAura === true) {
            welcomeElem.style.textShadow = "0 0 15px #22d3ee, 0 0 25px #22d3ee";
            if (!stats.nameColor) welcomeElem.style.color = "#22d3ee";
        } else {
            welcomeElem.style.textShadow = "none";
            if (!stats.nameColor) welcomeElem.style.color = "inherit";
        }
    }

    if (rankElem) {
        rankElem.textContent = "Niveau " + (stats.level || 1) + " - " + titles[titleIndex];
        rankElem.style.color = stats.rankColor ? stats.rankColor : "#fbbf24";
    }

    if (streakElem) streakElem.textContent = stats.streak || 0;

    if (xpBar) {
        const currentXP = (stats.progression || 0) % 100;
        xpBar.style.width = Math.min(100, Math.max(0, currentXP)) + "%";
    }
}

function proposerQuestionBonus() {
    const veutJouer = confirm("🎲 Tu possèdes un Dé Chanceux ! Veux-tu l'utiliser pour une QUESTION BONUS et gagner plus d'XP ?");
    
    if (veutJouer) {
        stats.bonusQuestion--;
        lancerQuestionBonus();
    } else {
        saveUserStats();
        updateHome();
    }
}

function lancerQuestionBonus() {
    playMusic('bonusMusic'); // ⚡ MUSIQUE DE LA QUESTION BONUS
    const timerBox = document.getElementById("timerContainer");
    if (timerBox) timerBox.style.display = "none";

    let bonusQ = { ...questionsData[Math.floor(Math.random() * questionsData.length)] };
    bonusQ.isBonus = true;

    currentQuestions = [bonusQ];
    current = 0;

    showQuestion();
}

// ==========================================
// 👤 LOGIQUE DU PROFIL & DE LA PHOTO
// ==========================================

function switchTab(screenId, clickedBtn) {

    // 🎵 Si on quitte le jeu/quiz pour revenir sur un menu, on remet la musique de fond !
    const menuScreens = ['home-screen', 'shop-screen', 'modeSelection', 'profile', 'leaderboard-screen', 'score'];
    if (menuScreens.includes(screenId) && typeof playMusic === 'function') {
        playMusic('bgMusic');
    }

    const allScreens = [
        'login-screen', 
        'home-screen', 
        'shop-screen', 
        'modeSelection', 
        'quiz', 
        'profile', 
        'score', 
        'leaderboard-screen'
    ];

    allScreens.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
        }
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
    }

    const buttons = document.querySelectorAll('.bottom-nav .nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }

    if (screenId === 'home-screen' && typeof updateHome === 'function') {
        updateHome();
    } else if (screenId === 'shop-screen' && typeof updateShopDisplay === 'function') {
        updateShopDisplay();
    } else if (screenId === 'profile' && typeof renderProfile === 'function') {
        renderProfile();
    }

    // ➔ GESTION AUTOMATIQUE DE LA BARRE DU BAS
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        if (screenId === 'login-screen') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
        }
    }
} // 👈 Cette accolade ferme bien la fonction switchTab

function renderProfile() {
    const currentUsername = localStorage.getItem("brainflamme_user") || "Joueur";

    const nameEl = document.getElementById("profileUsername");
    const tagEl = document.querySelector(".user-tag");
    if (nameEl) nameEl.textContent = currentUsername;
    if (tagEl) tagEl.textContent = "@" + currentUsername.toLowerCase().replace(/\s+/g, '');

    const currentXp = (stats && stats.xp) ? stats.xp : 0;
    const currentLevel = (stats && stats.level) ? stats.level : 1;
    const currentProgression = (stats && stats.progression) ? (stats.progression % 100) : (currentXp % 100);

    if (document.getElementById("xpText")) {
        document.getElementById("xpText").textContent = `${currentProgression} / 100 XP`;
    }
    if (document.getElementById("xpBarFill")) {
        document.getElementById("xpBarFill").style.width = currentProgression + "%";
    }

    if (document.getElementById("profileCurrentFlame")) {
        document.getElementById("profileCurrentFlame").textContent = stats.streak || 0;
    }
    if (document.getElementById("profileMaxFlame")) {
        document.getElementById("profileMaxFlame").textContent = "🔥 " + (stats.maxStreak || stats.streak || 0);
    }
    if (document.getElementById("profileLevel")) {
        document.getElementById("profileLevel").textContent = "Niv. " + currentLevel;
    }

    if (stats.avatar && document.getElementById("avatarImg")) {
        document.getElementById("avatarImg").src = stats.avatar;
    }

    if (!stats.friends) stats.friends = [];
    renderFriends(stats.friends);
}

function updateAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 150;
            canvas.height = 150;

            ctx.drawImage(img, 0, 0, 150, 150);
            
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

            const avatarElem = document.getElementById("avatarImg");
            if (avatarElem) avatarElem.src = compressedBase64;

            stats.avatar = compressedBase64;
            saveUserStats();
            console.log("🔥 Avatar compressé et synchronisé sur Firebase !");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function renderFriends(friendsList) {
    const list = document.getElementById("friendsList");
    if (!list) return;
    list.innerHTML = "";
    
    if (friendsList.length === 0) {
        list.innerHTML = "<li style='color:#a6adc8; font-style:italic;'>Aucun ami ajouté</li>";
        return;
    }

    friendsList.forEach(friend => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.style.display = "flex";
        li.style.justify = "space-between";
        li.style.alignItems = "center";
        
        li.onclick = function() {
            showFriendProfile(friend);
        };

        li.innerHTML = `<span>👤 <strong>${friend}</strong></span> <span style="font-size:0.8rem; color:#f97316;">Voir ➔</span>`;
        list.appendChild(li);
    });
}

function setNavActive(clickedBtn) {
    const buttons = document.querySelectorAll('.bottom-nav .nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
}

function showFriendProfile(friendName) {
    const nameEl = document.getElementById("profileUsername");
    const tagEl = document.querySelector(".user-tag");
    
    if (nameEl) nameEl.textContent = friendName;
    if (tagEl) tagEl.textContent = "@" + friendName.toLowerCase().replace(/\s+/g, '');

    if (typeof database !== "undefined" && database) {
        database.ref('joueurs/' + friendName).once('value').then((snapshot) => {
            const friendStats = snapshot.val();

            if (friendStats) {
                if (document.getElementById("profileCurrentFlame")) {
                    document.getElementById("profileCurrentFlame").textContent = friendStats.streak || 0;
                }
                if (document.getElementById("profileMaxFlame")) {
                    document.getElementById("profileMaxFlame").textContent = "🔥 " + (friendStats.maxStreak || friendStats.streak || 0);
                }
                if (document.getElementById("profileLevel")) {
                    document.getElementById("profileLevel").textContent = "Niv. " + (friendStats.level || 1);
                }

                const currentProgression = (friendStats.progression !== undefined) ? (friendStats.progression % 100) : 0;
                if (document.getElementById("xpText")) {
                    document.getElementById("xpText").textContent = currentProgression + " / 100 XP";
                }
                if (document.getElementById("xpBarFill")) {
                    document.getElementById("xpBarFill").style.width = currentProgression + "%";
                }

                if (document.getElementById("avatarImg")) {
                    document.getElementById("avatarImg").src = friendStats.avatar || "https://via.placeholder.com/100?text=" + friendName.charAt(0).toUpperCase();
                }
            } else {
                alert("Impossible de trouver les données de cet ami.");
            }
        }).catch(err => console.error("Erreur chargement ami :", err));
    }

    const socialSec = document.querySelector(".social-section");
    if (socialSec) {
        socialSec.innerHTML = `
            <button onclick="renderProfile(); restoreSocialSection();" style="width:100%; padding:10px; background:#f97316; border:none; border-radius:10px; color:white; font-weight:bold; cursor:pointer;">
                ← Retour à Mon Profil
            </button>
        `;
    }
}

function restoreSocialSection() {
    const socialSec = document.querySelector(".social-section");
    if (socialSec) {
        socialSec.innerHTML = `
            <h3>👥 Mes Amis</h3>
            <div class="add-friend-box">
                <input type="text" id="friendInput" placeholder="Entrer un pseudo...">
                <button onclick="addFriend()">Ajouter</button>
            </div>
            <ul id="friendsList" class="friends-list"></ul>
        `;
        if (typeof stats !== 'undefined' && stats.friends) {
            renderFriends(stats.friends);
        } else {
            renderFriends([]);
        }
    }
}
let currentChestType = null; // "Quotidien" ou "Chrono"
let coffreDejaOuvert = false;

// 1. AFFICHER LE COFFRE SELON LE MODE DE JEU
// 1. AFFICHER LE COFFRE SELON LE MODE DE JEU (Version Améliorée)
// JS : Dans ta fonction preparerCoffre()
function preparerCoffre() {
    const chestScreen = document.getElementById("chest-screen");
    const chestImg = document.getElementById("chest-img");
    const title = document.getElementById("chest-title");

    if (!chestScreen || !chestImg) return false;

    coffreDejaOuvert = false;
    chestImg.style.display = "block";

    if (selectedMode === "Quotidien") {
        currentChestType = "Quotidien";
        if (title) title.textContent = "COFFRE DORÉ DÉBLOQUÉ !";
        
        // 🎯 NOM EXACT GITHUB :
        chestImg.src = "coffre_or_flat-removebg-preview.png";
        
        show("chest-screen");
        return true; 
    } else if (selectedMode === "Chrono") {
        currentChestType = "Chrono";
        if (title) title.textContent = "COFFRE EN BOIS DÉBLOQUÉ !";
        
        // 🎯 NOM EXACT GITHUB :
        chestImg.src = "coffre_bois_flat-removebg-preview.png";
        
        show("chest-screen");
        return true; 
    }

    return false;
}

// 2. LOGIQUE D'OUVERTURE AVEC SUSPENSE
function ouvrirCoffre() {
    if (coffreDejaOuvert) return;
    coffreDejaOuvert = true;

    playSFX('chest-open');
    const box = document.getElementById("chest-box");
    box.classList.add("shake-chest"); // Déclenche la secousse

    // Attente de suspense (800ms) avant l'explosion de récompense
    setTimeout(() => {
        box.classList.remove("shake-chest");
        genererEtAfficherRecompense();
    }, 800);
}

function genererEtAfficherRecompense() {
    let xpGagne = 0;
    let itemObtenu = null;
    let itemIcone = "";
    let itemName = "";

   playSFX('reward'); // 💎 SON DE PIÈCES / RÉCOMPENSE
    
    const tirageRarete = Math.random();

    if (currentChestType === "Quotidien") {
        xpGagne = Math.floor(Math.random() * 51) + 50; // 50 à 100 XP

        if (tirageRarete < 0.35) {
            itemObtenu = "bonus_question"; itemIcone = "🎲"; itemName = "Dé Chanceux";
            stats.bonusQuestion = (stats.bonusQuestion || 0) + 1;
        } else if (tirageRarete < 0.65) {
            itemObtenu = "shield"; itemIcone = "🛡️"; itemName = "Bouclier d'argent";
            stats.shields = (stats.shields || 0) + 1;
        } else if (tirageRarete < 0.85) {
            itemObtenu = "xp_boost"; itemIcone = "💜"; itemName = "Élixir Violet";
            stats.hasXpBoost = true;
        }
    } else {
        xpGagne = Math.floor(Math.random() * 16) + 10; // 10 à 25 XP

        if (tirageRarete < 0.15) { 
            itemObtenu = "chrono_bonus"; itemIcone = "⏳"; itemName = "+5s Sablier";
            stats.chronoBonus = (stats.chronoBonus || 0) + 5;
        }
    }

    stats.xp = (stats.xp || 0) + xpGagne;
    stats.progression = (stats.progression || 0) + xpGagne;
    
    while (stats.progression >= stats.level * 100) {
        stats.level++;
    playSFX('levelUp'); // 🏆 LEVEL UP GRÂCE AU COFFRE !
    }

    if (typeof saveUserStats === "function") saveUserStats();
    if (typeof updateHome === "function") updateHome();

    if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }

    const chestName = currentChestType === "Quotidien" ? "DORÉ" : "EN BOIS";
    const chestColor = currentChestType === "Quotidien" ? "#fbbf24" : "#94a3b8";

    let itemHTML = itemObtenu ? `
        <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; padding: 10px; border-radius: 12px; margin-top: 15px;">
            <span style="font-size: 2rem;">${itemIcone}</span>
            <p style="color: #22c55e; font-weight: bold; margin: 5px 0 0 0;">ITEM DROP : ${itemName} !</p>
        </div>
    ` : '';

    const modalHTML = `
        <div id="reward-modal-screen" class="reward-modal">
            <div class="reward-card" style="border-color: ${chestColor}; box-shadow: 0 0 30px ${chestColor}80;">
                <h1 style="font-size: 3rem; margin: 0;">🎉</h1>
                <h2 style="color: ${chestColor}; font-size: 1.8rem; margin: 10px 0;">BUTIN DU COFFRE ${chestName} !</h2>
                
                <p style="font-size: 2.5rem; font-weight: 900; color: #38bdf8; margin: 10px 0;">
                    +${xpGagne} XP 🪙
                </p>

                ${itemHTML}

                <button onclick="document.getElementById('reward-modal-screen').remove(); show('score');" 
                        style="margin-top: 25px; padding: 15px 30px; background: #f97316; border: none; border-radius: 12px; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer; width: 100%;">
                    RÉCUPÉRER LE BUTIN 🔥
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
// Variable globale pour suivre la catégorie active
let currentLeaderboardCategory = 'flames';

// ==========================================
// 🏆 CLASSEMENT SIMPLE ET FONCTIONNEL
// ==========================================
function switchLeaderboardCategory(category, element) {
    currentLeaderboardCategory = category;

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    loadRealLeaderboard();
}

function loadRealLeaderboard() {
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<p style="text-align:center; color:#94a3b8; padding: 20px;">Chargement...</p>';

    // Récupération dynamique de l'utilisateur connecté (LOCAL OU FIREBASE AUTH)
    const localUsername = localStorage.getItem('username') || localStorage.getItem('brainflamme_user') || "";
    const currentUserId = (typeof auth !== "undefined" && auth && auth.currentUser) ? auth.currentUser.uid : localStorage.getItem('brainflamme_uid');

    if (typeof database === "undefined" || !database) {
        listContainer.innerHTML = '<p style="text-align:center; color:#94a3b8; padding: 20px;">Firebase non connecté.</p>';
        return;
    }

    database.ref('joueurs').once('value').then(snapshot => {
        if (!snapshot.exists()) {
            listContainer.innerHTML = '<p style="text-align:center; color:#94a3b8; padding: 20px;">Aucun joueur enregistré.</p>';
            return;
        }

        let playersData = [];

        snapshot.forEach(childSnapshot => {
    const player = childSnapshot.val() || {};
    const key = childSnapshot.key || "";
    
    // 1. On cherche s'il y a un vrai nom dans Firebase
    let cleanName = (
        player.username || 
        player.pseudo || 
        player.name || 
        player.displayName || 
        player.user || 
        ""
    ).toString().trim();

    // 2. S'IL N'Y A AUCUN NOM EN BASE : 
    // Au lieu d'écrire "Anonyme", on prend la clé du joueur (ex: "Louis", "User_12", "Player3")
    if (!cleanName || cleanName.toLowerCase() === "anonyme") {
        cleanName = key; // Affiche directement le nom du dossier Firebase !
    }

    const streakVal = player.streak !== undefined ? player.streak : (player.flammes || 0);
    const xpVal = player.xp || 0;
    const levelVal = player.level || 1;
    const customAvatar = player.avatar || player.photoURL || player.avatarUrl || "";

    playersData.push({
        name: cleanName,
        flames: parseInt(streakVal) || 0,
        xp: parseInt(xpVal) || 0,
        level: parseInt(levelVal) || 1,
        avatar: customAvatar,
        key: key
    });
});

        // Tri par Flammes, XP ou Niveau
        const category = typeof currentLeaderboardCategory !== 'undefined' ? currentLeaderboardCategory : 'flames';
        playersData.sort((a, b) => {
            if (category === 'xp') return b.xp - a.xp;
            if (category === 'level') return b.level - a.level;
            return b.flames - a.flames;
        });

        listContainer.innerHTML = '';
        let rank = 1;
        let myRankFound = false;

        playersData.forEach(player => {
            let rankDisplay = `#${rank}`;
            let rankClass = '';

            if (rank === 1) { rankDisplay = '🥇'; rankClass = 'top-1'; }
            else if (rank === 2) { rankDisplay = '🥈'; rankClass = 'top-2'; }
            else if (rank === 3) { rankDisplay = '🥉'; rankClass = 'top-3'; }

            let valueDisplay = `${player.flames} 🔥`;
            if (category === 'xp') valueDisplay = `${player.xp} ⚡`;
            else if (category === 'level') valueDisplay = `Niv. ${player.level}`;

            // Détection du joueur connecté
            const isMe = (currentUserId && player.key === currentUserId) || 
                         (localUsername !== "" && player.name.toLowerCase() === localUsername.trim().toLowerCase());

            if (isMe && !myRankFound) {
                myRankFound = true;
                const myPos = document.getElementById('my-rank-position');
                const myName = document.getElementById('my-rank-name');
                const myVal = document.getElementById('my-rank-value');

                if (myPos) myPos.innerText = rankDisplay;
                if (myName) myName.innerText = player.name; // Affiche le VRAI nom du compte connecté
                if (myVal) myVal.innerText = valueDisplay;
            }

            // Gestion Avatar (Image URL, Emoji ou Initiale)
            let avatarHtml = '';
            if (player.avatar && (player.avatar.startsWith('http') || player.avatar.startsWith('data:image'))) {
                avatarHtml = `<img src="${player.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; flex-shrink:0;">`;
            } else if (player.avatar && player.avatar.length <= 4) {
                avatarHtml = `<div style="width:40px; height:40px; border-radius:50%; background: rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0;">${player.avatar}</div>`;
            } else {
                const initial = player.name.charAt(0).toUpperCase();
                avatarHtml = `<div style="width:40px; height:40px; border-radius:50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color:white; font-weight:bold; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">${initial}</div>`;
            }

            const item = document.createElement('div');
            item.className = `leaderboard-item ${rankClass} ${isMe ? 'my-score-highlight' : ''}`;

            item.innerHTML = `
                <span class="rank-badge">${rankDisplay}</span>
                <div class="player-info" style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                    ${avatarHtml}
                    <span class="player-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">
                        ${player.name} ${isMe ? '<span style="color:#22c55e; font-size:0.8rem; font-weight:bold;">(Toi)</span>' : ''}
                    </span>
                </div>
                <span class="score-tag">${valueDisplay}</span>
            `;
            listContainer.appendChild(item);

            rank++;
        });

        // Si le joueur local n'est pas encore dans la liste Firebase
        if (!myRankFound) {
            const myPos = document.getElementById('my-rank-position');
            const myName = document.getElementById('my-rank-name');
            const myVal = document.getElementById('my-rank-value');
            if (myPos) myPos.innerText = "#--";
            if (myName) myName.innerText = localUsername || "Moi";
            if (myVal) myVal.innerText = (typeof stats !== 'undefined' ? (stats.flammes || stats.streak || 0) : 0) + " 🔥";
        }

    }).catch(err => {
        console.error("Erreur classement :", err);
    });
}

function saveUserProfileToFirebase(username, streak, xp, level, avatar) {
    if (typeof database === "undefined" || !database) return;

    const userId = (typeof auth !== "undefined" && auth && auth.currentUser) 
        ? auth.currentUser.uid 
        : (localStorage.getItem('brainflamme_uid') || ("user_" + Date.now()));

    // Récupère le vrai pseudo saisi (priorité au localStorage si username n'est pas passé)
    const actualName = username || localStorage.getItem('username') || localStorage.getItem('brainflamme_user');

    if (!actualName) return; // Ne sauvegarde pas si pas de nom

    database.ref('joueurs/' + userId).update({
        username: actualName,
        pseudo: actualName,
        name: actualName,
        displayName: actualName,
        streak: parseInt(streak) || 0,
        flammes: parseInt(streak) || 0,
        xp: parseInt(xp) || 0,
        level: parseInt(level) || 1,
        avatar: avatar || localStorage.getItem('avatar') || "",
        lastSeen: Date.now()
    });
}
