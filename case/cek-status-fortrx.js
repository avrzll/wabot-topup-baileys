const fs = require("fs");
const { react } = require("../utils/reaction");
const { saldo, kurangiSaldo } = require("../utils/saldoManager");
const toRupiah = require("@develoka/angka-rupiah-js");
const dateTimeId = require("../utils/dateTimeId");
const { getPriceFF } = require("./fetch-data-harga");

require("../conf");
/*


CEK STATUS TOPUP
















*/
const readFilePricelist = () => {
  const data = fs.readFileSync("./database/pricelist.json", "utf-8");
  return JSON.parse(data);
};

const apiUrl = "https://duniatopupgames.com/api/v2/status";

async function cekStatusTrx(orderID, idProduk, msg, sock, id) {
  async function reply(text) {
    await sock.sendMessage(msg.key.remoteJid, { text: text }, { quoted: msg });
  }

  const apiData = new FormData();
  apiData.append("api_key", global.apikey);
  apiData.append("order_id", orderID);

  let data;
  let pesan;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: apiData,
    });
    data = await res.json();
    const sender = msg.key.remoteJid.split("@")[0];
    const harga = readFilePricelist().pricelist.free_fire_reseller[idProduk];

    if (data.status) {
      if (data.data.status === "Success") {
        const note = data.data.note;
        const nickname = note.split(". RefId : ")[0];
        const sn = note.split(". RefId : ")[1];

        if (global.reseller.includes(sender)) {
          // console.log(harga);
          kurangiSaldo(sender, harga);
          pesan = `
「 🟢 TOP UP BERHASIL 」

❍ ID transaksi : ${orderID}
❍ SN : ${sn}
❍ ID Player : ${data.data.target}
❍ Nickname : ${nickname}
❍ Produk : ${data.data.product}

${dateTimeId()}

❍ Harga : ${toRupiah(harga, { formal: false, floatingPoint: 0 })}
❍ Sisa Saldo : ${toRupiah(saldo(sender), { formal: false, floatingPoint: 0 })}

YOGSSTORE BOT
          `;
        } else {
          kurangiSaldo(sender, data.data.price);
          pesan = `
「 🟢 TOP UP BERHASIL 」

❍ ID transaksi : ${orderID}
❍ SN : ${sn}
❍ ID Player : ${data.data.target}
❍ Nickname : ${nickname}
❍ Produk : ${data.data.product}

${dateTimeId()}

❍ Sisa Saldo : ${toRupiah(saldo(sender), { formal: false, floatingPoint: 0 })}

YOGSSTORE BOT
        `;
        }

        await react(msg, sock, "✅");
        await reply(pesan);
      } else if (data.data.status === "Processing") {
        pesan = `
「 🔵 MASIH DIPROSES 」

Silahkan cek kembali setelah beberapa saat
CMD : cekstatus [id_transaksi] 
Contoh : cekstatus KT160120249863

YOGSSTORE BOT
        `;
        if (global.reseller.includes(sender)) {
          kurangiSaldo(sender, harga);
        } else {
          kurangiSaldo(sender, await getPriceFF(id));
        }
        await react(msg, sock, "🕒");
        await reply(pesan);
      } else if (data.data.status === "Canceled") {
        await react(msg, sock, "❌");
        await reply("Cancelled: " + data.data.note);
      } else {
        pesan = `
「 🔴 TRANSAKSI GAGAL 」

Silahkan hubungi owner

YOGSSTORE BOT
        `;
        await react(msg, sock, "❌");
        await reply(pesan);
      }
    } else {
      pesan = `
「 🔴 STATUS EROR 」

Order ID tidak ditemukan

YOGSSTORE BOT
        `;
      await react(msg, sock, "❌");
      await reply(pesan);
    }
  } catch (err) {
    console.error(err);
    reply(`Update Status For Trx Eror ${err}`);
  }
}

module.exports = { cekStatusTrx };
