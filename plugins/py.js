import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (_0x1b9510, _0xde7a32) => {
    const _0x2c2c73 = _0x1b9510.body.toLowerCase().split(" ");
    const _0x528617 = _0x2c2c73[0]; // First word of the message
    const _0x5809fc = _0x2c2c73.slice(1).join(" ").trim(); // Rest of the message

    if (_0x528617 !== 'play') {
        return;
    }

    if (!_0x5809fc) {
        return _0x1b9510.reply("❌ Please provide a search query!");
    }

    await _0x1b9510.React('⏳');

    try {
        // Search for the video
        const _0x589357 = await ytSearch(_0x5809fc);
        if (!_0x589357.videos.length) {
            return _0x1b9510.reply("❌ No results found!");
        }

        const _0x24d96b = _0x589357.videos[0]; // First result
        const _0xac0071 = _0x24d96b.url; // Video URL
        const _0xthumbnail = _0x24d96b.thumbnail; // Video thumbnail
        const _0x39489e = `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${_0xac0071}`;

        // Fetch and process thumbnail
        const _0xthumbnailBuffer = await fetch(_0xthumbnail).then(res => res.buffer());

        // Send thumbnail first
        await _0xde7a32.sendMessage(_0x1b9510.from, {
            image: _0xthumbnailBuffer,
            caption: `🎵 *Title:* ${_0x24d96b.title}\n⏳ *Duration:* ${_0x24d96b.timestamp}\n\nRegards, BruceBera`,
            footer: "Regards, BruceBera"
        }, { quoted: _0x1b9510 });

        // Fetch the download link
        const _0x15ce39 = await fetch(_0x39489e);
        const _0x3e2e40 = await _0x15ce39.json();
        const _0x575e0e = _0x3e2e40.url; // Direct MP3 link

        if (!_0x575e0e) {
            return _0x1b9510.reply("❌ Download failed, please try again.");
        }

        // Send audio separately after the thumbnail
        await _0xde7a32.sendMessage(_0x1b9510.from, {
            audio: { url: _0x575e0e },
            mimetype: "audio/mpeg",
            caption: "📥 *Downloaded in Audio Format*"
        }, { quoted: _0x1b9510 });

    } catch (_0x5db9ce) {
        console.error("Error:", _0x5db9ce);
        return _0x1b9510.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
