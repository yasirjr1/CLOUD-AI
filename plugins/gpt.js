import fetch from 'node-fetch';
import config from '../../config.cjs';

const gpt = async (message, client) => {
  const text = message.body.trim().toLowerCase();

  if (!text.startsWith('gpt')) return;
  
  const query = text.replace(/^gpt\s*/, "").trim();
  if (!query) return message.reply("❌ *Please provide a prompt!*");

  await message.React('⏳');

  const gptAPIs = [
    `https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(query)}`,
    `https://someotherfreeapi.com/chat?query=${encodeURIComponent(query)}`,
    `https://anotherbackupapi.com/ask?prompt=${encodeURIComponent(query)}`
  ];

  let responseText = "❌ *Failed to fetch response, try again!*";

  for (const apiUrl of gptAPIs) {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data && data.response) {
        responseText = data.response;
        break; // Stop trying once a valid response is received
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  await client.sendMessage(message.from, { text: `🤖 *AI Response:*\n\n${responseText}` }, { quoted: message });
};

export default gpt;
