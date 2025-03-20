import fs from "fs";
import config from "../config.cjs";

const vcfCompiler = async (m, gss) => {
  try {
    const cmd = m.body.split(" ")[0].toLowerCase();
    const validCommands = ["vcf", "VCF", "Vcf"];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;

    m.reply("*NON-PREFIX-XMD is compiling your contacts, pls wait...*");

    let vcfData = "BEGIN:VCARD\nVERSION:3.0\n";
    
    for (let participant of participants) {
      try {
        const contact = await gss.getContact(participant.id);
        const name = contact.notify || contact.pushname || `User-${participant.id.split("@")[0]}`;
        const phoneNumber = participant.id.replace("@s.whatsapp.net", "");

        vcfData += `FN:${name}\nTEL;TYPE=CELL:+${phoneNumber}\nEND:VCARD\nBEGIN:VCARD\nVERSION:3.0\n`;
      } catch (err) {
        console.error("Error fetching contact:", err);
      }
    }

    vcfData += "END:VCARD";

    const filePath = "./contacts.vcf";
    fs.writeFileSync(filePath, vcfData);

    await gss.sendMessage(
      m.from,
      { document: fs.readFileSync(filePath), mimetype: "text/vcard", fileName: "WhatsAppContacts.vcf", caption: "*Regards, Bruce Bera.*" },
      { quoted: m }
    );

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error compiling VCF:", error);
    m.reply("*⚠️ An error occurred while compiling contacts. Please try again.*\n\n*Regards, Bruce Bera.*");
  }
};

export default vcfCompiler;
