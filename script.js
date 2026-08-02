// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyCzYz9-C-qnA8ZKd_E7aCBWOa9cCH_w24Y",
    databaseURL: "https://brainflamme-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "brainflamme",
    storageBucket: "brainflamme.firebasestorage.app",
    messagingSenderId: "200853989780",
    appId: "1:200853989780:web:94b21502105f8ae860c781"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth(); // 👈 Assure-toi d'avoir aussi cette ligne pour l'authentification !

// --- ÉCOUTEUR DE CONNEXION (Point 3) ---
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Utilisateur connecté :", user.displayName || user.uid);
        // On charge et rafraîchit le profil dès que Firebase confirme la connexion du compte
        renderProfile();
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
    { question: "Quel est le plus grand pays du monde ?", answers: ["Canada", "USA", "Chine", "Russie"], correct: 3, info: "Avec plus de 17 millions de km², la Russie est le plus grand pays de la planète." },
    { question: "Qui a peint 'La Jeune Fille à la perle' ?", answers: ["Vermeer", "Rembrandt", "Van Gogh", "Da Vinci"], correct: 0, info: "Ce chef-d'œuvre a été peint par le Néerlandais Johannes Vermeer vers 1665." },
    { question: "Comment se nomme la monnaie du Japon ?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, info: "Le Yen est la monnaie officielle du Japon depuis 1871." },
    { question: "Quel est le plus long fleuve du monde ?", answers: ["Amazone", "Nil", "Mississippi", "Yangzi"], correct: 1, info: "L'Amazone détient le record du débit le plus élevé, mais le Nil reste le plus long (environ 6 650 km)." },
    { question: "Quel est le plus grand océan de la Terre ?", answers: ["Océan Atlantique", "Océan Pacifique", "Océan Indien", "Océan Arctique"], correct: 1, info: "L'océan Pacifique couvre plus de 165 millions de km², soit plus que la totalité des terres émergées." },
    { question: "Combien de dents un adulte possède-t-il en général (dents de sagesse incluses) ?", answers: ["28", "30", "32", "36"], correct: 2, info: "Une dentition adulte complète comporte 32 dents : 8 incisives, 4 canines, 8 prémolaires et 12 molaires." },
    { question: "En quelle année le Titanic a-t-il coulé ?", answers: ["1912", "1905", "1918", "1923"], correct: 0, info: "Le Titanic a heurté un iceberg dans la nuit du 14 au 15 avril 1912 lors de son voyage inaugural." },
    { question: "Quel est l'élément chimique représenté par le symbole 'O' ?", answers: ["Or", "Oxygène", "Osmium", "Ozone"], correct: 1, info: "L'oxygène constitue environ 21% de l'air que nous respirons sur Terre." },
    { question: "Quelle est la capitale de l'Australie ?", answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2, info: "Canberra a été choisie comme capitale en 1908 comme compromis entre Sydney et Melbourne." },
    { question: "Qui a peint la Joconde ?", answers: ["Vincent van Gogh", "Claude Monet", "Léonard de Vinci", "Pablo Picasso"], correct: 2, info: "Léonard de Vinci a commencé à peindre La Joconde au début du XVIe siècle." },
    { question: "Quel est le plus long fleuve du monde ?", answers: ["Le Nil", "L'Amazone", "Le Mississippi", "Le Yangtze"], correct: 1, info: "L'Amazone est le fleuve le plus long (environ 6 992 km) et le plus puissant en terme de débit." },
    { question: "Combien d'os compte le corps humain adulte ?", answers: ["206", "300", "150", "250"], correct: 0, info: "À la naissance, les bébés ont environ 270 os, mais beaucoup fusionnent en grandissant pour atteindre 206." },
    { question: "Dans quel pays se trouvent les Pyramides de Gizeh ?", answers: ["Mexique", "Égypte", "Pérou", "Grèce"], correct: 1, info: "Ces pyramides ont été construites sous la IVe dynastie égyptienne, il y a plus de 4 500 ans." },
    { question: "Quel métal est liquide à température ambiante ?", answers: ["Le Mercure", "Le Plomb", "L'Étain", "Le Zinc"], correct: 0, info: "Le mercure (Hg) a un point de fusion de -38,83 °C, ce qui le rend liquide à température ambiante." },
    { question: "Quel est l'oiseau le plus rapide du monde en piqué ?", answers: ["L'Aigle royal", "Le Faucon pèlerin", "Le Colibri", "Le Martinet"], correct: 1, info: "Le Faucon pèlerin peut dépasser les 380 km/h lorsqu'il fonce en piqué sur sa proie." },
    { question: "Quel compositeur a écrit la 5ème Symphonie alors qu'il devenait sourd ?", answers: ["Mozart", "Beethoven", "Bach", "Chopin"], correct: 1, info: "Ludwig van Beethoven a commencé à perdre l'ouïe à la trentaine mais a continué à composer." },
    { question: "Quelle planète est connue sous le nom de 'Planète Rouge' ?", answers: ["Vénus", "Mars", "Jupiter", "Saturne"], correct: 1, info: "Sa couleur rouge provient de l'abondance d'oxyde de fer (la rouille) à sa surface." },
    { question: "Quel pays a offert la Statue de la Liberté aux États-Unis ?", answers: ["Le Royaume-Uni", "La France", "L'Espagne", "L'Italie"], correct: 1, info: "Conçue par Auguste Bartholdi, elle a été offerte pour célébrer le centenaire de la déclaration d'indépendance." },
    { question: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?", answers: ["1965", "1969", "1972", "1961"], correct: 1, info: "Neil Armstrong et Buzz Aldrin ont posé le pied sur la Lune le 20 juillet 1969 lors de la mission Apollo 11." },
    { question: "Quel est l'animal terrestre le plus rapide au monde ?", answers: ["Le Lion", "Le Guépard", "La Gazelle", "Le Léopard"], correct: 1, info: "Le guépard peut atteindre des vitesses de pointe d'environ 110 à 120 km/h sur de courtes distances." },
    { question: "Dans quel sport utilise-t-on les termes 'birdie', 'eagle' et 'bogey' ?", answers: ["Le Tennis", "Le Golf", "Le Badminton", "Le Polo"], correct: 1, info: "Ces termes désignent le nombre de coups joués par rapport au par fixé sur un trou." },
    { question: "Quelle est la capitale du Japon ?", answers: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct: 2, info: "Le grand Tokyo est la zone urbaine la plus peuplée au monde avec plus de 37 millions d'habitants." },
    { question: "Qui a écrit la saga littéraire 'Harry Potter' ?", answers: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Stephen King"], correct: 1, info: "Le premier tome, 'Harry Potter à l'école des sorciers', a été publié en 1997." },
    { question: "Quel organe filtre le sang pour produire l'urine ?", answers: ["Le Foie", "Les Rois", "Le Poumon", "La Rate"], correct: 1, info: "Les reins filtrent environ 180 litres de sang par jour pour éliminer les déchets métaboliques." },
    { question: "Quelle est la devise monétaire officielle du Royaume-Uni ?", answers: ["L'Euro", "Le Dollar", "La Livre Sterling", "Le Franc"], correct: 2, info: "La livre sterling est l'une des plus anciennes monnaies encore utilisées dans le monde." },
    { question: "Quel est le plus petit continent de la Terre par sa superficie ?", answers: ["L'Europe", "L'Océanie", "L'Antarctique", "L'Afrique"], correct: 1, info: "L'Océanie couvre environ 8,5 millions de km²." },
    { question: "Qui est le créateur du système d'exploitation Windows ?", answers: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], correct: 1, info: "Bill Gates a fondé Microsoft avec Paul Allen en 1975." },
    { question: "Quel est le nombre pi (π) arrondi à deux decimales ?", answers: ["3,12", "3,14", "3,16", "3,18"], correct: 1, info: "Pi est une constante mathématique irrationnelle approximée par 3,14159..." },
    { question: "Dans quel musée se trouve la célèbre peinture 'La Jeune Fille à la perle' ?", answers: ["Le Louvre", "Le Mauritshuis", "Le Prado", "Le MoMA"], correct: 1, info: "Ce chef-d'œuvre de Johannes Vermeer est conservé au musée Mauritshuis à La Haye (Pays-Bas)." },
    { question: "Combien de côtés possède un octogone ?", answers: ["6", "7", "8", "10"], correct: 2, info: "Un octogone a 8 côtés et 8 angles." },
    { question: "Quelle est la plus grande forêt tropicale de la planète ?", answers: ["La forêt du Congo", "L'Amazonie", "La forêt de Taïga", "La forêt de Bornéo"], correct: 1, info: "L'Amazonie abrite environ 10% de la biodiversité connue dans le monde." },
    { question: "Qui a réalisé le film 'Titanic' et 'Avatar' ?", answers: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Quentin Tarantino"], correct: 2, info: "James Cameron détient plusieurs records du box-office mondial grâce à ces deux films." },
    { question: "Combien de cœurs possède une pieuvre ?", answers: ["1", "2", "3", "4"], correct: 2, info: "Une pieuvre possède 3 cœurs : deux pour irriguer les branchies et un pour le reste du corps." },
    { question: "Dans quel pays se trouve la tour de Pise ?", answers: ["Espagne", "France", "Italie", "Portugal"], correct: 2, info: "La tour penche en raison d'un affaissement du sol sur lequel ses fondations ont été construites." },
    { question: "Quel gaz les plantes absorbent-elles principalement lors de la photosynthèse ?", answers: ["L'Oxygène", "Le Dioxyde de carbone (CO2)", "L'Azote", "L'Hydrogène"], correct: 1, info: "Elles captent le CO2 pour fabriquer du glucose et rejettent de l'oxygène dans l'atmosphère." },
    { question: "En quelle année a eu lieu la Révolution Française ?", answers: ["1789", "1799", "1815", "1776"], correct: 0, info: "La prise de la Bastille le 14 juillet 1789 est un événement emblématique de cette révolution." },
    { question: "Quel est le dessert traditionnel italien à base de café et de mascarpone ?", answers: ["Le Panna Cotta", "Le Tiramisu", "Le Cannoli", "Le Gelato"], correct: 1, info: "'Tiramisù' signifie littéralement 'redonne-moi du peps' ou 'remonte-moi le moral' en italien." },
    { question: "Quel est l'instrument à vent le plus grand de l'orchestre symphonique ?", answers: ["La Flûte traversière", "Le Tuba", "Le Claricorne", "Le Trombone"], correct: 1, info: "Le tuba est le membre le plus grave et le plus massif de la famille des cuivres." },
    { question: "Combien de couleurs contient un arc-en-ciel traditionnel ?", answers: ["5", "6", "7", "8"], correct: 2, info: "Isaac Newton a identifié 7 couleurs : rouge, orange, jaune, vert, bleu, indigo et violet." },
    { question: "Quelle est la capitale de l'Espagne ?", answers: ["Barcelone", "Séville", "Madrid", "Valence"], correct: 2, info: "Madrid est la plus grande ville d'Espagne et le siège du gouvernement royal." },
    { question: "Qui est le dieu grec de la mer ?", answers: ["Zeus", "Poséidon", "Hadès", "Ares"], correct: 1, info: "Son équivalent dans la mythologie romaine est le dieu Neptune." },
    { question: "Quel est le pays le plus vaste du monde en terme de superficie ?", answers: ["Le Canada", "La Chine", "La Russie", "Les États-Unis"], correct: 2, info: "La Russie s'étend sur plus de 17 millions de kilomètres carrés et chevauche deux continents." },
    { question: "Combien de joueurs composent une équipe de football sur le terrain ?", answers: ["9", "10", "11", "12"], correct: 2, info: "Une équipe compte 10 joueurs de champ et 1 gardien de but." },
    { question: "Quelle vitamine est principalement synthétisée par le corps grâce à l'exposition au soleil ?", answers: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine K"], correct: 2, info: "Les rayons UVB du soleil transforment le cholestérol de la peau en vitamine D." },
    { question: "Quel pays est surnommé 'Le pays du soleil levant' ?", answers: ["La Chine", "Le Japon", "La Corée du Sud", "La Thaïlande"], correct: 1, info: "Ce surnom provient du fait que le Japon se situe à l'est de la Chine continentale." },
    { question: "Dans quel sport s'est illustré Michael Jordan ?", answers: ["Le Baseball", "Le Basketball", "Le Football Américain", "L'Athlétisme"], correct: 1, info: "Considéré comme l'un des plus grands sportifs de tous les temps, il a remporté 6 titres NBA avec les Chicago Bulls." },
    { question: "Quel auteur français a écrit 'Les Misérables' ?", answers: ["Émile Zola", "Victor Hugo", "Gustave Flaubert", "Molière"], correct: 1, info: "Ce roman monumental publié en 1862 décrit la vie de miséreux dans le Paris du XIXe siècle." },
    { question: "Combien de semaines y a-t-il dans une année civile classique ?", answers: ["48", "50", "52", "54"], correct: 2, info: "Une année compte 365 jours, soit 52 semaines complètes plus 1 jour (ou 2 en année bissextile)." },
    { question: "Quel est le plus grand mammifère du monde ?", answers: ["L'Éléphant d'Afrique", "La Baleine bleue", "Le Requin-baleine", "Le Rorqual"], correct: 1, info: "La baleine bleue peut mesurer jusqu'à 30 mètres de long et peser près de 180 tonnes." },
    { question: "Quel célèbre physicien a développé la théorie de la relativité ?", answers: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Stephen Hawking"], correct: 1, info: "Sa célèbre formule E=mc² décrit l'équivalence entre la masse et l'énergie." },
    { question: "Quelle est la capitale du Canada ?", answers: ["Toronto", "Montréal", "Ottawa", "Vancouver"], correct: 2, info: "Ottawa a été choisie par la reine Victoria en 1857 pour des raisons stratégiques et linguistiques." },
    { question: "Quelle est la boisson la plus consommée au monde après l'eau ?", answers: ["Le Café", "Le Thé", "Le Coca-Cola", "La Bière"], correct: 1, info: "Des milliards de tasses de thé sont bues chaque jour à travers le globe." },
    { question: "Quel élément chimique a pour symbole 'Fe' ?", answers: ["Le Fluor", "Le Fer", "Le Francium", "L'Étain"], correct: 1, info: "Le symbole vient du mot latin pour le fer : 'Ferrum'." },
    { question: "En quelle année est tombé le mur de Berlin ?", answers: ["1985", "1989", "1991", "1993"], correct: 1, info: "La chute du mur le 9 novembre 1989 a marqué la fin symbolique de la guerre froide." },
    { question: "Combien y a-t-il d'os chez un adulte ?", answers: ["186", "206", "226", "256"], correct: 1, info: "Le squelette d'un adulte compte 206 os. À la naissance, les bébés en ont environ 270." },
    { question: "Quel est le symbole chimique de l'Or ?", answers: ["Ag", "Fe", "Au", "Pb"], correct: 2, info: "Le symbole 'Au' vient du mot latin 'Aurum', qui signifie 'aurore éclatante'." },
    { question: "Comment s'appelle la planète la plus chaude ?", answers: ["Mercure", "Vénus", "Mars", "Jupiter"], correct: 1, info: "Vénus est la plus chaude (460°C) car son atmosphère épaisse de CO2 piège la chaleur." },
    { question: "Qui a découvert la pénicilline ?", answers: ["Curie", "Pasteur", "Fleming", "Einstein"], correct: 2, info: "Alexander Fleming a découvert le premier antibiotique par erreur en 1928." },
    { question: "Quelle équipe a gagné la Coupe du Monde de football 2018 ?", answers: ["Allemagne", "Brésil", "France", "Argentine"], correct: 2, info: "L'équipe de France a remporté sa deuxième étoile en battant la Croatie 4-2." },
    { question: "Quelle est la langue la plus parlée dans le monde (nombre total) ?", answers: ["Anglais", "Espagnol", "Mandarin", "Hindi"], correct: 0, info: "L'anglais est la langue la plus parlée au monde avec plus de 1,4 milliard de locuteurs." },
    { question: "Dans quel océan se trouve Madagascar ?", answers: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 1, info: "Madagascar est située au large de l'Afrique de l'Est, dans l'océan Indien." },
    { question: "Comment s'appelle le sommet le plus haut du monde ?", answers: ["K2", "Mont Blanc", "Annapurna", "Everest"], correct: 3, info: "Situé dans l'Himalaya, le mont Everest culmine à 8 848 mètres d'altitude." },
    { question: "Quel auteur connu a écrit 'Les Misérables' ?", answers: ["Zola", "Hugo", "Flaubert", "Balzac"], correct: 1, info: "Victor Hugo a publié ce roman historique et social en 1862." },
    { question: "Quel est le numéro atomique de l'Hydrogène ?", answers: ["1", "2", "10", "12"], correct: 0, info: "L'Hydrogène est l'élément le plus simple de l'univers, avec un seul proton." },
    { question: "Comment s'appelle la capitale du Canada ?", answers: ["Toronto", "Montréal", "Ottawa", "Vancouver"], correct: 2, info: "Ottawa a été désignée capitale par la reine Victoria en 1857." },
    { question: "Sous quel nom est connue la cité ensevelie par le Vésuve ?", answers: ["Rome", "Athènes", "Pompéi", "Carthage"], correct: 2, info: "En l'an 79 après J.-C., l'éruption du Vésuve a figé la ville de Pompéi sous les cendres." },
    { question: "Parmi les propositions suivantes, quel oiseau ne peut pas voler ?", answers: ["Aigle", "Autruche", "Perroquet", "Faucon"], correct: 1, info: "L'autruche est le plus grand des oiseaux. Elle peut courir jusqu'à 70 km/h." },
    { question: "À quelle vitesse la lumière se propage-t-elle ?", answers: ["150k km/s", "300k km/s", "500k km/s", "1M km/s"], correct: 1, info: "La lumière voyage à environ 300 000 kilomètres par seconde." },
    { question: "Comment s'appelle le plus grand désert chaud du monde ?", answers: ["Gobi", "Sahara", "Atacama", "Kalahari"], correct: 1, info: "Le Sahara couvre 9 millions de km², soit presque la taille des États-Unis." },
    { question: "Sous quel nom connaît-on le principal inventeur du téléphone ?", answers: ["Edison", "Tesla", "Graham Bell", "Newton"], correct: 2, info: "Alexander Graham Bell a déposé le premier brevet pour un téléphone électrique en 1876." },
    { question: "Quelle est la capitale de l'Italie ?", answers: ["Milan", "Florence", "Rome", "Naples"], correct: 2, info: "Surnommée la 'Ville Éternelle', Rome abrite en son sein le Vatican." },
    { question: "Combien de cœurs possède une pieuvre ?", answers: ["1", "2", "3", "4"], correct: 2, info: "La pieuvre possède trois cœurs pour pomper son sang bleu." },
    { question: "Quel est le plus petit pays du monde ?", answers: ["Monaco", "Vatican", "Malte", "San Marin"], correct: 1, info: "Le Vatican ne fait que 0,44 km²." },
    { question: "Comment se nomme la mer qui se situe entre Jordanie et Israël ?", answers: ["Mer Rouge", "Mer Noire", "Mer Morte", "Méditerranée"], correct: 2, info: "La Mer Morte est si salée qu'elle permet aux humains de flotter sans effort." },
    { question: "Dans quel groupe Freddie Mercury a-t-il joué ?", answers: ["Beatles", "Led Zep", "Queen", "U2"], correct: 2, info: "Freddie Mercury était le chanteur du groupe de rock britannique Queen." },
    { question: "Qui a peint la Chapelle Sixtine ?", answers: ["Picasso", "Michel-Ange", "Raphaël", "Donatello"], correct: 1, info: "Michel-Ange a mis quatre ans pour peindre les fresques du plafond." },
    { question: "Lequel de ces fruits est le plus produit au monde ?", answers: ["Banane", "Pomme", "Tomate", "Orange"], correct: 2, info: "La tomate est botaniquement un fruit. C'est la culture la plus produite sur Terre." },
    { question: "Combien de dents a un adulte ?", answers: ["28", "30", "32", "34"], correct: 2, info: "Un adulte possède normalement 32 dents, dents de sagesse incluses." },
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
    { question: "Quelle équipe nationale de football est surnommée la 'Seleção' ?", answers: ["Le Portugal", "L'Espagne", "Le Brésil", "La Colombie"], correct: 2, info: "Le terme 'Seleção' signifie tout simplement 'Sélection' en portugais." },
    { question: "Quel est le jeu vidéo le plus vendu de tous les temps ?", answers: ["Tetris", "Minecraft", "GTA V", "Wii Sports"], correct: 1, info: "Minecraft dépasse les 300 millions d'exemplaires vendus à travers le monde." },
    { question: "Quel personnage est la mascotte officielle de Nintendo ?", answers: ["Link", "Donkey Kong", "Mario", "Pikachu"], correct: 2, info: "Créé par Shigeru Miyamoto, Mario est apparu pour la première fois en 1981 dans Donkey Kong." },
    { question: "Dans quelle franchise de jeu vidéo incarne-t-on le personnage de Link ?", answers: ["Final Fantasy", "The Legend of Zelda", "Dragon Quest", "Fire Emblem"], correct: 1, info: "Le héros vêtu de vert cherche toujours à sauver la princesse Zelda et le royaume d'Hyrule." },
    { question: "Quel studio de développement a créé le jeu 'The Witcher 3: Wild Hunt' ?", answers: ["Ubisoft", "CD Projekt Red", "Bethesda", "Bioware"], correct: 1, info: "Le studio polonais CD Projekt Red s'est basé sur les romans de Andrzej Sapkowski." },
    { question: "Quel jeu de Battle Royale phénomène a été développé par Epic Games ?", answers: ["PUBG", "Apex Legends", "Fortnite", "Warzone"], correct: 2, info: "Sorti en 2017, Fortnite est devenu un véritable phénomène culturel mondial." },
    { question: "Quelle est la ville fictive dans laquelle se déroule principalement GTA V ?", answers: ["Liberty City", "Vice City", "San Fierro", "Los Santos"], correct: 3, info: "Los Santos est une satire inspirée directement de la ville de Los Angeles." },
    { question: "Quel est le nom du hérisson bleu mascotte de SEGA ?", answers: ["Shadow", "Sonic", "Tails", "Knuckles"], correct: 1, info: "Sonic a été conçu en 1991 pour rivaliser directement avec le succès de Mario chez Nintendo." },
    { question: "Dans le Pokédex national, quel Pokémon porte le numéro 0001 ?", answers: ["Pikachu", "Salamèche", "Bulbizarre", "Mew"], correct: 2, info: "Bulbizarre est le tout premier Pokémon du Pokédex de la région de Kanto." },
    { question: "Quel jeu de tir à la première personne culte oppose Terroristes et Anti-Terroristes ?", answers: ["Call of Duty", "Counter-Strike", "Overwatch", "Battlefield"], correct: 1, info: "Né comme un simple mod de Half-Life en 1999, Counter-Strike est devenu un pilier de l'esport." },
    { question: "Sur quelle console la série de jeux 'Uncharted' a-t-elle fait ses débuts ?", answers: ["PlayStation 2", "PlayStation 3", "Xbox 360", "PlayStation 4"], correct: 1, info: "Uncharted: Drake's Fortune est sorti en 2007 sur PlayStation 3." },
    { question: "Quelle est la capitale de l'Allemagne ?", answers: ["Munich", "Francfort", "Hambourg", "Berlin"], correct: 3, info: "Berlin est la capitale de l'Allemagne réunifiée depuis 1990." },
    { question: "Quelle est la capitale du Portugal ?", answers: ["Lisbonne", "Porto", "Faro", "Coimbra"], correct: 0, info: "Lisbonne est l'une des plus vieilles villes d'Europe." },
    { question: "Quelle planète est surnommée 'Planète rouge' ?", answers: ["Vénus", "Mars", "Saturne", "Neptune"], correct: 1, info: "Mars doit sa couleur à l'oxyde de fer (rouille) à sa surface." },
    { question: "Qui a peint 'La Cène' ?", answers: ["Michel-Ange", "Da Vinci", "Raphaël", "Titien"], correct: 1, info: "Léonard de Vinci a réalisé cette fresque célèbre à Milan." },
    { question: "Quel est le seul métal liquide à température ambiante ?", answers: ["Plomb", "Mercure", "Étain", "Argent"], correct: 1, info: "Le mercure est le seul métal liquide à température ambiante." },
    { question: "Quelle est la capitale de la Chine ?", answers: ["Shanghai", "Canton", "Pékin", "Shenzhen"], correct: 2, info: "Pékin est le cœur politique de la Chine et proche de la Grande Muraille." },
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
    { question: "En quelle année a eu lieu la chute du mur de Berlin ?", answers: ["1989", "1991", "1987", "1985"], correct: 0, info: "Le mur est tombé le 9 novembre 1989, marquant la fin symbolique de la Guerre Froide." },
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
    { question: "Quelle est la température moyenne sur Terre ?", answers: ["10°C", "15°C", "20°C", "30°C"], correct: 1, info: "L'effet de serre naturel permet de maintenir une moyenne d'environ 15°C." }
];

const titles = ["Étincelle 🕯️", "Braise 🪵", "Brise-Glace ❄️", "Torche 🔦", "Brasier 🔥", "Or 🏆", "Diamant 💎"]; // Ajout Or et Diamant

let stats = {
    xp: 0,
    level: 1,
    progression: 0,
    streak: 0,
    shields: 0,
    chronoBonus: 0,
    bonusQuestion: 0,
    hasXpBoost: false,
    hasAura: false
};

let current = 0, score = 0, timerInterval, timeLeft, currentQuestions = [], selectedMode = "";
let dailyTimerInterval;
let quizHistory = []; // AJOUT ICI : mémorise les réponses du joueur

// --- INITIALISATION AU CHARGEMENT ---
window.onload = () => {
    setupLogin(); // On prépare le bouton quoi qu'il arrive
    
    const savedUser = localStorage.getItem("brainflamme_user");
    if (savedUser) { 
        loadUserStatsFromCloud(savedUser); 
    } else {
        show("login-screen");
    }
};

function setupLogin() {
    const loginBtn = document.getElementById("loginBtn");
    const input = document.getElementById("username-input");

    if (loginBtn && input) {
        loginBtn.onclick = () => {
            const username = input.value.trim();
            if (username) {
                localStorage.setItem("brainflamme_user", username);
                
                if (typeof database !== "undefined" && database) {
                    database.ref('joueurs/' + username).once('value').then((snapshot) => {
                        if (snapshot.exists()) {
                            stats = Object.assign({}, stats, snapshot.val());
                        } else {
                            saveUserStats();
                        }
                        updateHome(); 
                        show("home-screen");
                    }).catch(err => {
                        console.error("Erreur Firebase fallback local:", err);
                        chargerStatsLocales(username);
                    });
                } else {
                    chargerStatsLocales(username);
                }
            } else {
                alert("Choisis un pseudo pour commencer ! 🔥");
            }
        };
    }
}

function chargerStatsLocales(username) {
    const saved = localStorage.getItem("brainflamme_stats_" + username);
    if (saved) {
        stats = Object.assign({}, stats, JSON.parse(saved));
    } else {
        saveUserStats();
    }
    updateHome();
    show("home-screen");
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

function loadUserStatsFromCloud(username) {
    if (typeof database === "undefined" || !database) {
        chargerStatsLocales(username);
        return;
    }

    database.ref('joueurs/' + username).once('value').then((snapshot) => {
        const cloudData = snapshot.val();
       
        if (cloudData) {
            stats = Object.assign({}, stats, cloudData);
            
            if (stats.shields === undefined) stats.shields = 0;
            if (stats.progression === undefined) stats.progression = stats.xp;
            if (stats.hasAura === undefined) stats.hasAura = false;

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
            chargerStatsLocales(username);
        }
        
        updateHome(); 
        show("home-screen");
    }).catch(err => {
        console.error("Erreur Cloud:", err);
        chargerStatsLocales(username);
    });
}

// --- LOGIQUE DU JEU ---

document.getElementById("startBtn").onclick = () => {
    show("modeSelection");
    checkDailyStatus();
};

document.getElementById("chronoMode").onclick = () => {
    selectedMode = "Chrono";
    quizHistory = [];
    score = 0;
    current = 0;
    bonusSuccess = false;
    
    const timerBox = document.getElementById("timerContainer");
    if (timerBox) timerBox.style.display = "block";
    
    currentQuestions = [...questionsData].sort(() => Math.random() - 0.5);

    // ⏱️ Temps de base = 30s
    let durance = 30;

    // 💡 Si le joueur a l'item Bonus de Temps (+5s) en réserve :
    if (stats.chronoBonus && stats.chronoBonus > 0) {
        durance += stats.chronoBonus; // Ajoute les +5s (fait passer à 35s)
        stats.chronoBonus = 0;        // Consomme le bonus pour cette partie
        saveUserStats();               // Sauvegarde la consommation
    }

    startChronoTimer(durance);

    show("quiz");
    showQuestion();
};

// Mode Quotidien (Corrigé : charge questionsData au lieu de dailyQuestions inexistant)
document.getElementById("dailyMode").onclick = () => {
    selectedMode = "Quotidien";
    quizHistory = [];
    score = 0;
    current = 0;
    
    const timerBox = document.getElementById("timerContainer");
    if (timerBox) timerBox.style.display = "none";
    
    currentQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, 5);

    show("quiz");
    showQuestion();
};

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
function startChronoTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    maxChronoTime = seconds;
    
    updateTimerUI();

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        updateTimerUI();

        // ⏱️ Quand le temps est écoulé :
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // Si le joueur a l'item bonus en réserve
            if (stats.bonusQuestion && stats.bonusQuestion > 0) {
                stats.bonusQuestion--;
                saveUserStats();
                lancerQuestionBonus(); // 👈 On lance la prolongation bonus !
            } else {
                endQuiz();
            }
        }
    }, 100);
}

