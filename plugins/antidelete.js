import { writeFile, readFile } from "fs/promises";

// Store deleted messages
const deletedMessages = new Map();

// Anti-Delete Function (Always ON)
const antidelete = async (m, Matrix) => {
    const chatId = m.from;

    // ✅ Store messages before they get deleted
    if (!m.isDeleted) {
        deletedMessages.set(m.id, { text: m.body, sender: m.sender, timestamp: m.timestamp });
    }

    // ✅ Detect deleted messages and repost
    if (m.isDeleted) {
        const deletedMsg = deletedMessages.get(m.id);
        if (!deletedMsg) return;

        await Matrix.sendMessage(chatId, {
            text: `🚨 *Anti-Delete Active! A message was deleted!*\n\n👤 *Sender:* @${deletedMsg.sender.split('@')[0]}\n🕒 *Time:* ${new Date(deletedMsg.timestamp * 1000).toLocaleString()}\n📝 *Message:* \n\n${deletedMsg.text}`,
            mentions: [deletedMsg.sender]
        });

        deletedMessages.delete(m.id);
    }
};

export default antidelete;
