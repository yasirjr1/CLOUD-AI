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
      
      const _0x24d96b = _0x589357.videos[0x0];

      const buttons = [
        {buttonId: 'video_' + _0x24d96b.url, buttonText: {displayText: '📹 Video'}, type: 1},
        {buttonId: 'audio_' + _0x24d96b.url, buttonText: {displayText: '🎵 Audio'}, type: 1},
        {buttonId: 'video_doc_' + _0x24d96b.url, buttonText: {displayText: '📂 Video (Document)'}, type: 1},
        {buttonId: 'audio_doc_' + _0x24d96b.url, buttonText: {displayText: '📂 Audio (Document)'}, type: 1},
      ];

      const buttonMessage = {
        image: {url: _0x24d96b.thumbnail},
        caption: `📺 *YOUTUBE PLAY*\n\n🎵 *Title:* ${_0x24d96b.title}\n👀 *Views:* ${_0x24d96b.views}\n⏳ *Duration:* ${_0x24d96b.timestamp}\n📺 *Channel:* ${_0x24d96b.author.name}\n📅 *Uploaded:* ${_0x24d96b.ago}\n🔗 *URL:* ${_0x24d96b.url}\n\n📥 *Choose an option to download:*`,
        footer: 'Bera Tech Downloader',
        buttons: buttons,
        headerType: 4
      };

      await _0xde7a32.sendMessage(_0x1b9510.from, buttonMessage, {quoted: _0x1b9510});
      
    } catch (_0x5db9ce) {
      console.error("Error:", _0x5db9ce);
      return _0x1b9510.reply("❌ *An error occurred while processing your request.*");
    }
  }
};

export default play;
