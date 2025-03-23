import { writeFile, readFile } from 'fs/promises';

const welcomeFile = './bera.json';

const readWelcomeStatus = async () => {
    try {
        const data = await readFile(welcomeFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

const writeWelcomeStatus = async (status) => {
    await writeFile(welcomeFile, JSON.stringify(status, null, 2));
};

const welcome = async (m, Matrix) => {
    const chatId = m.from;
    const senderId = m.sender;
    const isGroup = m.isGroup;
    const text = m.body?.trim().toLowerCase();

    if (!isGroup) return;

    // ✅ Fetch group metadata to check admin status
    const groupMetadata = await Matrix.groupMetadata(chatId);
    const admins = groupMetadata.participants.filter(p => p.admin);
    const isAdmin = admins.some(a => a.id === senderId);

    let welcomeStatus = await readWelcomeStatus();

    // ✅ Toggle Welcome (Admins Only)
    if (text === "welcome on" || text === "welcome off") {
        if (!isAdmin) {
            await Matrix.sendMessage(chatId, { text: "❌ *Permission Denied!* Only *group admins* can toggle the welcome message." }, { quoted: m });
            return;
        }

        welcomeStatus[chatId] = text === "welcome on";
        await writeWelcomeStatus(welcomeStatus);

        await Matrix.sendMessage(chatId, { text: `✅ *Welcome messages have been ${text === "welcome on" ? "enabled" : "disabled"} for this group.*` }, { quoted: m });
        return;
    }

    // ✅ Handle New Participant Join Event
    if (m.update?.participants && m.update.action === "add") {
        if (!welcomeStatus[chatId]) return;

        const userJid = m.update.participants[0];
        const userProfilePic = await Matrix.profilePictureUrl(userJid, 'image').catch(() => "https://i.imgur.com/6Q0qLAE.jpg");

        const welcomeMessage = `🌟 *Welcome to the group!* 🌟\n\n👤 *User:* @${userJid.split('@')[0]}\n📌 *Enjoy your stay and follow the rules!*\n\n*Regards, Bera Tech*`;

        await Matrix.sendMessage(chatId, { 
            image: { url: userProfilePic }, 
            caption: welcomeMessage, 
            mentions: [userJid] 
        });
    }
};

export default welcome;