function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = "block";
    }

    if (id === "shop-screen" && typeof updateShopDisplay === "function") { 
        updateShopDisplay();
    }

    const welcomeUser = document.getElementById("welcome-user");
    if (welcomeUser) {
        welcomeUser.style.textShadow = stats.hasAura ? "0 0 15px #22d3ee" : "none";
    }

    const nav = document.getElementById("main-nav");
    if (nav) {
        if (id === "login-screen" || id === "quiz") {
            nav.style.display = "none";
        } else {
            const user = localStorage.getItem("brainflamme_user");
            nav.style.display = user ? "flex" : "none";
        }
    }
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
                score += 1;
                
                if (q.isBonus) {
                    bonusSuccess = true;
                }
            } else { 
                b.classList.add("wrong");
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

function endQuiz() {
    clearInterval(timerInterval);
    clearInterval(dailyTimerInterval);

    if (isNaN(stats.xp) || stats.xp === undefined) stats.xp = 0;
    if (isNaN(stats.progression) || stats.progression === undefined) stats.progression = 0;
    if (isNaN(stats.level) || !stats.level) stats.level = 1;

    // Calcul standard (10 XP par bonne réponse)
let gain = score * 10; 

// 👈 AJOUTE CECI : 10 XP supplémentaires si la question bonus a été réussie (= XP doublée)
if (typeof bonusSuccess !== "undefined" && bonusSuccess) {
    gain += 10; 
    bonusSuccess = false;
}
    
    stats.xp += gain;
    stats.progression += gain;

    while (stats.progression >= stats.level * 100) {
        stats.level++;
    }

    if (selectedMode === "Quotidien") {
        const user = localStorage.getItem("brainflamme_user");
        localStorage.setItem("daily_done_" + user, new Date().toLocaleDateString());
        
        stats.streak = (stats.streak || 0) + 1;
        stats.lastPlayDate = new Date().toDateString(); 
        
        checkDailyStatus();
    }

    saveUserStats();
    continuerAffichageScore(gain);
}

function continuerAffichageScore(gain) {
    show("score");

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
            const currentLevelXP = stats.progression % 100; 
            bar.style.width = currentLevelXP + "%";
        }
    }, 100);

    if (score === nbQuestionsPosees && selectedMode === "Quotidien" && typeof lancerConfettis === "function") {
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

function checkDailyStatus() {
    const user = localStorage.getItem("brainflamme_user");
    const lastDate = localStorage.getItem("daily_done_" + user);
    const today = new Date().toLocaleDateString();
    const btn = document.getElementById("dailyMode");

    if (!btn) return;

    clearInterval(dailyTimerInterval);

    if (lastDate === today) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";

        dailyTimerInterval = setInterval(() => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);

            const diff = midnight - now;

            if (diff <= 0) {
                clearInterval(dailyTimerInterval);
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.innerText = "Mode Quotidien 📅";
            } else {
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                btn.innerText = `Disponible dans ${h}h ${m}m ${s}s`;
            }
        }, 1000);
    } else {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.innerText = "Mode Quotidien 📅";
    }
}

