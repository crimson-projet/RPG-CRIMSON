const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN manquant dans les variables d'environnement.");
}

const bot = new TelegramBot(token, {
  polling: true
});

const scores = new Map();

const questions = [
  {
    q: "Que vaut 2 + 3 en JavaScript ?",
    options: ["23", "5", "6", "Erreur"],
    answer: 1,
    explanation: "2 + 3 vaut 5."
  },
  {
    q: "Quelle fonction affiche un texte en Python ?",
    options: ["echo()", "print()", "show()", "write()"],
    answer: 1,
    explanation: "print() affiche du texte en Python."
  },
  {
    q: "Quelle balise HTML crée un paragraphe ?",
    options: ["<h1>", "<p>", "<img>", "<br>"],
    answer: 1,
    explanation: "La balise <p> représente un paragraphe."
  },
  {
    q: "Quelle propriété CSS modifie la couleur du texte ?",
    options: ["background", "font-size", "color", "border"],
    answer: 2,
    explanation: "color définit la couleur du texte."
  },
  {
    q: "Quel opérateur JavaScript compare valeur et type ?",
    options: ["=", "==", "===", "!="],
    answer: 2,
    explanation: "=== effectue une comparaison stricte."
  }
];

const sessions = new Map();

bot.onText(/^\/start(?:@\w+)?$/, async (msg) => {
  const name = msg.from.first_name || "Joueur";

  await bot.sendMessage(
    msg.chat.id,
    `👑 Bienvenue ${name} sur CRIMSON BOT ULTIMATE !\n\n` +
    "🔥 Gaming • Quiz • Outils\n" +
    "💻 Programmation\n\n" +
    "Utilise /help pour découvrir les commandes.",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📚 COMMANDES", callback_data: "menu_help" }],
          [{ text: "🎮 GAMING", callback_data: "menu_gaming" }],
          [{ text: "💻 QUIZ CODE", callback_data: "menu_quiz" }]
        ]
      }
    }
  );
});

bot.onText(/^\/help(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "👑 CRIMSON BOT ULTIMATE\n" +
    "━━━━━━━━━━━━━━━━━━\n\n" +
    "📌 GÉNÉRAL\n" +
    "/start — Démarrer le bot\n" +
    "/help — Afficher les commandes\n" +
    "/ping — Tester le bot\n" +
    "/id — Afficher ton identifiant Telegram\n" +
    "/score — Voir ton score de quiz\n\n" +
    "🎮 GAMING\n" +
    "/gaming — Menu gaming\n" +
    "/fftips — Conseils Free Fire\n" +
    "/ffsens — Conseils de sensibilité\n" +
    "/ffname — Idées de pseudo\n" +
    "/pubgtips — Conseils PUBG\n" +
    "/pubgsens — Réglages PUBG\n" +
    "/dlstips — Conseils DLS\n\n" +
    "💻 PROGRAMMATION\n" +
    "/quizcode — Quiz de programmation\n\n" +
    "━━━━━━━━━━━━━━━━━━\n" +
    "🥷 CRIMSON 🩵🪽"
  );
});

bot.onText(/^\/ping(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(msg.chat.id, "🏓 Pong ! CRIMSON BOT est actif.");
});

