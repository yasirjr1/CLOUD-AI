const fetchMedia = async (url, type) => {
  const apiUrl = type === 'mp3'
    ? `https://apis.davidcyriltech.my.id/download/ytmp3?url=${url}`
    : `https://apis.davidcyriltech.my.id/download/ytmp4?url=${url}`;

  try {
    const response = await _0x42e277(apiUrl);
    const data = await response.json();

    if (data.success) {
      return {
        download_url: data.download_url,
        title: data.title,
        image: data.thumbnail
      };
    } else {
      throw new Error("Error fetching media");
    }
  } catch (error) {
    throw new Error("Error fetching media from API");
  }
};

// Inside playcommand function
const playcommand = async (_0x3a4726, _0x1107b4) => {
  // ...existing code...

  if (_0xc7779b.includes(_0x555d40)) {
    if (!_0xee736c) {
      return _0x3a4726.reply("*Please provide a search query*");
    }
    try {
      await _0x3a4726.React('🕘');
      const _0x4067ec = await _0x25103f(_0xee736c);
      const _0x4eb7e3 = _0x4067ec.videos.slice(0, 5);
      if (_0x4eb7e3.length === 0) {
        _0x3a4726.reply("No results found.");
        await _0x3a4726.React('❌');
        return;
      }

      // Store search results
      _0x4eb7e3.forEach((_0xdb159c, _0x66a43c) => {
        const _0x1240bd = searchIndex + _0x66a43c;
        searchResultsMap.set(_0x1240bd, _0xdb159c);
      });

      const _0x319d2 = searchResultsMap.get(searchIndex);
      const _0x3d1f37 = _0x319d2.thumbnail;
      const _0x487953 = "https://www.youtube.com/watch?v=" + _0x319d2.videoId;

      // Media fetch (MP3 or MP4)
      const mediaType = "audio";  // This should be set dynamically based on the user's choice
      const mediaData = await fetchMedia(_0x487953, mediaType);  // Fetch either MP3 or MP4

      const _0x5eb864 = {
        buttons: [{
          'name': "quick_reply",
          'buttonParamsJson': JSON.stringify({
            'display_text': mediaType === 'mp3' ? "🎧 AUDIO" : "🎥 VIDEO",
            'id': "media_" + mediaType + "_" + searchIndex
          })
        }]
      };

      // Construct message with the fetched media details
      const _0x41cbb0 = {
        text: "*NON-PREFIX-XMD YOUTUBE SEARCH*\n\n> *TITLE:* " + _0x319d2.title + "\n> *AUTHOR:* " + _0x319d2.author.name + "\n> *VIEWS:* " + _0x319d2.views + "\n> *DURATION:* " + _0x319d2.timestamp + "\n> *YTLINK:* " + _0x487953 + "\n"
      };

      const _0x405e9c = {
        image: { url: mediaData.image }
      };

      const _0x43f596 = generateWAMessageFromContent(_0x3a4726.from, {
        'viewOnceMessage': {
          'message': {
            'interactiveMessage': proto.Message.InteractiveMessage.create({
              'body': proto.Message.InteractiveMessage.Body.create(_0x41cbb0),
              'footer': proto.Message.InteractiveMessage.Footer.create({
                'text': "© Regards brucebera"
              }),
              'header': proto.Message.InteractiveMessage.Header.create({
                'title': '',
                'gifPlayback': true,
                'subtitle': '',
                'hasMediaAttachment': false
              }),
              'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create(_0x5eb864),
              'contextInfo': { 'mentionedJid': [_0x3a4726.sender] }
            })
          }
        }
      }, {});

      await _0x1107b4.relayMessage(_0x43f596.key.remoteJid, _0x43f596.message, {
        'messageId': _0x43f596.key.id
      });

      await _0x3a4726.React('✅');
      searchIndex += 1;
    } catch (_0x26f97b) {
      console.error("Error processing your request:", _0x26f97b);
      _0x3a4726.reply("Error processing your request.");
      await _0x3a4726.React('❌');
    }
  } else {
    // Handle media download actions
    if (_0x26c572 && _0x26c572.startsWith("media_")) {
      const _0x19a454 = _0x26c572.split('_');
      const _0x1628f9 = _0x19a454[1];
      const _0x854df6 = parseInt(_0x19a454[2]);
      const _0x2ece3c = searchResultsMap.get(_0x854df6);
      if (!_0x2ece3c) {
        return _0x3a4726.reply("Media not found.");
      }

      try {
        const _0x32fd22 = "https://www.youtube.com/watch?v=" + _0x2ece3c.videoId;
        const mediaData = await fetchMedia(_0x32fd22, _0x1628f9);

        let mediaMessage;
        if (_0x1628f9 === "audio") {
          mediaMessage = {
            audio: await (await _0x42e277(mediaData.download_url)).buffer(),
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: _0x2ece3c.title + ".mp3",
            contextInfo: { mentionedJid: [_0x3a4726.sender] }
          };
        } else {
          mediaMessage = {
            video: await (await _0x42e277(mediaData.download_url)).buffer(),
            mimetype: "video/mp4",
            contextInfo: { mentionedJid: [_0x3a4726.sender] }
          };
        }

        await _0x1107b4.sendMessage(_0x3a4726.from, mediaMessage);
      } catch (error) {
        console.error("Error downloading media:", error);
        _0x3a4726.reply("Failed to download the media.");
      }
    }
  }
};
