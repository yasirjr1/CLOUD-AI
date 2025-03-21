const yts = require("yt-search");
const fetch = require("node-fetch");
const config = require("../config.cjs");

module.exports = {
    name: "play",
    alias: ["video"], // Allow both 'play' and 'video' triggers
    category: "downloader",
    desc: "Download MP3 or MP4 from YouTube",
    
    async run(m, client, args) {
        try {
            const command = m.body.split(" ")[0].toLowerCase(); // "play" or "video"
            const query = m.body.split(" ").slice(1).join(" "); // Song/video name

            if (!["play", "video"].includes(command)) return;
            if (!query) return client.sendMessage(m.from, { text: "❌ Please provide a search query!" });

            await client.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

            // 🔍 Search for video
            const searchResults = await yts(query);
            if (!searchResults.videos.length) return client.sendMessage(m.from, { text: "❌ No results found!" });

            const video = searchResults.videos[0];
            const videoUrl = video.url;
            const thumbnailUrl = video.thumbnail;
            const title = video.title;
            const duration = video.timestamp;

            // 🌐 API List (Fallback System)
            const apiList = [
                `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${videoUrl}`,
                `https://apis.davidcyriltech.my.id/youtube/mp3?url=${videoUrl}`,
                `https://keith-api.vercel.app/download/dlmp3?url=${videoUrl}`
            ];
            
            if (command === "video") {
                apiList.push(
                    `https://apis.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${videoUrl}`,
                    `https://apis-keith.vercel.app/download/dlmp4?url=${videoUrl}`
                );
            }

            let downloadUrl = null;
            for (const apiUrl of apiList) {
                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (data.status && data.result && data.result.downloadUrl) {
                        downloadUrl = data.result.downloadUrl;
                        break; // Exit loop on first successful API response
                    }
                } catch (error) {
                    console.log(`API failed: ${apiUrl}`);
                }
            }

            if (!downloadUrl) return client.sendMessage(m.from, { text: "❌ Download failed, please try again." });

            // 🖼️ Send Thumbnail First
            await client.sendMessage(m.from, {
                image: { url: thumbnailUrl },
                caption: `🎵 *Title:* ${title}\n⏳ *Duration:* ${duration}\n\nRegards, BruceBera`
            });

            // 🎵 Send Audio or Video
            const messageType = command === "play" ? "audio" : "video";
            const mimeType = command === "play" ? "audio/mpeg" : "video/mp4";

            await client.sendMessage(m.from, {
                [messageType]: { url: downloadUrl },
                mimetype: mimeType,
                caption: `📥 Downloaded in ${messageType === "audio" ? "Audio" : "Video"} Format`
            });

            await client.sendMessage(m.from, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error("Error:", error);
            return client.sendMessage(m.from, { text: "❌ An error occurred while processing your request." });
        }
    }
};
