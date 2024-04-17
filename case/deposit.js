const fs = require("fs");

module.exports = deposit = async (
  noHp,
  nominal,
  m,
  sock,
  pino,
  downloadMediaMessage
) => {
  const pesan = `
===== DEPO REQUEST =====

❍ No HP : ${noHp}
❍ Nominal Depo : Rp. ${nominal}

Segera diproses yaa..
Bukti tf terlampir.

Salin pesan diatas dan hilangkan double slice nya (//)
`;

  const pesan2 = `
//tambahsaldo ${noHp} ${nominal}
`;

  const buffer = await downloadMediaMessage(m, "buffer", {}, { logger: pino });
  fs.writeFileSync("./image.png", buffer);
  await sock.sendMessage("6285174422041@s.whatsapp.net", {
    image: { url: "./image.png" },
    mimetype: "image/png",
    contextInfo: { forwardingScore: 999, isForwarded: true },
  });
  await sock.sendMessage("6285174422041@s.whatsapp.net", {
    text: pesan2,
    contextInfo: { forwardingScore: 999, isForwarded: true },
  });
  await sock.sendMessage("6285174422041@s.whatsapp.net", {
    text: pesan,
    contextInfo: { forwardingScore: 999, isForwarded: true },
  });
};
