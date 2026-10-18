require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;

if (!token) {
    console.error("❌ Token absent ! Vérifie le fichier .env");
    process.exit(1);
}

const bot = new TelegramBot(token, {
    polling: true
});

bot.on("polling_error", (err) => {
    console.error("Erreur Telegram :", err.message);
});

bot.onText(/^\/start$/, async (msg) => {
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "🤖 Intelligence artificielle", callback_data: "ai" }
                ],
                [
                    { text: "🎮 Gaming", callback_data: "gaming" },
                    { text: "🛠️ Outils", callback_data: "tools" }
                ],
                [
                    { text: "💻 Développement", callback_data: "dev" },
                    { text: "📚 Quiz", callback_data: "quiz" }
                ],
                [
                    { text: "👑 À propos", callback_data: "about" }
                ]
            ]
        }
    };

    await bot.sendMessage(
        msg.chat.id,
        "🥷🏼🪽 CRIMSON BOT ULTIMATE\n\n" +
        "Bienvenue dans ton assistant multifonctionnel !\n\n" +
        "🔥 Gaming • Outils • Programmation • Quiz\n\n" +
        "Choisis une catégorie ci-dessous 👇",
        keyboard
    );
});

bot.on("callback_query", async (query) => {
    const sections = {
        ai: "🤖 INTELLIGENCE ARTIFICIELLE\n\nLe module IA sera ajouté prochainement.",
        gaming: "🎮 GAMING\n\n/ff — Conseils Free Fire\n/pubg — Conseils PUBG Mobile",
        tools: "🛠️ OUTILS\n\n/ping — Tester le bot\n/calc 12+8 — Calculatrice",
        dev: "💻 DÉVELOPPEMENT\n\nJavaScript • Node.js • API",
        quiz: "📚 QUIZ\n\n/quiz — Lancer un quiz",
        about: "👑 CRIMSON BOT ULTIMATE\nVersion 1.0\nDéveloppé avec JavaScript et Node.js."
    };

    await bot.answerCallbackQuery(query.id);

    if (query.data === "quiz_correct") {
        return bot.sendMessage(query.message.chat.id,
            "✅ Exact ! Ce bot utilise JavaScript avec Node.js.");
    }

    if (query.data === "quiz_wrong") {
        return bot.sendMessage(query.message.chat.id,
            "❌ Essaie encore ! Le langage utilisé est JavaScript.");
    }

    if (sections[query.data]) {
        await bot.sendMessage(query.message.chat.id, sections[query.data]);
    }
});

bot.onText(/^\/ping$/, (msg) => {
    bot.sendMessage(msg.chat.id, "🏓 Pong ! CRIMSON BOT est actif.");
});

bot.onText(/^\/ff$/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "🔥 FREE FIRE\n\n" +
        "🎯 Entraîne ta précision.\n" +
        "🛡️ Améliore tes murs gloo.\n" +
        "⚙️ Adapte ta sensibilité.\n" +
        "📶 Privilégie une connexion stable."
    );
});

bot.onText(/^\/pubg$/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "🎮 PUBG MOBILE\n\n" +
        "🎯 Travaille le contrôle du recul.\n" +
        "👂 Écoute les bruits de pas.\n" +
        "⚙️ Adapte les graphismes à ton téléphone."
    );
});

bot.onText(/^\/calc(?:\s+(.+))?$/, (msg, match) => {
    const expression = match[1];

    if (!expression) {
        return bot.sendMessage(msg.chat.id,
            "🧮 Utilisation : /calc 12+8");
    }

    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        return bot.sendMessage(msg.chat.id,
            "❌ Expression non valide.");
    }

    try {
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Résultat non valide");
        }

        bot.sendMessage(msg.chat.id, `🧮 Résultat : ${result}`);
    } catch {
        bot.sendMessage(msg.chat.id, "❌ Calcul impossible.");
    }
});

bot.onText(/^\/quiz$/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "📚 MINI QUIZ\n\nQuel langage utilisons-nous pour développer ce bot ?",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "JavaScript", callback_data: "quiz_correct" }],
                    [{ text: "HTML uniquement", callback_data: "quiz_wrong" }]
                ]
            }
        }
    );
});

bot.onText(/^\/help$/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "📋 COMMANDES DISPONIBLES\n\n" +
        "/start — Menu principal\n" +
        "/help — Aide\n" +
        "/ping — Tester le bot\n" +
        "/ff — Conseils Free Fire\n" +
        "/pubg — Conseils PUBG\n" +
        "/calc 12+8 — Calculatrice\n" +
        "/quiz — Mini quiz"
    );
});

console.log("🔥 CRIMSON BOT ULTIMATE démarre...");
