import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (_0x1b9510, _0xde7a32) => {
    const _0x2c2c73 = _0x1b9510.body.toLowerCase().split(" ");
    const _0x528617 = _0x2c2c73[0]; // First word of the message
    const _0x5809fc = _0x2c2c73.slice(1).join(" ").trim(); // Rest of the message

    if (_0x528617 !== 'play' && _0x528617 !== 'video') {
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
        let _0x39489e, _0x566599, _0x1744fd, _0x24d9d1;

        if (_0x528617 === 'play') {
            _0x39489e = `https://bandahealimaree-api-ytdl.hf.space/api/ytmp3?url=${_0xac0071}`;
            _0x566599 = "audio";
            _0x1744fd = "audio/mpeg";
            _0x24d9d1 = "📥 *Downloaded in Audio Format*";
        } else if (_0x528617 === 'video') {
            _0x39489e = `https://apis.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${_0xac0071}`;
            _0x566599 = "video";
            _0x1744fd = "video/mp4";
            _0x24d9d1 = "📥 *Downloaded in Video Format*";
        }

        // Fetch the download link
        const _0x15ce39 = await fetch(_0x39489e);
        const _0x3e2e40 = await _0x15ce39.json();

        let _0x575e0e;
        if (_0x528617 === 'play') {
            _0x575e0e = _0x3e2e40.url; // Direct MP3 link
        } else {
            _0x575e0e = _0x3e2e40.result?.url || _0x3e2e40.url; // Direct MP4 link
        }

        if (!_0x575e0e) {
            return _0x1b9510.reply("❌ Download failed, please try again.");
        }

        // Fetch and process thumbnail
        const _0xthumbnailBuffer = await fetch(_0xthumbnail).then(res => res.buffer());

        const _0x485b96 = {
            [_0x566599]: { url: _0x575e0e },
            mimetype: _0x1744fd,
            caption: `${_0x24d9d1}\n\n*🎵 Title:* ${_0x24d96b.title}\n*⏳ Duration:* ${_0x24d96b.timestamp}\n\nBERA TECH DOWNLOADER`,
            footer: "BERA TECH DOWNLOADER",
            jpegThumbnail: _0xthumbnailBuffer
        };

        await _0xde7a32.sendMessage(_0x1b9510.from, _0x485b96, { quoted: _0x1b9510 });

    } catch (_0x5db9ce) {
        console.error("Error:", _0x5db9ce);
        return _0x1b9510.reply("❌ An error occurred while processing your request.");
    }
};

export default play;