function updateShopDisplay() {
    const shopXp = document.getElementById("shop-xp");
    if (shopXp) {
        shopXp.textContent = stats.xp; 
    }
}

function updateHome() {
    const titleIndex = Math.min(Math.floor(stats.level / 10), 6);
    const user = localStorage.getItem("brainflamme_user");
    
    const welcomeElem = document.getElementById("welcome-user");
    const rankElem = document.getElementById("player-level");
    const streakElem = document.getElementById("streak-number");
    const xpBar = document.getElementById("xp-bar-fill");

    if (welcomeElem) {
        welcomeElem.textContent = "Salut, " + user;
        
        if (stats.nameColor && stats.nameColor !== "") {
            welcomeElem.classList.remove("default-style");
            welcomeElem.style.webkitTextFillColor = stats.nameColor; 
            welcomeElem.style.color = stats.nameColor;
        } else {
            welcomeElem.classList.add("default-style");
        }

        if (stats.hasAura) {
            welcomeElem.style.textShadow = "0 0 15px #22d3ee, 0 0 5px #22d3ee";
            welcomeElem.style.fontWeight = "bold";
        } else {
            welcomeElem.style.textShadow = "none";
        }
    }

    if (rankElem) {
        rankElem.textContent = "Niveau " + stats.level + " - " + titles[titleIndex];
        rankElem.style.color = stats.rankColor ? stats.rankColor : "#fbbf24";
    }

    if (streakElem) streakElem.textContent = stats.streak;

    if (xpBar) {
        const currentLevelProgression = stats.progression % 100; 
        xpBar.style.width = currentLevelProgression + "%";
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
    const timerBox = document.getElementById("timerContainer");
    if (timerBox) timerBox.style.display = "none";

    // Préparer la question bonus ultime
    let bonusQ = { ...questionsData[Math.floor(Math.random() * questionsData.length)] };
    bonusQ.isBonus = true;

    currentQuestions = [bonusQ];
    current = 0;

    showQuestion();
}
// ==========================================
// 👤 LOGIQUE DU PROFIL & DE LA PHOTO
// ==========================================

// 🔄 GESTION DES ONGLETS DE LA BARRE DU BAS
function switchTab(screenId, clickedBtn) {
    // 1. Liste de tous les écrans principaux à masquer
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

    // 2. On masque tous les écrans
    allScreens.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
        }
    });

    // 3. On affiche UNIQUEMENT l'écran cliqué
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
    }

    // 4. On met à jour le bouton actif dans le menu du bas
    const buttons = document.querySelectorAll('.bottom-nav .nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }

    // 5. Actions spécifiques selon l'onglet ouvert
    if (screenId === 'home-screen' && typeof updateHome === 'function') {
        updateHome();
    } else if (screenId === 'shop-screen' && typeof updateShopDisplay === 'function') {
        updateShopDisplay();
    } else if (screenId === 'profile' && typeof renderProfile === 'function') {
        renderProfile();
    }
}

