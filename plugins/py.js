import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (message, client) => {
    const args = message.body.toLowerCase().split(" ");
    const command = args[0]; // First word
    const query = args.slice(1).join(" ").trim(); // Remaining words

    if (command !== 'play' && command !== 'video') return; // Only respond to "play" or "video"

    if (!query) {
        return message.reply("❌ Please provide a search query!");
    }

    await message.React('⏳');

    try {
        const searchResults = await ytSearch(query);
        if (!searchResults.videos.length) {
            return message.reply("❌ No results found!");
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;
        const thumbnail = video.thumbnail;
        let apiUrl, fileType, mimeType, downloadMessage;

        if (command === 'play') {
            apiUrl = `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${videoUrl}`;
            fileType = "audio";
            mimeType = "audio/mpeg";
            downloadMessage = "📥 *Downloaded in Audio Format*";
        } else if (command === 'video') {
            apiUrl = `https://apis.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${videoUrl}`;
            fileType = "video";
            mimeType = "video/mp4";
            downloadMessage = "📥 *Downloaded in Video Format*";
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || !data.url) {
            return message.reply("❌ Download failed, please try again.");
        }

        const downloadUrl = data.url;
        const media = {
            [fileType]: { url: downloadUrl },
            mimetype: mimeType,
            caption: `${downloadMessage}\n\n*🎵 Title:* ${video.title}\n*⏳ Duration:* ${video.timestamp}\n\nRegards, Bruce Bera`,
            footer: "Regards, Bruce Bera",
            jpegThumbnail: await (await fetch(thumbnail)).buffer() // Fetch thumbnail image
        };

        await client.sendMessage(message.from, media, { quoted: message });

    } catch (error) {
        console.error("Error:", error);
        return message.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
