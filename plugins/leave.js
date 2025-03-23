import config from '../config.cjs';

const leaveGroup = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);

    const text = m.body.trim().toLowerCase();
    const validCommands = ['leave', 'left'];

    if (!validCommands.includes(text)) return; // ✅ Only respond if the exact trigger word is used

    if (!m.isGroup) return m.reply("*❌ This command can only be used in groups!*");

    if (!isCreator) return m.reply("*❌ This is an owner-only command!*");

    await gss.groupLeave(m.from);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default leaveGroup;
