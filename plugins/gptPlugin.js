import axios from "axios";

const GPT_API_URL = "https://api.dreaded.site/api/chatgpt?text=";

const gptPlugin = async (chatUpdate, Matrix) => {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek.message || mek.key.fromMe) return;

        const messageText = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
        if (!messageText.toLowerCase().startsWith("gpt")) return;

        const query = messageText.substring(3).trim(); // Remove "gpt" trigger
        if (!query) {
            await Matrix.sendMessage(mek.key.remoteJid, { text: "Please provide a prompt after 'gpt'." });
            return;
        }

        // Force English response by modifying query
        const finalQuery = `Please respond in English: ${query}`;

        // Call GPT API
        const response = await axios.get(`${GPT_API_URL}${encodeURIComponent(finalQuery)}`);
        const replyText = response.data.result || "Sorry, I couldn't process that request.";

        await Matrix.sendMessage(mek.key.remoteJid, { text: replyText });
    } catch (error) {
        console.error("GPT Plugin Error:", error);
        await Matrix.sendMessage(chatUpdate.messages[0].key.remoteJid, {
            text: "⚠️ Error processing your request. Try again later."
        });
    }
};

export default gptPlugin;
