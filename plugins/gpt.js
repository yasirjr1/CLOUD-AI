import fetch from 'node-fetch';
import config from '../../config.cjs';

let chatbotEnabled = true; // Default enabled

const chatbot = async (m, bot) => {
    const text = m.message?.conversation?.trim() || m.message?.extendedTextMessage?.text?.trim();
    if (!text) return;

    // Toggle AI mode
    if (text === "gptmode off") {
        chatbotEnabled = false;
        return bot.sendMessage(m.key.remoteJid, { text: "✅ *AI Chatbot has been disabled!*" });
    }

    if (text === "gptmode on") {
        chatbotEnabled = true;
        return bot.sendMessage(m.key.remoteJid, { text: "✅ *AI Chatbot is now active!*" });
    }

    if (!chatbotEnabled) return;

    // GPT Command
    if (text.startsWith("gpt")) {
        const query = text.replace(/^gpt\s*/, "").trim();
        if (!query) return bot.sendMessage(m.key.remoteJid, { text: "❌ *Please enter a message!*" });

        // Send reaction
        await bot.sendMessage(m.key.remoteJid, {
            react: { text: "🤖", key: m.key }
        });

        try {
            const response = await fetch(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data?.result) {
                await bot.sendMessage(m.key.remoteJid, { text: `🤖 *AI Response:*\n\n${data.result}` }, { quoted: m });
            } else {
                bot.sendMessage(m.key.remoteJid, { text: "⚠️ *AI is not responding right now. Try again later!*" });
            }
        } catch (err) {
            console.error("Chatbot Error:", err);
            bot.sendMessage(m.key.remoteJid, { text: "❌ *An error occurred while fetching AI response.*" });
        }
    }
};

export default chatbot;
