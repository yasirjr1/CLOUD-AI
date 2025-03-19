import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (message, bot) => {
    const triggerWords = ["play", "song", "video"];
    const body = message.body.toLowerCase();
    const command = triggerWords.find(word => body.startsWith(word));

    if (!command) return;

    const query = body.slice(command.length).trim();
    if (!query) return message.reply("❌ Please provide a search query!");

    await message.React('⏳'); // Reaction to indicate processing
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

📥 *Select a format to download:*
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

        bot.ev.on("messages.upsert", async chatUpdate => {
            const replyMessage = chatUpdate.messages[0];
            if (!replyMessage.message || replyMessage.key.remoteJid !== message.from) return;
            const response = replyMessage.message.conversation || replyMessage.message.extendedTextMessage?.text;

            const downloadOptions = {
                "1": { api: "ytmp4", type: "video", caption: "📥 Downloading Video..." },
                "2": { api: "ytmp3", type: "audio", caption: "📥 Downloading Audio...", mimetype: "audio/mpeg" },
                "3": { api: "ytmp4", type: "document", caption: "📥 Downloading Video (Document)...", mimetype: "video/mp4", filename: "NON-PREFIX-XMD_Video.mp4" },
                "4": { api: "ytmp3", type: "document", caption: "📥 Downloading Audio (Document)...", mimetype: "audio/mpeg", filename: "NON-PREFIX-XMD_Audio.mp3" }
            };

            if (!downloadOptions[response]) return message.reply("❌ Invalid selection! Reply with 1, 2, 3, or 4.");

            const { api, type, caption, mimetype, filename } = downloadOptions[response];
            const downloadUrl = `https://apis.davidcyriltech.my.id/download/${api}?url=${encodeURIComponent(video.url)}`;

            await message.reply(caption);

            try {
                const fetchResponse = await fetch(downloadUrl);
                const jsonResponse = await fetchResponse.json();

                if (!jsonResponse.success || !jsonResponse.result || !jsonResponse.result.download_url) {
                    return message.reply("❌ Download failed. The API may be down, try again later.");
                }

                const fileData = { url: jsonResponse.result.download_url };
                const sendOptions = type === "document"
                    ? { document: fileData, mimetype, fileName: filename, caption }
                    : { [type]: fileData, mimetype, caption };

                await bot.sendMessage(message.from, sendOptions, { quoted: replyMessage });

            } catch (error) {
                console.error("Error fetching download:", error);
                return message.reply("❌ An error occurred while processing your request. Please try again later.");
            }
        });

    } catch (error) {
        console.error("Search error:", error);
        return message.reply("❌ An error occurred while searching for the video.");
    }
};

export default play;
