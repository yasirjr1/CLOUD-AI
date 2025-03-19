const tourl = async (m, bot) => {
  // Match if the message contains the valid command directly, without any prefix
  const validCommands = ['tourl', 'geturl', 'upload', 'url'];

  // Check if the message body directly contains any valid command
  const cmd = m.body.toLowerCase().split(' ')[0]; // First word of the message is the command
  
  if (validCommands.includes(cmd)) {
    if (!m.quoted || !['imageMessage', 'videoMessage', 'audioMessage'].includes(m.quoted.mtype)) {
      return m.reply(`Send/Reply/Quote an image, video, or audio to upload \n*${cmd}*`);
    }

    try {
      const loadingMessages = [
        "*「▰▰▰▱▱▱▱▱▱▱」*",
        "*「▰▰▰▰▱▱▱▱▱▱」*",
        "*「▰▰▰▰▰▱▱▱▱▱」*",
        "*「▰▰▰▰▰▰▱▱▱▱」*",
        "*「▰▰▰▰▰▰▰▱▱▱」*",
        "*「▰▰▰▰▰▰▰▰▱▱」*",
        "*「▰▰▰▰▰▰▰▰▰▱」*",
        "*「▰▰▰▰▰▰▰▰▰▰」*",
      ];

      const loadingMessageCount = loadingMessages.length;
      let currentMessageIndex = 0;

      const { key } = await bot.sendMessage(m.from, { text: loadingMessages[currentMessageIndex] }, { quoted: m });

      const loadingInterval = setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessageCount;
        bot.sendMessage(m.from, { text: loadingMessages[currentMessageIndex] }, { quoted: m, messageId: key });
      }, 500);

      const media = await m.quoted.download();
      if (!media) throw new Error('Failed to download media.');

      const fileSizeMB = media.length / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        clearInterval(loadingInterval);
        return m.reply(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
      }
      const mediaUrl = await uploadMedia(media);

      clearInterval(loadingInterval);
      await bot.sendMessage(m.from, { text: '✅ Loading complete.' }, { quoted: m });

      const mediaType = getMediaType(m.quoted.mtype);
      if (mediaType === 'audio') {
        const message = {
          text: `*Hey ${m.pushName} Here Is Your Audio URL*\n*Url:* ${mediaUrl}`,
        };
        await bot.sendMessage(m.from, message, { quoted: m });
      } else {
        const message = {
          [mediaType]: { url: mediaUrl },
          caption: `*Hey ${m.pushName} Here Is Your Media*\n*Url:* ${mediaUrl}`,
        };
        await bot.sendMessage(m.from, message, { quoted: m });
      }

    } catch (error) {
      console.error('Error processing media:', error);
      m.reply('Error processing media.');
    }
  }
};
