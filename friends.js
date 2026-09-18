(function () {

    "use strict";

    console.log("🔥 FRIENDS.JS CHARGÉ");

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const ROOM_ROOT = "friendRooms";

    let friendRoom = {
        id: null,
        code: null,
        isHost: false,
        listener: null,
        timer: null,
        scanner: null,
        xpAwarded: false,
        serverOffset: 0,
        serverOffsetRef: null,
        timerEndsAt: 0,
        autoAdvanceTimer: null,
        autoAdvanceKey: null
    };

    /* =====================================================
       UTILITAIRES
    ===================================================== */

    function getDB() {
        if (
            typeof firebase === "undefined" ||
            !firebase.database
        ) {
            return null;
        }

        return firebase.database();
    }

    function username() {
        try {
            return (
                localStorage.getItem(
                    "brainflamme_user"
                ) ||
                localStorage.getItem(
                    "username"
                ) ||
                "Joueur"
            );
        } catch {
            return "Joueur";
        }
    }

    function playerKey(name) {
        // Chaque appareil/navigateur garde un identifiant unique et stable,
        // pour que deux joueurs avec le même pseudo (ex: "Joueur" par défaut)
        // ne soient jamais confondus en une seule et même entrée de salle.
        try {
            let id = localStorage.getItem(
                "brainflamme_friend_player_id"
            );

            if (!id) {
                id =
                    typeof crypto !== "undefined" &&
                    crypto.randomUUID
                        ? crypto.randomUUID()
                        : Date.now().toString(36) +
                          Math.random()
                              .toString(36)
                              .slice(2, 10);

                localStorage.setItem(
                    "brainflamme_friend_player_id",
                    id
                );
            }

            return id;
        } catch {
            return String(name || "Joueur")
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "_");
        }
    }

    function safe(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function show(id) {
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

    function text(id, value) {
        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function getServerNow() {
        return (
            Date.now() +
            Number(friendRoom.serverOffset || 0)
        );
    }

    function watchServerTimeOffset() {
        const db = getDB();

        if (!db) {
            return;
        }

        if (friendRoom.serverOffsetRef) {
            return;
        }

        friendRoom.serverOffsetRef =
            db
                .ref(".info/serverTimeOffset");

        friendRoom.serverOffsetRef.on(
            "value",
            snapshot => {
                friendRoom.serverOffset =
                    Number(
                        snapshot.val() || 0
                    );
            }
        );
    }

    function generateRoomCode() {
        const chars =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        for (let i = 0; i < 6; i++) {
            code +=
                chars[
                    Math.floor(
                        Math.random() *
                        chars.length
                    )
                ];
        }

        return code;
    }

    function generateRoomId() {
        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .slice(2, 10)
        );
    }

    /* =====================================================
       ÉCRAN MODE AMIS
    ===================================================== */

    window.openFriendsMode =
        function () {
            watchServerTimeOffset();

            show(
                "friendsModeScreen"
            );

            stopQR();
        };

    /* =====================================================
       PARAMÈTRES
    ===================================================== */

    function getSelectedValue(
        name,
        fallback
    ) {
        const selected =
            document.querySelector(
                `input[name="${name}"]:checked`
            );

        return (
            selected?.value ??
            fallback
        );
    }

    function updateFriendSettingsUI() {
        const type =
            getSelectedValue(
                "friendGameType",
                "questions"
            );

        const chronoSettings =
            document.getElementById(
                "friendChronoSettings"
            );

        const questionSettings =
            document.getElementById(
                "friendQuestionsSettings"
            );

        if (chronoSettings) {
            chronoSettings.style.display =
                type === "chrono"
                    ? ""
                    : "none";
        }

        if (questionSettings) {
            questionSettings.style.display =
                type === "questions"
                    ? ""
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
                `${chronoSlider.value} min`;
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
                questionSlider.value;
        }

        const questionModeValue =
            getSelectedValue(
                "friendQuestionMode",
                "mixed"
            );

        const categorySettings =
            document.getElementById(
                "friendCategorySettings"
            );

        if (categorySettings) {
            categorySettings.style.display =
                questionModeValue ===
                "category"
                    ? ""
                    : "none";
        }

        if (
            questionModeValue ===
            "category"
        ) {
            populateCategories();
        }
    }

    function populateCategories() {
        const select =
            document.getElementById(
                "friendCategorySelect"
            );

        if (!select) {
            return;
        }

        if (
            select.options.length > 1
        ) {
            return;
        }

        select.innerHTML = "";

        const themeNames =
            (typeof allThemesQuestions !== "undefined" && allThemesQuestions)
                ? Object.keys(allThemesQuestions)
                : [];

        const categories = [
            "Toutes",
            ...themeNames
        ];

        categories.forEach(
            category => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category;

                option.textContent =
                    category;

                select.appendChild(
                    option
                );
            }
        );
    }

    function getFriendSettings() {
        const type =
            getSelectedValue(
                "friendGameType",
                "questions"
            );

        const category =
            document.getElementById(
                "friendCategorySelect"
            )?.value ||
            "Toutes";

        if (type === "chrono") {
            const slider =
                document.getElementById(
                    "friendChronoSlider"
                );

            return {
                type: "chrono",
                duration: Number(
                    slider?.value || 2
                ),
                category
            };
        }

        const slider =
            document.getElementById(
                "friendQuestionsSlider"
            );

        return {
            type: "questions",
            questionCount:
                Number(
                    slider?.value || 10
                ),
            category
        };
    }

    /* =====================================================
       QUESTIONS
    ===================================================== */

    function getQuestionPool() {
        if (
            typeof questionsData !==
            "undefined" &&
            Array.isArray(questionsData)
        ) {
            return questionsData;
        }

        return [];
    }

    function getAllThemesPool() {
        if (
            typeof allThemesQuestions ===
            "undefined" ||
            !allThemesQuestions
        ) {
            return [];
        }

        return Object.values(
            allThemesQuestions
        ).flat();
    }

    function normalizeQuestion(question) {
        if (!question) {
            return null;
        }

        const options =
            question.options ||
            question.answers ||
            question.choices ||
            [];

        return {
            ...question,
            question:
                question.question ||
                question.text ||
                "",
            options:
                Array.isArray(options)
                    ? options
                    : [],
            correct:
                Number(
                    question.correct ??
                    question.correctIndex ??
                    question.answer ??
                    0
                )
        };
    }

    function getFriendQuestions(
        settings
    ) {
        const useCategory =
            settings.category &&
            settings.category !==
                "Toutes" &&
            typeof allThemesQuestions !==
                "undefined" &&
            Array.isArray(
                allThemesQuestions[
                    settings.category
                ]
            );

        const rawPool = useCategory
            ? allThemesQuestions[
                  settings.category
              ]
            : [
                  ...getQuestionPool(),
                  ...getAllThemesPool()
              ];

        let pool = rawPool
            .map(
                normalizeQuestion
            )
            .filter(
                question =>
                    question &&
                    question.question &&
                    question.options.length
            );

        for (

            let i = pool.length - 1;
            i > 0;
            i--
        ) {
            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                pool[i],
                pool[j]
            ] = [
                pool[j],
                pool[i]
            ];
        }

        if (
            settings.type ===
            "questions"
        ) {
            return pool.slice(
                0,
                Math.min(
                    Number(
                        settings.questionCount ||
                        10
                    ),
                    pool.length
                )
            );
        }

        return pool;
    }

    /* =====================================================
       CRÉATION DE SALLE
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

            watchServerTimeOffset();

            const settings =
                getFriendSettings();

            const questions =
                getFriendQuestions(
                    settings
                );

            if (!questions.length) {
                alert(
                    "Aucune question disponible."
                );
                return;
            }

            const id =
                generateRoomId();

            let code =
                generateRoomCode();

            let attempts = 0;

            while (attempts < 10) {
                const snapshot =
                    await db
                        .ref(
                            `${ROOM_ROOT}/${id}`
                        )
                        .once("value");

                if (
                    !snapshot.exists()
                ) {
                    break;
                }

                code =
                    generateRoomCode();

                attempts++;
            }

            const key =
                playerKey(
                    username()
                );

            const room = {
                code,
                host:
                    username(),
                status:
                    "waiting",
                createdAt:
                    firebase.database
                        .ServerValue
                        .TIMESTAMP,
                settings,
                questions,
                players: {
                    [key]: {
                        username:
                            username(),
                        joinedAt:
                            firebase.database
                                .ServerValue
                                .TIMESTAMP,
                        answeredCount: 0,
                        correctCount: 0,
                        score: 0,
                        currentIndex: 0,
                        questionStartedAt:
                            getServerNow(),
                        finished: false
                    }
                },
                answers: {}
            };

            if (
                settings.type ===
                "chrono"
            ) {
                room.duration =
                    Number(
                        settings.duration
                    ) * 60 * 1000;
            }

            await db
                .ref(
                    `${ROOM_ROOT}/${id}`
                )
                .set(room);

            friendRoom.id = id;
            friendRoom.code = code;
            friendRoom.isHost = true;

            renderWaiting(room);

            listenFriendRoom();
        };

    /* =====================================================
       REJOINDRE UNE SALLE
    ===================================================== */

    window.joinFriendRoom =
        async function () {
            const db = getDB();

            if (!db) {
                alert(
                    "Firebase n'est pas disponible."
                );
                return;
            }

            const input =
                document.getElementById(
                    "friendRoomCodeInput"
                );

            const code =
                String(
                    input?.value || ""
                )
                    .trim()
                    .toUpperCase();

            if (
                code.length !== 6
            ) {
                alert(
                    "Entre un code à 6 caractères."
                );
                return;
            }

            const snapshot =
                await db
                    .ref(ROOM_ROOT)
                    .orderByChild(
                        "code"
                    )
                    .equalTo(code)
                    .once("value");

            if (
                !snapshot.exists()
            ) {
                alert(
                    "Salle introuvable."
                );
                return;
            }

            let roomId = null;
            let room = null;

            snapshot.forEach(
                child => {
                    if (
                        !roomId &&
                        child.val()?.status !==
                            "finished"
                    ) {
                        roomId =
                            child.key;

                        room =
                            child.val();
                    }
                }
            );

            if (
                !roomId ||
                !room
            ) {
                alert(
                    "Cette salle n'est plus disponible."
                );
                return;
            }

            const key =
                playerKey(
                    username()
                );

            await db
                .ref(
                    `${ROOM_ROOT}/${roomId}/players/${key}`
                )
                .set({
                    username:
                        username(),
                    joinedAt:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP,
                    answeredCount: 0,
                    correctCount: 0,
                    score: 0,
                    currentIndex: 0,
                    questionStartedAt:
                        getServerNow(),
                    finished: false
                });

            friendRoom.id =
                roomId;

            friendRoom.code =
                room.code;

            friendRoom.isHost =
                false;

            listenFriendRoom();
        };

    /* =====================================================
       ÉCOUTE DE LA SALLE
    ===================================================== */

    function listenFriendRoom() {
        const db = getDB();

        if (
            !db ||
            !friendRoom.id
        ) {
            return;
        }

        if (
            friendRoom.listener
        ) {
            friendRoom.listener.off();
        }

        friendRoom.listener =
            db.ref(
                `${ROOM_ROOT}/${friendRoom.id}`
            );

        friendRoom.listener.on(
            "value",
            snapshot => {
                const room =
                    snapshot.val();

                if (!room) {
                    cleanup();

                    if (
                        typeof switchTab ===
                        "function"
                    ) {
                        switchTab(
                            "home-screen"
                        );
                    }

                    return;
                }

                if (
                    room.status ===
                    "waiting"
                ) {
                    renderWaiting(
                        room
                    );
                }

                else if (
                    room.status ===
                    "playing"
                ) {
                    renderGame(
                        room
                    );
                }

                else if (
                    room.status ===
                    "finished"
                ) {
                    renderResults(
                        room
                    );
                }
            }
        );
    }

    /* =====================================================
       ATTENTE
    ===================================================== */

    function renderWaiting(room) {
        show(
            "friendRoomLobbyScreen"
        );

        text(
            "friendRoomCode",
            room.code || ""
        );

        const list =
            document.getElementById(
                "friendPlayersList"
            );

        if (!list) {
            return;
        }

        const players =
            Object.values(
                room.players || {}
            );

        list.innerHTML =
            players
                .map(
                    player =>
                        `<div class="friend-player">
                            ${safe(
                                player.username
                            )}
                        </div>`
                )
                .join("");

        const startButton =
            document.getElementById(
                "startFriendGameBtn"
            );

        if (startButton) {
            startButton.style.display =
                friendRoom.isHost
                    ? ""
                    : "none";

            const enoughPlayers =
                players.length >= 2;

            startButton.disabled =
                !enoughPlayers;

            startButton.style.opacity =
                enoughPlayers
                    ? "1"
                    : "0.5";

            startButton.textContent =
                enoughPlayers
                    ? "LANCER LA PARTIE 🚀"
                    : "EN ATTENTE D'UN AMI…";

            startButton.onclick =
                startFriendGame;
        }

        const hostText =
            document.getElementById(
                "friendLobbyStatus"
            );

        if (hostText) {
            hostText.textContent =
                friendRoom.isHost
                    ? players.length >= 2
                        ? "Tu es l'hôte"
                        : "Tu es l'hôte — en attente d'au moins un ami…"
                    : `En attente de ${room.host}…`;
        }
    }

    /* =====================================================
       DÉMARRER
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

            if (!db) {
                return;
            }

            const snapshot =
                await db
                    .ref(
                        `${ROOM_ROOT}/${friendRoom.id}`
                    )
                    .once("value");

            const room =
                snapshot.val();

            if (!room) {
                return;
            }

            const playerCount =
                Object.keys(
                    room.players || {}
                ).length;

            if (playerCount < 2) {
                alert(
                    "Il faut au moins 2 joueurs dans la salle pour lancer la partie."
                );
                return;
            }

            const now =
                getServerNow();

            const updates = {
                status: "playing",
                startedAt: now
            };

            if (
                room.settings.type ===
                "chrono"
            ) {
                updates.endsAt =
                    now +
                    Number(
                        room.settings
                            .duration
                    ) *
                    60 *
                    1000;
            }

            await db
                .ref(
                    `${ROOM_ROOT}/${friendRoom.id}`
                )
                .update(updates);
        };

    /* =====================================================
       PROGRESSION
    ===================================================== */

    function updateAnsweredText(
        room
    ) {
        const players =
            Object.values(
                room.players || {}
            );

        const type =
            room.settings?.type;

        const parts =
            players.map(
                player => {
                    const name =
                        player.username ||
                        "Joueur";

                    const answered =
                        Number(
                            player.answeredCount ||
                            0
                        );

                    if (
                        type ===
                        "questions"
                    ) {
                        const total =
                            Number(
                                room.settings
                                    ?.questionCount ||
                                0
                            );

                        return `${name} : ${answered}/${total}`;
                    }

                    return `${name} : ${answered}`;
                }
            );

        text(
            "friendAnsweredCount",
            parts.join(" · ")
        );
    }
       /* =====================================================
       JEU
    ===================================================== */

    function renderGame(room) {
        show("friendsQuizScreen");

        const nav =
            document.querySelector(
                ".bottom-nav"
            );

        if (nav) {
            nav.style.setProperty(
                "display",
                "none",
                "important"
            );
        }

        const isChrono =
            room.settings?.type ===
            "chrono";

        const timerContainer =
            document.getElementById(
                "friendGameTimerContainer"
            );

        if (timerContainer) {
            timerContainer.style.display =
                isChrono
                    ? ""
                    : "none";
        }

        const centerTimerEl =
            document.getElementById(
                "friendGameCenterTimer"
            );

        if (centerTimerEl) {
            centerTimerEl.style.display =
                isChrono
                    ? ""
                    : "none";
        }

        if (isChrono) {
            startFriendTimer(room);
        }

        const me =
            room.players?.[
                playerKey(username())
            ];

        if (!me) {
            return;
        }

        const index =
            Number(me.currentIndex || 0);

        const question =
            room.questions?.[index];

        if (!question) {
            checkEveryoneFinished(room);
            return;
        }

        const total =
            room.settings?.type === "questions"
                ? Number(
                    room.settings.questionCount || 0
                )
                : room.questions.length;

        text(
            "friendQuestionCounter",
            `Question ${Math.min(index + 1, total)} / ${total}`
        );

        text(
            "friendQuestionText",
            question.question || ""
        );

        const answers =
            document.getElementById(
                "friendAnswers"
            );

        if (!answers) {
            return;
        }

        answers.innerHTML = "";

        const answerOptions =
            question.options ||
            question.answers ||
            question.choices ||
            [];

        const answerKey =
            `${playerKey(username())}_${index}`;

        const savedAnswer =
            room.answers?.[answerKey];

        answerOptions.forEach(
            (answer, answerIndex) => {
                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";
                button.className =
                    "answer";

                button.textContent =
                    answer;

                button.disabled =
                    !!savedAnswer;

                button.onclick =
                    () => {
                        submitAnswer(
                            room,
                            index,
                            answerIndex
                        );
                    };

                answers.appendChild(
                    button
                );
            }
        );

        if (savedAnswer) {
            paintAnswer(
                Number(
                    savedAnswer.selectedIndex
                ),
                Number(
                    question.correct
                ),
                savedAnswer.correct === true
            );

            if (
                room.settings?.type ===
                "questions"
            ) {
                const continueButton =
                    document.createElement(
                        "button"
                    );

                continueButton.type =
                    "button";

                continueButton.className =
                    "friend-continue-button";

                continueButton.textContent =
                    "Continuer →";

                continueButton.onclick =
                    () => {
                        continueFriendQuestion(
                            room,
                            index
                        );
                    };

                answers.appendChild(
                    continueButton
                );
            }

            if (
                room.settings?.type ===
                "chrono"
            ) {
                scheduleChronoAdvance(
                    room,
                    index
                );
            }
        }

        updateAnsweredText(room);
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

        if (!player) {
            return;
        }

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
            getServerNow() >=
                Number(
                    room.endsAt || 0
                )
        ) {
            return;
        }

        const question =
            room.questions[index];

        if (!question) {
            return;
        }

        const answerKey =
            `${key}_${index}`;

        const answerRef =
            db.ref(
                `${ROOM_ROOT}/${friendRoom.id}/answers/${answerKey}`
            );

        const timeMs =
            Math.max(
                0,
                getServerNow() -
                Number(
                    player.questionStartedAt ||
                    getServerNow()
                )
            );

        const result =
            await answerRef.transaction(
                current =>
                    current || {
                        username:
                            username(),

                        questionIndex:
                            index,

                        selectedIndex:
                            selected,

                        correct:
                            Number(
                                selected
                            ) ===
                            Number(
                                question.correct
                            ),

                        timeMs:
                            timeMs,

                        timestamp:
                            firebase
                                .database
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

                    correctCount:
                        correctCount,

                    score:
                        correctCount,

                    currentIndex:
                        index,

                    finished:
                        false
                };
            }
        );

        paintAnswer(
            selected,
            Number(
                question.correct
            ),
            correct
        );

        if (
            correct &&
            typeof playSFX ===
                "function"
        ) {
            playSFX("correct");
        }

        if (
            room.settings.type ===
            "chrono"
        ) {
            scheduleChronoAdvance(
                room,
                index
            );
        }
    }

    /* =====================================================
       AFFICHAGE DE LA RÉPONSE
    ===================================================== */

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
                    index ===
                    selected
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
       QUESTION SUIVANTE — MODE QUESTIONS
    ===================================================== */

    async function continueFriendQuestion(
        room,
        index
    ) {
        const db = getDB();

        if (
            !db ||
            !friendRoom.id
        ) {
            return;
        }

        const key =
            playerKey(username());

        if (
            room.settings.type ===
                "chrono" &&
            getServerNow() >=
                Number(
                    room.endsAt || 0
                )
        ) {
            return;
        }

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

                const nextIndex =
                    index + 1;

                const total =
                    Number(
                        room.settings
                            .questionCount ||
                        0
                    );

                return {
                    ...current,

                    currentIndex:
                        nextIndex,

                    questionStartedAt:
                        getServerNow(),

                    finished:
                        room.settings.type ===
                            "questions" &&
                        nextIndex >= total
                };
            }
        );
    }

    /* =====================================================
       AVANCEMENT AUTOMATIQUE DU CHRONO
    ===================================================== */

    function scheduleChronoAdvance(
        room,
        index
    ) {
        const key =
            `${friendRoom.id}_${playerKey(username())}_${index}`;

        if (
            friendRoom.autoAdvanceKey ===
            key
        ) {
            return;
        }

        if (
            friendRoom.autoAdvanceTimer
        ) {
            clearTimeout(
                friendRoom.autoAdvanceTimer
            );

            friendRoom.autoAdvanceTimer =
                null;
        }

        friendRoom.autoAdvanceKey =
            key;

        friendRoom.autoAdvanceTimer =
            setTimeout(
                () => {
                    friendRoom.autoAdvanceTimer =
                        null;

                    continueFriendQuestion(
                        room,
                        index
                    );
                },
                1400
            );
    }

    /* =====================================================
       FIN DE PARTIE
    ===================================================== */

    function checkEveryoneFinished(
        room
    ) {
        const players =
            Object.values(
                room.players || {}
            );

        if (!players.length) {
            return;
        }

        if (
            room.settings.type ===
            "chrono"
        ) {
            if (
                getServerNow() <
                Number(
                    room.endsAt || 0
                )
            ) {
                return;
            }
        }

        const total =
            room.settings.type ===
            "questions"
                ? Number(
                    room.settings
                        .questionCount ||
                    0
                )
                : room.questions.length;

        const everyoneFinished =
            players.every(
                player =>
                    Number(
                        player.currentIndex ||
                        0
                    ) >= total
            );

        if (
            everyoneFinished &&
            friendRoom.isHost
        ) {
            finishFriendGame();
        }
    }
       /* =====================================================
       FIN DE PARTIE — HÔTE
    ===================================================== */

    async function finishFriendGame() {

        if (!friendRoom.isHost) {
            return;
        }

        const db = getDB();

        if (!db || !friendRoom.id) {
            return;
        }

        const ref =
            db.ref(
                `${ROOM_ROOT}/${friendRoom.id}`
            );

        const snapshot =
            await ref.once("value");

        const room =
            snapshot.val();

        if (!room) {
            return;
        }

        if (
            room.status === "finished"
        ) {
            return;
        }

        await ref.update({
            status: "finished",
            finishedAt:
                firebase.database
                    .ServerValue
                    .TIMESTAMP
        });
    }


    /* =====================================================
       RÉSULTATS
    ===================================================== */

    function computeAverageTime(
        room,
        key
    ) {
        const entries =
            Object.entries(
                room.answers || {}
            );

        let total = 0;
        let count = 0;

        entries.forEach(
            ([answerKey, answer]) => {
                const lastUnderscore =
                    answerKey.lastIndexOf(
                        "_"
                    );

                const ownerKey =
                    answerKey.slice(
                        0,
                        lastUnderscore
                    );

                if (
                    ownerKey === key &&
                    typeof answer?.timeMs ===
                        "number"
                ) {
                    total +=
                        answer.timeMs;
                    count++;
                }
            }
        );

        return count
            ? total / count / 1000
            : null;
    }

    function renderResults(room) {

        show(
            "friendResultsScreen"
        );

        const nav =
            document.querySelector(
                ".bottom-nav"
            );

        if (nav) {
            nav.style.removeProperty(
                "display"
            );
        }

        const players =
            Object.entries(
                room.players || {}
            );

        players.sort(
            ([, a], [, b]) =>
                Number(
                    b.score || 0
                ) -
                Number(
                    a.score || 0
                )
        );

        const list =
            document.getElementById(
                "friendResultsList"
            );

        if (list) {

            list.innerHTML =
                players
                    .map(
                        ([key, player], index) => {

                            const medal =
                                index === 0
                                    ? "🥇"
                                    : index === 1
                                    ? "🥈"
                                    : index === 2
                                    ? "🥉"
                                    : "";

                            const avgTime =
                                computeAverageTime(
                                    room,
                                    key
                                );

                            const avgTimeLabel =
                                avgTime === null
                                    ? ""
                                    : `<span class="friend-result-time">⏱ ${avgTime.toFixed(1)}s/question</span>`;

                            return `
                                <div class="friend-result">
                                    <span class="friend-result-rank">
                                        ${medal || index + 1}
                                    </span>

                                    <span class="friend-result-name">
                                        ${safe(
                                            player.username ||
                                            "Joueur"
                                        )}
                                        ${avgTimeLabel}
                                    </span>

                                    <span class="friend-result-score">
                                        ${Number(
                                            player.score || 0
                                        )} pts
                                    </span>
                                </div>
                            `;
                        }
                    )
                    .join("");
        }

        const meKey =
            playerKey(username());

        const me =
            room.players?.[
                meKey
            ];

        if (me) {

            text(
                "friendFinalScore",
                `${Number(
                    me.score || 0
                )} points`
            );

            text(
                "friendFinalCorrect",
                `${Number(
                    me.correctCount || 0
                )} bonnes réponses`
            );
        }

        const leaveButton =
            document.getElementById(
                "friendResultsLeaveButton"
            );

        if (leaveButton) {

            leaveButton.onclick =
                () => {
                    cleanup();

                    if (
                        typeof switchTab ===
                        "function"
                    ) {
                        switchTab(
                            "home-screen"
                        );
                    } else {
                        show(
                            "friendsModeScreen"
                        );
                    }
                };
        }

    }


    /* =====================================================
       CHRONOMÈTRE
    ===================================================== */

    function startFriendTimer(
        room
    ) {

        const endsAt =
            Number(
                room.endsAt || 0
            );

        if (
            room.settings?.type !==
                "chrono" ||
            !endsAt
        ) {
            if (
                friendRoom.timer
            ) {
                clearInterval(
                    friendRoom.timer
                );

                friendRoom.timer =
                    null;
            }

            friendRoom.timerEndsAt =
                null;

            return;
        }

        if (
            friendRoom.timer &&
            friendRoom.timerEndsAt ===
                endsAt
        ) {
            return;
        }

        if (
            friendRoom.timer
        ) {
            clearInterval(
                friendRoom.timer
            );

            friendRoom.timer =
                null;
        }

        friendRoom.timerEndsAt =
            endsAt;

        const totalDuration =
            Number(
                room.duration ||
                Number(
                    room.settings
                        .duration || 0
                ) *
                    60 *
                    1000
            ) || 1;

        const bar =
            document.getElementById(
                "friendGameTimerBar"
            );

        const centerTimer =
            document.getElementById(
                "friendGameCenterTimer"
            );

        const update =
            () => {

                const remaining =
                    Math.max(
                        0,
                        endsAt -
                        getServerNow()
                    );

                const seconds =
                    Math.ceil(
                        remaining /
                        1000
                    );

                const minutes =
                    Math.floor(
                        seconds /
                        60
                    );

                const rest =
                    seconds %
                    60;

                text(
                    "friendGameTimerText",
                    `${String(
                        minutes
                    ).padStart(2, "0")}:${String(
                        rest
                    ).padStart(2, "0")}`
                );

                const percentage =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (remaining /
                                totalDuration) *
                                100
                        )
                    );

                if (bar) {
                    bar.style.width =
                        percentage +
                        "%";
                }

                const isUrgent =
                    remaining <=
                        10000 &&
                        remaining > 0;

                const container =
                    document.getElementById(
                        "friendGameTimerContainer"
                    );

                if (container) {
                    container.classList.toggle(
                        "friend-timer-warning",
                        isUrgent
                    );
                }

                if (centerTimer) {
                    centerTimer.textContent =
                        `${seconds}s`;

                    centerTimer.classList.toggle(
                        "friend-timer-warning",
                        isUrgent
                    );
                }

                if (
                    remaining <= 0
                ) {

                    clearInterval(
                        friendRoom.timer
                    );

                    friendRoom.timer =
                        null;

                    friendRoom.timerEndsAt =
                        null;

                    if (
                        friendRoom.isHost
                    ) {
                        finishFriendGame();
                    }
                }
            };

        update();

        friendRoom.timer =
            setInterval(
                update,
                250
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

        try {

            new QRCode(
                container,
                {
                    text: code,
                    width: 180,
                    height: 180
                }
            );

        } catch (error) {

            console.error(
                "Erreur QR :",
                error
            );

        }
    }


    window.startFriendQRScanner = function () {

        const container =
            document.getElementById(
                "friendQrReader"
            );

        if (!container) {
            return;
        }

        if (
            typeof Html5Qrcode ===
            "undefined"
        ) {
            alert(
                "Le scanner QR n'a pas pu se charger. Vérifie ta connexion internet."
            );
            return;
        }

        if (friendRoom.scanner) {
            return;
        }

        container.innerHTML = "";
        container.style.display = "block";

            new Html5Qrcode(
                "friendQrReader"
            );

        friendRoom.scanner =
            scanner;

        scanner
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 220 },
                decodedText => {
                    const match =
                        String(decodedText || "")
                            .trim()
                            .toUpperCase()
                            .match(/[A-Z0-9]{6}/);

                    const code =
                        match ? match[0] : "";

                    if (!code) {
                        return;
                    }

                    stopQR();

                    const input =
                        document.getElementById(
                            "friendRoomCodeInput"
                        );

                    if (input) {
                        input.value = code;
                    }

                    joinFriendRoom();
                },
                () => {}
            )
            .catch(error => {
                console.error(
                    "Erreur caméra :",
                    error
                );

                alert(
                    "Impossible d'accéder à la caméra. Vérifie que l'accès y est autorisé pour ce site."
                );

                friendRoom.scanner =
                    null;
            });
    };


    function stopQR() {

        if (
            friendRoom.scanner
        ) {

            try {
                friendRoom.scanner.stop();
            } catch {}

            try {
                friendRoom.scanner.clear();
            } catch {}

            friendRoom.scanner =
                null;
        }

        const container =
            document.getElementById(
                "friendQrReader"
            );

        if (container) {
            container.style.display =
                "none";
        }

    }


    /* =====================================================
       NETTOYAGE
    ===================================================== */

    function cleanup() {

        if (
            friendRoom.listener
        ) {

            friendRoom.listener.off();

            friendRoom.listener =
                null;
        }

        if (
            friendRoom.timer
        ) {

            clearInterval(
                friendRoom.timer
            );

            friendRoom.timer =
                null;
        }

        if (
            friendRoom.autoAdvanceTimer
        ) {

            clearTimeout(
                friendRoom.autoAdvanceTimer
            );

            friendRoom.autoAdvanceTimer =
                null;
        }

        friendRoom.autoAdvanceKey =
            null;

        stopQR();

        friendRoom.id =
            null;

        friendRoom.code =
            null;

        friendRoom.isHost =
            false;

        friendRoom.xpAwarded =
            false;

        friendRoom.timerEndsAt =
            0;

        const nav =
            document.querySelector(
                ".bottom-nav"
            );

        if (nav) {
            nav.style.removeProperty(
                "display"
            );
        }
    }


    /* =====================================================
       QUITTER LA SALLE
    ===================================================== */

    window.leaveFriendRoom =
        async function () {

            const db = getDB();

            if (
                !db ||
                !friendRoom.id
            ) {
                cleanup();
                return;
            }

            const key =
                playerKey(username());

            try {

                await db
                    .ref(
                        `${ROOM_ROOT}/${friendRoom.id}/players/${key}`
                    )
                    .update({
                        online: false
                    });

            } catch (error) {

                console.error(
                    "Erreur sortie salle :",
                    error
                );
            }

            cleanup();

            if (
                typeof switchTab ===
                "function"
            ) {

                switchTab(
                    "home-screen"
                );

            } else {

                show(
                    "friendsModeScreen"
                );

            }
        };
       /* =====================================================
       ÉVÉNEMENTS DES PARAMÈTRES
    ===================================================== */

    function bindFriendSettings() {

        const typeInputs =
            document.querySelectorAll(
                'input[name="friendGameType"]'
            );

        typeInputs.forEach(
            input => {
                input.addEventListener(
                    "change",
                    updateFriendSettingsUI
                );
            }
        );

        const questionModeInputs =
            document.querySelectorAll(
                'input[name="friendQuestionMode"]'
            );

        questionModeInputs.forEach(
            input => {
                input.addEventListener(
                    "change",
                    updateFriendSettingsUI
                );
            }
        );

        const chronoSlider =
            document.getElementById(
                "friendChronoSlider"
            );

        if (chronoSlider) {

            chronoSlider.addEventListener(
                "input",
                updateFriendSettingsUI
            );
        }

        const questionSlider =
            document.getElementById(
                "friendQuestionsSlider"
            );

        if (questionSlider) {

            questionSlider.addEventListener(
                "input",
                updateFriendSettingsUI
            );
        }

        const category =
            document.getElementById(
                "friendCategorySelect"
            );

        if (category) {
            populateCategories();
        }

        updateFriendSettingsUI();
    }


    /* =====================================================
       OUVERTURE DE L'ÉCRAN DE CRÉATION
    ===================================================== */

    window.openCreateFriendRoom =
        function () {

            show(
                "createFriendRoomScreen"
            );

            populateCategories();

            bindFriendSettings();

            updateFriendSettingsUI();
        };


    /* =====================================================
       OUVERTURE DE L'ÉCRAN POUR REJOINDRE
    ===================================================== */

    window.openJoinFriendRoom =
        function () {

            show(
                "joinFriendRoomScreen"
            );

            const input =
                document.getElementById(
                    "friendRoomCodeInput"
                );

            if (input) {
                input.value = "";
                input.focus();
            }
        };


    /* =====================================================
       COPIE DU CODE DE SALLE
    ===================================================== */

    window.copyFriendRoomCode =
        async function () {

            const code =
                friendRoom.code;

            if (!code) {
                return;
            }

            try {

                await navigator
                    .clipboard
                    .writeText(code);

                alert(
                    "Code copié !"
                );

            } catch {

                const input =
                    document.createElement(
                        "input"
                    );

                input.value = code;

                document.body.appendChild(
                    input
                );

                input.select();

                try {
                    document.execCommand(
                        "copy"
                    );
                } catch {}

                input.remove();

                alert(
                    "Code de salle : " +
                    code
                );
            }
        };


    /* =====================================================
       PARTAGE DE LA SALLE
    ===================================================== */

    window.shareFriendRoom =
        async function () {

            const code =
                friendRoom.code;

            if (!code) {
                return;
            }

            const shareData = {
                title:
                    "BrainFlamme",
                text:
                    `Rejoins ma partie BrainFlamme avec le code ${code} !`
            };

            if (
                navigator.share
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                } catch {}

                return;
            }

            try {

                await navigator
                    .clipboard
                    .writeText(
                        shareData.text
                    );

                alert(
                    "Invitation copiée !"
                );

            } catch {

                alert(
                    shareData.text
                );
            }
        };


    /* =====================================================
       QR — AFFICHAGE
    ===================================================== */

    window.showFriendQR =
        function () {

            if (
                !friendRoom.code
            ) {
                return;
            }

            const qrScreen =
                document.getElementById(
                    "friendQRScreen"
                );

            if (qrScreen) {
                qrScreen.style.display =
                    "";
            }

            renderQR(
                friendRoom.code
            );
        };


    window.closeFriendQR =
        function () {

            const qrScreen =
                document.getElementById(
                    "friendQRScreen"
                );

            if (qrScreen) {
                qrScreen.style.display =
                    "none";
            }

            stopQR();
        };


    /* =====================================================
       RETOUR AU MODE AMIS
    ===================================================== */

    window.backToFriendsMode =
        function () {

            stopQR();

            show(
                "friendsModeScreen"
            );
        };


    /* =====================================================
       INITIALISATION
    ===================================================== */

    function initFriends() {

        populateCategories();

        bindFriendSettings();

        updateFriendSettingsUI();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initFriends,
            {
                once: true
            }
        );

    } else {

        initFriends();
    }
       /* =====================================================
       VÉRIFICATION PÉRIODIQUE DU CHRONO
    ===================================================== */

    function monitorFriendGame(room) {

        if (
            room.settings?.type !==
            "chrono"
        ) {
            return;
        }

        const check =
            () => {

                if (
                    !friendRoom.id
                ) {
                    return;
                }

                const remaining =
                    Number(
                        room.endsAt || 0
                    ) -
                    getServerNow();

                if (
                    remaining <= 0
                ) {

                    if (
                        friendRoom.timer
                    ) {
                        clearInterval(
                            friendRoom.timer
                        );

                        friendRoom.timer =
                            null;
                    }

                    if (
                        friendRoom.isHost
                    ) {
                        finishFriendGame();
                    }
                }
            };

        check();

        startFriendTimer(room);
    }


    /* =====================================================
       MISE À JOUR DE LA SALLE
    ===================================================== */

    function handleFriendRoomUpdate(
        room
    ) {

        if (!room) {
            return;
        }

        updateAnsweredText(
            room
        );

        if (
            room.status ===
            "waiting"
        ) {

            renderWaiting(
                room
            );

            return;
        }

        if (
            room.status ===
            "playing"
        ) {

            renderGame(
                room
            );

            monitorFriendGame(
                room
            );

            return;
        }

        if (
            room.status ===
            "finished"
        ) {

            if (
                friendRoom.timer
            ) {

                clearInterval(
                    friendRoom.timer
                );

                friendRoom.timer =
                    null;
            }

            renderResults(
                room
            );
        }
    }


    /* =====================================================
       ÉCOUTE RENFORCÉE DE LA SALLE
    ===================================================== */

    function attachFriendRoomListener() {

        const db = getDB();

        if (
            !db ||
            !friendRoom.id
        ) {
            return;
        }

        if (
            friendRoom.listener
        ) {

            friendRoom.listener.off();

            friendRoom.listener =
                null;
        }

        const ref =
            db.ref(
                `${ROOM_ROOT}/${friendRoom.id}`
            );

        friendRoom.listener =
            ref;

        ref.on(
            "value",
            snapshot => {

                const room =
                    snapshot.val();

                if (!room) {

                    cleanup();

                    show(
                        "friendsModeScreen"
                    );

                    return;
                }

                handleFriendRoomUpdate(
                    room
                );
            }
        );
    }


    /* =====================================================
       SYNCHRONISATION APRÈS CRÉATION / REJOINDRE
    ===================================================== */

    const originalListenFriendRoom =
        listenFriendRoom;

    listenFriendRoom =
        function () {

            originalListenFriendRoom();

            /*
             * Le listener principal est déjà installé
             * par listenFriendRoom().
             *
             * Cette fonction conserve donc la logique
             * existante sans créer de double listener.
             */
        };


    /* =====================================================
       FERMETURE DE PAGE
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (
                friendRoom.listener
            ) {

                try {
                    friendRoom.listener.off();
                } catch {}
            }

            if (
                friendRoom.timer
            ) {

                clearInterval(
                    friendRoom.timer
                );
            }

            if (
                friendRoom.autoAdvanceTimer
            ) {

                clearTimeout(
                    friendRoom.autoAdvanceTimer
                );
            }
        }
    );


    /* =====================================================
       EXPOSITION DE FONCTIONS UTILES
    ===================================================== */

    window.updateFriendSettingsUI =
        updateFriendSettingsUI;

    window.populateFriendCategories =
        populateCategories;

    window.copyFriendRoomCode =
        window.copyFriendRoomCode;

    window.shareFriendRoom =
        window.shareFriendRoom;

    window.showFriendQR =
        window.showFriendQR;

    window.closeFriendQR =
        window.closeFriendQR;

    window.leaveFriendRoom =
        window.leaveFriendRoom;
       /* =====================================================
       SÉCURITÉ : ÉTAT INITIAL
    ===================================================== */

    friendRoom.autoAdvanceTimer = null;
    friendRoom.autoAdvanceKey = null;


    /* =====================================================
       FIN DU MODULE FRIENDS.JS
    ===================================================== */

})();
