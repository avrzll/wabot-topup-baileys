const { react } = require("../utils/reaction");
const { kurangiSaldo, cekKetersediaanSaldo } = require("../utils/saldoManager");
const { cekStatus } = require("./cek-status");
const fs = require("fs");
const { cekStatusTrx } = require("./cek-status-fortrx");

require("../conf");
/*


TRANSAKSI TOPUP
















*/
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const readFilePricelist = () => {
  const data = fs.readFileSync("./database/pricelist.json", "utf-8");
  return JSON.parse(data);
};

const apiUrl = "https://duniatopupgames.com/api/v2/order";

module.exports = orderFFReseller = async (
  idProduk,
  idPlayer,
  sender,
  msg,
  socket
) => {
  async function reply(text) {
    await socket.sendMessage(sender, { text: text }, { quoted: msg });
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
    case "720":
      id = "1004";
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

  const harga_reseller =
    readFilePricelist().pricelist.free_fire_reseller[idProduk];
  const userId = sender.split("@")[0];

  let data;
  let pesan;

  try {
    if (cekKetersediaanSaldo(userId, harga_reseller)) {
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
idProduk
YOGSSTORE BOT
      `;
        await react(msg, socket, "🕒");
        await reply(pesan);
        await delay(10000);
        cekStatusTrx(data.data.order_id, idProduk, msg, socket, id);
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
      await reply("Saldo anda tidak mencukupi untuk melakukan transaksi.");
    }
  } catch (err) {
    console.error("ff-reseller-eror: " + err);
    reply(toString(err));
  }
};
