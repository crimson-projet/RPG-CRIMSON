const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN manquant dans les variables Render !");
}

const bot = new TelegramBot(token, { polling: true });

const DATA_FILE = path.join(__dirname, "quiz_data.json");

const categories = {
    programmation: "💻 Programmation",
    freefire: "🔥 Free Fire",
    pubg: "🔫 PUBG Mobile",
    dls: "⚽ Dream League Soccer",
    culture: "🌍 Culture générale",
    informatique: "🖥️ Informatique",
    electronique: "⚡ Électronique",
    devinettes: "🧩 Devinettes"
};

const questions = {
    programmation: [
        {
            q: "Quel mot affiche un message dans la console JavaScript ?",
            a: ["console.log()", "print()", "echo()", "show()"],
            correct: 0
        },
        {
            q: "Quel mot déclare une constante en JavaScript ?",
            a: ["var", "const", "static", "define"],
            correct: 1
        }
    ],

    freefire: [
        {
            q: "Quel est le nom du mode où deux joueurs s'affrontent individuellement ?",
            a: ["Battle Royale", "Loup solitaire", "Entraînement", "Escarmouche"],
            correct: 1
        },
        {
            q: "Quel élément permet de se protéger rapidement pendant un combat ?",
            a: ["Mur de gloo", "Sac", "Carte", "Jeton"],
            correct: 0
        }
    ],

    pubg: [
        {
            q: "Que signifie principalement l'objectif du Battle Royale ?",
            a: ["Être le dernier survivant", "Construire une base", "Marquer des buts", "Résoudre des calculs"],
            correct: 0
        }
    ],

    dls: [
        {
            q: "Quel est l'objectif principal dans Dream League Soccer ?",
            a: ["Marquer des buts", "Construire des maisons", "Résoudre des énigmes", "Survivre aux zombies"],
            correct: 0
        }
    ],

    culture: [
        {
            q: "Quelle est la capitale de la République démocratique du Congo ?",
            a: ["Lubumbashi", "Kinshasa", "Goma", "Kisangani"],
            correct: 1
        }
    ],

    informatique: [
        {
            q: "Quel composant exécute principalement les instructions d'un programme ?",
            a: ["Le processeur", "Le clavier", "La souris", "Le haut-parleur"],
            correct: 0
        }
    ],

    electronique: [
        {
            q: "Quelle unité mesure la tension électrique ?",
            a: ["Ampère", "Volt", "Ohm", "Watt"],
            correct: 1
        },
        {
            q: "Quel composant s'oppose au passage du courant électrique ?",
            a: ["Résistance", "LED", "Interrupteur fermé", "Fil conducteur"],
            correct: 0
        },
        {
            q: "Quelle unité mesure l'intensité du courant électrique ?",
            a: ["Volt", "Watt", "Ampère", "Ohm"],
            correct: 2
        }
    ],

    devinettes: [
        {
            q: "Plus je sèche, plus je deviens mouillé. Qui suis-je ?",
            a: ["Une serviette", "Le soleil", "Un ventilateur", "Un miroir"],
            correct: 0
        },
        {
            q: "J'ai des touches, mais je n'ouvre aucune porte. Qui suis-je ?",
            a: ["Un clavier", "Une serrure", "Une fenêtre", "Une clé"],
            correct: 0
        },
        {
            q: "Je peux faire le tour du monde tout en restant dans un coin. Qui suis-je ?",
            a: ["Un timbre", "Une voiture", "Un avion", "Une chaussure"],
            correct: 0
        }
    ]
};

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        }
    } catch (error) {
        console.error("Erreur lecture données :", error);
    }

    return { scores: {}, sessions: {} };
}

const data = loadData();

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getScore(userId) {
    return data.scores[userId] || {
        name: "Joueur",
        points: 0,
        parties: 0
    };
}

function setScore(userId, name, points) {
    const score = getScore(userId);
    score.name = name;
    score.points += points;
    data.scores[userId] = score;
    saveData();
}

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function mainMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Jouer au quiz", callback_data: "quiz_start" }],
                [{ text: "🏆 Classement général", callback_data: "quiz_rank" }],
                [{ text: "👤 Mon profil", callback_data: "quiz_profile" }]
            ]
        }
    };
}

bot.onText(/^\/quiz$/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "👑 CRIMSON QUIZ\n\nChoisis une option pour commencer !",
        mainMenu()
    );
});

bot.onText(/^\/classement$/, (msg) => {
    const ranking = Object.entries(data.scores)
        .sort((a, b) => b[1].points - a[1].points)
        .slice(0, 10);

    if (!ranking.length) {
        return bot.sendMessage(msg.chat.id, "🏆 Aucun score pour le moment !");
    }

    const text = ranking.map(([id, player], i) =>
        `${i + 1}. ${player.name} — ${player.points} points`
    ).join("\n");

    bot.sendMessage(msg.chat.id, `👑 CLASSEMENT CRIMSON\n\n${text}`);
});

bot.onText(/^\/monprofil$/, (msg) => {
    const player = getScore(String(msg.from.id));

    bot.sendMessage(
        msg.chat.id,
        `👤 PROFIL\n\nNom : ${msg.from.first_name}\nPoints : ${player.points}\nParties terminées : ${player.parties}`
    );
});

bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const userId = String(query.from.id);
    const action = query.data;

    await bot.answerCallbackQuery(query.id).catch(() => {});

    if (action === "quiz_start") {
        const buttons = Object.entries(categories).map(([id, name]) => [
            { text: name, callback_data: `cat:${id}` }
        ]);

        return bot.sendMessage(chatId, "📚 Choisis une catégorie :", {
            reply_markup: { inline_keyboard: buttons }
        });
    }

    if (action === "quiz_rank") {
        const ranking = Object.entries(data.scores)
            .sort((a, b) => b[1].points - a[1].points)
            .slice(0, 10);

        const text = ranking.length
            ? ranking.map(([id, p], i) =>
                `${i + 1}. ${p.name} — ${p.points} points`
            ).join("\n")
            : "Aucun joueur classé pour le moment.";

        return bot.sendMessage(chatId, `🏆 CLASSEMENT GÉNÉRAL\n\n${text}`);
    }

    if (action === "quiz_profile") {
        const player = getScore(userId);
        return bot.sendMessage(
            chatId,
            `👤 ${query.from.first_name}\n🏆 Points : ${player.points}\n🎮 Parties : ${player.parties}`
        );
    }

    if (action.startsWith("cat:")) {
        const category = action.split(":")[1];

        if (!questions[category]) {
            return bot.sendMessage(chatId, "Catégorie indisponible.");
        }

        data.sessions[userId] = {
            category,
            mode: null,
            count: null,
            index: 0,
            points: 0,
            questions: shuffle(questions[category])
        };

        const buttons = [
            [{ text: "5 questions", callback_data: "count:5" }],
            [{ text: "10 questions", callback_data: "count:10" }],
            [{ text: "20 questions", callback_data: "count:20" }],
            [{ text: "50 questions", callback_data: "count:50" }],
            [{ text: "100 questions", callback_data: "count:100" }]
        ];

        return bot.sendMessage(chatId, "🔢 Combien de questions ?", {
            reply_markup: { inline_keyboard: buttons }
        });
    }

    if (action.startsWith("count:")) {
        const session = data.sessions[userId];
        if (!session) return;

        session.count = Number(action.split(":")[1]);

        return bot.sendMessage(chatId, "👥 Choisis ton mode :", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "👤 Solo", callback_data: "mode:solo" }],
                    [{ text: "👥 Multijoueur", callback_data: "mode:multi" }]
                ]
            }
        });
    }

    if (action.startsWith("mode:")) {
        const session = data.sessions[userId];
        if (!session) return;

        session.mode = action.split(":")[1];

        if (session.mode === "multi") {
            return bot.sendMessage(
                chatId,
                "👥 Le mode multijoueur sera activé dans la prochaine version.\n\nPour l'instant, choisis Solo pour jouer."
            );
        }

        session.index = 0;
        session.points = 0;
        session.questions = shuffle(questions[session.category])
            .slice(0, session.count);

        return sendQuestion(chatId, userId);
    }

    if (action.startsWith("answer:")) {
        const [, answerUserId, answerIndex, answerChoice] = action.split(":");

        if (answerUserId !== userId) {
            return bot.sendMessage(chatId, "Cette partie appartient à un autre joueur.");
        }

        const session = data.sessions[userId];
        if (!session || session.index !== Number(answerIndex)) return;

        const current = session.questions[session.index];

        if (!current) return;

        const choice = Number(answerChoice);
        const correct = choice === current.correct;

        if (correct) session.points++;

        await bot.sendMessage(
            chatId,
            correct
                ? "✅ Bonne réponse ! +1 point"
                : `❌ Mauvaise réponse ! La bonne réponse était : ${current.a[current.correct]}`
        );

        session.index++;

        if (session.index >= session.questions.length) {
            setScore(userId, query.from.first_name, session.points);

            const score = getScore(userId);
            score.parties++;
            saveData();

            delete data.sessions[userId];
            saveData();

            return bot.sendMessage(
                chatId,
                `🏁 QUIZ TERMINÉ !\n\n⭐ Score : ${session.points}/${session.count}\n🏆 Total : ${score.points} points`,
                mainMenu()
            );
        }

        return sendQuestion(chatId, userId);
    }
});

async function sendQuestion(chatId, userId) {
    const session = data.sessions[userId];

    if (!session) return;

    const question = session.questions[session.index];

    if (!question) {
        return bot.sendMessage(chatId, "Pas assez de questions dans cette catégorie.");
    }

    const buttons = question.a.map((answer, i) => [{
        text: answer,
        callback_data: `answer:${userId}:${session.index}:${i}`
    }]);

    await bot.sendMessage(
        chatId,
        `📚 ${categories[session.category]}\n` +
        `❓ Question ${session.index + 1}/${session.count}\n\n` +
        question.q,
        { reply_markup: { inline_keyboard: buttons } }
    );
}

bot.on("polling_error", (error) => {
    console.error("Erreur Telegram :", error.message);
});

console.log("👑 CRIMSON QUIZ est lancé !");
