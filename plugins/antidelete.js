export const antidelete = async (Matrix, message) => {
    try {
        const { messages } = message;
        if (!messages || !messages[0]?.messageStubType) return;

        const msg = messages[0];
        if (msg.messageStubType !== 68) return; // Only detect deleted messages (Type 68)

        const chatId = msg.key.remoteJid; // Keeps the recovered message in the same chat
        const sender = msg.key.participant || msg.key.remoteJid;
        const messageType = Object.keys(msg.message || {})[0];

        let recoveredMessage = "📩 *Deleted Message Recovered:*\n";
        recoveredMessage += `\n👤 *From:* @${sender.split("@")[0]}`;
        recoveredMessage += `\n📌 *Type:* ${messageType}`;

        if (msg.message?.conversation) {
            recoveredMessage += `\n📝 *Content:* ${msg.message.conversation}`;
        } else if (msg.message[messageType]?.caption) {
            recoveredMessage += `\n📝 *Caption:* ${msg.message[messageType].caption}`;
        }

        recoveredMessage += `\n\n> *Regards, Bruce Bera.*`;

        // Send the recovered message ONLY in the chat where it was deleted
        await Matrix.sendMessage(chatId, { text: recoveredMessage, mentions: [sender] });

    } catch (error) {
        console.error("Antidelete Error:", error);
    }
};

export default {
    name: "antidelete",
    execute: antidelete
};
