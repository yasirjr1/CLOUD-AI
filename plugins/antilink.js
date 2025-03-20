import config from "../config.cjs";

const antilinkDB = new Map(); // Store Antilink status per group

const antilinkSystem = async (m, gss) => {
  try {
    const cmd = m.body.toLowerCase().trim();
    const validCommands = ["antilink on", "antilink off"];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*\n\n*Regards, Bruce Bera.*");

    const isAdmin = (await gss.groupMetadata(m.from)).participants.find(p => p.id === m.sender)?.admin;

    if (!isAdmin) {
      return m.reply("*📛 ONLY ADMINS CAN TOGGLE ANTILINK*\n\n*Regards, Bruce Bera.*");
    }

    if (cmd === "antilink on") {
      antilinkDB.set(m.from, true);
      return m.reply("*✅ ANTILINK PROTECTION ENABLED! ANY LINK SENT WILL BE DELETED.*\n\n*Regards, Bruce Bera.*");
    } else if (cmd === "antilink off") {
      antilinkDB.set(m.from, false);
      return m.reply("*🚫 ANTILINK PROTECTION DISABLED! LINKS ARE NOW ALLOWED.*\n\n*Regards, Bruce Bera.*");
    }
  } catch (error) {
    console.error("Error toggling antilink:", error);
    m.reply("*⚠️ An error occurred while toggling antilink.*\n\n*Regards, Bruce Bera.*");
  }
};

const antilinkMonitor = async (m, gss) => {
  try {
    if (!m.isGroup) return;

    const isAntilinkEnabled = antilinkDB.get(m.from);
    if (!isAntilinkEnabled) return;

    const linkRegex = /(https?:\/\/[^\s]+)/g;
    if (linkRegex.test(m.body)) {
      await gss.sendMessage(m.from, { delete: m.key });
      return m.reply("*🚫 LINKS ARE NOT ALLOWED IN THIS GROUP! DO NOT SEND LINKS.*\n\n*Regards, Bruce Bera.*");
    }
  } catch (error) {
    console.error("Error in antilink monitoring:", error);
  }
};

export { antilinkSystem, antilinkMonitor };
