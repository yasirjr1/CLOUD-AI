import config from '../config.cjs';

const promote = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    // Use the full message text without a prefix
    const text = m.body.trim();
    const parts = text.split(" ");
    const cmd = parts[0].toLowerCase();
    
    const validCommands = ['promote', 'admin', 'toadmin'];
    if (!validCommands.includes(cmd)) return;
    
    if (!m.isGroup) return m.reply("*🚫 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    
    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;
    
    if (!botAdmin) return m.reply("*🚫 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*🚫 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");
    
    // Remove the command word to get additional parameters (if any)
    const args = parts.slice(1).join(" ").trim();
    
    if (!m.mentionedJid) m.mentionedJid = [];
    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);
    
    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : args.replace(/[^0-9]/g, '').length > 0
      ? [args.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
      : [];
    
    if (users.length === 0) {
      return m.reply("*🚫 PLEASE MENTION OR QUOTE A USER TO PROMOTE*");
    }
    
    const validUsers = users.filter(Boolean);
    
    const usernames = await Promise.all(
      validUsers.map(async (user) => {
        try {
          const contact = await gss.getContact(user);
          return contact.notify || contact.pushname || user.split('@')[0];
        } catch (error) {
          return user.split('@')[0];
        }
      })
    );
    
    await gss.groupParticipantsUpdate(m.from, validUsers, 'promote')
      .then(() => {
        const promotedNames = usernames.map(username => `@${username}`).join(', ');
        m.reply(`*Users ${promotedNames} promoted successfully in the group ${groupMetadata.subject}.*`);
      })
      .catch(() => m.reply('Failed to promote user(s) in the group.'));
      
  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default promote;