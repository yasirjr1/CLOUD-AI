import { writeFile, readFile } from "fs/promises";

const antileftFile = "./antileft.json";

// Read status
const readAntiLeftStatus = async () => {
    try {
        const data = await readFile(antileftFile, "utf8");
        return JSON.parse(data);
    } catch {
        return {};
    }
};

// Write status
const writeAntiLeftStatus = async (status) => {
    await writeFile(antileftFile, JSON.stringify(status, null, 2));
};

const antileft = async (m, Matrix) => {
    const chatId = m.from;
    const text = m.body?.trim().toLowerCase();

    let antileftStatus = await readAntiLeftStatus();

    // ✅ Trigger words
    if (text === "antileft on" || text === "antileft off") {
        antileftStatus[chatId] = text === "antileft on";
        await writeAntiLeftStatus(antileftStatus);

        await Matrix.sendMessage(chatId, {
            text: `✅ *Anti-Left has been ${text === "antileft on" ? "enabled" : "disabled"} for this group.*`,
        }, { quoted: m });
        return;
    }

    // ✅ Detect participant leaving
    if (m.update?.participants && m.update.action === "leave") {
        const userJid = m.update.participants[0];
        if (!antileftStatus[chatId]) return;

        // Try to re-add the user
        try {
            await Matrix.sendMessage(chatId, {
                text: `⚠️ *Anti-Left Active!* @${userJid.split('@')[0]} tried to leave and has been re-added.`,
                mentions: [userJid]
            });

            await Matrix.groupParticipantsUpdate(chatId, [userJid], "add");
        } catch (error) {
            console.error("❌ Failed to re-add user:", error);
            await Matrix.sendMessage(chatId, { text: "⚠️ Unable to re-add user. They might have privacy settings blocking it." });
        }
    }
};

export default antileft;
