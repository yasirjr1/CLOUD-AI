const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "Your Session Id",
  MODE: process.env.MODE || "public",
  OWNER_NAME: process.env.OWNER_NAME || "BRUCE BERA",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254743982206",

  // 🌐 Heroku Deployment Keys
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",

  // 🚀 Bot Auto Features
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN === 'true',
  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY === 'true',
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || '',
  AUTO_DL: process.env.AUTO_DL === 'true',
  AUTO_READ: process.env.AUTO_READ === 'true',
  AUTO_TYPING: process.env.AUTO_TYPING === 'true',
  AUTO_RECORDING: process.env.AUTO_RECORDING === 'true',
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'true',
  AUTO_REACT: process.env.AUTO_REACT === 'true',
  AUTO_BLOCK: process.env.AUTO_BLOCK === 'true',
  REJECT_CALL: process.env.REJECT_CALL === 'true',
  NOT_ALLOW: process.env.NOT_ALLOW === 'true',

  // 🛡 Security Settings
  
  // 🔥 Auto Bio with Juice WRLD Quotes
  AUTO_BIO: process.env.AUTO_BIO === 'true',
  BIO_QUOTES: [
    "I still see your shadows in my room...",
    "You left me falling and landing inside my grave...",
    "I know that the truth is hard to digest...",
    "We ain't making it past 21...",
    "I'm a jealous boy, I really feel like John Lennon...",
    "Took a pill in Ibiza to show Avicii I was cool..."
  ],

  // 🤖 AI Integration
  GEMINI_KEY: process.env.GEMINI_KEY || "",

  // 🎨 Default Profile Picture
  defaultProfilePicture: "https://files.catbox.moe/6c2p2w.jpg"
};

// Export Config
module.exports = config;
