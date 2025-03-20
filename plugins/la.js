import fetch from "node-fetch";

const lyricsHandler = async (_0x1d9bf5, _0x5c8c29) => {
  // Extract user message and split into words
  const userInput = _0x1d9bf5.body.trim().toLowerCase().split(" ");
  const command = userInput[0]; // First word (should be "lyrics" or "lyric")
  const songQuery = userInput.slice(1).join(" "); // Rest of the message

  // Valid trigger words
  const validCommands = ["lyrics", "lyric"];
  
  // Check if the command is valid and a song title is provided
  if (!validCommands.includes(command) || !songQuery) {
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

    // Extract song title and artist
    const words = songQuery.split(" ");
    const artist = words.pop(); // Last word is assumed to be the artist
    const title = words.join(" "); // Remaining words form the song title

    // Construct API URL
    const apiUrl = `https://api.davidcyriltech.my.id/lyrics?t=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`;

    // Fetch lyrics from API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return _0x5c8c29.sendMessage(
        _0x1d9bf5.from,
        { text: "⚠️ API Error: " + response.statusText },
        { quoted: _0x1d9bf5 }
      );
    }

    const data = await response.json();
    if (!data.lyrics || !data.title || !data.artist) {
      console.error("Invalid API response:", data);
      return _0x5c8c29.sendMessage(
        _0x1d9bf5.from,
        { text: "⚠️ Could not find lyrics. Please check the title and artist." },
        { quoted: _0x1d9bf5 }
      );
    }

    // Send lyrics response
    await _0x5c8c29.sendMessage(
      _0x1d9bf5.from,
      {
        text: `🎤 *Lyrics for "${data.title}" by ${data.artist}:*\n\n${data.lyrics}\n\n📄 *Long lyrics? Tap and hold to copy!*`,
      },
      { quoted: _0x1d9bf5 }
    );
  } catch (error) {
    console.error("Unexpected Error:", error.message || error);
    _0x5c8c29.sendMessage(
      _0x1d9bf5.from,
      { text: "⚠️ An unexpected error occurred. Please try again later." },
      { quoted: _0x1d9bf5 }
    );
  }
};

export default lyricsHandler;
