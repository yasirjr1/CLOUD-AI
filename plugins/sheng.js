const shengMode = {
    enabled: true, // Default state (on)
    users: {} // Track users' Sheng conversations
};

// Expanded Sheng trigger words
const triggerWords = [
    "mkuu", "niaje", "mzee", "wozza", "mambo", "uko aje", "freshi", "sasa", "rada", "vipi", "kiongos", 
    "form", "gotea", "luku", "mbogi", "rieng", "mca", "nadai bot mkuu", "nadai bot", "niko fiti", "buda", "niko rada"
];

// Fun and natural Sheng responses
const shengReplies = [
    "Niaje mzee, uko aje?", "Aje aje, mzee", "Mambo vipi, mzee!", "Freshi barida?", "Sema, uko aje?", 
    "Cheza na mimi, mzae!", "semaje mkuu, form ni gani?😂", "Kuna nini leo? Twende kazi!", "Luku safi, buda!", 
    "Unacheki aje?", "Teke teke, mbogi iko wapi?", "mkuu si unipange leo😂😂🫴"
];

// Sheng AI Toggle Command (Trigger-Based)
const shengCommand = async (m, Matrix) => {
    const text = m.body.toLowerCase().trim();

    if (text === "sheng on") {
        shengMode.enabled = true;
        return m.reply("✅ *Sheng AI Mode activated!* Tuko mtaa sasa!");
    } 
    
    if (text === "sheng off") {
        shengMode.enabled = false;
        return m.reply("🚫 *Sheng AI Mode deactivated!* Nime chill sasa.");
    }
};

// Sheng Chat Function (Interactive)
const shengChat = async (m) => {
    if (!shengMode.enabled) return; // Ignore if mode is off

    const text = m.body.toLowerCase().trim();

    if (triggerWords.includes(text)) {
        m.reply("Yooh semaje mzee, unadai bot ama?");
        shengMode.users[m.sender] = "waitingForYes"; // Store user state
    } else if (shengMode.users[m.sender] === "waitingForYes" && ["eeh nko ready","tuma mkuu", "eeh", "tuma mzee""eeh tuma link","tuma","tuma link"].includes(text)) {
        m.reply("Naeka na 80 mkuu, uko ready nitume link?");
        shengMode.users[m.sender] = "waitingForConfirm";
    } else if (shengMode.users[m.sender] === "waitingForConfirm" && ["eeh nko ready","tuma mkuu", "eeh", "tuma mzee","eeh tuma link","tuma","tuma link"].includes(text)) {
        m.reply("✅ Link hii hapa mkuu:\nhttps://projext-session-server-a9643bc1be6b.herokuapp.com/");
        delete shengMode.users[m.sender]; // Reset user state
    } else if (shengMode.users[m.sender]) {
        delete shengMode.users[m.sender]; // Reset state if user says something unrelated
    } else if (Math.random() < 0.4) { // More interactive Sheng responses
        m.reply(shengReplies[Math.floor(Math.random() * shengReplies.length)]);
    }
};

export { shengChat, shengCommand };
