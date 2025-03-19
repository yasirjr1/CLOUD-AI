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
            footer: "Regards, Bruce Bera"
        };

        const sentMessage = await bot.sendMessage(message.from, messageOptions, { quoted: message });

        bot.ev.once("messages.upsert", async chatUpdate => {
            const replyMessage = chatUpdate.messages[0];
            if (!replyMessage.message || replyMessage.key.remoteJid !== message.from) return;
            const response = replyMessage.message.conversation || replyMessage.message.extendedTextMessage?.text;

            const downloadFormats = {
                "1": { type: "video", api: "ytmp4", caption: "📥 Downloading Video..." },
                "2": { type: "audio", api: "ytmp3", caption: "📥 Downloading Audio...", mimetype: "audio/mpeg" },
                "3": { type: "document", api: "ytmp4", caption: "📥 Downloading Video (Document)...", mimetype: "video/mp4", filename: "NON-PREFIX-XMD_Video.mp4" },
                "4": { type: "document", api: "ytmp3", caption: "📥 Downloading Audio (Document)...", mimetype: "audio/mpeg", filename: "NON-PREFIX-XMD_Audio.mp3" }
            };

            if (!downloadFormats[response]) {
                return message.reply("❌ Invalid selection! Please reply with 1, 2, 3, or 4.");
            }

            const { type, api, caption, mimetype, filename } = downloadFormats[response];
            const downloadUrl = `https://apis.davidcyriltech.my.id/download/${api}?url=${video.url}`;

            await message.reply(caption);

            try {
                const fetchResponse = await fetch(downloadUrl);
                const jsonResponse = await fetchResponse.json();

                if (!jsonResponse.success) {
                    return message.reply("❌ Download failed, please try again.");
                }

                const fileData = { url: jsonResponse.result.download_url };
                const sendOptions = type === "document"
                    ? { document: fileData, mimetype, fileName: filename, caption }
                    : { [type]: fileData, mimetype, caption };

                await bot.sendMessage(message.from, sendOptions, { quoted: replyMessage });

            } catch (error) {
                console.error("Error downloading:", error);
                message.reply("❌ An error occurred while processing your request.");
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return message.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
