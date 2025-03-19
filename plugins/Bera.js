import ytsearch from "yt-search";
import fetch from "node-fetch";

const playVideo = async (msg, bot) => {
  const body = msg.body.toLowerCase().trim();

  // Ensure only "play" or "video" triggers this command
  if (!body.startsWith("play") && !body.startsWith("video")) return;

  const command = body.split(" ")[0];
  const query = body.slice(command.length).trim();

  if (!query) {
    await msg.react("❌");
    return msg.reply("❌ *Please provide a search query!*");
  }

  await msg.react("⏳"); // Processing reaction

  try {
    // Search for the video
    const searchResults = await ytsearch(query);
    if (!searchResults.videos.length) {
      await msg.react("❌");
      return msg.reply("❌ *No results found!*");
    }

    const video = searchResults.videos[0];

    // Choose the correct API
    const apiUrl =
      command === "play"
        ? `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(video.url)}`
        : `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(video.url)}`;

    // Fetch API response
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Debugging log (remove after testing)
    console.log("API Response:", data);

    if (!data.success || !data.result || !data.result.download_url) {
      await msg.react("❌");
      return msg.reply("❌ *Download failed, please try again.*");
    }

    const downloadUrl = data.result.download_url;
    const mimeType = command === "play" ? "audio/mpeg" : "video/mp4";

    const caption = `📥 *NON-PREFIX-XMD DOWNLOADER*\n🎵 *Title:* ${video.title}\n⏱ *Duration:* ${video.timestamp}\n🔗 *Link:* ${video.url}\n\n_*Regards, Bruce Bera*_`;

    // First, send the thumbnail separately
    await bot.sendMessage(
      msg.from,
      {
        image: { url: video.thumbnail },
        caption: `🎶 *${video.title}*\n📌 *Duration:* ${video.timestamp}\n\n*NON-PREFIX-XMD DOWNLOADER*`,
      },
      { quoted: msg }
    );

    // Send the actual media file
    await bot.sendMessage(
      msg.from,
      {
        [command === "play" ? "audio" : "video"]: { url: downloadUrl },
        mimetype: mimeType,
        caption,
      },
      { quoted: msg }
    );

    await msg.react("✅"); // Success reaction
  } catch (error) {
    console.error("Error:", error);
    await msg.react("❌");
    return msg.reply("❌ *An error occurred while processing your request.*");
  }
};

export default playVideo;
