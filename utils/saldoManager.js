// ==================== MANAJEMEN SALDO ====================== //
require("../conf");

const fs = require("fs");
const toRupiah = require("@develoka/angka-rupiah-js");

// Fungsi untuk membaca file saldo.json
const readFile = () => {
  const data = fs.readFileSync("database/saldo.json", "utf-8");
  return JSON.parse(data);
};

// Fungsi untuk menulis ke file saldo.json
const writeFile = (data) => {
  fs.writeFileSync(
    "database/saldo.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
};

// Add saldo
const tambahSaldo = async (userId, jumlah, sock) => {
  try {
    const saldoData = readFile();
    // find usr
    const userIndex = saldoData.users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      saldoData.users[userIndex].saldo += jumlah;

      writeFile(saldoData);
      const pesan = `
「 🟢 TAMBAH SALDO BERHASIL 」

❍ Nama : ${saldoData.users[userIndex].nama}
❍ No HP : ${saldoData.users[userIndex].noHp}
❍ Nominal : ${toRupiah(jumlah, { formal: false, floatingPoint: 0 })}
❍ Total Saldo : ${toRupiah(saldoData.users[userIndex].saldo, {
        formal: false,
        floatingPoint: 0,
      })}

YOGSSTORE BOT`;
      await sock.sendMessage(
        `${userId}@s.whatsapp.net`,
        { text: pesan },
        { quoted: global.fq }
      );
      return pesan;
    } else {
      return `User dengan ID ${userId} tidak ditemukan.`;
    }
  } catch (error) {
    console.error("Error add saldo: ", error.message);
  }
};

// mins saldo
const kurangiSaldo = async (userId, jumlah) => {
  try {
    const saldoData = readFile();
    // find usr
    const userIndex = saldoData.users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      if (saldoData.users[userIndex].saldo >= jumlah) {
        saldoData.users[userIndex].saldo -= jumlah;
        writeFile(saldoData);
        const pesan = `
「 🟢 PENGURANGAN SALDO BERHASIL 」

❍ Nama : ${saldoData.users[userIndex].nama}
❍ No HP : ${saldoData.users[userIndex].noHp}
❍ Nominal : ${toRupiah(jumlah, { formal: false, floatingPoint: 0 })}
❍ Total Saldo : ${toRupiah(saldoData.users[userIndex].saldo, {
          formal: false,
          floatingPoint: 0,
        })}

YOGSSTORE BOT`;
        // console.log(
        //   `Saldo untuk ${saldoData.users[userIndex].nama} dikurangi sebesar ${jumlah}.`
        // );
        return pesan;
      } else {
        const pesan = `
「 🔴 PENGURANGAN SALDO GAGAL 」

Saldo ${saldoData.users[userIndex].nama} tidak mencukupi!

YOGSSTORE BOT`;
        // console.log(`Saldo ${saldoData.users[userIndex].nama} tidak mencukupi`);
        return pesan;
      }
    } else {
      return `User dengan ID ${userId} tidak ditemukan.`;
    }
  } catch (error) {
    console.error("Error minus saldo: ", error.message);
  }
};

// cek saldo
const cekSaldo = (userId) => {
  try {
    const saldoData = readFile();
    // find usr
    const userIndex = saldoData.users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      const saldo = JSON.stringify(saldoData.users[userIndex].saldo);
      const pesan = `
==== INFORMASI SALDO ====

❍ Nama : ${saldoData.users[userIndex].nama}
❍ No HP : ${saldoData.users[userIndex].noHp}
❍ Saldo : ${toRupiah(saldo, { formal: false, floatingPoint: 0 })}
`;
      return pesan;
    } else {
      const pesan = `User dengan ID ${userId} tidak ditemukan. Silahkan mendaftar terlebih dahulu.`;
      return pesan;
    }
  } catch (error) {
    console.error("Error cek saldo ", error.message);
  }
};

const saldo = (userId) => {
  try {
    const saldoData = readFile();
    // find usr
    const userIndex = saldoData.users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      const saldo = JSON.stringify(saldoData.users[userIndex].saldo);
      return saldo;
    }
  } catch (e) {
    return `Error ambil saldo : ${e}`;
  }
};

const cekKetersediaanSaldo = (userId, jumlah) => {
  try {
    const jmlsaldo = saldo(userId);
    return jmlsaldo >= jumlah ? true : false;
  } catch (e) {
    console.log(`Eror cekKetersediaanSaldo : ${e}`);
  }
};

const totalsaldo = () => {
  let total = 0;
  try {
    const saldo = readFile();
    for (const user of saldo.users) {
      total += user.saldo;
    }
    return total;
  } catch (error) {
    console.log(`Eror totalSaldo: ${error}`);
  }
};

const tfsaldo = async (sender, userID, jumlah, sock) => {
  // let jml = "0";
  const jml = parseInt(jumlah);
  const saldo = readFile();

  const userIndexSender = saldo.users.findIndex((u) => u.id === sender);
  const userIndexReceiver = saldo.users.findIndex((u) => u.id === userID);

  if (userIndexSender >= 0 && userIndexReceiver >= 0) {
    if (saldo.users[userIndexSender].saldo >= jml) {
      saldo.users[userIndexSender].saldo -= jml;
      saldo.users[userIndexReceiver].saldo += jml;

      writeFile(saldo);
      const pesan = `
「 🟢 TRANSFER SALDO BERHASIL 」

*Tujuan:*
❍ Nama : ${saldo.users[userIndexReceiver].nama}
❍ No HP : ${saldo.users[userIndexReceiver].noHp}
❍ Nominal : ${toRupiah(jml, { formal: false, floatingPoint: 0 })}

❍ Sisa Saldo : ${toRupiah(saldo.users[userIndexSender].saldo, {
        formal: false,
        floatingPoint: 0,
      })}

YOGSSTORE BOT`;
      await sock.sendMessage(
        `${userID}@s.whatsapp.net`,
        {
          text: `💳 Kamu menerima saldo sebesar ${jml} dari ${saldo.users[userIndexSender].nama}`,
        },
        { quoted: global.fq }
      );
      return pesan;
    } else {
      return "Jumlah saldo kamu tidak mencukupi!";
    }
  } else {
    return "Pengguna tidak ditemukan!";
  }
};

module.exports = {
  tambahSaldo,
  kurangiSaldo,
  cekSaldo,
  saldo,
  cekKetersediaanSaldo,
  totalsaldo,
  tfsaldo,
};
