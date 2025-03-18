import config from '../../config.cjs';

const kick = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const text = m.body.trim().toLowerCase(); // Get the message text

    const validCommands = ['kick', 'remove']; // Trigger words

    if (!validCommands.includes(text.split(" ")[0])) return; // Check if the first word is a valid command
    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    if (!m.mentionedJid) m.mentionedJid = [];
    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, '').length > 0
      ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
      : [];

    if (users.length === 0) {
      return m.reply("*📛 PLEASE MENTION OR QUOTE A USER TO KICK*");
    }

    const validUsers = users.filter(Boolean);

    await gss.groupParticipantsUpdate(m.from, validUsers, 'remove')
      .then(() => {
        const kickedNames = validUsers.map(user => `@${user.split("@")[0]}`);
        m.reply(`*🚨 USERS ${kickedNames} KICKED SUCCESSFULLY FROM THE GROUP ${groupMetadata.subject}!*`);
        
        // Custom kick message
        gss.sendMessage(m.from, { 
          text: `😈 *Bhosdewale ${kickedNames.join(', ')} ko remove kr dia!* 🚀`, 
          mentions: validUsers 
        });
      })
      .catch(() => m.reply('❌ Failed to kick user(s) from the group.'));
  } catch (error) {
    console.error('Error:', error);
    m.reply('⚠️ An error occurred while processing the command.');
  }
};

export default kick;
