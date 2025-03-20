import fetch from 'node-fetch';
import config from '../../config.cjs';

const gptCommand = async (message, client) => {
    const userMessage = message.body.toLowerCase();
    const triggerWords = ["gpt", "ai", "bera"]; // Trigger words without prefix

    if (!triggerWords.some(word => userMessage.startsWith(word))) return;

    const query = userMessage.replace(/^(gpt|ai|bera)\s+/i, '').trim();
    if (!query) {
        await client.sendMessage(message.from, { text: "Please provide a prompt. Example: `gpt What's the meaning of life?`" }, { quoted: message });
        return;
    }

    try {
        const response = await fetch(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        // Ensure the response contains a valid text output
        let aiResponse = data.result;
        if (!aiResponse || typeof aiResponse !== 'string') {
            throw new Error("Invalid API response format");
        }

        // Send AI response to the user
        await client.sendMessage(message.from, { text: `🤖 *AI Response:*\n\n${aiResponse.trim()}` }, { quoted: message });
    } catch (error) {
        await client.sendMessage(message.from, { text: "❌ Failed to fetch response. Try again later!" }, { quoted: message });
        console.error("GPT Error:", error);
    }
};

export default gptCommand;
