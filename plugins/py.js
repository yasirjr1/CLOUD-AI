import _0x5f083d from '../../config.cjs';
import _0x5cb03a from 'yt-search';

const play = async (_0x1b9510, _0xde7a32) => {
  const _0x5809fc = _0x1b9510.body.trim().toLowerCase();

  if (_0x5809fc.startsWith("play")) {
    const _0xsearchQuery = _0x5809fc.slice(4).trim(); // Extract search query after "play"
    
    if (!_0xsearchQuery) {
      return _0x1b9510.reply("❌ *Please provide a search query!*");
    }

    await _0x1b9510.React('⏳');
    try {
      const _0x589357 = await _0x5cb03a(_0xsearchQuery);
      if (!_0x589357.videos.length) {
        return _0x1b9510.reply("❌ *No results found!*");
      }
      const _0x24d96b = _0x589357.videos[0];

      const _0x384e8c = `
╭━━━〔 *ʙᴇʀᴀ ᴛᴇᴄʜ ᴅᴏᴡɴʟᴏᴅᴇʀ* 〕━━━

┃▸ *Title:* ${_0x24d96b.title}
┃▸ *Duration:* ${_0x24d96b.timestamp}
┃▸ *Views:* ${_0x24d96b.views}
┃▸ *Channel:* ${_0x24d96b.author.name}

╰━━━━━━━━━━━━━━━━━━

📥 *Choose an option to download:*

1️⃣ *Video*
2️⃣ *Audio*
3️⃣ *Video (Document)*
4️⃣ *Audio (Document)*
`;

      const _0x227196 = { 'url': _0x24d96b.thumbnail };
      const _0x13f7c8 = { 'image': _0x227196, 'caption': _0x384e8c };
      const _0x56311a = await _0xde7a32.sendMessage(_0x1b9510.from, _0x13f7c8, { 'quoted': _0x1b9510 });

      const _0x5a63b2 = _0x56311a.key.id;
      const _0xac0071 = _0x24d96b.url;

      _0xde7a32.ev.on('messages.upsert', async _0x9e83c1 => {
        const _0x2692f7 = _0x9e83c1.messages[0];
        if (!_0x2692f7.message) return;

        const _0x16800d = _0x2692f7.message.conversation || _0x2692f7.message.extendedTextMessage?.text;
        const _0x336b3f = _0x2692f7.key.remoteJid;
        const _0x33b7fd = _0x2692f7.message.extendedTextMessage && _0x2692f7.message.extendedTextMessage.contextInfo.stanzaId === _0x5a63b2;

        if (_0x33b7fd) {
          await _0xde7a32.sendMessage(_0x336b3f, { 'react': { 'text': '⬇️', 'key': _0x2692f7.key } });

          let _0x39489e, _0x24d9d1, _0x566599, _0x1744fd;

          if (_0x16800d === '1') {
            _0x39489e = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${_0xac0071}`;
            _0x566599 = "video";
            _0x24d9d1 = "📥 *Downloaded in Video Format*";
          } else if (_0x16800d === '2') {
            _0x39489e = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${_0xac0071}`;
            _0x566599 = "audio";
            _0x1744fd = "audio/mpeg";
            _0x24d9d1 = "📥 *Downloaded in Audio Format*";
          } else if (_0x16800d === '3') {
            _0x39489e = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${_0xac0071}`;
            _0x566599 = "document";
            _0x1744fd = "video/mp4";
            _0x24d9d1 = "📥 *Downloaded as Video Document*";
          } else if (_0x16800d === '4') {
            _0x39489e = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${_0xac0071}`;
            _0x566599 = "document";
            _0x1744fd = "audio/mpeg";
            _0x24d9d1 = "📥 *Downloaded as Audio Document*";
          } else {
            return _0x1b9510.reply("❌ *Invalid selection! Please reply with 1, 2, 3, or 4.*");
          }

          const _0x15ce39 = await fetch(_0x39489e);
          const _0x3e2e40 = await _0x15ce39.json();
          if (!_0x3e2e40.success) {
            return _0x1b9510.reply("❌ *Download failed, please try again.*");
          }

          const _0x575e0e = _0x3e2e40.result.download_url;
          const _0x485b96 = _0x566599 === 'document'
            ? { 'document': { 'url': _0x575e0e }, 'mimetype': _0x1744fd, 'fileName': `BERA TECH_${_0x566599}.mp4`, 'caption': _0x24d9d1 }
            : { [_0x566599]: { 'url': _0x575e0e }, 'mimetype': _0x1744fd, 'caption': _0x24d9d1 };

          await _0xde7a32.sendMessage(_0x336b3f, _0x485b96, { 'quoted': _0x2692f7 });
        }
      });

    } catch (_0x5db9ce) {
      console.error("Error:", _0x5db9ce);
      return _0x1b9510.reply("❌ *An error occurred while processing your request.*");
    }
  }
};

export default play;
