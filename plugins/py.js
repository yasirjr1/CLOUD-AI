import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (msg, client) => {
    const args = msg.body.toLowerCase().split(" ");
    const command = args[0]; // First word (either "play" or "video")
    const query = args.slice(1).join(" ").trim(); // Rest of the message

    if (command !== 'play' && command !== 'video') {
        return;
    }

    if (!query) {
        return msg.reply("❌ Please provide a search query!");
    }

    await msg.React('⏳');

    try {
        // Search YouTube
        const searchResults = await ytSearch(query);
        if (!searchResults.videos.length) {
            return msg.reply("❌ No results found!");
        }

        const video = searchResults.videos[0]; // First search result
        const videoUrl = video.url;
        const thumbnailUrl = video.thumbnail;

        // Fetch and process thumbnail
        const thumbnailBuffer = await fetch(thumbnailUrl).then(res => res.buffer());

        // Send Thumbnail First
        await client.sendMessage(msg.from, {
            image: thumbnailBuffer,
            caption: `🎵 *Title:* ${video.title}\n⏳ *Duration:* ${video.timestamp}\n🔗 *Link:* ${videoUrl}\n\nRegards, BruceBera`,
            footer: "Regards, BruceBera"
        }, { quoted: msg });

        // Define API URLs (MP3 for "play", MP4 for "video")
        const apiUrls = command === 'play'
            ? [
                `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${videoUrl}`,
                `https://apis.giftedtech.web.id/api/download/dlmp3?apikey=gifted&url=${videoUrl}`,
                `https://apis-keith.vercel.app/download/dlmp3?url=${videoUrl}`
            ]
            : [
                `https://apis.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${videoUrl}`,
                `https://apis-keith.vercel.app/download/dlmp4?url=${videoUrl}`
            ];

        let downloadUrl = null;
        let fileType = command === 'play' ? "audio/mpeg" : "video/mp4";
        let captionText = command === 'play' ? "📥 *Downloaded in Audio Format*" : "📥 *Downloaded in Video Format*";

        // Try each API until one works
        for (let apiUrl of apiUrls) {
            try {
                const response = await fetch(apiUrl);
                const jsonResponse = await response.json();

                console.log("API Response:", jsonResponse); // Debugging

                if (jsonResponse.url) {
                    downloadUrl = jsonResponse.url;
                    break; // Stop checking if we find a working link
                }
            } catch (error) {
                console.error(`API Failed: ${apiUrl}`, error);
            }
        }

        if (!downloadUrl) {
            return msg.reply("❌ All APIs failed to fetch the file. Please try again later.");
        }

        // Send the audio or video
        await client.sendMessage(msg.from, {
            [command]: { url: downloadUrl },
            mimetype: fileType,
            caption: captionText
        }, { quoted: msg });

    } catch (error) {
        console.error("Error:", error);
        return msg.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
