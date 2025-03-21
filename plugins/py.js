import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const downloadFromAPIs = async (videoUrl, format) => {
    const apiList = [
        format === 'audio'
            ? `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${videoUrl}`
            : `https://apis.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${videoUrl}`,
        format === 'audio'
            ? `https://apis-keith.vercel.app/download/dlmp3?url=${videoUrl}`
            : `https://apis-keith.vercel.app/download/dlmp4?url=${videoUrl}`,
        format === 'audio'
            ? `https://apis.davidcyriltech.my.id/youtube/mp3?url=${videoUrl}`
            : null,
        format === 'audio'
            ? `https://keith-api.vercel.app/download/dlmp3?url=${videoUrl}`
            : null
    ].filter(Boolean); // Remove null values

    for (const apiUrl of apiList) {
        try {
            const response = await axios.get(apiUrl);
            if (response.data.url) {
                return response.data.url;
            }
        } catch (error) {
            console.log(`API failed: ${apiUrl}`);
        }
    }
    throw new Error("❌ Download failed from all APIs.");
};

const play = async (message, sender) => {
    try {
        const words = message.body.toLowerCase().split(" ");
        const command = words[0]; // "play" or "video"
        const query = words.slice(1).join(" ").trim();

        if (command !== 'play' && command !== 'video') return;

        if (!query) {
            return sender.reply("❌ Please provide a search query!");
        }

        await sender.react('⏳'); // Reaction for processing

        // Search YouTube
        const { data } = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
        const videoIdMatch = data.match(/"videoId":"(.*?)"/);
        if (!videoIdMatch) return sender.reply("❌ No results found!");

        const videoUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
        const format = command === 'play' ? 'audio' : 'video';
        const info = await ytdl.getInfo(videoUrl);

        // Extract details
        const title = info.videoDetails.title;
        const thumbnail = info.videoDetails.thumbnails.pop().url;

        // Send thumbnail first
        await sender.sendMessage({
            image: { url: thumbnail },
            caption: `🎵 *Title:* ${title}\n\n📥 *Downloading...*\n\nRegards, BruceBera`
        });

        // Download using APIs
        const mediaUrl = await downloadFromAPIs(videoUrl, format);

        // Send media file
        await sender.sendMessage({
            [format]: { url: mediaUrl },
            mimetype: format === 'audio' ? 'audio/mpeg' : 'video/mp4',
            caption: `📥 *Downloaded in ${format.toUpperCase()} Format*\n\nRegards, BruceBera`
        });

        await sender.react('✅'); // Success reaction

    } catch (error) {
        console.error('Error:', error);
        sender.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
