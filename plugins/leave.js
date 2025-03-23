const leaveGroup = async (m, Matrix) => {
    const chatId = m.from;
    const isGroup = m.isGroup;
    const botJid = Matrix.user.id; // ✅ Bot's own WhatsApp ID

    const text = m.body?.trim()?.toLowerCase();
    const validTriggers = ["left", "leave"];

    if (!isGroup) return; // ✅ Works only in groups
    if (!validTriggers.includes(text)) return; // ✅ Only triggers on "left" or "leave"
    if (m.sender !== botJid) {
        await Matrix.sendMessage(chatId, { text: "❌ *Permission Denied!* Only the bot itself can leave the group." }, { quoted: m });
        return;
    }

    await Matrix.sendMessage(chatId, { text: "👋 *Goodbye everyone!* I'm leaving the group now." }, { quoted: m });
    await Matrix.groupLeave(chatId);
};

export default leaveGroup;