bot.onText(/^\/id(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🆔 Ton identifiant Telegram : ${msg.from.id}`
  );
});

bot.onText(/^\/gaming(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "🎮 CRIMSON GAMING CENTER\n\n" +
    "🔥 FREE FIRE\n/fftips\n/ffsens\n/ffname\n\n" +
    "🎯 PUBG MOBILE\n/pubgtips\n/pubgsens\n\n" +
    "⚽ DREAM LEAGUE SOCCER\n/dlstips\n\n" +
    "💻 PROGRAMMATION\n/quizcode"
  );
});

bot.onText(/^\/fftips(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "🔥 FREE FIRE TIPS\n\n" +
    "🎯 Entraîne-toi aux tirs à la tête.\n" +
    "🧱 Travaille la pose des murs gloo.\n" +
    "🏃 Déplace-toi pendant les combats.\n" +
    "🎧 Les écouteurs peuvent aider à repérer les pas.\n" +
    "⚙️ Ajuste progressivement ta sensibilité."
  );
});

bot.onText(/^\/ffsens(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "🎯 CRIMSON SENSITIVITY\n\n" +
    "Teste tes réglages au terrain d'entraînement.\n" +
    "Ajuste la sensibilité par petites étapes.\n" +
    "Entraîne-toi aux tirs à la tête."
  );
});

bot.onText(/^\/ffname(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "👑 PSEUDOS CRIMSON\n\n" +
    "🥷 CRIMSON D-SHADOW\n" +
    "🪽 亗CRIMSON亗\n" +
    "🔥 CRIMSON々VOID\n" +
    "💀 ᴄʀɪᴍsᴏɴメ\n" +
    "⚡ CRIMSON乂"
  );
});

bot.onText(/^\/pubgtips(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "🎯 PUBG MOBILE TIPS\n\n" +
    "🪖 Utilise les couvertures.\n" +
    "👂 Écoute les bruits de pas.\n" +
    "🎯 Entraîne-toi au contrôle du recul.\n" +
    "🗺️ Surveille la zone.\n" +
    "🔋 Réduis les graphismes si ton téléphone chauffe."
  );
});

bot.onText(/^\/pubgsens(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "🎮 PUBG SENSITIVITY\n\n" +
    "• Ajuste la caméra selon tes préférences.\n" +
    "• Teste le recul au stand de tir.\n" +
    "• Configure les lunettes séparément si nécessaire."
  );
});

bot.onText(/^\/dlstips(?:@\w+)?$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "⚽ DLS TIPS\n\n" +
    "🥅 Renforce les postes faibles.\n" +
    "💰 Économise tes pièces.\n" +
    "🛡️ Garde une défense équilibrée.\n" +
    "⚡ Évite de sprinter constamment.\n" +
    "🎯 Travaille les passes et les tirs."
  );
});

bot.onText(/^\/quizcode(?:@\w+)?$/, async (msg) => {
  const userId = msg.from.id;

  const index = Math.floor(Math.random() * questions.length);
  sessions.set(userId, {
    index,
    answered: false
  });

  await sendQuestion(msg.chat.id, userId, index);
});

async function sendQuestion(chatId, userId, index) {
  const question = questions[index];

  const buttons = question.options.map((option, i) => [{
    text: option,
    callback_data: `qc:${userId}:${index}:${i}`
  }]);

  await bot.sendMessage(
    chatId,
    `💻 CRIMSON CODE QUIZ\n\n` +
    `❓ ${question.q}\n\n` +
    "Choisis la bonne réponse :",
    {
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  );
}

bot.onText(/^\/score(?:@\w+)?$/, async (msg) => {
  const score = scores.get(msg.from.id) || 0;

  await bot.sendMessage(
    msg.chat.id,
    `🏆 Ton score CRIMSON CODE : ${score} point(s).`
  );
});

bot.on("callback_query", async (query) => {
  try {
    const data = query.data || "";

    if (data === "menu_help") {
      await bot.answerCallbackQuery(query.id);
      return bot.sendMessage(query.message.chat.id, "Utilise /help pour afficher les commandes.");
    }

    if (data === "menu_gaming") {
      await bot.answerCallbackQuery(query.id);
      return bot.sendMessage(query.message.chat.id, "🎮 Utilise /gaming pour découvrir les commandes gaming.");
    }

    if (data === "menu_quiz") {
      await bot.answerCallbackQuery(query.id);
      return bot.sendMessage(query.message.chat.id, "💻 Lance ton quiz avec /quizcode.");
    }

    if (!data.startsWith("qc:")) return;

    const [, userId, questionIndex, selected] = data.split(":");

    if (String(query.from.id) !== userId) {
      return bot.answerCallbackQuery(query.id, {
        text: "Ce quiz appartient à un autre joueur."
      });
    }

    const session = sessions.get(query.from.id);

    if (
      !session ||
      session.answered ||
      session.index !== Number(questionIndex)
    ) {
      return bot.answerCallbackQuery(query.id, {
        text: "Cette question est déjà terminée."
      });
    }

    session.answered = true;

    const question = questions[session.index];
    const correct = Number(selected) === question.answer;

    if (correct) {
      scores.set(
        query.from.id,
        (scores.get(query.from.id) || 0) + 1
      );
    }

    await bot.answerCallbackQuery(query.id, {
      text: correct ? "Bonne réponse ! 🎉" : "Mauvaise réponse !"
    });

    await bot.editMessageText(
      `${correct ? "✅ CORRECT !" : "❌ INCORRECT !"}\n\n` +
      `📘 Réponse : ${question.options[question.answer]}\n` +
      `💡 ${question.explanation}\n\n` +
      `🏆 Score : ${scores.get(query.from.id) || 0}`,
      {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: {
          inline_keyboard: [[
            {
              text: "🔄 Recommencer",
              callback_data: "menu_quiz"
            }
          ]]
        }
      }
    );
  } catch (error) {
    console.error("Erreur callback :", error.message);
  }
});

bot.on("polling_error", (error) => {
  console.error("Erreur Telegram :", error.message);
});

console.log("👑 CRIMSON BOT ULTIMATE est lancé !");
