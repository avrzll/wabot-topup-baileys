const { react } = require("../utils/reaction");
const { cekKetersediaanSaldo, kurangiSaldo } = require("../utils/saldoManager");
const { cekStatusTrx } = require("./cek-status-fortrx");
const { getPriceFF, getPriceML } = require("./fetch-data-harga");

require("../conf");

const cache = new Map();

function isDuplicateCall(argsKey) {
  const now = Date.now();
  if (cache.has(argsKey)) {
    const lastCallTime = cache.get(argsKey);
    if (now - lastCallTime < 60000) {
      // Periksa apakah panggilan sebelumnya terjadi dalam 1 menit terakhir
      return true; // Panggilan duplikat
    }
  }
  cache.set(argsKey, now); // Simpan atau perbarui timestamp panggilan terakhir
  return false;
}
/*


TRANSAKSI TOPUP
















*/
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const apiUrl = "https://duniatopupgames.com/api/v2/order";

async function orderML(idProduk, idPlayer, idZona, sender, msg, socket) {
  async function reply(text) {
    await socket.sendMessage(sender, { text: text }, { quoted: msg });
  }

  const argsKey = `${idProduk}-${idPlayer}-${idZona}-${sender}-${msg}`;
  if (isDuplicateCall(argsKey)) {
    console.log(
      "Panggilan fungsi orderML dengan argumen yang sama dalam 1 menit terakhir. Tidak menjalankan ulang."
    );
    reply("Harap tunggu 1 menit untuk melakukan transaksi yang sama!");
    return; // Keluar dari fungsi jika terdeteksi sebagai panggilan duplikat
  }

  await react(msg, socket, "🕒");

  const idMap = {
    3: "231",
    5: "214",
    10: "183",
    12: "187",
    14: "178",
    18: "179",
    19: "193",
    36: "206",
    44: "212",
    59: "218",
    74: "222",
    86: "226",
    88: "228",
    110: "185",
    113: "177",
    170: "191",
    172: "192",
    240: "196",
    257: "197",
    344: "204",
    429: "210",
    514: "215",
    600: "219",
    706: "221",
    963: "230",
    1050: "184",
    1220: "188",
    1412: "189",
    2195: "195",
    WDP: "232",
    TP: "182",
  };

  const id = idMap[idProduk] || null;

  const apiData = new FormData();
  apiData.append("api_key", global.apikey);
  apiData.append("id", id);
  apiData.append("user", idPlayer);
  apiData.append("zone", idZona);

  const harga = await getPriceML(id);
  const userId = sender.split("@")[0];
  // console.log(harga);

  let data;
  let pesan;

  try {
    if (cekKetersediaanSaldo(userId, harga)) {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: apiData,
      });
      data = await res.json();
      if (data.status) {
        pesan = `
「 🟡 PENDING 」
Note : Pesanan berhasil dibuat dan sedang diproses, silahkan tunggu !

❍ ID transaksi : ${data.data.order_id}
❍ ID Player : ${data.data.user}
❍ ID Zona : ${data.data.zone}
❍ Produk : ${data.data.product}

YOGSSTORE BOT
      `;
        await react(msg, socket, "🕒");
        await reply(pesan);
        await delay(10000);
        cekStatusTrx(data.data.order_id, "", msg, socket, id);
      } else {
        pesan = `
「 🔴 TRX EROR 」

${data.message}

YOGSSTORE BOT
      `;

        await react(msg, socket, "❌");
        await reply(pesan);
      }
    } else {
      await react(msg, socket, "❌");
      await reply("Saldo anda tidak mencukupi untuk melakukan transaksi.");
    }
  } catch (err) {
    console.error(err);
    reply(err);
  }
}

// orderFF();
module.exports = { orderML };
