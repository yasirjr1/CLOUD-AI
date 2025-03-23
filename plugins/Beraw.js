import { writeFile, readFile } from 'fs/promises';

const welcomeFile = './bera.json';

// Function to read welcome status
const readWelcomeStatus = async () => {
    try {
        const data = await readFile(welcomeFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

// Function to write welcome status
const writeWelcomeStatus = async (status) => {
    await writeFile(welcomeFile, JSON.stringify(status, null, 2));
};

const welcome = async (m, Matrix) => {
    const chatId = m.from;
    const senderId = m.sender;
    const isGroup = m.isGroup;
    const isAdmin = m.isAdmin;
    const text = m.body.trim().toLowerCase();
    let welcomeStatus = await readWelcomeStatus();

    // Toggle welcome (Admins only)
    if (text === "welcome on" || text === "welcome off") {
        if (!isGroup || !isAdmin) {
            await Matrix.sendMessage(chatId, { text: "❌ *Permission Denied!* Only *group admins* can toggle the welcome message." }, { quoted: m });
            return;
        }

        welcomeStatus[chatId] = text === "welcome on";
        await writeWelcomeStatus(welcomeStatus);

        await Matrix.sendMessage(chatId, { text: `✅ *Welcome messages have been ${text === "welcome on" ? "enabled" : "disabled"} for this group.*` }, { quoted: m });
        return;
    }

    // If a new participant joins & welcome is enabled
    if (m.type === "group-participants-update" && m.action === "add") {
        if (!welcomeStatus[chatId]) return;

        const userJid = m.participants[0];
        const userProfilePic = await Matrix.profilePictureUrl(userJid, 'image').catch(() => "https://i.imgur.com/6Q0qLAE.jpg"); // Default pic if none exists

        const welcomeMessage = `🌟 *Welcome to the group!* 🌟\n\n👤 *User:* @${userJid.split('@')[0]}\n📌 *Enjoy your stay and follow the rules!*\n\n*Regards, Bera Tech*`;

        await Matrix.sendMessage(chatId, { 
            image: { url: userProfilePic }, 
            caption: welcomeMessage, 
            mentions: [userJid] 
        });
    }
};

export default welcome;
