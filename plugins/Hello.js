const handleShengChat = async (message, client) => {
  const cmd = message.body.trim().toLowerCase();

  // Trigger word
  const trigger = atob('aGV5'); // "hey"

  // Random Sheng responses
  const shengReplies = [
    atob('d296emE='), // "wozza"
    atob('eW9vaA=='), // "yooh"
    atob('bmlhamU='), // "niaje"
    atob('YWthIHN0YW5zIG1rYSA/'), // "aka stans mka ?"
    atob('bXplZSBib3JhaSBhYnUgbWVkaA=='), // "mzee borai abu medh"
    atob('d2hhdHVkbw=='), // "whatudo"
    atob('bmtzIHNob3J0IHNhbmlrYQ=='), // "nks short sanika"
    atob('dGhlIGJveSBmcm9tIGRvd24gYXJlYQ=='), // "the boy from down area"
  ];

  // Step 1: If user says "hey", reply with random Sheng greeting
  if (cmd === trigger) {
    const reply = shengReplies[Math.floor(Math.random() * shengReplies.length)];
    client.sendMessage(message.from, { text: reply });

    // Store the chat state
    client.tempState = { step: 1, user: message.from };
    return;
  }

  // Step 2: If user replies, continue Sheng chat with another random phrase
  if (client.tempState?.step === 1 && client.tempState.user === message.from) {
    const reply = shengReplies[Math.floor(Math.random() * shengReplies.length)];
    client.sendMessage(message.from, { text: reply });

    // Keep chat going for fun
    client.tempState.step = 2;
    return;
  }

  // Step 3: If user keeps chatting, mix it up
  if (client.tempState?.step === 2 && client.tempState.user === message.from) {
    const reply = shengReplies[Math.floor(Math.random() * shengReplies.length)];
    client.sendMessage(message.from, { text: reply });

    // Reset after 3 responses
    delete client.tempState;
  }
};

export default handleShengChat;
