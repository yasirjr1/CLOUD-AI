import yts from "yt-search";
import fetch from "node-fetch";

const play = async (context) => {
  const { client, m, text, botname, sendReply, sendMediaMessage } = context;

  try {
    if (!text) {
      return sendReply(client, m, "❌ Please specify the song you want to download.");
    }

    await client.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    let search = await yts(text);
    if (!search.all.length) {
      return sendReply(client, m, "❌ No results found for your query.");
    }
    
    let link = search.all[0].url;
    let thumbnail = search.all[0].thumbnail;
    
    const apiList = [
      `https://keith-api.vercel.app/download/dlmp3?url=${link}`,
      `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${link}`,
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`
    ];

    let audioData = null;

    for (const apiUrl of apiList) {
      try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        if (data.status && data.result) {
          audioData = {
            title: data.result.title,
            downloadUrl: data.result.downloadUrl,
            format: data.result.format || "mp3",
            quality: data.result.quality || "Standard",
          };
          break;
        }
      } catch (error) {
        console.log(`API failed: ${apiUrl}`);
      }
    }

    if (!audioData) {
      await client.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return sendReply(client, m, "❌ Unable to fetch the song. Please try again later.");
    }

    // Send thumbnail first
    await sendMediaMessage(client, m, {
      image: { url: thumbnail },
      caption: `
╭═════════════════⊷
║ 🎵 *Title:* ${audioData.title}
║ 📁 *Format:* ${audioData.format}
║ 🔊 *Quality:* ${audioData.quality}
╰═════════════════⊷
📥 *Downloading...*\n\nRegards, BruceBera
`,
    }, { quoted: m });

    // Send audio file
    await client.sendMessage(
      m.chat,
      {
        audio: { url: audioData.downloadUrl },
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `${audioData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`
      },
      { quoted: m }
    );

    // Send audio document
    await client.sendMessage(
      m.chat,
      {
        document: { url: audioData.downloadUrl },
        mimetype: "audio/mp3",
        fileName: `${audioData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`,
      },
      { quoted: m }
    );

    await client.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);
    await client.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return sendReply(client, m, "❌ An error occurred while processing your request.");
  }
};

export default play;
