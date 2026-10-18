const questions = [
  {
    q: "Que donne 2 + 3 en JavaScript ?",
    options: ["23", "5", "6", "Erreur"],
    answer: 1,
    explanation: "2 + 3 donne 5."
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
    explanation: "La balise <p> sert à créer un paragraphe."
  },
  {
    q: "Quelle propriété CSS change la couleur du texte ?",
    options: ["background", "font-size", "color", "border"],
    answer: 2,
    explanation: "La propriété color définit la couleur du texte."
  },
  {
    q: "Quel opérateur JavaScript compare aussi le type ?",
    options: ["=", "==", "===", "!="],
    answer: 2,
    explanation: "=== compare la valeur et le type."
  }
];

const sessions = new Map();

function registerQuiz(bot) {
  bot.onText(/^\/quizcode(?:@\w+)?$/, async (msg) => {
    const userId = msg.from.id;

    const questionIndex = Math.floor(
      Math.random() * questions.length
    );

    const question = questions[questionIndex];

    sessions.set(userId, {
      questionIndex,
      answered: false
    });

    const keyboard = question.options.map((option, index) => [{
      text: option,
      callback_data: `cq:${userId}:${index}`
    }]);

    await bot.sendMessage(
      msg.chat.id,
      `👑 CRIMSON CODE QUIZ\n\n` +
      `💻 Question : ${question.q}\n\n` +
      `🎯 Choisis une réponse :`,
      {
        reply_markup: {
          inline_keyboard: keyboard
        }
      }
    );
  });

  bot.on("callback_query", async (query) => {
    if (!query.data || !query.data.startsWith("cq:")) return;

    const [, targetUser, selected] = query.data.split(":");

    if (String(query.from.id) !== targetUser) {
      return bot.answerCallbackQuery(query.id, {
        text: "Ce quiz appartient à un autre joueur !"
      });
    }

    const session = sessions.get(query.from.id);

    if (!session || session.answered) {
      return bot.answerCallbackQuery(query.id, {
        text: "Tu as déjà répondu à cette question."
      });
    }

    session.answered = true;

    const question = questions[session.questionIndex];
    const correct = Number(selected) === question.answer;

    await bot.answerCallbackQuery(query.id, {
      text: correct ? "Bonne réponse ! 🎉" : "Essaie encore la prochaine fois !"
    });

    const keyboard = [[
      {
        text: "🔄 Question suivante",
        callback_data: `cqnext:${query.from.id}`
      }
    ]];

    await bot.editMessageText(
      `${correct ? "✅ CORRECT !" : "❌ INCORRECT !"}\n\n` +
      `📘 Réponse : ${question.options[question.answer]}\n` +
      `💡 Explication : ${question.explanation}`,
      {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: {
          inline_keyboard: keyboard
        }
      }
    );
  });

  bot.on("callback_query", async (query) => {
    if (!query.data || !query.data.startsWith("cqnext:")) return;

    const userId = Number(query.data.split(":")[1]);

    if (query.from.id !== userId) {
      return bot.answerCallbackQuery(query.id, {
        text: "Ce bouton appartient à un autre joueur."
      });
    }

    await bot.answerCallbackQuery(query.id);

    const questionIndex = Math.floor(
      Math.random() * questions.length
    );

    sessions.set(userId, {
      questionIndex,
      answered: false
    });

    const question = questions[questionIndex];

    await bot.sendMessage(
      query.message.chat.id,
      `👑 CRIMSON CODE QUIZ\n\n💻 ${question.q}`,
      {
        reply_markup: {
          inline_keyboard: question.options.map((option, index) => [{
            text: option,
            callback_data: `cq:${userId}:${index}`
          }])
        }
      }
    );
  });
}

module.exports = registerQuiz;
