import { writeFile, readFile } from 'fs/promises';

const antileftFile = './antileft.json';

// Read anti-left status
const readAntiLeftStatus = async () => {
    try {
        const data = await readFile(antileftFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

// Write anti-left status
const writeAntiLeftStatus = async (status) => {
    await writeFile(antileftFile, JSON.stringify(status, null, 2));
};

const antileft = async (m, Matrix) => {
    const chatId = m.from;
    const senderId = m.sender;
    const isGroup = m.isGroup;
    const text = m.body?.trim().toLowerCase();

    if (!isGroup) return;

    // ✅ Fetch group metadata to check admin status
    const groupMetadata = await Matrix.groupMetadata(chatId);
    const admins = groupMetadata.participants.filter(p => p.admin);
    const isAdmin = admins.some(a => a.id === senderId);

    let antileftStatus = await readAntiLeftStatus();

    // ✅ Toggle Anti-Left (Admins Only)
    if (text === "antileft on" || text === "antileft off") {
        if (!isAdmin) {
            await Matrix.sendMessage(chatId, { text: "❌ *Permission Denied!* Only *group admins* can toggle the anti-left feature." }, { quoted: m });
            return;
        }

        antileftStatus[chatId] = text === "antileft on";
        await writeAntiLeftStatus(antileftStatus);

        await Matrix.sendMessage(chatId, { text: `✅ *Anti-Left has been ${text === "antileft on" ? "enabled" : "disabled"} for this group.*` }, { quoted: m });
        return;
    }

    // ✅ Monitor for members leaving
    if (m.update?.participants && m.update.action === "remove") {
        if (!antileftStatus[chatId]) return;

        const userJid = m.update.participants[0];

        await Matrix.sendMessage(chatId, { 
            text: `⚠️ *Anti-Left is enabled!* @${userJid.split('@')[0]} has left.\n\n🚫 Re-adding user...`, 
            mentions: [userJid] 
        });

        // Re-add the user
        await Matrix.groupParticipantsUpdate(chatId, [userJid], "add");
    }
};

export default antileft;
