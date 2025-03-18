// shengMode.js

const shengMode = {
  enabled: true, // Default state is ON
  users: {} // To track conversation state for each user
};

const triggerWords = [
  "yooh", "wozza", "mzee", "mkuu niaje", "hey", "sup", "mambo", "uko aje"
];

// Dictionary of specific Sheng phrases and responses
const shengReplies = {
  "yooh": "Yooh semaje mzee, unadai bot ama?",
  "wozza": "Wozza msee, mambo vipi? Kuna vibe?",
  "mzee": "Sema mzee, form ni gani? Uko poa?",
  "mkuu niaje": "Mkuu niaje, uko freshi? Unauliza aje?",
  "hey": "Hey, vipi boss? Unahitaji mambo gani leo?",
  "sup": "Sup, uko fiti? Tuko mtaa!",
  "mambo": "Mambo vipi? Hustle aje, let's vibe!",
  "uko aje": "Uko aje? Niko freshi sana, tuko in the game!",
  
  // Additional lively responses
  "cheza": "Cheza chini, relax and enjoy life!",
  "freshi": "Freshi kama mdogo, form ni sawa!",
  "kiko poa": "Kiko poa, usiwute mambo, twende kazi!",
  "unajua": "Unajua, maisha ni hustle lakini lazima ucheke!",
  "mbona": "Mbona? Twende hustle, hakuna stress!",
  "hustle": "Hustle aje, lazima upige kazi na enjoy maisha!",
  "sherehe": "Sherehe iko fiti sana, unataka kuja?",
  "nina tips": "Tips ya mtaa: always smile, stay woke, and hustle hard!",
  "kiende": "Kiende, bro! Life ni safari, enjoy the ride!",
  "form ni gani": "Form ni kuchill, tuongee na cheki mambo!",
  "uko na doo": "Uko na doo? Sasa ni time ya hustle zaidi!",
  "baza": "Baza iko poa, lakini lazima tuwe sharp kila time!",
  "kesho kuna plan": "Kesho kuna plan, lazima tuipange mapema!",
  "utakuja lini": "Utakuja lini? Niko karibu, piga luku kidogo!",
  "leo kuna nini": "Leo kuna vibes, msee! Tuko ready for sherehe!",
  "tukutane wapi": "Tukutane wapi? Naomba nipe spot yako, bro!",
  "manze": "Manze, sema kweli! Unadai nini leo?",
  "niko radar": "Niko radar, kila kitu kiko poa!"
};

const positiveResponses = ["yes", "yap", "eeh"]; // For confirmation steps

// Function to toggle Sheng mode on or off
const toggleSheng = (m, status) => {
  if (status === "on") {
    shengMode.enabled = true;
    m.reply("✅ *Sheng AI Mode activated!* Tuko mtaa sasa!");
  } else if (status === "off") {
    shengMode.enabled = false;
    m.reply("🚫 *Sheng AI Mode deactivated!* Nime chill sasa.");
  }
};

// Main Sheng AI Chat function
const shengChat = async (m) => {
  if (!shengMode.enabled) return; // Do nothing if mode is off

  const text = m.body.toLowerCase().trim();
  const sender = m.sender;

  // If message is exactly one of the trigger words, start conversation
  if (triggerWords.includes(text)) {
    m.reply("Yooh semaje mzee, unadai bot ama?");
    shengMode.users[sender] = "waitingForYes"; // Set conversation state
    return;
  }
  
  // Step 1: User replies to initial greeting with a positive response
  if (shengMode.users[sender] === "waitingForYes" && positiveResponses.includes(text)) {
    m.reply("Naeka na 80 mkuu, uko ready nitume link?");
    shengMode.users[sender] = "waitingForConfirm";
    return;
  }
  
  // Step 2: User confirms and bot sends the link
  if (shengMode.users[sender] === "waitingForConfirm" && positiveResponses.includes(text)) {
    m.reply("✅ Link hii hapa mkuu:\nhttps://projext-session-server-a9643bc1be6b.herokuapp.com/");
    delete shengMode.users[sender]; // Reset state
    return;
  }

  // If user had a pending state but responds with unrelated text, reset state
  if (shengMode.users[sender]) {
    delete shengMode.users[sender];
  }

  // If the text contains any of our defined keys, respond with the corresponding phrase
  for (const key in shengReplies) {
    if (text.includes(key)) {
      m.reply(shengReplies[key]);
      return;
    }
  }

  // Default random reply if nothing matches
  const randomReplies = [
    "Unadai aje buda?", "Niko fit, wewe uko aje?", "Maisha ya mtaa iko vipi leo?",
    "Cheka, mambo yako poa?", "Unajua, hustle ni life!", "Twende kazi, bro!",
    "Msee, sema kweli, una shida?", "Hakuna stress, we are in the game!",
    "Fiti vibes, msee! Unataka tuongee?"
  ];
  const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
  m.reply(randomReply);
};

export { shengChat, toggleSheng };
