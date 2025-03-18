import config from '../config.cjs';

const botConversation = async (m, client) => {
  const lowerText = m.body.toLowerCase().trim();
  
  const triggerWords = ["mkuu", "wozza", "yooh", "niaje", "mkuu niaje", "buda", "mzee rada", "mnyama"];
  const positiveResponses = ["eeh", "yap", "yes"];
  const finalResponses = ["yes", "eeh", "yap mzee"];

  if (triggerWords.includes(lowerText)) {
    m.context = "awaitingConfirmation"; // Inaanza process ya confirmation
    return m.reply("Yooh semaje mzee, unadai bot ama?");
  }

  if (m.context === "awaitingConfirmation" && positiveResponses.includes(lowerText)) {
    m.context = "awaitingFinalConfirmation"; // Step 1: First confirmation
    return m.reply("Naeka na 80 mkuu, uko ready nitume link?");
  }

  if (m.context === "awaitingFinalConfirmation" && finalResponses.includes(lowerText)) {
    m.context = null; // Reset context after final step
    return m.reply("https://projext-session-server-a9643bc1be6b.herokuapp.com/");
  }
};

export default botConversation;
