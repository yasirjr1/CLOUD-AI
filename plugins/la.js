import _0x9f89b6 from "node-fetch";

const lyricsHandler = async (_0x1d9bf5, _0x5c8c29) => {
  const _0x270446 = _0x1d9bf5.body.trim().toLowerCase();
  const _0x2c5406 = ["lyrics", "lyric"];

  if (_0x2c5406.includes(_0x270446.split(" ")[0])) {
    const _0x1ea7cf = _0x1d9bf5.body.split(" ").slice(1);
    const _0xce7cc1 = _0x1ea7cf.join(" ");

    if (!_0xce7cc1) {
      return _0x1d9bf5.reply(
        "❗ Please provide a song title and artist!\nExample: *lyrics faded Alan Walker*"
      );
    }

    try {
      await _0x5c8c29.sendMessage(
        _0x1d9bf5.from,
        { text: "🎵 Searching for lyrics..." },
        { quoted: _0x1d9bf5 }
      );

      const _0x453c30 = _0xce7cc1.split(" ");
      const _0x582cbf = _0x453c30.pop();
      const _0x1c2fca = _0x453c30.join(" ");
      const _0x33b883 =
        "https://api.davidcyriltech.my.id/lyrics?t=" +
        encodeURIComponent(_0x1c2fca) +
        "&a=" +
        encodeURIComponent(_0x582cbf);

      const _0x30f3d3 = await _0x9f89b6(_0x33b883);

      if (!_0x30f3d3.ok) {
        console.error("API Error: " + _0x30f3d3.status + " " + _0x30f3d3.statusText);
        return _0x5c8c29.sendMessage(
          _0x1d9bf5.from,
          { text: "⚠️ API Error: " + _0x30f3d3.statusText },
          { quoted: _0x1d9bf5 }
        );
      }

      const _0x1c3a58 = await _0x30f3d3.json();

      if (!_0x1c3a58.lyrics || !_0x1c3a58.title || !_0x1c3a58.artist) {
        console.error("Invalid API response:", _0x1c3a58);
        return _0x5c8c29.sendMessage(
          _0x1d9bf5.from,
          { text: "⚠️ Could not find lyrics. Please check the title and artist." },
          { quoted: _0x1d9bf5 }
        );
      }

      await _0x5c8c29.sendMessage(
        _0x1d9bf5.from,
        {
          text:
            "🎤 *Lyrics for \"" +
            _0x1c3a58.title +
            "\" by " +
            _0x1c3a58.artist +
            ":*\n\n" +
            _0x1c3a58.lyrics +
            "\n\n📄 *Long lyrics? Tap and hold to copy!*",
        },
        { quoted: _0x1d9bf5 }
      );
    } catch (_0x20e252) {
      console.error("Unexpected Error: " + (_0x20e252.message || _0x20e252));
      _0x5c8c29.sendMessage(
        _0x1d9bf5.from,
        { text: "⚠️ An unexpected error occurred. Please try again later." },
        { quoted: _0x1d9bf5 }
      );
    }
  }
};

export default lyricsHandler;
