import config from '../config.cjs';  

const report = async (m, gss) => {  
  const reportedMessages = {};  
  const devlopernumber = '254743982206';  
  const text = m.body.trim().toLowerCase();  

  const validCommands = ['bug', 'report', 'request'];  

  if (!validCommands.includes(text.split(" ")[0])) return; // Check if the first word is a valid command  

  const botNumber = await gss.decodeJid(gss.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  
  if (!isCreator) return m.reply("*THIS IS AN OWNER COMMAND*");

  const textContent = text.split(" ").slice(1).join(" "); // Extract the report content

  if (!textContent) return m.reply(`Example: ${text.split(" ")[0]} hi dev, play command is not working`);  

  const messageId = m.key.id;  

  if (reportedMessages[messageId]) {  
      return m.reply("This report has already been forwarded to the owner. Please wait for a response.");  
  }  

  reportedMessages[messageId] = true;  

  const textt = `*| REQUEST/BUG |*`;  
  const teks1 = `\n\n*User*: @${m.sender.split("@")[0]}\n*Request/Bug*: ${textContent}`;  
  const teks2 = `\n\n*Hi ${m.pushName}, your request has been forwarded to my Owners.*\n*Please wait...*`;  

  gss.sendMessage(devlopernumber + "@s.whatsapp.net", {  
      text: textt + teks1,  
      mentions: [m.sender],  
  }, {  
      quoted: m,  
  });  

  m.reply("✅ *Thank you for your report!* Your request has been forwarded to the owner. Please wait for a response.");  
};  

export default report;
