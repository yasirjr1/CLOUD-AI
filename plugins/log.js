
import axios from 'axios';
import config from '../../config.cjs';

const LogoCmd = async (message, bot) => {
  const userName = message.pushName || "User";
  const text = message.body.trim().toLowerCase(); // Convert message text to lowercase

  const sendMessage = async (text) => {
    await bot.sendMessage(message.from, { text }, { quoted: message });
  };

  // Logo styles API list
  const logoStyles = {
    logo: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=",
    blackpink: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html&name=",
    glossysilver: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html&name=",
    naruto: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html&name=",
    digitalglitch: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html&name=",
    pixelglitch: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html&name=",
    water: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-water-effect-text-online-295.html&name=",
    thunder: "https://api-pink-venom.vercel.app/api/logo?url=https://textpro.me/online-thunder-text-effect-generator-1031.html&name=",
    graffiti: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/graffiti-color-199.html&name=",
    hacker: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html&name=",
    sand: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html&name=",
    galaxy: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/galaxy-text-effect-new-258.html&name=",
    horror: "https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/writing-horror-letters-on-metal-plates-265.html&name=",
  };

  // Check if the text matches any logo style
  const [logoType, ...userTextArray] = text.split(" ");
  const userInput = userTextArray.join(" ").trim();

  if (logoStyles[logoType]) {
    if (!userInput) {
      await sendMessage("⚠️ Please provide text to generate a logo!");
      return;
    }

    try {
      await bot.sendMessage(message.from, { react: { text: '⏳', key: message.key } });

      const apiUrl = logoStyles[logoType] + encodeURIComponent(userInput);
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.status && data.result && data.result.download_url) {
        const imageUrl = data.result.download_url;
        await bot.sendMessage(message.from, { image: { url: imageUrl }, caption: "Here is your logo!" }, { quoted: message });

        await bot.sendMessage(message.from, { react: { text: '✅', key: message.key } });
      } else {
        await sendMessage("⚠️ Failed to generate the logo. Please try again later!");
      }
    } catch (error) {
      console.error(error);
      await sendMessage("⚠️ An error occurred while generating the logo. Please try again later!");
    }
  }
};

export default LogoCmd;