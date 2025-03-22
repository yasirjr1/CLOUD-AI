import config from "../../config.cjs";

const antiLeft = async (m, sock) => {
    const command = m.body.trim().toLowerCase();

    if (!["antileft on", "antileft off"].includes(command)) return;

    const groupId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    
    // Ensure only the bot owner can toggle this feature
    if (!config.OWNERS.includes(sender)) {
        return await sock.sendMessage(m.from, { text: "❌ *Only the bot owner can use this command!*" }, { quoted: m });
    }

    // Store the anti-left setting dynamically (You might want to save it in a database for persistence)
    if (!global.antiLeft) global.antiLeft = {};
    
    if (command === "antileft on") {
        global.antiLeft[groupId] = true;
        await sock.sendMessage(m.from, { text: "✅ *Anti-Left is now enabled!*" }, { quoted: m });
    } else if (command === "antileft off") {
        global.antiLeft[groupId] = false;
        await sock.sendMessage(m.from, { text: "❌ *Anti-Left is now disabled!*" }, { quoted: m });
    }
};

// Event listener for participants leaving
const onGroupParticipantsUpdate = async (update, sock) => {
    const { id, participants, action } = update;

    if (action === "remove" && global.antiLeft?.[id]) {
        for (const user of participants) {
            try {
                await sock.groupParticipantsUpdate(id, [user], "add");
                await sock.sendMessage(id, { text: `🚫 *You cannot leave this group!*` });
            } catch (error) {
                console.error("Error re-adding user:", error);
            }
        }
    }
};

export { antiLeft, onGroupParticipantsUpdate };
