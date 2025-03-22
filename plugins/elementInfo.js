import fetch from 'node-fetch';
import config from '../config.cjs';

export const elementInfo = async (context) => {
  const { client, m, text } = context;

  // No-prefix trigger words
  const triggerWords = ['element', 'ele'];
  if (!triggerWords.includes(text.toLowerCase())) return;

  if (!text) {
    return m.reply("❌ Please provide an element name or symbol.");
  }

  try {
    const response = await fetch(`https://api.popcat.xyz/periodic-table?element=${text}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const message = `*⚛️ Element Information:*\n\n` +
      `     • *Name:* ${data.name}\n` +
      `     • *Symbol:* ${data.symbol}\n` +
      `     • *Atomic Number:* ${data.atomic_number}\n` +
      `     • *Atomic Mass:* ${data.atomic_mass}\n` +
      `     • *Period:* ${data.period}\n` +
      `     • *Phase:* ${data.phase}\n` +
      `     • *Discovered By:* ${data.discovered_by}\n` +
      `     • *Summary:* ${data.summary}`;

    await client.sendMessage(m.chat, { image: { url: data.image }, caption: message });

  } catch (error) {
    console.error("Error fetching element data:", error);
    return m.reply("❌ An error occurred while fetching element details.");
  }
};
