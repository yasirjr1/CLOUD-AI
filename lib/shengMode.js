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

// Sheng responses
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

// Decline responses
const declineResponses = ["zae", "zii", "siko ready"];

// Partial payment responses
const partialPaymentResponses = ["nko Na 50 mkuu", "nko Na 60 mkuu", "nko Na 60", "nko Na 50"];

// Payment after service responses
const paymentLaterResponses = ["payment after serving", "Eka Kwanza", "Eka bot Kwanza"];

// Toggle Sheng Mode ON/OFF
const shengCommand = async (m) => {
    if (m.isGroup) return; // Ignore group chats

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

// Main Sheng AI Chat function (Only responds in private chats)
const shengChat = async (m) => {
    if (!shengMode.enabled || m.isGroup) return; // Ignore if disabled or in groups

    const text = m.body.toLowerCase().trim();
    const sender = m.sender;

    if (triggerWords.includes(text)) {
        m.reply("Yooh semaje mzee, unadai bot ama?");
        shengMode.users[sender] = "waitingForYes";
        return;
    }

    // If user says they want the bot (confirming step 1)
    if (shengMode.users[sender] === "waitingForYes") {
        if (positiveResponses.includes(text)) {
            m.reply("Naeka na 80 mkuu, uko ready nitume link?");
            shengMode.users[sender] = "waitingForConfirm";
            return;
        }

        if (declineResponses.includes(text)) {
            m.reply("Haina noma mkuu");
            delete shengMode.users[sender]; // Reset state
            return;
        }
    }

    // If user confirms the payment
    if (shengMode.users[sender] === "waitingForConfirm") {
        if (positiveResponses.includes(text)) {
            m.reply("✅ Link hii hapa mkuu:\nhttps://projext-session-server-a9643bc1be6b.herokuapp.com/");
            delete shengMode.users[sender];
            return;
        }

        if (declineResponses.includes(text)) {
            m.reply("Haina noma mkuu");
            delete shengMode.users[sender]; // Reset state
            return;
        }

        if (partialPaymentResponses.includes(text)) {
            m.reply("Ok poa mkuu, tuma kwa hii number 0743982206");
            delete shengMode.users[sender]; // Reset state
            return;
        }

        if (paymentLaterResponses.includes(text)) {
            m.reply("Ok mkuu, haina noma");
            delete shengMode.users[sender]; // Reset state
            return;
        }
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
        
        "Am Bruce Bera's personal assistant 🤖,Type yooh or wozza to continue to the principal",
        "Hello niaje 😂🫴"
    ];
    const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    m.reply(randomReply);
};

export { shengChat, shengCommand };
