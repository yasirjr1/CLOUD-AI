import nodeFetch from 'node-fetch';
import config from '../../config.cjs';

const flirting = async (m, Matrix) => {
  try {
    const text = m.body.trim().toLowerCase();
    const validCommands = ['gpt3']; // ✅ Only respond to these words (non-prefix)

    if (!validCommands.includes(text)) return;

    const apiKey = config.API_KEY || 'your_api_key_here'; // ✅ Use API key from config.cjs
    const response = await nodeFetch(`https://api.siputzx.my.id/api/ai/deepseek-r1?content=${encodeURIComponent(text)}&apikey=${apiKey}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch GPT-3 response: ${await response.text()}`);
    }

    const json = await response.json();
    const result = json.result || "I couldn't generate a response. Try again!"; // ✅ Handle empty API responses

    await Matrix.sendMessage(m.from, { text: result, mentions: [m.sender] }, { quoted: m });
  } catch (error) {
    console.error('Error fetching GPT-3 response:', error);
    await Matrix.sendMessage(m.from, { text: "❌ *Error:* Could not retrieve a response. Try again later!" });
  }
};

export default flirting;
