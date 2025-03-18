import config from '../config.cjs';

const block = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);

    // Split the message into words and extract the command and remaining text
    const parts = m.body.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const text = parts.slice(1).join(' ').trim();

    // Only proceed if the command is exactly "block"
    if (cmd !== 'block') return;
    
    if (!isCreator) return m.reply("*ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ*");

    // Determine the target user: check if a user was mentioned, if the message was a reply, or if a number is provided in the text.
    let users;
    if (m.mentionedJid && m.mentionedJid[0]) {
      users = m.mentionedJid[0];
    } else if (m.quoted) {
      users = m.quoted.sender;
    } else {
      // Extract numbers from the additional text and form a WhatsApp ID
      users = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }
    
    await gss.updateBlockStatus(users, 'block')
      .then((res) => m.reply(`Blocked ${users.split('@')[0]} successfully.`))
      .catch((err) => m.reply(`Failed to block user: ${err}`));
  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default block;
