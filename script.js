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
    { question: "Quel est l'organe le plus lourd du corps ?", answers: ["Cerveau", "Foie", "Cœur", "Poumons"], correct: 1, info: "Le foie est l'organe interne le plus massif, pesant environ 1,5 kg. Il assure plus de 500 fonctions vitales." },
    { question: "En quelle année l'Homme a marché pour la première fois sur la Lune ?", answers: ["1962", "1969", "1972", "1965"], correct: 1, info: "Le 21 juillet 1969, Neil Armstrong est devenu le premier humain à marcher sur la Lune lors de la mission Apollo 11." },
    { question: "Quel est le plus grand pays du monde ?", answers: ["Canada", "USA", "Chine", "Russie"], correct: 3, info: "Avec plus de 17 millions de km², la Russie est le plus grand pays de la planète." },
    { question: "Qui a peint 'La Jeune Fille à la perle' ?", answers: ["Vermeer", "Rembrandt", "Van Gogh", "Da Vinci"], correct: 0, info: "Ce chef-d'œuvre a été peint par le Néerlandais Johannes Vermeer vers 1665." },
    { question: "Comment se nomme la monnaie du Japon ?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, info: "Le Yen est la monnaie officielle du Japon depuis 1871." },
    { question: "Quel est le plus long fleuve du monde ?", answers: ["Amazone", "Nil", "Mississippi", "Yangzi"], correct: 1, info: "L'Amazone détient le record du débit le plus élevé, mais le Nil reste le plus long (environ 6 650 km)." },
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
    { question: "Quelle est la température moyenne sur Terre ?", answers: ["10°C", "15°C", "20°C", "30°C"], correct: 1, info: "L'effet de serre naturel permet de maintenir une moyenne d'environ 15°C." },
];

const titles = ["Étincelle 🕯️", "Braise 🪵", "Brise-Glace ❄️", "Torche 🔦", "Brasier 🔥", "Or 🏆", "Diamant 💎"]; // Ajout Or et Diamant

// Ajoute ces nouvelles variables dans tes stats de base
let stats = {
    xp: 0,
    progression: 0,
    level: 1,
    streak: 0,
    shields: 0,
    chronoBonus: 0,
    bonusQuestion: 0, // Corrige l'incohérence du nom
    nameColor: null,
    rankColor: null,
    hasAura: false,
    hasXpBoost: false
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
                
                // Si Firebase est disponible
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
                    // Fallback direct en local
                    chargerStatsLocales(username);
                }
            } else {
                alert("Choisis un pseudo pour commencer ! 🔥");
            }
        };
    }
}

// Fonction de secours locale pour garantir l'accès à l'accueil
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
    
    // 1. Sauvegarde Firebase sécurisée
    if (typeof database !== "undefined" && database) {
        database.ref('joueurs/' + username).set(stats)
            .then(() => console.log("🔥 Stats synchronisées sur Firebase !"))
            .catch(err => console.error("Erreur Firebase :", err));
    }
        
    // 2. Sauvegarde locale de secours (toujours active)
    localStorage.setItem("brainflamme_stats_" + username, JSON.stringify(stats));
}

function loadUserStatsFromCloud(username) {
    // Sécurité au cas où Firebase ne charge pas
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

document.getElementById("dailyMode").onclick = () => startQuiz("Quotidien");
document.getElementById("chronoMode").onclick = () => startQuiz("Chrono");

function show(id) {
    // 1. On cache tous les écrans
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    
    // 2. On affiche l'écran demandé
    const target = document.getElementById(id);
    if (target) {
        target.style.display = "block";
    }

    // 3. Mise à jour spécifique à la boutique
    if (id === "shop-screen" && typeof updateShopDisplay === "function") { 
        updateShopDisplay();
    }

    // 4. Gestion de l'aura visuelle du joueur
    const welcomeUser = document.getElementById("welcome-user");
    if (welcomeUser) {
        welcomeUser.style.textShadow = stats.hasAura ? "0 0 15px #22d3ee" : "none";
    }

    // 5. Gestion de la barre de navigation (nav)
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

function startQuiz(mode) {
    quizHistory = []; 
    selectedMode = mode; 
    current = 0; 
    score = 0;
    
    currentQuestions = [...questionsData].sort(() => Math.random() - 0.5);
    
    if (mode === "Quotidien") {
        let nbQuestions = 5;
        if (stats.bonusQuestion > 0) {
            nbQuestions = 6; 
            stats.bonusQuestion--; 
            saveUserStats();
            alert("🎲 Dé Chanceux : Une question bonus a été ajoutée !");
        }
        
        currentQuestions = currentQuestions.slice(0, nbQuestions);
        document.getElementById("timerContainer").style.display = "none";
    } else {
        document.getElementById("timerContainer").style.display = "block";
        
        // --- BONUS CHRONO ---
        timeLeft = 30 + (stats.chronoBonus || 0); 
        stats.chronoBonus = 0; 
        saveUserStats(); 
        
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
            
            quizHistory.push({
                question: q.question,
                userAns: answerObj.text,
                correctAns: q.answers[q.correct],
                isCorrect: answerObj.isCorrect
            });
            
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
        };
        area.appendChild(b);
    });
}

function endQuiz() {
    clearInterval(timerInterval);
    clearInterval(dailyTimerInterval);

    let gain = score * 10;
    if (stats.hasXpBoost) {
        gain = gain * 2;
        stats.hasXpBoost = false; 
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

    continuerAffichageScore(gain);
}

function continuerAffichageScore(gain) {
    show("score");
    const scoreScreen = document.getElementById("score");
    if (!scoreScreen) return;

    saveUserStats();
    updateShopDisplay();

    let nbQuestionsPosees = (selectedMode === "Quotidien") ? 5 : current;
    if (nbQuestionsPosees === 0) nbQuestionsPosees = 1; 

    let comment = (score >= (nbQuestionsPosees * 0.8)) ? "INCROYABLE ! 🔥" : (score >= (nbQuestionsPosees * 0.5) ? "BIEN JOUÉ ! 👏" : "ESSAIE ENCORE ! 🐢");

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

    setTimeout(() => {
        const bar = document.getElementById("anim-fill");
        if(bar) {
            const currentLevelXP = stats.progression % 100; 
            bar.style.width = currentLevelXP + "%";
        }
    }, 100);

    if (score === 5 && selectedMode === "Quotidien") {
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
    const bonusQ = questionsData[Math.floor(Math.random() * questionsData.length)];
    currentQuestions = [bonusQ]; 
    current = 0;

    const quizScreen = document.getElementById("quiz");
    if(quizScreen) quizScreen.classList.add("bonus-mode-active");
    
    showQuestion();
    
    const qText = document.getElementById("question");
    if(qText) qText.innerHTML = "✨ QUESTION BONUS ✨<br>" + qText.innerText;
}

console.log("🔥 Le fichier script.js s'exécute jusqu'au bout !");
