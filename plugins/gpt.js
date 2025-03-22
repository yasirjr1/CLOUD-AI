import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const chatHistoryFile = path.resolve(__dirname, '../deepseek_history.json');
const gptStatusFile = path.resolve(__dirname, '../gpt_status.json');

const deepSeekSystemPrompt = "You are an intelligent AI assistant.";

// Function to read GPT status
async function readGptStatus() {
    try {
        const data = await fs.readFile(gptStatusFile, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return { enabled: true }; // Default: GPT is ON
    }
}

// Function to write GPT status
async function writeGptStatus(status) {
    try {
        await fs.writeFile(gptStatusFile, JSON.stringify({ enabled: status }, null, 2));
    } catch (err) {
        console.error('Error writing GPT status to file:', err);
    }
}

// Function to read chat history
async function readChatHistoryFromFile() {
    try {
        const data = await fs.readFile(chatHistoryFile, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// Function to write chat history
async function writeChatHistoryToFile(chatHistory) {
    try {
        await fs.writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    } catch (err) {
        console.error('Error writing chat history to file:', err);
    }
}

// Function to update chat history
async function updateChatHistory(chatHistory, sender, message) {
    if (!chatHistory[sender]) {
        chatHistory[sender] = [];
    }
    chatHistory[sender].push(message);
    if (chatHistory[sender].length > 20) {
        chatHistory[sender].shift();
    }
    await writeChatHistoryToFile(chatHistory);
}

// Function to delete chat history
async function deleteChatHistory(chatHistory, userId) {
    delete chatHistory[userId];
    await writeChatHistoryToFile(chatHistory);
}

// GPT Command Handler
const deepseek = async (m, Matrix) => {
    const chatHistory = await readChatHistoryFromFile();
    const gptStatus = await readGptStatus();
    const text = m.body.trim().toLowerCase();

    // Toggle GPT On/Off
    if (text === "gpt on") {
        await writeGptStatus(true);
        await Matrix.sendMessage(m.from, { text: "✅ GPT Mode has been *activated*." }, { quoted: m });
        return;
    }

    if (text === "gpt off") {
        await writeGptStatus(false);
        await Matrix.sendMessage(m.from, { text: "❌ GPT Mode has been *deactivated*." }, { quoted: m });
        return;
    }

    if (!gptStatus.enabled) {
        return; // Stop responding if GPT is off
    }

    if (text === "gpt") {
        await Matrix.sendMessage(m.from, { text: 'Please provide a prompt.' }, { quoted: m });
        return;
    }

    if (text === "/forget") {
        await deleteChatHistory(chatHistory, m.sender);
        await Matrix.sendMessage(m.from, { text: 'Conversation deleted successfully' }, { quoted: m });
        return;
    }

    const prompt = m.body.trim();

    try {
        const senderChatHistory = chatHistory[m.sender] || [];
        const messages = [
            { role: "system", content: deepSeekSystemPrompt },
            ...senderChatHistory,
            { role: "user", content: prompt }
        ];

        await m.React("💻");

        // ✅ Updated API Endpoint
        const apiUrl = `https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(prompt)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const answer = responseData.data;

        await updateChatHistory(chatHistory, m.sender, { role: "user", content: prompt });
        await updateChatHistory(chatHistory, m.sender, { role: "assistant", content: answer });

        const codeMatch = answer.match(/```([\s\S]*?)```/);

        if (codeMatch) {
            const code = codeMatch[1];

            await Matrix.sendMessage(m.from, { text: `🔹 *Here's your code snippet:* \n\n\`\`\`${code}\`\`\`` }, { quoted: m });
        } else {
            await Matrix.sendMessage(m.from, { text: answer }, { quoted: m });
        }

        await m.React("✅");
    } catch (err) {
        await Matrix.sendMessage(m.from, { text: "Something went wrong, please try again." }, { quoted: m });
        console.error('Error fetching response from DeepSeek API:', err);
        await m.React("❌");
    }
};

export default deepseek;
