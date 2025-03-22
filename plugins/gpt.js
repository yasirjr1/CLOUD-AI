import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const chatHistoryFile = path.resolve(__dirname, '../deepseek_history.json');
const gptStatusFile = path.resolve(__dirname, '../gpt_status.json');

const deepSeekSystemPrompt = "You are an intelligent AI assistant.";

// ✅ Function to check if sender is the bot owner
async function isOwner(m, Matrix) {
    console.log("🔹 Matrix.user.id:", Matrix.user.id);
    console.log("🔹 m.sender:", m.sender);

    const botUser = Matrix.user.id.split(":")[0].replace(/\D/g, ""); // Normalize bot's ID
    const sender = m.sender.split(":")[0].replace(/\D/g, ""); // Normalize sender's ID

    console.log("✅ Processed Bot User ID:", botUser);
    console.log("✅ Processed Sender ID:", sender);

    return sender === botUser;
}

// ✅ Read GPT status
async function readGptStatus() {
    try {
        const data = await fs.readFile(gptStatusFile, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return { enabled: true }; // Default: GPT is ON
    }
}

// ✅ Write GPT status
async function writeGptStatus(status) {
    try {
        await fs.writeFile(gptStatusFile, JSON.stringify({ enabled: status }, null, 2));
    } catch (err) {
        console.error('❌ Error writing GPT status:', err);
    }
}

// ✅ GPT Command Handler
const deepseek = async (m, Matrix) => {
    const gptStatus = await readGptStatus();
    const text = m.body.trim().toLowerCase();

    // ✅ **Owner-Only GPT Toggle**
    if (text === "gpt on" || text === "gpt off") {
        if (!(await isOwner(m, Matrix))) {
            await Matrix.sendMessage(m.from, { text: "❌ *Permission Denied!* Only the *bot owner* can toggle GPT mode." }, { quoted: m });
            return;
        }

        const newStatus = text === "gpt on";
        await writeGptStatus(newStatus);
        await Matrix.sendMessage(m.from, { text: `✅ GPT Mode has been *${newStatus ? "activated" : "deactivated"}*.` }, { quoted: m });
        return;
    }

    if (!gptStatus.enabled) {
        return; // Stop responding if GPT is off
    }

    if (text === "gpt") {
        await Matrix.sendMessage(m.from, { text: 'Please provide a prompt.' }, { quoted: m });
        return;
    }

    const prompt = m.body.trim();
    try {
        await m.React("💻");

        // ✅ Updated API Endpoint
        const apiUrl = `https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(prompt)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const answer = responseData.data;

        await Matrix.sendMessage(m.from, { text: answer }, { quoted: m });

        await m.React("✅");
    } catch (err) {
        await Matrix.sendMessage(m.from, { text: "Something went wrong, please try again." }, { quoted: m });
        console.error('Error fetching response:', err);
        await m.React("❌");
    }
};

export default deepseek;
