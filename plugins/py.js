import fetch from "node-fetch";
import ytsearch from "yt-search";

const playCommand = async (m, Matrix) => {
  const command = m.body.toLowerCase().trim();

  if (command.startsWith("play") || command.startsWith("video")) {
    const query = m.body.slice(command.indexOf(" ") + 1).trim();

    if (!query) {
      return m.reply("⚠️ *Please provide a YouTube URL or song name.*");
    }

    try {
      const yt = await ytsearch(query);
      if (!yt.results.length) {
        return m.reply("❌ No results found for your search.");
      }

      const yts = yt.results[0];
      const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
        return m.reply("⚠️ Failed to fetch the audio. Please try again later.");
      }

      const ytmsg = `
╔═══〔 *NON-PREFIX-XMD* 〕═══❒
║🎵 *Title:* ${yts.title}
║⏳ *Duration:* ${yts.timestamp}
║👀 *Views:* ${yts.views}
║🎤 *Author:* ${yts.author.name}
║🔗 *Link:* ${yts.url}
╚══════════════════❒
> *Powered by NON-PREFIX-XMD*
`;

      // Send song details with thumbnail
      await Matrix.sendMessage(m.from, { image: { url: data.result.image || "" }, caption: ytmsg }, { quoted: m });

      // Send audio file
      await Matrix.sendMessage(m.from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });

    } catch (error) {
      console.error("❌ Error fetching song:", error);
      m.reply("⚠️ An error occurred. Please try again later.");
    }
  }
};

export default playCommand;