// 👤 MISE À JOUR DYNAMIQUE DU PROFIL
function renderProfile() {
    // 1. Récupération du pseudo
    const currentUsername = localStorage.getItem("brainflamme_user") || "Joueur";

    // Affichage Pseudo & Tag
    const nameEl = document.getElementById("profileUsername");
    const tagEl = document.querySelector(".user-tag");
    if (nameEl) nameEl.textContent = currentUsername;
    if (tagEl) tagEl.textContent = "@" + currentUsername.toLowerCase().replace(/\s+/g, '');

    // 2. Mise à jour de la barre d'XP (basée sur l'objet stats)
    const currentXp = (stats && stats.xp) ? stats.xp : 0;
    const currentLevel = (stats && stats.level) ? stats.level : 1;
    const currentProgression = (stats && stats.progression) ? (stats.progression % 100) : (currentXp % 100);

    if (document.getElementById("xpText")) {
        document.getElementById("xpText").textContent = `${currentProgression} / 100 XP`;
    }
    if (document.getElementById("xpBarFill")) {
        document.getElementById("xpBarFill").style.width = currentProgression + "%";
    }

    // 3. Stats (Flammes / Niveau)
    if (document.getElementById("profileCurrentFlame")) {
        document.getElementById("profileCurrentFlame").textContent = stats.streak || 0;
    }
    if (document.getElementById("profileMaxFlame")) {
        document.getElementById("profileMaxFlame").textContent = "🔥 " + (stats.streak || 0);
    }
    if (document.getElementById("profileLevel")) {
        document.getElementById("profileLevel").textContent = "Niv. " + currentLevel;
    }

    // 4. Charger l'avatar et les amis depuis les stats
    if (stats.avatar && document.getElementById("avatarImg")) {
        document.getElementById("avatarImg").src = stats.avatar;
    }

    if (!stats.friends) stats.friends = [];
    renderFriends(stats.friends);
}

function updateAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            
            // 1. Mise à jour visuelle
            const img = document.getElementById("avatarImg");
            if (img) img.src = imageDataUrl;
            
            // 2. Enregistrement dans les stats
            stats.avatar = imageDataUrl;
            saveUserStats();
            console.log("🔥 Avatar enregistré avec succès !");
        };
        reader.readAsDataURL(file);
    }
}

function addFriend() {
    const input = document.getElementById("friendInput");
    if (!input) return;
    
    const friendName = input.value.trim();
    if (friendName === "") return;

    // ⛔ SÉCURITÉ : Récupérer son propre pseudo dans localStorage
    const myOwnName = localStorage.getItem("brainflamme_user") || "";

    // Si on essaie de s'ajouter soi-même
    if (myOwnName && friendName.toLowerCase() === myOwnName.toLowerCase()) {
        alert("Vous ne pouvez pas vous ajouter vous-même en ami !");
        input.value = "";
        return;
    }

    if (!stats.friends) stats.friends = [];

    // Éviter les doublons
    if (!stats.friends.some(f => f.toLowerCase() === friendName.toLowerCase())) {
        stats.friends.push(friendName);
        
        // Mettre à jour l'affichage
        renderFriends(stats.friends);

        // Sauvegarder dans Firebase Realtime Database
        saveUserStats();
        alert(`Ami ${friendName} ajouté avec succès !`);
    } else {
        alert("Cet ami est déjà dans ta liste !");
    }

    input.value = "";
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
        
        // Clic sur l'ami pour voir son profil
        li.onclick = function() {
            showFriendProfile(friend);
        };

        li.innerHTML = `<span>👤 <strong>${friend}</strong></span> <span style="font-size:0.8rem; color:#f97316;">Voir ➔</span>`;
        list.appendChild(li);
    });
}
// Fonction pour mettre à jour la fonction show() d'origine
const originalShow = window.show;
window.show = function(screenId) {
    // Liste de tous les écrans du jeu
    const screens = ['login-screen', 'home-screen', 'shop-screen', 'modeSelection', 'quiz', 'profile', 'score', 'leaderboard-screen'];
    
    // On cache tous les écrans
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // On affiche uniquement l'écran demandé
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
    }
};

