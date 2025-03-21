import _0x5f083d from '../../config.cjs';
import _0x5cb03a from 'yt-search';

const play = async (_0x1b9510, _0xde7a32) => {
  const _0x5809fc = _0x1b9510.body.trim().toLowerCase();
  
  if (_0x5809fc.startsWith('play') || _0x5809fc.startsWith('video')) { // Non-prefix trigger
    const _0xquery = _0x5809fc.replace(/^(play|video)\s*/, "").trim();
    
    if (!_0xquery) {
      return _0x1b9510.reply("❌ *Please provide a search query!*");
    }

    await _0x1b9510.React('⏳');
    
    try {
      const _0x589357 = await _0x5cb03a(_0xquery);
      if (!_0x589357.videos.length) {
        return _0x1b9510.reply("❌ *No results found!*");
      }
      
      const _0x24d96b = _0x589357.videos[0x0];
      const _0x384e8c = `\n\n╭━━━〔 *ᴄʟᴏᴜᴅ ᴀɪ ᴅᴏᴡɴʟᴏᴅᴇʀ* 〕━━━\n\n┃▸ *Title:* ${_0x24d96b.title}\n\n┃▸ *Duration:* ${_0x24d96b.timestamp}\n\n┃▸ *Views:* ${_0x24d96b.views}\n\n┃▸ *Channel:* ${_0x24d96b.author.name}\n\n╰━━━━━━━━━━━━━━━━━━\n\n📥 *Downloading automatically...*`;

      await _0xde7a32.sendMessage(_0x1b9510.from, { 
        image: { url: _0x24d96b.thumbnail }, 
        caption: _0x384e8c 
      }, { quoted: _0x1b9510 });

      const _0xac0071 = _0x24d96b.url;
      const _0x39489e = _0x5809fc.startsWith('video') 
        ? `https://apis.davidcyriltech.my.id/download/ytmp4?url=${_0xac0071}` 
        : `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${_0xac0071}`;
        
      const _0x566599 = _0x5809fc.startsWith('video') ? "video" : "audio";
      const _0x1744fd = _0x5809fc.startsWith('video') ? "video/mp4" : "audio/mpeg";
      const _0x24d9d1 = _0x5809fc.startsWith('video') 
        ? "📥 *Downloaded in Video Format*" 
        : "📥 *Downloaded in Audio Format*";

      const _0x15ce39 = await fetch(_0x39489e);
      const _0x3e2e40 = await _0x15ce39.json();

      if (!_0x3e2e40.success) {
        return _0x1b9510.reply("❌ *Download failed, please try again.*");
      }

      const _0x575e0e = _0x3e2e40.result.download_url;

      const _0x485b96 = {
        [_0x566599]: { url: _0x575e0e },
        mimetype: _0x1744fd,
        caption: _0x24d9d1
      };

      await _0xde7a32.sendMessage(_0x1b9510.from, _0x485b96, { quoted: _0x1b9510 });

    } catch (_0x5db9ce) {
      console.error("Error:", _0x5db9ce);
      return _0x1b9510.reply("❌ *An error occurred while processing your request.*");
    }
  }
};

export default play;
