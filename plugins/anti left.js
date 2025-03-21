import config from '../config.cjs';

const antiLeft = {
    enabled: true, // Default: ON
};

export const toggleAntiLeft = async (m, Matrix) => {
    const botOwner = config.OWNER_NUMBER + "@s.whatsapp.net"; // Ensure OWNER_NUMBER is in config.cjs

    if (m.sender !== botOwner) {
        return m.reply("⚠️ *You are not authorized to use this command!*");
    }

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

// Function to re-add members when they leave
export const handleGroupUpdate = async (Matrix, update) => {
    if (!antiLeft.enabled) return; // Stop if feature is off

    if (update.action === "remove") {
        const userJid = update.participants[0];
        try {
            await Matrix.groupParticipantsUpdate(update.id, [userJid], "add");
            await Matrix.sendMessage(update.id, { text: `❌ *Leaving is not allowed!* @${userJid.split("@")[0]}, you've been re-added!` }, { mentions: [userJid] });
        } catch (err) {
            console.error("Error re-adding user:", err);
        }
    }
};
