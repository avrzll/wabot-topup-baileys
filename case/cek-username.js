const { react } = require("../utils/reaction");
const axios = require("axios");
require("../conf");

const getUserFF = async (idPlayer, sock, m) => {
  const reply = async (text) => {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  };

  react(m, sock, "🕒");

  const requestData = {
    game: "freefire",
    id: idPlayer,
    apikey: global.velixs,
  };

  try {
    axios
      .post("https://api.velixs.com/idgames-checker", requestData)
      .then(async (response) => {
        if (response.status) {
          const username = response.data.data.username;
          await react(m, sock, "✅");
          await reply(username);
        }
      })
      .catch(async () => {
        await react(m, sock, "❌");
        await reply("Username tidak ditemukan !");
      });
  } catch (e) {
    await react(m, sock, "❌");
    await reply(e.toString());
  }
};

module.exports = { getUserFF };
