const fs = require("fs");
const toRupiah = require("@develoka/angka-rupiah-js");
const moment = require("moment-timezone");
require("moment/locale/id");

const readFile = () => {
  try {
    const data = fs.readFileSync("database/saldo.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return { users: [] };
  }
};

module.exports = menu = async (m, sock) => {
  let saldo;
  let level;
  const id = m.key.remoteJid;

  const timezone = moment.tz("Asia/Jakarta");
  const formatJam = "HH:mm:ss";
  const jam = timezone.format(formatJam);

  let ucapan;

  if (jam >= "04:00:00" && jam < "12:00:00") {
    ucapan = "Selamat pagi 🌄";
  } else if (jam >= "12:00:00" && jam < "15:00:00") {
    ucapan = "Selamat siang 🌤️";
  } else if (jam >= "15:00:00" && jam < "18:00:00") {
    ucapan = "Selamat sore 🌇";
  } else if (jam >= "18:00:00" && jam < "24:00:00") {
    ucapan = "Selamat malam 🌃";
  } else {
    ucapan = "Jangan lupa istirahat 🛌";
  }

  try {
    const saldoData = readFile();
    // find usr
    const userIndex = saldoData.users.findIndex(
      (u) => u.id === id.split("@")[0]
    );
    if (userIndex >= 0) {
      saldo = JSON.stringify(saldoData.users[userIndex].saldo);
      level = saldoData.users[userIndex].level;

      const text = `
Halo ${m.pushName}, ${ucapan}
✦ *INFO MEMBER* ✦
: ̗̀➛ Saldo : ${toRupiah(saldo)}
: ̗̀➛ Id : ${id.split("@")[0]}
: ̗̀➛ Level : ${level}

Ⓞ Owner
Ⓡ Reseller
ⓜ Member

✦ *MENU TOP UP* ✦
: ̗̀➛ .ff \`id_ff\` \`jumlah_order\` Ⓞ
: ̗̀➛ .rff \`id_ff\` \`jumlah_order\` Ⓡ

✦ *TOOLS* ✦
: ̗̀➛ .cekff \`id_ff\` ⓜ
: ̗̀➛ .cekstatus \`id_transaksi\` ⓜ
: ̗̀➛ .ceksaldo ⓜ                         
: ̗̀➛ .tf \`id_tujuan\` \`nominal\` ⓜ
: ̗̀➛ .tambahsaldo Ⓞ
: ̗̀➛ .kurangisaldo Ⓞ
: ̗̀➛ .pricelist-ress Ⓡ

✦ *LAINNYA* ✦
: ̗̀➛ .ping 
: ̗̀➛ .runtime 
`;

      await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
    } else {
      const text = `Anda belum terdaftar di database. Silahkan ketik .daftar`;
      await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
    }
  } catch (e) {
    return `Error at menu: ${e}`;
  }
};
