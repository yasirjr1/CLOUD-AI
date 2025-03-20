// plugins/gptPlugin.js

import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Define your GPT API endpoints (primary and fallbacks)
const GPT_APIS = [
  'https://api.dreaded.site/api/chatgpt?text=',
  'https://api.safone.me/chatgpt?query=',
  'https://api.ownthink.com/bot?appid=xiaosi&userid=user&spoken=' // fallback
];

// Define the file to store chat history (optional)
const gptHistoryFile = path.join(process.cwd(), 'gpt_chat_history.json');

// Read chat history from file (returns an object)
async function readGPTChatHistory() {
  try {
    const data = await fs.readFile(gptHistoryFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // Return empty history if file doesn't exist or can't be parsed
    return {};
  }
}

// Write chat history to file
async function writeGPTChatHistory(history) {
  try {
    await fs.writeFile(gptHistoryFile, JSON.stringify(history, null, 2));
  } catch (err) {
    console.error('Error writing GPT chat history:', err);
  }
}

// Update chat history for a specific sender with a new entry
async function updateGPTChatHistory(sender, role, content) {
  const history = await readGPTChatHistory();
  if (!history[sender]) history[sender] = [];
  history[sender].push({ role, content });
  // Limit to last 20 messages per sender
  if (history[sender].length > 20) {
    history[sender] = history[sender].slice(-20);
  }
  await writeGPTChatHistory(history);
}

// Call GPT API endpoints in order until one succeeds
async function fetchGPTResponse(prompt) {
  for (const api of GPT_APIS) {
    try {
      const url = api + encodeURIComponent(prompt);
      console.log(`Calling GPT API: ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();

      // Try to extract a response from known keys
      if (data?.result?.response) {
        return data.result.response;
      } else if (data?.data) {
        return data.data;
      } else if (data?.message) {
        return data.message;
      } else if (typeof data === 'string') {
        return data;
      }
    } catch (err) {
      console.error(`Error calling API ${api}:`, err);
    }
  }
  return 'All GPT APIs failed. Try again later.';
}

// The main plugin function – it will be called from your index.js messages handler
export default async function gptPlugin(chatUpdate, Matrix) {
  try {
    const m = chatUpdate.messages[0];
    if (!m?.message) return;
    // Skip status messages (broadcast, etc.)
    if (m.key.remoteJid === 'status@broadcast') return;

    // Extract text from message (from conversation, extended text, or captions)
    const messageContent =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      '';

    if (!messageContent) return;

    // Convert message content to lowercase for a case-insensitive check
    const lowerText = messageContent.trim().toLowerCase();
    if (!lowerText.startsWith('gpt')) return; // Only trigger if message starts with "gpt"

    // Remove the trigger word ("gpt") and trim the remaining prompt
    const prompt = messageContent.slice(3).trim();
    if (!prompt) {
      await Matrix.sendMessage(
        m.key.remoteJid,
        { text: 'Please provide a prompt after "gpt".' },
        { quoted: m }
      );
      return;
    }

    // Optionally update chat history with the user's prompt
    await updateGPTChatHistory(m.key.remoteJid, 'user', prompt);

    // React with an hourglass emoji to indicate processing
    try {
      await Matrix.sendMessage(m.key.remoteJid, {
        react: { text: '⏳', key: m.key }
      });
    } catch (err) {
      console.error('Error sending reaction:', err);
    }

    // Fetch the GPT response using the provided prompt
    const aiResponse = await fetchGPTResponse(prompt);

    // Optionally save the assistant's response to chat history
    await updateGPTChatHistory(m.key.remoteJid, 'assistant', aiResponse);

    // Send the GPT response back to the chat
    await Matrix.sendMessage(
      m.key.remoteJid,
      { text: aiResponse },
      { quoted: m }
    );

    // React with a check mark emoji to indicate completion
    try {
      await Matrix.sendMessage(m.key.remoteJid, {
        react: { text: '✅', key: m.key }
      });
    } catch (err) {
      console.error('Error sending reaction:', err);
    }
  } catch (err) {
    console.error('Error in GPT plugin:', err);
  }
}
