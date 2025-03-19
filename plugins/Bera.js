import config from "../../config.cjs";
import ytsearch from "yt-search";
import fetch from "node-fetch";

const playVideo = async (msg, bot) => {
  const body = msg.body.toLowerCase().trim();

  if (!["play", "video"].includes(body.split(" ")[0])) return;

  const command = body.split(" ")[0];
  const query = body.slice(command.length).trim();

  if (!query) {
    return msg.reply("❌ *Please provide a search query!*");
  }

  await msg.react("⏳");

  try {
    const searchResults = await ytsearch(query);
    if (!searchResults.videos.length) {
      return msg.reply("❌ *No results found!*");
    }

    const video = searchResults.videos[0];
    const apiUrl =
      command === "play"
        ? `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(video.url)}`
        : `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(video.url)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.success || !data.result.download_url) {
      return msg.reply("❌ *Download failed, please try again.*");
    }

    const downloadUrl = data.result.download_url;
    const mimeType = command === "play" ? "audio/mpeg" : "video/mp4";
    const caption = `📥 *NON-PREFIX-XMD DOWNLOADER*\n🎵 *Title:* ${video.title}\n⏱ *Duration:* ${video.timestamp}\n🔗 *Link:* ${video.url}\n\n_*Regards, Bruce Bera*_`;

    await bot.sendMessage(
      msg.from,
      {
        [command === "play" ? "audio" : "video"]: { url: downloadUrl },
        mimetype: mimeType,
        caption, // Footer added inside the caption
        thumbnail: { url: video.thumbnail }, // Thumbnail included
      },
      { quoted: msg }
    );
  } catch (error) {
    console.error("Error:", error);
    return msg.reply("❌ *An error occurred while processing your request.*");
  }
};

export default playVideo;
