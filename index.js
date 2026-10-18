const commandCategories = {
  User: [
    { name: "register", description: "Créer ton profil" },
    { name: "profile", description: "Afficher ton profil" },
    { name: "balance", description: "Consulter ton solde" }
  ],

  AI: [
    { name: "ai", description: "Assistant intelligent" },
    { name: "gemini", description: "Assistant Gemini" },
    { name: "gpt", description: "Assistant GPT" },
    { name: "translate", description: "Traduire un texte" }
  ],

  "Box Chat": [
    { name: "rules", description: "Afficher les règles du groupe" },
    { name: "warn", description: "Avertissement de modération" },
    { name: "count", description: "Compter les messages" }
  ],

  Gaming: [
    { name: "ff", description: "Conseils Free Fire" },
    { name: "pubg", description: "Conseils PUBG Mobile" },
    { name: "dls", description: "Conseils Dream League Soccer" },
    { name: "quiz", description: "Lancer un quiz" },
    { name: "snake", description: "Jeu Snake" },
    { name: "guess", description: "Deviner un nombre" }
  ],

  Fun: [
    { name: "joke", description: "Obtenir une blague" },
    { name: "fortune", description: "Découvrir ta fortune" },
    { name: "emoji", description: "Obtenir un emoji aléatoire" }
  ],

  Info: [
    { name: "id", description: "Afficher ton identifiant Telegram" },
    { name: "ping", description: "Tester le bot" },
    { name: "info", description: "Informations du bot" },
    { name: "uptime", description: "Temps de fonctionnement" }
  ],

  Tools: [
    { name: "calc", description: "Calculatrice" },
    { name: "font", description: "Styles de texte" },
    { name: "weather", description: "Informations météo" }
  ]
};

// ───────── HELP ─────────

bot.onText(/^\/help(?:@\w+)?$/, async (msg) => {
  let text = "🔍 𝐂𝐑𝐈𝐌𝐒𝐎𝐍 𝐁𝐎𝐓 — 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧰\n";

  for (const [category, commands] of Object.entries(commandCategories)) {
    text += `\n𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${category} (${commands.length})\n`;

    text += commands
      .map(command => `📄 /${command.name}`)
      .join("   ") + "\n";
  }

  text += "\n👑 Developed by CRIMSON 🩵🪽";
  text += "\n\n➜ Command details: /menu <commande>";
  text += "\n➜ Search: /search <mot>";

  await bot.sendMessage(msg.chat.id, text);
});

// ───────── MENU ─────────

bot.onText(/^\/menu(?:@\w+)?(?:\s+([a-z0-9_-]+))?$/i, async (msg, match) => {
  const name = match[1]?.toLowerCase();

  if (!name) {
    return bot.sendMessage(
      msg.chat.id,
      "📄 Utilisation : /menu ping"
    );
  }

  for (const [category, commands] of Object.entries(commandCategories)) {
    const command = commands.find(item => item.name === name);

    if (command) {
      return bot.sendMessage(
        msg.chat.id,
        `📄 COMMANDE : /${command.name}\n\n` +
        `📂 Catégorie : ${category}\n` +
        `📝 Description : ${command.description}`
      );
    }
  }

  return bot.sendMessage(
    msg.chat.id,
    "❌ Commande introuvable dans le catalogue."
  );
});

// ───────── SEARCH ─────────

bot.onText(/^\/search(?:@\w+)?(?:\s+(.+))?$/i, async (msg, match) => {
  const query = match[1]?.trim().toLowerCase();

  if (!query) {
    return bot.sendMessage(
      msg.chat.id,
      "🔎 Utilisation : /search gaming"
    );
  }

  const results = [];

  for (const [category, commands] of Object.entries(commandCategories)) {
    for (const command of commands) {
      if (
        command.name.includes(query) ||
        command.description.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      ) {
        results.push(
          `📂 ${category}\n📄 /${command.name} — ${command.description}`
        );
      }
    }
  }

  return bot.sendMessage(
    msg.chat.id,
    results.length
      ? `🔍 RÉSULTATS DE RECHERCHE\n\n${results.join("\n\n")}`
      : "❌ Aucune commande trouvée."
  );
});

console.log("👑 Système HELP chargé !");
