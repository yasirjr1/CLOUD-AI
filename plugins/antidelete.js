import config from "../config.cjs";

const antiDeleteDB = {}; // Temporary storage (Use a database for persistence)

const antiDelete = async (m, gss) => {
  try {
    const cmd = m.body.toLowerCase().trim();

    if (cmd === "antidelete on") {
      antiDeleteDB[m.from] = true;
      return m.reply("*✅ Anti-Delete is now ACTIVE. Deleted messages will be recovered.*\n\n*Regards, Bruce Bera*");
    }

    if (cmd === "antidelete off") {
      antiDeleteDB[m.from] = false;
      return m.reply("*❌ Anti-Delete is now OFF. Deleted messages will not be recovered.*\n\n*Regards, Bruce Bera*");
    }
  } catch (error) {
    console.error("Error in Anti-Delete command:", error);
    m.reply("⚠️ An error occurred. Try again.");
  }
};

const checkDelete = async (event, gss) => {
  try {
    if (!antiDeleteDB[event.remoteJid]) return; // Check if Anti-Delete is enabled

    const message = event.message;
    if (!message) return;

    const participant = event.participant;
    const key = event.key;
    
    // Restore the deleted message
    let text = `*🛑 Anti-Delete Alert 🛑*\n\n`;
    text += `*User:* @${participant.split("@")[0]}\n`;
    text += `*Deleted Message:*`;

    await gss.sendMessage(event.remoteJid, { text, mentions: [participant] });
    await gss.sendMessage(event.remoteJid, message, { quoted: key });

  } catch (error) {
    console.error("Error in Anti-Delete:", error);
  }
};

export { antiDelete, checkDelete };
