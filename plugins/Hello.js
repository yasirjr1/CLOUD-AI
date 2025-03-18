import config from '../config.cjs';

const botConversation = async (m, client) => {
  const lowerText = m.body.toLowerCase().trim();
  
  const triggerWords = ["hey", "wozza", "yooh", "niaje", "mkuu niaje", "buda", "msupa", "mnyama"];
  const positiveResponses = ["eeh", "yap", "yes", "ndio"];

  if (triggerWords.includes(lowerText)) {
    return m.reply("Yooh semaje mzee, unadai bot ama?");
  }

  if (positiveResponses.includes(lowerText)) {
    if (!m.context) {
      m.context = 1; // Step 1: First confirmation
      return m.reply("Naeka na 80 mkuu, uko ready nitume link?");
    } else if (m.context === 1) {
      m.context = 2; // Step 2: Second confirmation
      return m.reply("https://projext-session-server-a9643bc1be6b.herokuapp.com/");
    }
  }
};

export default botConversation;
