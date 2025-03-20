import fs from "fs";
import config from "../config.cjs";

const settingsFile = "./plugins/settings.json";

// Load or create settings file
const loadSettings = () => {
    if (!fs.existsSync(settingsFile)) {
        fs.writeFileSync(settingsFile, JSON.stringify({ ANTIDELETE: config.ANTI_DELETE }, null, 2));
    }
    return JSON.parse(fs.readFileSync(settingsFile));
};

const saveSettings = (newSettings) => {
    fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 2));
};

// Handle Antidelete Command
const handleAntideleteCommand = async (message, Matrix) => {
    const sender = message.key.participant || message.key.remoteJid;
    if (!sender.includes(config.OWNER_NUMBER)) {
        return Matrix.sendMessage(message.key.remoteJid, { text: "🚫 *Only the bot owner can use this command!*" });
    }

    const settings = loadSettings();
    const command = message.message.conversation.toLowerCase();

    if (command === "antidelete on") {
        settings.ANTIDELETE = true;
        saveSettings(settings);
        await Matrix.sendMessage(message.key.remoteJid, { text: "✅ *Antidelete is now ENABLED!*", footer: "Regards, Bruce Bera" });
    } else if (command === "antidelete off") {
        settings.ANTIDELETE = false;
        saveSettings(settings);
        await Matrix.sendMessage(message.key.remoteJid, { text: "❌ *Antidelete is now DISABLED!*", footer: "Regards, Bruce Bera" });
    }
};

// Detect and Show Deleted Messages
const antidelete = async (update, Matrix) => {
    try {
        const settings = loadSettings();
        if (!settings.ANTIDELETE) return;

        if (update.type === "message-revoke") {
            const message = update.messages[0];
            if (!message.key.fromMe) { // Only detect deleted messages from others
                const chatId = message.key.remoteJid;
                const sender = message.key.participant || message.key.remoteJid;
                let msgContent = "📌 *Message Deleted:*";

                if (message.message?.conversation) {
                    msgContent += `\n💬 *Text:* ${message.message.conversation}`;
                } else if (message.message?.imageMessage) {
                    msgContent += `\n🖼️ *An image was deleted.*`;
                } else if (message.message?.videoMessage) {
                    msgContent += `\n📹 *A video was deleted.*`;
                } else if (message.message?.documentMessage) {
                    msgContent += `\n📄 *A document was deleted.*`;
                } else {
                    msgContent += `\n❓ *Unknown content was deleted.*`;
                }

                await Matrix.sendMessage(chatId, {
                    text: `⚠️ *Antidelete Alert!*\n\n👤 *User:* @${sender.split('@')[0]}\n${msgContent}`,
                    mentions: [sender],
                    footer: "Regards, Bruce Bera"
                });
            }
        }
    } catch (error) {
        console.error("Error in Antidelete:", error);
    }
};

export { handleAntideleteCommand, antidelete };
