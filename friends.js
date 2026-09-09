/* ==========================================================
   👥 BRAINFLAMME — JOUER ENTRE AMIS
========================================================== */

(function () {

    "use strict";

    const ROOM_ROOT = "sallesAmis";

    const MIN_PLAYERS = 2;
    const MAX_PLAYERS = 4; 

    const ROOM_CODE_LENGTH = 6;

    const XP_PER_CORRECT = 10;

    let friendRoom = {
    id: null,
    code: null,
    isHost: false,
    listener: null,
    timer: null,
    scanner: null,
    xpAwarded: false,

    // Synchronisation de l'heure avec Firebase
    serverOffset: 0,
    serverOffsetRef: null,

    // Heure de fin du chrono
    timerEndsAt: 0
};


    /* =====================================================
       UTILITAIRES
    ===================================================== */

    function getDB() {

        if (typeof database !== "undefined" && database) {
            return database;
        }

        return null;
    }

   function getServerNow() {
    return Date.now() + Number(friendRoom.serverOffset || 0);
}

function watchServerTimeOffset() {
    const db = getDB();

    if (!db || friendRoom.serverOffsetRef) return;

    const ref = db.ref('.info/serverTimeOffset');
    friendRoom.serverOffsetRef = ref;

    ref.on('value', snapshot => {
        const value = Number(snapshot.val() || 0);
        friendRoom.serverOffset = Number.isFinite(value) ? value : 0;
    });
}


    function username() {

        const local =
            localStorage.getItem("brainflamme_user");

        if (local) {
            return local.trim();
        }

        if (
            typeof stats !== "undefined" &&
            stats.username
        ) {
            return String(stats.username).trim();
        }

        return "Joueur";
    }


    function safe(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function playerKey(name) {

        return encodeURIComponent(name)
            .replace(/\./g, "%2E")
            .replace(/#/g, "%23")
            .replace(/\$/g, "%24")
            .replace(/\[/g, "%5B")
            .replace(/\]/g, "%5D")
            .replace(/\//g, "%2F");

    }


    function shuffle(array) {

        const result = [...array];

        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [
                result[i],
                result[j]
            ] = [
                result[j],
                result[i]
            ];

        }

        return result;
    }


    function text(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }

    }


    function show(id) {

        if (typeof hideAllScreens === "function") {
            hideAllScreens();
        }

        document
            .querySelectorAll(".screen")
            .forEach(screen => {
                screen.style.display = "none";
            });

        const element =
            document.getElementById(id);

        if (element) {
            element.style.display = "block";
        }

    }


    /* =====================================================
       ÉCRANS
    ===================================================== */

    window.openFriendsMode = function () {

        show("friendsModeScreen");

        stopQR();

    };


    window.openCreateFriendRoom = function () {

        show("createFriendRoomScreen");

        populateCategories();

        updateFriendSettingsUI();

    };


    window.openJoinFriendRoom = function () {

        show("joinFriendRoomScreen");

        stopQR();

        const input =
            document.getElementById(
                "friendRoomCodeInput"
            );

        if (input) {

            input.value = "";

            setTimeout(
                () => input.focus(),
                100
            );

        }

    };


    /* =====================================================
       CATÉGORIES
    ===================================================== */

    function populateCategories() {

        const select =
            document.getElementById(
                "friendCategorySelect"
            );

        if (
            !select ||
            typeof allThemesQuestions === "undefined"
        ) {
            return;
        }

        const categories =
            Object.keys(allThemesQuestions)
                .filter(category =>
                    Array.isArray(
                        allThemesQuestions[category]
                    ) &&
                    allThemesQuestions[category].length
                );

        select.innerHTML =
            categories.map(category => {

                return `
                    <option value="${safe(category)}">
                        ${safe(category)}
                    </option>
                `;

            }).join("");

    }


    window.updateFriendSettingsUI =
        function () {

            const type =
                document.querySelector(
                    'input[name="friendGameType"]:checked'
                )?.value || "chrono";

            const mode =
                document.querySelector(
                    'input[name="friendQuestionMode"]:checked'
                )?.value || "mixed";


            const chrono =
                document.getElementById(
                    "friendChronoSettings"
                );

            const questions =
                document.getElementById(
                    "friendQuestionsSettings"
                );

            const category =
                document.getElementById(
                    "friendCategorySettings"
                );


            if (chrono) {
                chrono.style.display =
                    type === "chrono"
                        ? "block"
                        : "none";
            }


            if (questions) {
                questions.style.display =
                    type === "questions"
                        ? "block"
                        : "none";
            }


            if (category) {
                category.style.display =
                    mode === "category"
                        ? "block"
                        : "none";
            }


            const chronoSlider =
                document.getElementById(
                    "friendChronoSlider"
                );

            const chronoValue =
                document.getElementById(
                    "friendChronoValue"
                );


            if (
                chronoSlider &&
                chronoValue
            ) {

                chronoValue.textContent =
                    `${chronoSlider.value} secondes`;

            }


            const questionSlider =
                document.getElementById(
                    "friendQuestionsSlider"
                );

            const questionValue =
                document.getElementById(
                    "friendQuestionsValue"
                );


            if (
                questionSlider &&
                questionValue
            ) {

                questionValue.textContent =
                    `${questionSlider.value} questions`;

            }

        };


    function settings() {

        const type =
            document.querySelector(
                'input[name="friendGameType"]:checked'
            )?.value === "questions"
                ? "questions"
                : "chrono";


        const mode =
            document.querySelector(
                'input[name="friendQuestionMode"]:checked'
            )?.value === "category"
                ? "category"
                : "mixed";


        return {

            type,

            mode,

            duration: Math.min(
                60,
                Math.max(
                    30,
                    Number(
                        document.getElementById(
                            "friendChronoSlider"
                        )?.value || 45
                    )
                )
            ),

            questionCount: Math.min(
                20,
                Math.max(
                    5,
                    Number(
                        document.getElementById(
                            "friendQuestionsSlider"
                        )?.value || 10
                    )
                )
            ),

            category:
                mode === "category"
                    ? document.getElementById(
                        "friendCategorySelect"
                    )?.value || null
                    : null

        };

    }


    /* =====================================================
       QUESTIONS
    ===================================================== */

    function getPool(config) {

        if (
            config.mode === "category"
        ) {

            if (
                typeof allThemesQuestions ===
                "undefined"
            ) {
                return [];
            }

            return Array.isArray(
                allThemesQuestions[
                    config.category
                ]
            )
                ? allThemesQuestions[
                    config.category
                ]
                : [];

        }


        /*
         * Même banque générale que
         * les modes généraux.
         */

        if (
            typeof questionsData !==
            "undefined" &&
            Array.isArray(questionsData)
        ) {

            return questionsData;

        }


        return [];

    }


    function makeQuestions(config) {

        const pool =
            getPool(config);

        if (!pool.length) {
            return [];
        }


        if (
            config.type === "questions"
        ) {

            return shuffle(pool)
                .slice(
                    0,
                    Math.min(
                        config.questionCount,
                        pool.length
                    )
                );

        }


        /*
         * Chrono :
         * on prépare beaucoup de questions
         * pour que le joueur ne tombe jamais
         * à court pendant les 30–60 secondes.
         */

        const result = [];

        let source = shuffle(pool);

        while (
            result.length < 100
        ) {

            if (!source.length) {
                source = shuffle(pool);
            }

            result.push(
                source.shift()
            );

        }

        return result;

    }


    /* =====================================================
       CODE SALLE
    ===================================================== */

    function randomCode() {

        const alphabet =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        for (
            let i = 0;
            i < ROOM_CODE_LENGTH;
            i++
        ) {

            code += alphabet[
                Math.floor(
                    Math.random() *
                    alphabet.length
                )
            ];

        }

        return code;

    }


    async function uniqueCode() {

        const db = getDB();

        for (let i = 0; i < 10; i++) {

            const code =
                randomCode();

            const snapshot =
                await db
                    .ref(ROOM_ROOT)
                    .orderByChild("code")
                    .equalTo(code)
                    .once("value");


            if (!snapshot.exists()) {
                return code;
            }

        }

        throw new Error(
            "Impossible de créer un code."
        );

    }


    /* =====================================================
       CRÉER UNE SALLE
    ===================================================== */

    window.createFriendRoom =
        async function () {

            const db = getDB();

            if (!db) {
                alert(
                    "Firebase n'est pas disponible."
                );
                return;
            }


            const config =
                settings();


            if (
                config.mode === "category" &&
                !config.category
            ) {

                alert(
                    "Choisis une catégorie."
                );

                return;

            }


            const pool =
                getPool(config);


            const minimum =
                config.type === "questions"
                    ? config.questionCount
                    : 1;


            if (
                pool.length < minimum
            ) {

                alert(
                    "Pas assez de questions disponibles."
                );

                return;

            }


            const questions =
                makeQuestions(config);


            if (!questions.length) {

                alert(
                    "Impossible de préparer les questions."
                );

                return;

            }


            const name =
                username();

            const code =
                await uniqueCode();


            const ref =
                db
                    .ref(ROOM_ROOT)
                    .push();


            const room = {

                code,

                host: name,

                status: "lobby",

                createdAt:
                    firebase.database
                        .ServerValue
                        .TIMESTAMP,

                settings: config,

                questions,

                startedAt: 0,

                endsAt: 0,

                players: {

                    [playerKey(name)]: {

                        username: name,

                        score: 0,

                        correctCount: 0,

                        answeredCount: 0,

                        currentIndex: 0,

                        finished: false,

                        online: true

                    }

                },

                answers: {}

            };


            await ref.set(room);


            friendRoom.id =
                ref.key;

            friendRoom.code =
                code;

            friendRoom.isHost =
                true;


            listenRoom(
                ref.key
            );


            show(
                "friendRoomLobbyScreen"
            );


            text(
                "friendRoomCode",
                code
            );


            renderQR(code);

        };


    /* =====================================================
       REJOINDRE
    ===================================================== */

    window.joinFriendRoom =
        async function (givenCode) {

            const db = getDB();

            if (!db) {
                alert("Firebase indisponible.");
                return;
            }


            const input =
                document.getElementById(
                    "friendRoomCodeInput"
                );


            const code =
                String(
                    givenCode ||
                    input?.value ||
                    ""
                )
                    .toUpperCase()
                    .replace(
                        /[^A-Z0-9]/g,
                        ""
                    );


            if (
                code.length !== 6
            ) {

                alert(
                    "Le code doit contenir 6 caractères."
                );

                return;

            }


            const result =
                await db
                    .ref(ROOM_ROOT)
                    .orderByChild("code")
                    .equalTo(code)
                    .once("value");


            let roomId = null;
            let room = null;


            result.forEach(child => {

                if (
                    !room &&
                    child.val()?.status ===
                    "lobby"
                ) {

                    roomId =
                        child.key;

                    room =
                        child.val();

                }

            });


            if (!room) {

                alert(
                    "Salle introuvable ou partie déjà commencée."
                );

                return;

            }


            const players =
                room.players || {};


            const active =
                Object.values(players)
                    .filter(
                        p => p.online !== false
                    );


            const name =
                username();

            const key =
                playerKey(name);


            if (
                !players[key] &&
                active.length >= MAX_PLAYERS
            ) {

                alert(
                    "Cette salle est complète."
                );

                return;

            }


            await db
                .ref(
                    `${ROOM_ROOT}/${roomId}/players/${key}`
                )
                .set({

                    username: name,

                    score: 0,

                    correctCount: 0,

                    answeredCount: 0,

                    currentIndex: 0,

                    finished: false,

                    online: true

                });


            friendRoom.id =
                roomId;

            friendRoom.code =
                code;

            friendRoom.isHost =
                room.host === name;


            listenRoom(roomId);

            show(
                "friendRoomLobbyScreen"
            );

            text(
                "friendRoomCode",
                code
            );

            renderQR(code);

        };


    /* =====================================================
       LOBBY
    ===================================================== */

    function listenRoom(id) {

        const db = getDB();

        const ref =
            db.ref(
                `${ROOM_ROOT}/${id}`
            );


        if (friendRoom.listener) {

            friendRoom.listener.off();

        }


        friendRoom.listener =
            ref;


        ref.on(
            "value",
            snapshot => {

                if (!snapshot.exists()) {

                    cleanup();

                    show(
                        "friendsModeScreen"
                    );

                    return;

                }


                const room =
                    snapshot.val();


                if (
                    room.status ===
                    "lobby"
                ) {

                    renderLobby(room);

                }


                if (
                    room.status ===
                    "playing"
                ) {

                    renderGame(room);

                }


                if (
                    room.status ===
                    "finished"
                ) {

                    renderResults(room);

                }

            }
        );

    }


    function renderLobby(room) {

        show(
            "friendRoomLobbyScreen"
        );


        text(
            "friendRoomCode",
            room.code
        );


        const config =
            room.settings || {};


        text(
            "friendLobbySettings",

            config.type === "chrono"

                ? `⚡ Chrono · ${config.duration}s`

                : `❓ ${config.questionCount} questions`

        );


        const list =
            document.getElementById(
                "friendPlayersList"
            );


        const players =
            Object.values(
                room.players || {}
            );


        if (list) {

            list.innerHTML =
                players.map(
                    player => `

                    <div class="friend-player-row">

                        <div class="friend-player-avatar">
                            ${safe(
                                (player.username || "?")
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <div class="friend-player-name">
                            ${safe(
                                player.username
                            )}
                        </div>

                        <div class="friend-player-status">
                            ${
                                player.username === room.host
                                    ? "👑 Hôte"
                                    : "🟢 Prêt"
                            }
                        </div>

                    </div>

                `
                ).join("");

        }


        const active =
            players.filter(
                p => p.online !== false
            ).length;


        const start =
            document.getElementById(
                "startFriendGameBtn"
            );


        if (start) {

            start.style.display =
                room.host === username()
                    ? "block"
                    : "none";

            start.disabled =
                active < MIN_PLAYERS ||
                active > MAX_PLAYERS;

        }


        text(
            "friendLobbyStatus",

            active < 2

                ? "En attente d'un autre joueur..."

                : `${active}/4 joueurs · La partie peut commencer 🔥`

        );

    }


    /* =====================================================
       LANCER
    ===================================================== */

    window.startFriendGame =
        async function () {

            if (
                !friendRoom.isHost ||
                !friendRoom.id
            ) {
                return;
            }


            const db = getDB();

            const ref =
                db.ref(
                    `${ROOM_ROOT}/${friendRoom.id}`
                );


            const snapshot =
                await ref.once("value");


            const room =
                snapshot.val();


            const players =
                Object.entries(
                    room.players || {}
                )
                .filter(
                    ([, p]) =>
                        p.online !== false
                );


            if (
                players.length < 2
            ) {

                alert(
                    "Il faut au moins 2 joueurs."
                );

                return;

            }


            const startTime =
                Date.now();


            const endTime =
                room.settings.type === "chrono"

                    ? startTime +
                      room.settings.duration *
                      1000

                    : 0;


            const updates = {

                status: "playing",

                startedAt: startTime,

                endsAt: endTime

            };


            players.forEach(
                ([key]) => {

                    updates[
                        `players/${key}/score`
                    ] = 0;

                    updates[
                        `players/${key}/correctCount`
                    ] = 0;

                    updates[
                        `players/${key}/answeredCount`
                    ] = 0;

                    updates[
                        `players/${key}/currentIndex`
                    ] = 0;

                    updates[
                        `players/${key}/finished`
                    ] = false;

                }
            );


            await ref.update(
                updates
            );

        };


    /* =====================================================
       JEU
    ===================================================== */

    function renderGame(room) {

        show(
            "friendsQuizScreen"
        );


        renderProgress(room);


        const me =
    room.players?.[
        playerKey(username())
    ];


if (!me) return;


updateAnsweredText(room);


const config =
    room.settings;


        if (
            config.type === "chrono"
        ) {

            startTimer(room);

        }


        const index =
            Number(
                me.currentIndex || 0
            );


        if (
            config.type === "questions" &&
            index >= config.questionCount
        ) {

            text(
                "friendQuestionCounter",
                "Terminé ✓"
            );

            text(
                "friendQuestionText",
                "Tu as terminé ! 🔥"
            );


            document.getElementById(
                "friendAnswers"
            ).innerHTML = "";


            checkEveryoneFinished(room);

            return;

        }


        const question =
            room.questions[index];


        if (!question) return;


        text(
            "friendQuestionCounter",

            config.type === "questions"

                ? `Question ${index + 1}/${config.questionCount}`

                : `Question ${index + 1}`

        );


        text(
            "friendQuestionText",
            question.question
        );


        const container =
            document.getElementById(
                "friendAnswers"
            );


        container.innerHTML = "";


        const answerKey =
            `${playerKey(username())}_${index}`;


        const alreadyAnswered =
            Boolean(
                room.answers?.[answerKey]
            );


        const options =
    question.options ||
    question.answers ||
    [];

options.forEach(
    (answer, i) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "answer";


                button.textContent =
                    answer;


                button.disabled =
                    alreadyAnswered;


                button.onclick =
                    () =>
                        submitAnswer(
                            room,
                            index,
                            i
                        );


                container.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       RÉPONSE
    ===================================================== */

    async function submitAnswer(
        room,
        index,
        selected
    ) {

        const db = getDB();

        const key =
            playerKey(username());


        const player =
            room.players?.[key];


        if (!player) return;


        if (
            Number(
                player.currentIndex || 0
            ) !== index
        ) {
            return;
        }


        if (
            room.settings.type ===
                "chrono" &&
            Date.now() >=
                Number(room.endsAt)
        ) {

            return;

        }


        const question =
            room.questions[index];


        const answerKey =
            `${key}_${index}`;


        const answerRef =
            db.ref(
                `${ROOM_ROOT}/${friendRoom.id}/answers/${answerKey}`
            );


        const result =
            await answerRef.transaction(
                current =>
                    current ||
                    {

                        username:
                            username(),

                        questionIndex:
                            index,

                        selectedIndex:
                            selected,

                        correct:
                            Number(selected) ===
                            Number(question.correct),

                        timestamp:
                            firebase.database
                                .ServerValue
                                .TIMESTAMP

                    }
            );


        if (!result.committed) {
            return;
        }


        const answer =
            result.snapshot.val();


        const correct =
            answer.correct === true;


        const playerRef =
            db.ref(
                `${ROOM_ROOT}/${friendRoom.id}/players/${key}`
            );


        await playerRef.transaction(
            current => {

                if (!current) {
                    return current;
                }


                if (
                    Number(
                        current.currentIndex ||
                        0
                    ) !== index
                ) {

                    return current;

                }


                const answered =
                    Number(
                        current.answeredCount ||
                        0
                    ) + 1;


                const correctCount =
                    Number(
                        current.correctCount ||
                        0
                    ) +
                    (
                        correct
                            ? 1
                            : 0
                    );


                return {

                    ...current,

                    answeredCount:
                        answered,

                    correctCount,

                    score:
                        correctCount,

                    currentIndex:
                        index + 1,

                    finished:
                        room.settings.type ===
                            "questions" &&
                        answered >=
                            room.settings.questionCount

                };

            }
        );


        paintAnswer(
            selected,
            Number(question.correct),
            correct
        );


        if (
            correct &&
            typeof playSFX === "function"
        ) {

            playSFX("correct");

        }

    }


    function paintAnswer(
        selected,
        correct,
        isCorrect
    ) {

        const buttons =
            document.querySelectorAll(
                "#friendAnswers .answer"
            );


        buttons.forEach(
            (button, index) => {

                button.disabled =
                    true;


                if (
                    index === selected
                ) {

                    button.classList.add(
                        isCorrect
                            ? "correct"
                            : "wrong"
                    );

                }


                if (
                    !isCorrect &&
                    index === correct
                ) {

                    button.classList.add(
                        "correct"
                    );

                }

            }
        );

    }


    /* =====================================================
       PROGRESSION DES ADVERSAIRES
    ===================================================== */

    function renderProgress(room) {

        const panel =
            document.getElementById(
                "friendProgressPanel"
            );


        const list =
            document.getElementById(
                "friendProgressList"
            );


        if (!panel || !list) {
            return;
        }


        const players =
            Object.values(
                room.players || {}
            );


        if (
            room.settings.type !==
            "questions"
        ) {

            panel.style.display =
                "none";

            return;

        }


        panel.style.display =
            "block";


        const total =
            Number(
                room.settings.questionCount
            );


        list.innerHTML =
            players.map(
                player => {

                    const answered =
                        Math.min(
                            total,
                            Number(
                                player.answeredCount ||
                                0
                            )
                        );


                    let dots = "";


                    for (
                        let i = 0;
                        i < total;
                        i++
                    ) {

                        if (
                            i < answered
                        ) {

                            dots +=
                                `<span class="friend-progress-dot done">✓</span>`;

                        }

                        else if (
                            i === answered
                        ) {

                            dots +=
                                `<span class="friend-progress-dot current"></span>`;

                        }

                        else {

                            dots +=
                                `<span class="friend-progress-dot"></span>`;

                        }

                    }


                    return `

                        <div class="friend-progress-player">

                            <span class="friend-progress-name">
                                ${safe(
                                    player.username
                                )}
                            </span>

                            <span class="friend-progress-dots">
                                ${dots}
                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    /* =====================================================
       CHRONO
    ===================================================== */

    function startTimer(room) {

        clearInterval(
            friendRoom.timer
        );


        const bar =
            document.getElementById(
                "friendGameTimerBar"
            );


        const label =
            document.getElementById(
                "friendGameTimerText"
            );


        const duration =
            Number(
                room.settings.duration
            ) * 1000;


        const tick = () => {

            const remaining =
                Math.max(
                    0,
                    Number(room.endsAt) -
                    Date.now()
                );


            label.textContent =
                `${Math.ceil(
                    remaining / 1000
                )}s`;


            bar.style.width =
                `${
                    remaining /
                    duration *
                    100
                }%`;


            if (
                remaining <= 0
            ) {

                clearInterval(
                    friendRoom.timer
                );


                if (
                    friendRoom.isHost
                ) {

                    finishRoom();

                }

            }

        };


        tick();


        friendRoom.timer =
            setInterval(
                tick,
                200
            );

    }


    /* =====================================================
       FIN
    ===================================================== */

    function checkEveryoneFinished(
        room
    ) {

        if (
            !friendRoom.isHost ||
            room.settings.type !==
                "questions"
        ) {
            return;
        }


        const players =
            Object.values(
                room.players || {}
            );


        const total =
            Number(
                room.settings.questionCount
            );


        if (
            players.length >= 2 &&
            players.every(
                p =>
                    Number(
                        p.answeredCount ||
                        0
                    ) >= total
            )
        ) {

            finishRoom();

        }

    }


    async function finishRoom() {

        if (
            !friendRoom.isHost
        ) {
            return;
        }


        const db = getDB();


        await db
            .ref(
                `${ROOM_ROOT}/${friendRoom.id}`
            )
            .update({

                status: "finished",

                finishedAt:
                    Date.now()

            });

    }


    /* =====================================================
       RÉSULTATS
    ===================================================== */

    function renderResults(room) {

        show(
            "friendResultsScreen"
        );


        const players =
            Object.values(
                room.players || {}
            )
            .map(player => ({

                ...player,

                score:
                    Number(
                        player.score ||
                        0
                    ),

                correctCount:
                    Number(
                        player.correctCount ||
                        0
                    ),

                answeredCount:
                    Number(
                        player.answeredCount ||
                        0
                    )

            }))
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            );


        const list =
            document.getElementById(
                "friendResultsList"
            );


        list.innerHTML =
            players.map(
                (player, index) => {

                    const xp =
                        player.correctCount *
                        XP_PER_CORRECT;


                    return `

                        <div class="friend-result-row">

                            <span class="friend-result-rank">

                                ${
                                    index === 0
                                        ? "🥇"
                                        : index === 1
                                        ? "🥈"
                                        : index === 2
                                        ? "🥉"
                                        : "#" +
                                          (index + 1)
                                }

                            </span>


                            <div class="friend-result-main">

                                <strong>
                                    ${safe(
                                        player.username
                                    )}
                                </strong>

                                <small>
                                    ${
                                        player.correctCount
                                    }
                                    bonnes réponses
                                    ·
                                    ${
                                        player.answeredCount
                                    }
                                    questions
                                </small>

                            </div>


                            <div class="friend-result-score">

                                <strong>
                                    ${
                                        player.score
                                    }
                                    pts
                                </strong>

                                <span>
                                    +${xp} XP
                                </span>

                            </div>

                        </div>

                    `;

                }
            ).join("");


        const me =
            players.find(
                p =>
                    p.username ===
                    username()
            );


        if (me) {

            const xp =
                me.correctCount *
                XP_PER_CORRECT;


            text(
                "friendFinalXP",
                `+${xp} XP`
            );


            awardXP(xp);

        }

    }


    /* =====================================================
       XP
    ===================================================== */

    function awardXP(gain) {

        if (
            !gain ||
            typeof stats === "undefined"
        ) {
            return;
        }


        const storageKey =
            `friendXP_${friendRoom.id}_${username()}`;


        if (
            localStorage.getItem(
                storageKey
            )
        ) {
            return;
        }


        stats.xp =
            Number(stats.xp || 0) +
            gain;


        stats.progression =
            Number(
                stats.progression || 0
            ) +
            gain;


        while (
            typeof getXPForLevel ===
                "function" &&
            stats.progression >=
                getXPForLevel(
                    stats.level
                )
        ) {

            stats.progression -=
                getXPForLevel(
                    stats.level
                );

            stats.level++;


            if (
                typeof playSFX ===
                "function"
            ) {

                playSFX(
                    "levelUp"
                );

            }

        }


        if (
            typeof saveUserStats ===
            "function"
        ) {

            saveUserStats();

        }


        localStorage.setItem(
            storageKey,
            "1"
        );

    }


    /* =====================================================
       QR CODE
    ===================================================== */

    function renderQR(code) {

        const container =
            document.getElementById(
                "friendRoomQR"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (
            typeof QRCode ===
            "undefined"
        ) {

            return;

        }


        new QRCode(
            container,
            {

                text:
                    `brainflamme://join/${code}`,

                width: 180,

                height: 180

            }
        );

    }

window.startFriendQRScanner = async function () {

    const reader = document.getElementById('friendQrReader');

    if (!reader) {
        console.error('[Amis] Zone du scanner introuvable.');
        return;
    }

    // Vérification de la bibliothèque
    if (typeof Html5Qrcode === 'undefined') {
        console.error('[Amis] Html5Qrcode n’est pas chargé.');
        message(
            'Le scanner QR n’est pas disponible. Recharge la page puis réessaie.',
            'error'
        );
        return;
    }

    // Vérification du support caméra
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        message(
            'La caméra n’est pas accessible sur ce navigateur. Utilise le code à 6 caractères.',
            'error'
        );
        return;
    }

    // Arrêter un éventuel ancien scanner
    try {
        stopScanner();
    } catch (e) {
        console.warn('[Amis] Impossible d’arrêter l’ancien scanner :', e);
    }

    reader.innerHTML = `
        <div style="
            min-height:250px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            gap:10px;
            color:#94a3b8;
            text-align:center;
            padding:20px;
            box-sizing:border-box;
        ">
            <div style="font-size:36px;">📷</div>
            <strong style="color:#fff;">Activation de la caméra…</strong>
            <span>Autorise l’accès à la caméra si ton navigateur te le demande.</span>
        </div>
    `;

    try {

        /*
         * On demande d'abord les caméras disponibles.
         * C'est plus fiable que d'imposer directement
         * facingMode: "environment".
         */
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
            throw new Error('Aucune caméra détectée.');
        }

        /*
         * On cherche en priorité une caméra arrière.
         * Sur Android, son nom contient souvent "back",
         * "rear" ou "environment".
         */
        let camera = cameras.find(cam => {
            const label = String(cam.label || '').toLowerCase();

            return (
                label.includes('back') ||
                label.includes('rear') ||
                label.includes('environment')
            );
        });

        // Si aucune caméra arrière n'est identifiable,
        // on prend simplement la première disponible.
        if (!camera) {
            camera = cameras[0];
        }

        friendRoom.scanner = new Html5Qrcode('friendQrReader');

        await friendRoom.scanner.start(
            camera.id,
            {
                fps: 10,

                qrbox: function (viewfinderWidth, viewfinderHeight) {

                    const size = Math.floor(
                        Math.min(viewfinderWidth, viewfinderHeight) * 0.68
                    );

                    return {
                        width: Math.min(size, 280),
                        height: Math.min(size, 280)
                    };
                },

                aspectRatio: 1.0
            },

            decodedText => {

                console.log('[Amis] QR détecté :', decodedText);

                const text = String(decodedText).trim();

                /*
                 * Format généré par BrainFlamme :
                 *
                 * brainflamme://join/ABC123
                 */
                const match = text.match(
                    /brainflamme:\/\/join\/([A-Z0-9]{6})/i
                );

                let code;

                if (match) {
                    code = match[1].toUpperCase();
                } else {
                    /*
                     * Permet également de lire directement
                     * un QR contenant simplement ABC123.
                     */
                    code = text
                        .replace(/[^A-Z0-9]/gi, '')
                        .toUpperCase();
                }

                if (!/^[A-Z0-9]{6}$/.test(code)) {

                    message(
                        'Ce QR code ne correspond pas à une salle BrainFlamme.',
                        'error'
                    );

                    return;
                }

                console.log('[Amis] Code de salle détecté :', code);

                // Arrêt de la caméra
                stopScanner();

                const input = document.getElementById(
                    'friendRoomCodeInput'
                );

                if (input) {
                    input.value = code;
                }

                // Petite confirmation avant la connexion
                message(
                    `Salle ${code} détectée ! 🔥`,
                    'success'
                );

                // Rejoindre automatiquement
                setTimeout(() => {
                    joinFriendRoom(code);
                }, 350);
            },

            /*
             * Les erreurs de lecture sont normales :
             * tant qu'aucun QR n'est devant la caméra,
             * html5-qrcode en génère régulièrement.
             */
            () => {}
        );

        message(
            '📷 Caméra active — place le QR code dans le cadre.',
            'success'
        );

    } catch (error) {

        console.error('[Amis] Erreur scanner QR :', error);

        stopScanner();

        let errorMessage =
            'Impossible d’utiliser la caméra.';

        const errorText = String(
            error && error.message
                ? error.message
                : error
        ).toLowerCase();

        if (
            errorText.includes('permission') ||
            errorText.includes('notallowed') ||
            errorText.includes('denied')
        ) {
            errorMessage =
                '📷 Accès à la caméra refusé. Autorise la caméra dans les paramètres du navigateur puis réessaie.';
        } else if (
            errorText.includes('secure') ||
            errorText.includes('https')
        ) {
            errorMessage =
                '🔒 La caméra nécessite une connexion sécurisée HTTPS.';
        } else if (
            errorText.includes('camera') ||
            errorText.includes('device')
        ) {
            errorMessage =
                '📷 Aucune caméra utilisable n’a été trouvée.';
        }

        message(
            `${errorMessage} Tu peux aussi entrer le code à 6 caractères.`,
            'error'
        );

        /*
         * On laisse la zone du scanner propre plutôt que
         * de laisser un bloc cassé.
         */
        reader.innerHTML = `
            <div style="
                min-height:220px;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
                gap:10px;
                padding:20px;
                box-sizing:border-box;
                text-align:center;
                color:#94a3b8;
            ">
                <div style="font-size:42px;">📷</div>
                <strong style="color:#f8fafc;">
                    Caméra indisponible
                </strong>
                <span>
                    Autorise l'accès à la caméra ou utilise le code de la salle.
                </span>
            </div>
        `;
    }
};


    function stopQR() {

        if (
            !friendRoom.scanner
        ) {
            return;
        }


        friendRoom.scanner
            .stop()
            .catch(() => {});


        friendRoom.scanner =
            null;

    }


    /* =====================================================
       COPIER CODE
    ===================================================== */

    window.copyFriendRoomCode =
        async function () {

            if (
                !friendRoom.code
            ) {
                return;
            }


            try {

                await navigator
                    .clipboard
                    .writeText(
                        friendRoom.code
                    );

                alert(
                    "Code copié ! 📋"
                );

            }

            catch {

                alert(
                    `Code : ${friendRoom.code}`
                );

            }

        };


    /* =====================================================
       QUITTER
    ===================================================== */

    window.leaveFriendRoom =
        async function () {

            const db = getDB();


            if (
                db &&
                friendRoom.id
            ) {

                const key =
                    playerKey(
                        username()
                    );


                if (
                    friendRoom.isHost
                ) {

                    await db
                        .ref(
                            `${ROOM_ROOT}/${friendRoom.id}`
                        )
                        .remove();

                }

                else {

                    await db
                        .ref(
                            `${ROOM_ROOT}/${friendRoom.id}/players/${key}`
                        )
                        .remove();

                }

            }


            cleanup();


            if (
                typeof switchTab ===
                "function"
            ) {

                switchTab(
                    "home-screen"
                );

            }

        };


    window.resetFriendRoomToModes =
        function () {

            cleanup();

            show(
                "friendsModeScreen"
            );

        };


    function cleanup() {

        clearInterval(
            friendRoom.timer
        );

        stopQR();


        if (
            friendRoom.listener
        ) {

            friendRoom.listener.off();

        }


        friendRoom = {

            id: null,

            code: null,

            isHost: false,

            listener: null,

            timer: null,

            scanner: null,

            xpAwarded: false

        };

    }


    /* =====================================================
       INITIALISATION
    ===================================================== */

   document.addEventListener(
    "DOMContentLoaded",
    () => {

        watchServerTimeOffset();

        populateCategories();

        updateFriendSettingsUI();


            document
                .querySelectorAll(
                    'input[name="friendGameType"], input[name="friendQuestionMode"]'
                )
                .forEach(
                    input =>
                        input.addEventListener(
                            "change",
                            updateFriendSettingsUI
                        )
                );


            document
                .getElementById(
                    "friendChronoSlider"
                )
                ?.addEventListener(
                    "input",
                    updateFriendSettingsUI
                );


            document
                .getElementById(
                    "friendQuestionsSlider"
                )
                ?.addEventListener(
                    "input",
                    updateFriendSettingsUI
                );


            const input =
                document.getElementById(
                    "friendRoomCodeInput"
                );


            input?.addEventListener(
                "input",
                () => {

                    input.value =
                        input.value
                            .toUpperCase()
                            .replace(
                                /[^A-Z0-9]/g,
                                ""
                            )
                            .slice(0, 6);

                }
            );

        }
    );

})();
