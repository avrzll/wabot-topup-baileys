async function react(msg, socket, reaction) {
  const reactionMessage = {
    react: {
      text: reaction, // use an empty string to remove the reaction
      key: msg.key,
    },
  };
  await socket.sendMessage(msg.key.remoteJid, reactionMessage);
}

module.exports = { react };
