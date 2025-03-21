import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const downloadYouTubeMedia = async (url, format) => {
    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
        const fileExtension = format === 'audio' ? 'mp3' : 'mp4';
        const fileName = `${title}.${fileExtension}`;
        const filePath = path.resolve('downloads', fileName);

        // Ensure the downloads folder exists
        if (!fs.existsSync('downloads')) fs.mkdirSync('downloads');

        const streamOptions = format === 'audio'
            ? { filter: 'audioonly', quality: 'highestaudio' }
            : { quality: 'highestvideo' };

        const stream = ytdl(url, streamOptions).pipe(fs.createWriteStream(filePath));

        return new Promise((resolve, reject) => {
            stream.on('finish', () => resolve({ filePath, title, thumbnail: info.videoDetails.thumbnails.pop().url }));
            stream.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading media:', error);
        throw new Error('Failed to download media.');
    }
};

// WhatsApp Message Handler
const handleMessage = async (message, sender) => {
    try {
        const words = message.body.toLowerCase().split(" ");
        const command = words[0]; // "play" or "video"
        const query = words.slice(1).join(" ").trim();

        if (command !== 'play' && command !== 'video') return;

        if (!query) {
            return sender.reply("❌ Please provide a search query!");
        }

        sender.react('⏳');

        // Search on YouTube
        const { data } = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
        const videoIdMatch = data.match(/"videoId":"(.*?)"/);
        if (!videoIdMatch) return sender.reply("❌ No results found!");

        const videoUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
        const format = command === 'play' ? 'audio' : 'video';

        // Download the media
        const { filePath, title, thumbnail } = await downloadYouTubeMedia(videoUrl, format);

        // Send thumbnail first
        await sender.sendMessage({
            image: { url: thumbnail },
            caption: `🎵 *Title:* ${title}\n\n📥 *Downloading...*\n\nRegards, BruceBera`
        });

        // Send media file
        await sender.sendMessage({
            [format]: { url: filePath },
            mimetype: format === 'audio' ? 'audio/mpeg' : 'video/mp4',
            caption: `📥 *Downloaded in ${format.toUpperCase()} Format*\n\nRegards, BruceBera`
        });

    } catch (error) {
        console.error('Error:', error);
        sender.reply("❌ An error occurred while processing your request.");
    }
};

export default handleMessage;
