import { promises as fs } from "fs";
import path from "path";
import fetch from "node-fetch";
import { generateWAMessageFromContent, proto } from "@whiskeysockets/baileys";
import config from "../../config.cjs";

// File paths
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const chatHistoryFile = path.resolve(__dirname, "../mistral_history.json");

// Function to read chat history
async function readChatHistory() {
  try {
    const data = await fs.readFile(chatHistoryFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {}; // Return empty object if file doesn't exist
  }
}

// Function to write chat history
async function writeChatHistory(data) {
  try {
    await fs.writeFile(chatHistoryFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing chat history:", error);
  }
}

// Function to update chat history
async function updateChatHistory(history, user, message) {
  if (!history[user]) history[user] = [];
  history[user].push(message);
  if (history[user].length > 20) history[user].shift(); // Keep max 20 messages
  await writeChatHistory(history);
}

// Function to delete chat history
async function deleteChatHistory(history, user) {
  delete history[user];
  await writeChatHistory(history);
}

// AI Chatbot function
const gptChat = async (message, bot) => {
  const chatHistory = await readChatHistory();
  const text = message.body.toLowerCase();

  // Handle "/forget" command
  if (text === "/forget") {
    await deleteChatHistory(chatHistory, message.sender);
    await bot.sendMessage(message.from, { text: "🗑️ Chat history deleted successfully." }, { quoted: message });
    return;
  }

  // Supported trigger words
  const triggerWords = ["gpt", "ai", "bera"];
  const [command, ...args] = text.split(" ");
  const query = args.join(" ").trim();

  if (triggerWords.includes(command.toLowerCase())) {
    if (!query) {
      await bot.sendMessage(message.from, { text: "❌ Please provide a prompt!" }, { quoted: message });
      return;
    }

    try {
      // Prepare chat context
      const previousMessages = chatHistory[message.sender] || [];
      const conversation = [
        { role: "system", content: "You are a helpful AI assistant." },
        ...previousMessages,
        { role: "user", content: query }
      ];

      await message.React("🧠"); // React with brain emoji

      // API Call to MatrixCoder AI
      const response = await fetch("https://matrixcoder.tech/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text-generation",
          model: "hf/meta-llama/meta-llama-3-8b-instruct",
          messages: conversation
        })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const reply = data.result.response;

      // Save chat history
      await updateChatHistory(chatHistory, message.sender, { role: "user", content: query });
      await updateChatHistory(chatHistory, message.sender, { role: "assistant", content: reply });

      // Detect Code Block
      const codeBlockMatch = reply.match(/```([\s\S]*?)```/);
      if (codeBlockMatch) {
        const codeContent = codeBlockMatch[1];
        let msg = generateWAMessageFromContent(message.from, {
          viewOnceMessage: {
            message: {
              messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({ text: reply }),
                footer: proto.Message.InteractiveMessage.Footer.create({ text: "> 🤖 Powered by BERA AI" }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: [
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "📋 Copy Code",
                        id: "copy_code",
                        copy_code: codeContent
                      })
                    }
                  ]
                })
              })
            }
          }
        }, {});

        await bot.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
      } else {
        await bot.sendMessage(message.from, { text: reply }, { quoted: message });
      }

      await message.React("✅"); // React with checkmark emoji
    } catch (error) {
      await bot.sendMessage(message.from, { text: "❌ Something went wrong!" }, { quoted: message });
      console.error("GPT Error:", error);
      await message.React("❌");
    }
  }
};

export default gptChat;
