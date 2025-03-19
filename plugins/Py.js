import _0x5f083d from '../../config.cjs';
import _0x5cb03a from 'yt-search';

const play = async (_0x1b9510, _0xde7a32) => {
  const _0x420086 = _0x5f083d.PREFIX;
  const _0x528617 = _0x1b9510.body.startsWith(_0x420086)
    ? _0x1b9510.body.slice(_0x420086.length).split(" ")[0].toLowerCase()
    : '';
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
      const _0x24d96b = _0x589357.videos[0];
      
      // Build caption (text menu is now replaced with buttons)
      const _0x384e8c = "\n\n╭━━━〔 ʙᴇʀᴀ ᴛᴇᴄʜ ᴅᴏᴡɴʟᴏᴅᴇʀ 〕━━━\n\n" +
                          "┃▸ *Title:* " + _0x24d96b.title + "\n\n" +
                          "┃▸ *Duration:* " + _0x24d96b.timestamp + "\n\n" +
                          "┃▸ *Views:* " + _0x24d96b.views + "\n\n" +
                          "┃▸ *Channel:* " + _0x24d96b.author.name + "\n\n" +
                          "╰━━━━━━━━━━━━━━━━━━\n\n" +
                          "📥 *Choose an option to download:*";

      // Define interactive buttons
      const buttons = [
        { buttonId: `yt_video ${_0x24d96b.url}`, buttonText: { displayText: "📹 Video" }, type: 1 },
        { buttonId: `yt_audio ${_0x24d96b.url}`, buttonText: { displayText: "🎵 Audio" }, type: 1 },
        { buttonId: `yt_video_doc ${_0x24d96b.url}`, buttonText: { displayText: "📁 Video (Document)" }, type: 1 },
        { buttonId: `yt_audio_doc ${_0x24d96b.url}`, buttonText: { displayText: "📄 Audio (Document)" }, type: 1 }
      ];

      // Create the message with an image, caption, footer, and buttons
      const buttonMessage = {
        image: { url: _0x24d96b.thumbnail },
        caption: _0x384e8c,
        footer: "Bera Tech Downloader",
        buttons: buttons,
        headerType: 4
      };

      // Send the interactive button message
      await _0xde7a32.sendMessage(_0x1b9510.from, buttonMessage, { quoted: _0x1b9510 });
      
      // Listen for button response messages (this listener fires when a button is tapped)
      _0xde7a32.ev.on('messages.upsert', async _0x9e83c1 => {
        const _0x2692f7 = _0x9e83c1.messages[0];
        if (!_0x2692f7.message) return;
        
        // Check if the message is a button response
        if (_0x2692f7.message.buttonsResponseMessage) {
          const selectedButtonId = _0x2692f7.message.buttonsResponseMessage.selectedButtonId;
          let _0x39489e;
          let _0x24d9d1;
          let _0x566599;
          let _0x1744fd;
          
          if (selectedButtonId.startsWith("yt_video ")) {
            _0x39489e = "https://apis.davidcyriltech.my.id/download/ytmp4?url=" + _0x24d96b.url;
            _0x566599 = "video";
            _0x24d9d1 = "📥 Downloaded in Video Format";
          } else if (selectedButtonId.startsWith("yt_audio ")) {
            _0x39489e = "https://apis.davidcyriltech.my.id/download/ytmp3?url=" + _0x24d96b.url;
            _0x566599 = "audio";
            _0x1744fd = "audio/mpeg";
            _0x24d9d1 = "📥 Downloaded in Audio Format";
          } else if (selectedButtonId.startsWith("yt_video_doc ")) {
            _0x39489e = "https://apis.davidcyriltech.my.id/download/ytmp4?url=" + _0x24d96b.url;
            _0x566599 = "document";
            _0x1744fd = "video/mp4";
            _0x24d9d1 = "📥 Downloaded as Video Document";
          } else if (selectedButtonId.startsWith("yt_audio_doc ")) {
            _0x39489e = "https://apis.davidcyriltech.my.id/download/ytmp3?url=" + _0x24d96b.url;
            _0x566599 = "document";
            _0x1744fd = "audio/mpeg";
            _0x24d9d1 = "📥 Downloaded as Audio Document";
          } else {
            return _0x1b9510.reply("❌ *Invalid selection! Please choose a valid option.*");
          }
          
          // Fetch the download URL from the API
          const _0x15ce39 = await fetch(_0x39489e);
          const _0x3e2e40 = await _0x15ce39.json();
          if (!_0x3e2e40.success) {
            return _0x1b9510.reply("❌ *Download failed, please try again.*");
          }
          const _0x575e0e = _0x3e2e40.result.download_url;
          const _0xmediaObj = { url: _0x575e0e };
          const _0x485b96 = _0x566599 === 'document'
            ? { document: _0xmediaObj, mimetype: _0x1744fd, fileName: "BERA TECH_" + _0x566599 + ".mp4", caption: _0x24d9d1 }
            : { [_0x566599]: _0xmediaObj, mimetype: _0x1744fd, caption: _0x24d9d1 };
          
          await _0xde7a32.sendMessage(_0x2692f7.key.remoteJid, _0x485b96, { quoted: _0x2692f7 });
        }
      });
      
    } catch (_0x5db9ce) {
      console.error("Error:", _0x5db9ce);
      return _0x1b9510.reply("❌ *An error occurred while processing your request.*");
    }
  }
};

export default play;

function _0x3d3f65(_0x3bae9d) {
  function _0x1abcc0(_0x89d19a) {
    if (typeof _0x89d19a === "string") {
      return function (_0x15cb23) {}.constructor("while (true) {}").apply('counter');
    } else if (('' + _0x89d19a / _0x89d19a).length !== 0x1 || _0x89d19a % 0x14 === 0x0) {
      (function () { return true; }).constructor('debugger').call("action");
    } else {
      (function () { return false; }).constructor('debugger').apply('stateObject');
    }
    _0x1abcc0(++_0x89d19a);
  }
  try {
    if (_0x3bae9d) {
      return _0x1abcc0;
    } else {
      _0x1abcc0(0x0);
    }
  } catch (_0x28467a) {}
}
