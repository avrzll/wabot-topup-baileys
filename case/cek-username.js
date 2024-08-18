const { react } = require("../utils/reaction");
const axios = require("axios");
require("../conf");

const getUserFF = async (idPlayer, sock, m) => {
  const reply = async (text) => {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  };

  react(m, sock, "🕒");

  const url = "https://api.velixs.com/idgames-checker";
  const body = {
    game: "freefire",
    id: idPlayer,
    apikey: global.velixs,
  };

  try {
    const response = await axios.post(url, body);
    // console.log(response.data);
    if (response.data.status) {
      const username = response.data.data.username;
      await react(m, sock, "✅");
      await reply(username);
    } else {
      await react(m, sock, "❌");
      await reply("Username tidak ditemukan !");
    }
  } catch (error) {
    console.error("Error:", error);
    await react(m, sock, "⚠️");
    await reply("Terdapat beberapa eror, cek log sistem ! " + error);
  }
};

const getUserML = async (player_id, zone_id, sock, m) => {
  const reply = async (text) => {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  };

  react(m, sock, "🕒");

  const url = "https://api.velixs.com/idgames-checker";
  const body = {
    game: "ml",
    id: player_id,
    zoneid: zone_id,
    apikey: global.velixs,
  };

  try {
    const response = await axios.post(url, body);
    // console.log(response.data);
    if (response.data.status) {
      const username = response.data.data.username;
      await react(m, sock, "✅");
      await reply(username);
    } else {
      await react(m, sock, "❌");
      await reply("Username tidak ditemukan !");
    }
  } catch (error) {
    console.error("Error:", error);
    await react(m, sock, "⚠️");
    await reply("Terdapat beberapa eror, cek log sistem ! " + error);
  }
};

module.exports = { getUserFF, getUserML };
