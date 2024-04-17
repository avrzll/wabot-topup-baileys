const { react } = require("../utils/reaction");
const { cekKetersediaanSaldo, kurangiSaldo } = require("../utils/saldoManager");
const { cekStatusTrx } = require("./cek-status-fortrx");
const { getPriceFF } = require("./fetch-data-harga");

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

async function orderFF(idProduk, idPlayer, sender, msg, socket) {
  async function reply(text) {
    await socket.sendMessage(sender, { text: text }, { quoted: msg });
  }

  const argsKey = `${idProduk}-${idPlayer}-${sender}-${msg}`;
  if (isDuplicateCall(argsKey)) {
    console.log(
      "Panggilan fungsi orderFF dengan argumen yang sama dalam 1 menit terakhir. Tidak menjalankan ulang."
    );
    reply("Harap tunggu 1 menit untuk melakukan transaksi yang sama!");
    return; // Keluar dari fungsi jika terdeteksi sebagai panggilan duplikat
  }

  await react(msg, socket, "🕒");

  let id;

  switch (idProduk) {
    case "5":
      id = "1051";
      break;
    case "20":
      id = "1048";
      break;
    case "50":
      id = "1044";
      break;
    case "70":
      id = "1041";
      break;
    case "100":
      id = "1037";
      break;
    case "140":
      id = "1034";
      break;
    case "210":
      id = "1027";
      break;
    case "355":
      id = "1022";
      break;
    case "500":
      id = "1015";
      break;
    case "720":
      id = "1004";
      break;
    case "860":
      id = "998";
      break;
    case "1000":
      id = "880";
      break;
    case "1440":
      id = "872";
      break;
    case "2000":
      id = "865";
      break;
    case "BPC":
      id = "929";
      break;
    case "LUP":
      id = "928";
      break;
    case "MM":
      id = "926";
      break;
    case "MB":
      id = "927";
      break;
    default:
      break;
  }

  const apiData = new FormData();
  apiData.append("api_key", global.apikey);
  apiData.append("id", id);
  apiData.append("user", idPlayer);

  const harga = await getPriceFF(id);
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
module.exports = { orderFF };
