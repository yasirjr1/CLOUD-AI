import config from "../../config.cjs";
import ytsearch from "yt-search";
import fetch from "node-fetch";

const playVideo = async (msg, bot) => {
  const PREFIX = config.PREFIX;
  const command = msg.body.startsWith(PREFIX) 
    ? msg.body.slice(PREFIX.length).split(" ")[0].toLowerCase() 
    : '';
  const query = msg.body.slice(PREFIX.length + command.length).trim();

  if (!["play", "video"].includes(command)) return;

  if (!query) {
    return msg.reply("❌ *Please provide a search query!*");
  }

  await msg.React('⏳');

  try {
    const searchResults = await ytsearch(query);
    if (!searchResults.videos.length) {
      return msg.reply("❌ *No results found!*");
    }

    const video = searchResults.videos[0];
    const apiUrl = command === "play" 
      ? `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}` 
      : `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.success || !data.result.download_url) {
      return msg.reply("❌ *Download failed, please try again.*");
    }

    const downloadUrl = data.result.download_url;
    const mimeType = command === "play" ? "audio/mpeg" : "video/mp4";
    const caption = `📥 *Downloaded: ${video.title}*`;

    await bot.sendMessage(
      msg.from, 
      { 
        [command === "play" ? "audio" : "video"]: { url: downloadUrl }, 
        mimetype: mimeType, 
        caption 
      }, 
      { quoted: msg }
    );

  } catch (error) {
    console.error("Error:", error);
    return msg.reply("❌ *An error occurred while processing your request.*");
  }
};

export default playVideo;
