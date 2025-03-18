const shengMode = {
    enabled: true, // Default state is ON
    users: {} // To track conversation state for each user
};

// Sheng trigger words (merged without duplicates)
const triggerWords = [
    "yooh", "wozza", "mzee", "mkuu niaje", "bro", "sup", "mambo", "uko aje", "mkuu",
    "niaje", "freshi", "sasa", "rada", "vipi", "kiongos", "form", "gotea", "luku",
    "mbogi", "rieng", "mca", "nadai bot", "niko fiti", "buda", "niko rada"
];

// Sheng responses (merged without duplicates)
const shengReplies = {
    "bera": "Yooh semaje mzee, unadai bot ama?",
    "wozza": "Wozza mzee, form ni gani mkuu?",
    "mzee": "Sema mzee, form ni gani? Uko poa?",
    "mkuu niaje": "Poa mzee, uko freshi? Unauliza aje?",
    "bro": "Rada mkuu semaje?",
    "sup": "Sup, uko fiti? Tuko mtaa!",
    "mambo": "Poa sana mkuu. Unasema aje?",
    "uko aje": "Niko poa mkuu, maybe wewe?",
    "cheza": "Cheza chini, relax and enjoy life!",
    "freshi": "Freshi kama mdogo, form ni sawa!",
    "hustle": "Hustle aje, lazima upige kazi na enjoy maisha!",
    "sherehe": "Sherehe iko fiti sana, unataka kuja?",
    "kiende": "Kiende, bro! Life ni safari, enjoy the ride!",
    "tukutane wapi": "Tukutane wapi? Naomba nipe spot yako, bro!",
    "manze": "Manze, sema kweli! Unadai nini leo?",
    "niko radar": "Niko radar, kila kitu kiko poa!"
};

// Positive responses for confirmation steps
const positiveResponses = ["yes", "yap", "eeh", "tuma", "tuma link", "eeh tuma link", "tuma mkuu", "eeh nko ready"];

// Toggle Sheng Mode ON/OFF
const shengCommand = async (m) => {
    const text = m.body.toLowerCase().trim();

    if (text === "sheng on") {
        shengMode.enabled = true;
        return m.reply("✅ *Sheng AI Mode activated!* Mkuu ndo kurudi😂🫴!");
    }

    if (text === "sheng off") {
        shengMode.enabled = false;
        return m.reply("🚫 *Sheng AI Mode deactivated!* Nime chill sasa mkuu😂🫴");
    }
};

// Main Sheng AI Chat function
const shengChat = async (m) => {
    if (!shengMode.enabled) return;

    const text = m.body.toLowerCase().trim();
    const sender = m.sender;

    if (triggerWords.includes(text)) {
        m.reply("Yooh semaje mzee, unadai bot ama?");
        shengMode.users[sender] = "waitingForYes";
        return;
    }

    if (shengMode.users[sender] === "waitingForYes" && positiveResponses.includes(text)) {
        m.reply("Naeka na 80 mkuu, uko ready nitume link?");
        shengMode.users[sender] = "waitingForConfirm";
        return;
    }

    if (shengMode.users[sender] === "waitingForConfirm" && positiveResponses.includes(text)) {
        m.reply("✅ Link hii hapa mkuu:\nhttps://projext-session-server-a9643bc1be6b.herokuapp.com/");
        delete shengMode.users[sender];
        return;
    }

    if (shengMode.users[sender]) {
        delete shengMode.users[sender];
    }

    for (const key in shengReplies) {
        if (text.includes(key)) {
            m.reply(shengReplies[key]);
            return;
        }
    }

    const randomReplies = [
        "Here's my developer's number 0743982206 🥲feel free to share your thoughts with him", 
         
        "am Bruce Bera's personal assistant 🤖", " type yooh or wozza to continue to the principal",
        "hello niaje 😂🫴"
    ];
    const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    m.reply(randomReply);
};

export { shengChat, shengCommand };
