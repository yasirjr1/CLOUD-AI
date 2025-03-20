const mistral = async (_0x194111, _0x26ee37) => {
  const _0x2dd4e3 = await readChatHistoryFromFile();
  const _0x276e78 = _0x194111.body.trim().toLowerCase();

  if (_0x276e78 === "/forget") {
    await deleteChatHistory(_0x2dd4e3, _0x194111.sender);
    await _0x26ee37.sendMessage(_0x194111.from, {
      text: "🗑️ Conversation deleted successfully."
    }, { quoted: _0x194111 });
    return;
  }

  // Extract first word as the command
  const words = _0x276e78.split(" ");
  const command = words[0]; 
  const userQuery = words.slice(1).join(" "); // Remaining message

  // Allowed trigger words (regardless of case)
  const validCommands = ["gpt", "ai", "bera"];

  if (validCommands.includes(command)) {
    if (!userQuery) {
      await _0x26ee37.sendMessage(_0x194111.from, {
        text: "❗ Please provide a prompt.\nExample: *gpt What is AI?*"
      }, { quoted: _0x194111 });
      return;
    }

    try {
      const chatHistory = _0x2dd4e3[_0x194111.sender] || [];
      const conversation = [
        { role: "system", content: "You are a highly intelligent and helpful assistant." },
        ...chatHistory,
        { role: "user", content: userQuery }
      ];

      await _0x194111.React("🤖"); // React with a bot emoji

      const response = await fetch("https://matrixcoder.tech/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text-generation",
          model: "hf/meta-llama/meta-llama-3-8b-instruct",
          messages: conversation
        })
      });

      if (!response.ok) throw new Error("HTTP error: " + response.status);

      const data = await response.json();
      const botReply = data.result.response;

      // Update chat history
      await updateChatHistory(_0x2dd4e3, _0x194111.sender, { role: "user", content: userQuery });
      await updateChatHistory(_0x2dd4e3, _0x194111.sender, { role: "assistant", content: botReply });

      // Send response
      await _0x26ee37.sendMessage(_0x194111.from, { text: botReply }, { quoted: _0x194111 });

      await _0x194111.React("✅"); // React with a success emoji
    } catch (error) {
      console.error("Error:", error);
      await _0x26ee37.sendMessage(_0x194111.from, {
        text: "⚠️ Something went wrong. Try again later."
      }, { quoted: _0x194111 });

      await _0x194111.React("❌");
    }
  }
};

export default mistral;
