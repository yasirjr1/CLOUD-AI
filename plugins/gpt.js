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
    const botUser = Matrix.user.id.replace(/[^0-9]/g, ""); // Normalize bot's ID
    const sender = m.sender.replace(/[^0-9]/g, ""); // Normalize sender's ID

    console.log(`Bot User ID: ${botUser}`);
    console.log(`Sender ID: ${sender}`);

    return sender === botUser;
}

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

// GPT Command Handler
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
};

export default deepseek;
