import ytdl from 'ytdl-core';
import axios from 'axios';

const fetchDownloadUrl = async (videoUrl, format) => {
    const apis = [
        format === 'audio'
            ? `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${videoUrl}`
            : `https://apis.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${videoUrl}`,
        format === 'audio'
            ? `https://apis-keith.vercel.app/download/dlmp3?url=${videoUrl}`
            : `https://apis-keith.vercel.app/download/dlmp4?url=${videoUrl}`,
        format === 'audio'
            ? `https://apis.davidcyriltech.my.id/youtube/mp3?url=${videoUrl}`
            : `https://keith-api.vercel.app/download/dlmp4?url=${videoUrl}`
    ];

    for (const api of apis) {
        try {
            const response = await axios.get(api);
            if (response.data.result?.downloadUrl) return response.data.result.downloadUrl;
        } catch (err) {
            console.log(`API failed: ${api}`);
        }
    }
    throw new Error("❌ Download failed from all APIs.");
};

const handleDownload = async (message, sender) => {
    try {
        const words = message.body.toLowerCase().split(" ");
        const trigger = words[0]; 
        const query = words.slice(1).join(" ").trim();

        if (!["play", "video"].includes(trigger)) return; 
        if (!query) return sender.reply("❌ Please provide a search query!");

        await sender.react('⏳');

        // 🔍 YouTube Search
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(searchUrl);
        const videoIdMatch = data.match(/"videoId":"(.*?)"/);
        if (!videoIdMatch) return sender.reply("❌ No results found!");

        const videoUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
        const format = trigger === 'play' ? 'audio' : 'video';
        const info = await ytdl.getInfo(videoUrl);

        // 🎵 Video Details
        const title = info.videoDetails.title;
        const thumbnail = info.videoDetails.thumbnails.pop().url;

        // 🖼 Send Thumbnail
        await sender.sendMessage({
            image: { url: thumbnail },
            caption: `🎵 *Title:* ${title}\n\n📥 *Downloading...*\n\nRegards, BruceBera`
        });

        // ⬇ Get Media URL
        const mediaUrl = await fetchDownloadUrl(videoUrl, format);

        // 📩 Send Media
        await sender.sendMessage({
            [format]: { url: mediaUrl },
            mimetype: format === 'audio' ? 'audio/mpeg' : 'video/mp4',
            caption: `📥 *Downloaded in ${format.toUpperCase()} Format*\n\nRegards, BruceBera`
        });

        await sender.react('✅');

    } catch (error) {
        console.error('Error:', error);
        sender.reply("❌ An error occurred while processing your request.");
    }
};

export default handleDownload;
