import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent } = pkg;
import axios from 'axios';

const handleRepoCommand = async (m, Matrix) => {
  try {
    // Fetch Repository Info
    const repoLink = 'https://github.com/DEVELOPER-BRUCE/NON-PREFIX-XMD';
    const repoOwner = 'BRUCE BERA';
    const repoName = 'BERA TECH';

    const repoData = {
      stars: 690,
      forks: 6676,
      watchers: 690,
      openIssues: 28,
    };

    const fetchedDate = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Styled Repository Message
    const messageText = `🌍 *${repoName} REPO INFO* 🌟\n\n` +
      `💡 *Name:* ${repoName}\n` +
      `⭐ *Stars:* ${repoData.stars}\n` +
      `🍴 *Forks:* ${repoData.forks}\n` +
      `👀 *Watchers:* ${repoData.watchers}\n` +
      `❗ *Open Issues:* ${repoData.openIssues}\n` +
      `👤 *Owner:* ${repoOwner}\n\n` +
      `🕒 *Fetched on:* ${fetchedDate}\n\n` +
      `🔗 *Repo Link:* ${repoLink}\n\n` +
      `🛠️ Scripted by *${repoOwner}*\n\n` +
      `Stay connected and follow my updates!`;

    // Send the styled message
    await Matrix.sendMessage(m.from, { text: messageText }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error('Error processing your request:', error);
    m.reply('ʀᴇɢᴀʀᴅs ʙʀᴜᴄᴇ ʙᴇʀᴀ');
    await m.react('🥲');
  }
};

const searchRepo = async (m, Matrix) => {
  // Check if the message is exactly "repo" (case-insensitive)
  if (m.body.trim().toLowerCase() === "repo") {
    await handleRepoCommand(m, Matrix);
  }
};

export default searchRepo;
