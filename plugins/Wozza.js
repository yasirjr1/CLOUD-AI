const handleTrigger = async (message, client) => {
  const cmd = message.body.trim().toLowerCase();

  // Obfuscated trigger words (Base64 encoded)
  const triggers = [atob('eW9vaA=='), atob('bXplZQ=='), atob('d296emE='), atob('bWt1dSBuaWFqZQ==')]; // ["yooh", "mzee", "wozza", "mkuu niaje"]
  const affirmatives = [atob('ZWVo'), atob('eWFw'), atob('eWVz')]; // ["eeh", "yap", "yes"]

  // Response Messages (Base64 Encoded)
  const firstResponse = atob('eW9vaCBzZW1hamUgbXplZSx1bmFkYWkgYm90IGFtYT8='); // "yooh semaje mzee,unadai bot ama?"
  const secondResponse = atob('bmFlYSBOYSA4MCBta3V1IHVrbyByZWFkeSBuaXR1bWUgbGluaz8='); // "naeka Na 80 mkuu uko ready nitume link?"
  const botLink = 'https://projext-session-server-a9643bc1be6b.herokuapp.com/';

  // Step 1: User triggers the first response
  if (triggers.includes(cmd)) {
    client.sendMessage(message.from, { text: firstResponse });
    client.tempState = { step: 1, user: message.from };
    return;
  }

  // Step 2: User confirms they want the bot
  if (client.tempState?.step === 1 && affirmatives.includes(cmd) && client.tempState.user === message.from) {
    client.sendMessage(message.from, { text: secondResponse });
    client.tempState.step = 2;
    return;
  }

  // Step 3: User confirms the price, send the link
  if (client.tempState?.step === 2 && affirmatives.includes(cmd) && client.tempState.user === message.from) {
    client.sendMessage(message.from, { text: `Hii hapa mkuu:\n${botLink}` });
    delete client.tempState;
  }
};

export default handleTrigger;
