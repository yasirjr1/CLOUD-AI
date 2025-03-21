const antiLeft = {
    enabled: true, // Default: ON
};

const toggleAntiLeft = async (m, Matrix) => {
    const text = m.body.toLowerCase().trim();

    if (text === "antileft on") {
        antiLeft.enabled = true;
        return m.reply("✅ *Anti-Left is now enabled!* Members cannot leave this group.");
    }

    if (text === "antileft off") {
        antiLeft.enabled = false;
        return m.reply("🚫 *Anti-Left is now disabled!* Members can leave freely.");
    }
};

const handleGroupUpdate = async (update, sock) => {
    if (!antiLeft.enabled) return; // Do nothing if Anti-Left is off

    if (update.action === "remove") {
        const groupMetadata = await sock.groupMetadata(update.id);
        const botAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";

        if (!botAdmins.includes(botNumber)) return; // Exit if bot is not an admin

        const userJid = update.participants[0];

        try {
            await sock.groupParticipantsUpdate(update.id, [userJid], "add"); // Add back the user
            await sock.sendMessage(update.id, { text: `🚨 *Anti-Left Activated!*\n\n@${userJid.split("@")[0]} tried to leave but was added back!`, mentions: [userJid] });
        } catch (error) {
            console.error("Failed to re-add user:", error);
        }
    }
};

export { toggleAntiLeft, handleGroupUpdate };
