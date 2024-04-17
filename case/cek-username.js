const { react } = require("../utils/reaction");
const axios = require("axios");
require("../conf")

const reply = async (sock, msg, text) => {
  await sock.sendMessage(msg.key.remoteJid, { text: text }, { quoted: msg });
};

function getUserFF(idPlayer, socket, msg) {
  const requestData = {
    game: "freefire",
    id: "1685084111",
    apikey: "",
  };
}

module.exports = { getUserFF };
