import fetch from 'node-fetch';
import config from '../../config.cjs';

let chatbotEnabled = true; // Default enabled

const chatbot = async (m, bot) => {
    const text = m.body.trim();
    
    if (text === "gptmode off") {
        chatbotEnabled = false;
        return m.reply("✅ *AI Chatbot has been disabled!*");
    }
    
    if (text === "gptmode on") {
        chatbotEnabled = true;
        return m.reply("✅ *AI Chatbot is now active!*");
    }
    
    if (!chatbotEnabled) return;

    if (text.startsWith("gpt")) {
        const query = text.replace(/^gpt\s*/, "").trim();
        if (!query) return m.reply("❌ *Please enter a message!*");
        
        await m.React('🤖');

        try {
            const response = await fetch(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data && data.result) {
                await bot.sendMessage(m.from, { text: `🤖 *AI Response:*\n\n${data.result}` }, { quoted: m });
            } else {
                m.reply("⚠️ *AI is not responding right now. Try again later!*");
            }
        } catch (err) {
            console.error("Chatbot Error:", err);
            m.reply("❌ *An error occurred while fetching AI response.*");
        }
    }
};

export default chatbot;
