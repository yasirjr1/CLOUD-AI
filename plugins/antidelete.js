import config from "../config.cjs";

export const antidelete = async (Matrix, m) => {
    const sender = m.key.remoteJid;
    const ownerNumber = config.OWNER_NUMBER.includes(sender.split("@")[0]);

    if (!ownerNumber) {
        return await Matrix.sendMessage(sender, { text: "❌ *Only the bot owner can use this command!*" });
    }

    config.ANTIDELETE = !config.ANTIDELETE;
    await Matrix.sendMessage(sender, { text: `✅ *Antidelete is now ${config.ANTIDELETE ? "ON" : "OFF"}*` });
};

export default {
    name: "antidelete",
    execute: antidelete
};
