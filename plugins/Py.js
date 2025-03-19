import _0x5f083d from '../../config.cjs';
import _0x5cb03a from 'yt-search';

const play = async (_0x1b9510, _0xde7a32) => {
  const _0x420086 = _0x5f083d.PREFIX;
  const _0x528617 = _0x1b9510.body.startsWith(_0x420086) ? _0x1b9510.body.slice(_0x420086.length).split(" ")[0x0].toLowerCase() : '';
  const _0x5809fc = _0x1b9510.body.slice(_0x420086.length + _0x528617.length).trim();
  
  if (_0x528617 === 'play') {
    if (!_0x5809fc) {
      return _0x1b9510.reply("❌ *Please provide a search query!*");
    }

    await _0x1b9510.React('⏳');

    try {
      const _0x589357 = await _0x5cb03a(_0x5809fc);
      if (!_0x589357.videos.length) {
        return _0x1b9510.reply("❌ *No results found!*");
      }

      const _0x24d96b = _0x589357.videos[0x0]; // First search result
      const _0xac0071 = _0x24d96b.url;

      // Message Format
      const _0x384e8c = `📺 *YOUTUBE PLAY*
      
🎵 *Title:* ${_0x24d96b.title}
👁‍🗨 *Views:* ${_0x24d96b.views}
⏳ *Duration:* ${_0x24d96b.timestamp}
📺 *Channel:* ${_0x24d96b.author.name}
📅 *Uploaded:* ${_0x24d96b.ago}
🔗 *URL:* ${_0xac0071}
      
📥 *Choose an option to download:*`;

      // Thumbnail
      const _0x227196 = { 'url': _0x24d96b.thumbnail };
      const _0x13f7c8 = { 'image': _0x227196, 'caption': _0x384e8c };

      // Sending Message with Buttons
      const buttons = [
        { buttonId: `yt_video ${_0xac0071}`, buttonText: { displayText: "📹 Video" }, type: 1 },
        { buttonId: `yt_audio ${_0xac0071}`, buttonText: { displayText: "🎵 Audio" }, type: 1 },
        { buttonId: `yt_video_doc ${_0xac0071}`, buttonText: { displayText: "📁 Video (Document)" }, type: 1 },
        { buttonId: `yt_audio_doc ${_0xac0071}`, buttonText: { displayText: "📄 Audio (Document)" }, type: 1 }
      ];

      const buttonMessage = {
        image: _0x227196,
        caption: _0x384e8c,
        footer: "© BERA TECH",
        buttons: buttons,
        headerType: 4
      };

      await _0xde7a32.sendMessage(_0x1b9510.from, buttonMessage, { quoted: _0x1b9510 });

    } catch (error) {
      console.error("Error:", error);
      return _0x1b9510.reply("❌ *An error occurred while processing your request.*");
    }
  }
};

export default play;
