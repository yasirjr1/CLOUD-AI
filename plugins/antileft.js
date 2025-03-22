import config from "../../config.cjs";

const antiLeft = async (m, sock) => {
    const command = m.body.trim().toLowerCase();
    if (!["antileft on", "antileft off"].includes(command)) return;

    const groupId = m.key.remoteJid;

    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const groupAdmins = groupMetadata.participants
            .filter(p => p.admin) // Get all admins
            .map(p => p.id);

        const sender = m.key.participant || m.key.remoteJid;
        if (!groupAdmins.includes(sender)) {
            return await sock.sendMessage(m.from, { text: "❌ *Only group admins can use this command!*" }, { quoted: m });
        }

        // Store the Anti-Left setting dynamically
        if (!global.antiLeft) global.antiLeft = {};

        if (command === "antileft on") {
            global.antiLeft[groupId] = true;
            await sock.sendMessage(m.from, { text: "✅ *Anti-Left is now enabled!*" }, { quoted: m });
        } else if (command === "antileft off") {
            global.antiLeft[groupId] = false;
            await sock.sendMessage(m.from, { text: "❌ *Anti-Left is now disabled!*" }, { quoted: m });
        }
    } catch (error) {
        console.error("Error:", error);
        await sock.sendMessage(m.from, { text: "❌ *Failed to update Anti-Left settings.*" }, { quoted: m });
    }
};

// Listen for group participant updates
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
