// ═══════════════════════════════════════
//       CRIMSON BOT ULTIMATE 👑
//          COMMAND CENTER
// ═══════════════════════════════════════

const commands = {
  "🤖 INTELLIGENCE ARTIFICIELLE": [
    "ai", "ask", "chatgpt", "gemini", "translate",
    "summarize", "explain", "write", "story", "code",
    "debug", "fixcode", "review", "python", "javascript",
    "html", "css", "sql", "regex", "algorithm",
    "idea", "brainstorm", "prompt", "grammar", "spell",
    "define", "synonym", "antonym", "learn", "tutor"
  ],

  "💻 PROGRAMMATION": [
    "quizcode", "terminal", "base64", "decode64", "json",
    "minify", "format", "htmltest", "csscolor", "uuid",
    "timestamp", "binary", "hex", "ascii", "morse",
    "password", "hash", "urlencode", "urldecode", "markdown",
    "githelp", "npmhelp", "nodehelp", "pythonhelp", "jshelp",
    "bugreport", "codequiz", "devtools", "techquiz", "compiler"
  ],

  "🎮 GAMING": [
    "ff", "freefire", "ffstats", "ffsens", "fftips",
    "ffname", "ffbio", "ffrank", "ffquiz", "ffguide",
    "pubg", "pubgtips", "pubgsens", "pubgguide", "pubgquiz",
    "dls", "dlstips", "dlsquiz", "efootball", "fc mobile",
    "minecraft", "roblox", "gaming", "gamequiz", "gamer",
    "crosshair", "fps", "pinggame", "gametips", "gameinfo"
  ],

  "🛠️ OUTILS": [
    "calc", "convert", "qr", "shorturl", "weather",
    "time", "date", "count", "reverse", "uppercase",
    "lowercase", "fancy", "emojify", "repeat", "choose",
    "dice", "coin", "random", "number", "percentage",
    "age", "timer", "stopwatch", "calendar", "reminder",
    "note", "checklist", "unit", "currency", "helpme"
  ],

  "🎯 QUIZ": [
    "quiz", "quizcode", "quiztech", "quizgeneral",
    "quizscience", "quizmath", "quizhistory", "quizgeo",
    "quizenglish", "quizfrench", "quizhtml", "quizcss",
    "quizpython", "quizjs", "quizlogic", "trivia",
    "challenge", "question", "answer", "score",
    "leaderboard", "dailyquiz", "exam", "learnfact", "brain"
  ],

  "😂 DIVERTISSEMENT": [
    "joke", "meme", "fact", "quote", "motivation",
    "roast", "ship", "love", "truth", "dare",
    "wouldyourather", "riddle", "storytime", "fun",
    "compliment", "insult", "fortune", "vibe", "mood",
    "nickname", "username", "bio", "caption", "status",
    "inspire"
  ],

  "📱 TELEGRAM": [
    "start", "help", "ping", "id", "myid",
    "info", "profile", "botinfo", "commands", "about",
    "support", "feedback", "language", "setlang", "report",
    "privacy", "version", "uptime", "stats", "menu",
    "contact", "rules", "terms", "donate", "source"
  ],

  "⚙️ ADMINISTRATION": [
    "ban", "unban", "mute", "unmute", "warn",
    "warnings", "kick", "promote", "demote", "admins",
    "lock", "unlock", "antilink", "welcome", "goodbye",
    "setrules", "clear", "purge", "slowmode"
  ],

  "👑 CRIMSON": [
    "crimson", "crimsoninfo", "crimsonquiz", "crimsonrank",
    "crimsonpoints", "crimsonlevel", "crimsondaily",
    "crimsonprofile", "crimsonbadge", "crimsonleaderboard",
    "crimsontheme", "crimsonmenu", "crimsonstats",
    "crimsonhelp", "crimsonversion"
  ]
};

// Menu Telegram
function getHelpMessage() {
  let message = "👑 CRIMSON BOT ULTIMATE\n";
  message += "━━━━━━━━━━━━━━━━━━━━\n";
  message += "📚 CENTRE DES COMMANDES\n\n";

  for (const [category, cmds] of Object.entries(commands)) {
    message += `${category}\n`;
    message += cmds.map(cmd => `/${cmd}`).join(" • ");
    message += "\n\n";
  }

  message += "━━━━━━━━━━━━━━━━━━━━\n";
  message += "⚡ Développé par CRIMSON 🩵🪽";

  return message;
}

module.exports = { commands, getHelpMessage };
