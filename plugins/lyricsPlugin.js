import axios from "axios";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import mime from "mime-types";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Whisper API Key
const TEMP_DIR = "./temp_audio"; // Temporary folder for audio processing

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

async function transcribeAudio(filePath) {
  try {
    const audioData = fs.readFileSync(filePath);
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      { file: audioData, model: "whisper-1", language: "en" },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "multipart/form-data" } }
    );

    return response.data.text;
  } catch (error) {
    console.error("❌ Transcription Error:", error.response?.data || error.message);
    return null;
  }
}

async function processAudio(message, Matrix) {
  try {
    const audioMessage = message.message.audioMessage || message.message.videoMessage;
    if (!audioMessage) return;

    const buffer = await Matrix.downloadMediaMessage(message);
    const extension = mime.extension(audioMessage.mimetype);
    const fileName = `audio.${extension}`;
    const filePath = path.join(TEMP_DIR, fileName);
    const mp3Path = filePath.replace(extension, "mp3");

    fs.writeFileSync(filePath, buffer);

    // Convert to MP3 (if needed)
    if (extension !== "mp3") {
      await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .toFormat("mp3")
          .on("end", resolve)
          .on("error", reject)
          .save(mp3Path);
      });
      fs.unlinkSync(filePath);
    }

    // Transcribe the audio
    const lyrics = await transcribeAudio(mp3Path);
    fs.unlinkSync(mp3Path);

    return lyrics ? `🎶 *Generated Lyrics:*\n\n${lyrics}` : "❌ Could not generate lyrics.";
  } catch (error) {
    console.error("❌ Error processing audio:", error);
    return "❌ Failed to process the audio.";
  }
}

// WhatsApp Message Listener (Trigger: "to lyrics")
async function lyricsPlugin(chatUpdate, Matrix) {
  try {
    const message = chatUpdate.messages[0];
    if (!message || !message.message) return;

    const type = Object.keys(message.message)[0];
    const text = message.message.conversation || message.message.extendedTextMessage?.text || "";

    if (text.toLowerCase() === "to lyrics" && (type === "audioMessage" || type === "videoMessage")) {
      const reply = await processAudio(message, Matrix);
      await Matrix.sendMessage(message.key.remoteJid, { text: reply }, { quoted: message });
    }
  } catch (error) {
    console.error("❌ Lyrics Plugin Error:", error);
  }
}

export default lyricsPlugin;