// Gestion de la couleur orange sur le bouton de la barre active
function setNavActive(clickedBtn) {
    const buttons = document.querySelectorAll('.bottom-nav .nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
}
// 👤 AFFICHER LE PROFIL D'UN AMI
function showFriendProfile(friendName) {
    const nameEl = document.getElementById("profileUsername");
    const tagEl = document.querySelector(".user-tag");
    
    if (nameEl) nameEl.textContent = friendName;
    if (tagEl) tagEl.textContent = "@" + friendName.toLowerCase().replace(/\s+/g, '');

    // Génère des stats fictives/aléatoires pour l'ami (ou lis-les depuis Firebase si tu les as)
    const mockFlame = Math.floor(Math.random() * 20) + 1;
    const mockLevel = Math.floor(Math.random() * 5) + 1;

    if (document.getElementById("profileCurrentFlame")) document.getElementById("profileCurrentFlame").textContent = mockFlame;
    if (document.getElementById("profileMaxFlame")) document.getElementById("profileMaxFlame").textContent = "🔥 " + (mockFlame + 5);
    if (document.getElementById("profileLevel")) document.getElementById("profileLevel").textContent = "Niv. " + mockLevel;
    if (document.getElementById("xpText")) document.getElementById("xpText").textContent = "50 / 100 XP";
    if (document.getElementById("xpBarFill")) document.getElementById("xpBarFill").style.width = "50%";

    // Photo par défaut pour l'ami
    if (document.getElementById("avatarImg")) {
        document.getElementById("avatarImg").src = "https://via.placeholder.com/100?text=" + friendName.charAt(0).toUpperCase();
    }

    // Cache la zone "Ajouter des amis" pendant qu'on consulte le profil d'un ami
    const socialSec = document.querySelector(".social-section");
    if (socialSec) {
        socialSec.innerHTML = `
            <button onclick="renderProfile(); restoreSocialSection();" style="width:100%; padding:10px; background:#f97316; border:none; border-radius:10px; color:white; font-weight:bold; cursor:pointer;">
                ← Retour à Mon Profil
            </button>
        `;
    }
}

// Restaure la boîte d'ajout d'amis quand on revient sur son profil
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
        // Recharge la liste des amis
        if (typeof stats !== 'undefined' && stats.friends) {
            renderFriends(stats.friends);
        } else {
            renderFriends([]);
        }
    }
}
