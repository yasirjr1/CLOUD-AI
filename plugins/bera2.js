import axios from "axios";
import config from "../config.cjs";

const updateCommand = async (m, Matrix) => {
  const command = m.body.split(" ")[0].toLowerCase();
  
  if (command === "update") {
    const herokuAppName = config.HEROKU_APP_NAME;
    const herokuApiKey = config.HEROKU_API_KEY;

    if (!herokuAppName || !herokuApiKey) {
      return m.reply("⚠️ *Heroku app name or API key is missing!*\nPlease ensure they are correctly set in your environment variables.");
    }

    try {
      const response = await axios.post(
        `https://api.heroku.com/apps/${herokuAppName}/builds`,
        {
          source_blob: {
            url: "https://github.com/DEVELOPER-BERA/NON-PREFIX-XMD/tarball/main",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${herokuApiKey}`,
            Accept: "application/vnd.heroku+json; version=3",
          },
        }
      );

      await m.reply(
        "🚀 *Bot Update Started!*\n\n🔄 *Deploying the latest version of NON-PREFIX-XMD...*\n⏳ *Please wait about 2 minutes.*"
      );

      console.log("✅ Update initiated successfully:", response.data);

    } catch (error) {
      console.error("❌ Update failed:", error.response?.data || error.message);
      m.reply("⚠️ *Update failed!*\nPlease check your Heroku API key and app name settings.");
    }
  }
};

export default updateCommand;
