const config = require("./config.cjs");

module.exports = async (context) => {
    const { client, m } = context;

    const command = m.text.trim().split(/\s+/)[0].toLowerCase();

    if (command !== "profile1") return;

    const target = m.quoted ? m.quoted.sender : m.sender;
    const name = m.quoted ? "@" + target.split("@")[0] : m.pushName;

    let ppUrl = config.defaultProfilePicture;
    let statusMessage = "About not accessible due to user privacy settings.";

    try {
        ppUrl = await client.profilePictureUrl(target, "image");
    } catch (err) {
        console.error("Error fetching profile picture:", err.message);
    }

    try {
        const status = await client.fetchStatus(target);
        statusMessage = status.status || statusMessage;
    } catch (err) {
        console.error("Error fetching status:", err.message);
    }

    const message = {
        image: { url: ppUrl },
        caption: `*Name:* ${name}\n*About:*\n${statusMessage}`,
        mentions: m.quoted ? [m.quoted.sender] : []
    };

    await client.sendMessage(m.chat, message, { quoted: m });
};
