import { writeFile, readFile } from "fs/promises";

const antiDeleteFile = "./antidelete.json";

// ✅ Read Anti-Delete Status
const readAntiDeleteStatus = async () => {
    try {
        const data = await readFile(antiDeleteFile, "utf8");
        return JSON.parse(data);
    } catch {
        return {};
    }
};

// ✅ Write Anti-Delete Status
const writeAntiDeleteStatus = async (status) => {
    await writeFile(antiDeleteFile, JSON.stringify(status, null, 2));
};

const antidelete = async (m, Matrix) => {
    const chatId = m.from;
    const isGroup = m.isGroup;

    let antiDeleteStatus = await readAntiDeleteStatus();

    // ✅ Allow Any User to Toggle
    if (m.body.toLowerCase() === "antidelete on" || m.body.toLowerCase() === "antidelete off") {
        antiDeleteStatus[chatId] = m.body.toLowerCase() === "antidelete on";
        await writeAntiDeleteStatus(antiDeleteStatus);

        await Matrix.sendMessage(chatId, { 
            text: `✅ *Anti-Delete has been ${m.body.toLowerCase() === "antidelete on" ? "enabled" : "disabled"} in this chat.*`
        }, { quoted: m });
        return;
    }

    // ✅ Detect Deleted Messages and Recover
    if (m.type === "message-revoke") {
        if (!antiDeleteStatus[chatId]) return; // Ignore if Anti-Delete is off

        const originalMessage = m.message; // The deleted message
        const userJid = m.participant; // Who deleted the message

        const recoveryMessage = `🚨 *Anti-Delete Active!* 🚨\n\n👤 *User:* @${userJid.split("@")[0]}\n🗑️ *Tried to delete a message!*\n\n📩 *Message Content:*`;

        await Matrix.sendMessage(chatId, { text: recoveryMessage, mentions: [userJid] });
        await Matrix.sendMessage(chatId, originalMessage, { quoted: m }); // Re-send deleted message
    }
};

export default antidelete;
