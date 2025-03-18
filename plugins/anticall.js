import config from '../config.cjs';

// Main command function
const anticallcommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const command = m.body.trim().toLowerCase(); // Remove prefix dependency

  if (command === 'anticall on' || command === 'anticall off') {
    if (!isCreator) return m.reply("*ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ*");

    const newState = command === 'anticall on';
    config.REJECT_CALL = newState;

    const responseMessage = `✅ *Anti-Call has been ${newState ? "enabled" : "disabled"}.*`;

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default anticallcommand;
