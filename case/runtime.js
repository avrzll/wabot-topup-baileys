module.exports = async function (msg, sock) {
  async function reply(text) {
    await sock.sendMessage(msg.key.remoteJid, { text: text }, { quoted: msg });
  }

  let uptime = process.uptime();
  let second = JSON.stringify(Math.round(uptime));

  let day = Math.floor(second / 86400); // 86400 detik dalam satu hari
  let secondAfterDay = second % 86400;
  let hours = Math.floor(secondAfterDay / 3600);
  let secondAfterHours = secondAfterDay % 3600;
  let minutes = Math.floor(secondAfterHours / 60);
  let seconds = secondAfterHours % 60;

  reply(`
☀ ${day} Hari 
⏰ ${hours} Jam 
🕔 ${minutes} Menit 
⏱️ ${seconds} Detik`);
};
