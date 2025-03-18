import config from '../../config.cjs';

const jidCommand = async (message, client) => {
  const cmd = message.body.trim().toLowerCase();

  // Obfuscated trigger word: "jid" (Base64 encoded)
  const encodedTrigger = atob('amlk'); // Decoded value: "jid"

  if (cmd === encodedTrigger) {
    if (message.chatId && message.chatId.includes('@g.us')) {
      const groupJid = message.chatId;
      return client.sendMessage(message.from, {
        text: `The JID for this group is: ${groupJid}`
      });
    } else {
      const personalJid = `${message.from}@s.whatsapp.net`;
      return client.sendMessage(message.from, {
        text: `The JID for this number is: ${personalJid}`
      });
    }
  }
};

export default jidCommand;
