import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (message, bot) => {
    const triggerWords = ["play", "song", "video"];
    const body = message.body.toLowerCase();
    const command = triggerWords.find(word => body.startsWith(word));

    if (!command) return;

    const query = body.slice(command.length).trim();
    if (!query) return message.reply("❌ Please provide a search query!");

    await message.React('🔍');
    try {
        const searchResults = await ytSearch(query);
        if (!searchResults.videos.length) {
            return message.reply("❌ No results found!");
        }

        const video = searchResults.videos[0];
        const responseText = `🎵 *NON-PREFIX-XMD DOWNLOAD CENTER* 🎵

📌 *Title:* ${video.title}
🎥 *Duration:* ${video.timestamp}
👀 *Views:* ${video.views}
📺 *Channel:* ${video.author.name}
🔗 *Link:* ${video.url}

📥 *Choose a format to download:*
1️⃣ Video
2️⃣ Audio
3️⃣ Video (Document)
4️⃣ Audio (Document)

📝 *Reply with 1, 2, 3, or 4 to proceed.*`;

        const messageOptions = {
            image: { url: video.thumbnail },
            caption: responseText,
            footer: "Regards, Bruce Bera",
            buttons: [
                { buttonId: "1", buttonText: { displayText: "🎬 Video" }, type: 1 },
                { buttonId: "2", buttonText: { displayText: "🎵 Audio" }, type: 1 },
                { buttonId: "3", buttonText: { displayText: "📄 Video (Doc)" }, type: 1 },
                { buttonId: "4", buttonText: { displayText: "📑 Audio (Doc)" }, type: 1 }
            ],
            headerType: 4
        };

        const sentMessage = await bot.sendMessage(message.from, messageOptions, { quoted: message });
        const messageId = sentMessage.key.id;
        const videoUrl = video.url;

        bot.ev.on("messages.upsert", async chatUpdate => {
            const replyMessage = chatUpdate.messages[0];
            if (!replyMessage.message || replyMessage.key.remoteJid !== message.from) return;
            const response = replyMessage.message.conversation || replyMessage.message.extendedTextMessage?.text;

            if (["1", "2", "3", "4"].includes(response)) {
                let downloadUrl;
                let fileType;
                let mimeType;
                let fileName;
                let captionText;

                if (response === "1") {
                    downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${videoUrl}`;
                    fileType = "video";
                    captionText = "📥 Downloading Video...";
                } else if (response === "2") {
                    downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
                    fileType = "audio";
                    mimeType = "audio/mpeg";
                    captionText = "📥 Downloading Audio...";
                } else if (response === "3") {
                    downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${videoUrl}`;
                    fileType = "document";
                    mimeType = "video/mp4";
                    fileName = "NON-PREFIX-XMD_Video.mp4";
                    captionText = "📥 Downloading Video (Document)...";
                } else if (response === "4") {
                    downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
                    fileType = "document";
                    mimeType = "audio/mpeg";
                    fileName = "NON-PREFIX-XMD_Audio.mp3";
                    captionText = "📥 Downloading Audio (Document)...";
                }

                await message.reply(captionText);
                const fetchResponse = await fetch(downloadUrl);
                const jsonResponse = await fetchResponse.json();

                if (!jsonResponse.success) {
                    return message.reply("❌ Download failed, please try again.");
                }

                const downloadFile = { url: jsonResponse.result.download_url };
                const sendOptions = fileType === "document"
                    ? { document: downloadFile, mimetype: mimeType, fileName, caption: captionText }
                    : { [fileType]: downloadFile, mimetype: mimeType, caption: captionText };

                await bot.sendMessage(message.from, sendOptions, { quoted: replyMessage });
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return message.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
