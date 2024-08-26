require("./conf");

const {
  useMultiFileAuthState,
  Browsers,
  downloadMediaMessage,
} = require("@whiskeysockets/baileys");
const {
  cekSaldo,
  tambahSaldo,
  kurangiSaldo,
  totalsaldo,
  tfsaldo,
} = require("./utils/saldoManager");
const { setInterval } = require("timers");
const { getJid, getName, sendMedia } = require("./utils/msgFunc");
const { getUserFF, getUserML } = require("./case/cek-username");
const { react } = require("./utils/reaction");
const { boot } = require("./utils/boot");
const { orderFF } = require("./case/ff-owner");
const { cekStatus } = require("./case/cek-status");
const { default: chalk } = require("chalk");
const makeWASocket = require("@whiskeysockets/baileys").default;
const pino = require("pino");
const now = require("performance-now");
const runtime = require("./case/runtime");
const orderFFReseller = require("./case/ff-reseller");
const daftar = require("./case/daftar");
const pricelistReseller = require("./case/pricelist-reseller");
const deposit = require("./case/deposit");
const dateTimeId = require("./utils/dateTimeId");
const toRupiah = require("@develoka/angka-rupiah-js");
const menu = require("./case/menu");
const { orderML } = require("./case/ml-owner");

async function connectToWhatsapp() {
  const auth = await useMultiFileAuthState("database/auth");
  const sock = makeWASocket({
    printQRInTerminal: true,
    browser: Browsers.macOS("Nishimura"),
    auth: auth.state,
    logger: pino({ level: "silent" }),
    generateHighQualityLinkPreview: true,
  });
  sock.ev.on("creds.update", auth.saveCreds);
  boot();
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") console.log("Connected!");
    if (connection === "close") connectToWhatsapp();
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const start = now();

    const m = messages[0];
    const pushName = getName(m);
    const sender = getJid(m);

    if (!m.message) return;

    const msgType = Object.keys(m.message)[0];

    const textMsg =
      msgType === "conversation"
        ? m.message.conversation
        : msgType === "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : msgType === "imageMessage"
        ? m.message.imageMessage.caption
        : "";

    async function reply(text) {
      await sock.sendMessage(getJid(m), { text: text }, { quoted: m });
    }

    await sock.readMessages([m.key]);

    // console.log(m);

    console.log(`
${chalk.black.bgWhite("[ CMD ]")} ${chalk.black.bgYellow(
      dateTimeId()
    )} ${chalk.black.bgBlue(textMsg)}
${chalk.magenta("=> From")} ${chalk.green(pushName)} ${chalk.yellow(sender)}
${chalk.blue("=> In")} ${chalk.green(sender)}
    `);

    let isGroup = false;

    if (sender.endsWith("@g.us")) {
      isGroup = true; //ganti true
    }

    if (isGroup) {
      return;
    }

    let command;
    let prefix;

    for (const p of global.prefix) {
      if (textMsg.startsWith(p)) {
        command = textMsg.slice(p.length).split(" ")[0].toLowerCase();
        prefix = p;
        break;
      }
    }

    const owner = global.own;
    const reseller = global.reseller;
    const someone = sender.split("@")[0];

    switch (command) {
      //========================= CASE START HERE ==========================//
      case "ping":
        const end = now();
        let ping = end - start;
        ping = ping / 1000;
        ping = ping.toFixed(4);
        reply(`Kecepatan respon :\n *${ping} s*`);
        break;

      //========================= CASE RUNTIME =========================//
      case "runtime":
      case "uptime":
        runtime(m, sock);
        break;

      //========================= CASE MENU / HELP =========================//
      case "menu":
      case "help":
        menu(m, sock);
        break;

      //========================== CASE CEK ID FF ==========================//
      case "cekff":
        if (
          textMsg.toLowerCase() === `${prefix}cekff` ||
          textMsg.toLowerCase() === "cekff"
        ) {
          reply(`Mana Id-nya?\n\nContoh : .cekff 6464331474`);
        } else {
          const idPlayer = textMsg.split(" ")[1];
          getUserFF(idPlayer, sock, m);
        }
        break;

      //========================== CASE CEK ID ML ==========================//
      case "cekml":
        if (
          textMsg.toLowerCase() === `${prefix}cekml` ||
          textMsg.toLowerCase() === "cekml"
        ) {
          reply(`Lengkapi format nya.\n\nContoh: .cekml 157228049 2241`);
        } else {
          const player_id = textMsg.split(" ")[1];
          const zone_id = textMsg.split(" ")[2];
          getUserML(player_id, zone_id, sock, m);
        }
        break;

      //========================== CASE TOPUP FF ==========================//
      case "ff":
        if (!owner.includes(someone)) {
          reply(
            "Mohon maaf, sementara fitur ini hanya boleh digunakan oleh owner YOGSSTORE"
          );
          return;
        } else if (
          textMsg.toLowerCase() === "ff" ||
          textMsg.toLowerCase() === `${prefix}ff`
        ) {
          reply(
            `Mau top up berapa ? dan mana ID nya ?\n\nFormat : FF [kode] [id_player] \n\nContoh 1 : FF 140 6464331474 \nContoh 2 : FF MM 6464331474`
          );
        } else {
          const idProduct = textMsg.split(" ")[1];
          const idPlayer = textMsg.split(" ")[2];
          orderFF(idProduct.toUpperCase(), idPlayer, sender, m, sock);
        }
        break;

      //========================== CASE TOPUP FF ==========================//
      case "ml":
        reply("Mohon maaf, fitur terdapat eror!");
        // if (!owner.includes(someone)) {
        //   reply(
        //     "Mohon maaf, sementara fitur ini hanya boleh digunakan oleh owner YOGSSTORE"
        //   );
        //   return;
        // } else if (
        //   textMsg.toLowerCase() === "ml" ||
        //   textMsg.toLowerCase() === `${prefix}ml`
        // ) {
        //   reply(
        //     `Mau top up berapa ? dan mana ID nya ?\n\nFormat : ML [kode] [id_player] [id_zona]\n\nContoh 1 : ML 5 6464331474 15140`
        //   );
        // } else {
        //   const idProduct = textMsg.split(" ")[1];
        //   const idPlayer = textMsg.split(" ")[2];
        //   const idZona = textMsg.split(" ")[3];
        //   orderML(idProduct.toUpperCase(), idPlayer, idZona, sender, m, sock);
        // }
        break;

      //========================== CASE CEK STATUS TRANSAKSI ==========================//
      case "cekstatus":
        if (
          textMsg.toLowerCase() === `${prefix}cekstatus` ||
          textMsg.toLowerCase() === "cekstatus"
        ) {
          reply(
            "Mana ID Transaksinya?\n\nFormat : cekstatus [ID Transaksinya]\n\nContoh : cekstatus KT170120242564"
          );
        } else {
          const trxid = textMsg.split(" ")[1];
          await react(m, sock, "🕒");
          await cekStatus(trxid, "", m, sock);
        }
        break;

      //========================== CASE DAFTAR JADI MEMBER ==========================//
      case "daftar":
        daftar(m, sock);
        break;

      //========================== CASE CEK SALDO USER ==========================//
      case "ceksaldo":
        let idUsers;
        if (
          textMsg.toLowerCase() === "ceksaldo" ||
          textMsg.toLowerCase() === `${prefix}ceksaldo`
        ) {
          idUsers = sender.split("@")[0];
        } else {
          idUsers = textMsg.split(" ")[1];
        }
        const saldo = cekSaldo(idUsers);
        reply(saldo);
        break;
      //========================== CASE TOTAL SALDO ==========================//
      case "totalsaldo":
        const total = toRupiah(totalsaldo(), {
          formal: false,
          floatingPoint: 0,
        });
        reply(total);
        break;

      //========================== CASE TAMBAH SALDO ==========================//
      case "tambahsaldo":
        if (!owner.includes(someone)) {
          reply("Lu siapa anjir main tambah saldo sembarangan 🗿");
          return;
        } else {
          const noHp = textMsg.split(" ")[1];
          const nominal = textMsg.split(" ")[2];
          const result = await tambahSaldo(noHp, parseInt(nominal), sock);
          reply(result);
        }
        break;

      //========================== CASE KURANGI SALDO ==========================//
      case "kurangisaldo":
        let userId;
        let jml;
        if (!owner.includes(someone)) {
          reply("Lu siapa anjir main ngurangin saldo sembarangan 🗿");
          return;
        } else if (
          textMsg.toLowerCase() === "kurangisaldo" ||
          textMsg.toLowerCase() === `${prefix}kurangisaldo`
        ) {
          reply("Mana argumennya?\nCth: .kurangisaldo 6285174422041 1000");
        } else {
          userId = textMsg.split(" ")[1];
          jml = textMsg.split(" ")[2];
        }
        const pesan = await kurangiSaldo(userId, jml);
        await sock.sendMessage(
          `${userId}@s.whatsapp.net`,
          { text: pesan },
          { quoted: global.fq }
        );
        reply(pesan);
        break;

      //========================== CASE TF SALDO ==========================//
      case "tf":
        if (
          textMsg.toLowerCase() === "tf" ||
          textMsg.toLowerCase() === `${prefix}tf`
        ) {
          reply(`Lengkapi argumennya. \nContoh: .tf 6285174418180 2000`);
        } else {
          const receiver = textMsg.split(" ")[1];
          const jumlah = textMsg.split(" ")[2];
          reply(await tfsaldo(sender.split("@")[0], receiver, jumlah, sock));
        }
        break;
      //========================== CASE REQUEST DEPOSIT ==========================//
      case "deposit":
        if (
          textMsg.toLowerCase() === "deposit" ||
          textMsg.toLowerCase() === `${prefix}deposit`
        ) {
          reply(
            `Lengkapi formatnya. Kirim bukti transfer dengan caption\n.deposit nominal_depo`
          );
        } else if (msgType !== "imageMessage") {
          reply(
            `Lengkapi formatnya. Kirim bukti transfer dengan caption\n.deposit nominal_depo`
          );
        } else if (msgType === "imageMessage") {
          reply(
            "Permintaan deposit anda akan segera diproses oleh admin, silahkan tunggu . . ."
          );
          const noHp = sender.split("@")[0];
          const nominal = textMsg.split(" ")[1];
          deposit(noHp, nominal, m, sock, pino, downloadMediaMessage);
        }
        break;

      //========================== CASE PRICELIST RESELLER ==========================//
      case "pricelist-ress":
        if (!reseller.includes(someone)) {
          reply(
            "Mohon maaf, sementara fitur ini hanya boleh digunakan oleh reseller YOGSSTORE"
          );
          return;
        } else {
          reply(pricelistReseller());
        }
        break;

      //========================== CASE TOPUP FF RESELLER ==========================//
      case "rff":
        if (!reseller.includes(someone)) {
          reply(
            "Mohon maaf, sementara fitur ini hanya boleh digunakan oleh reseller YOGSSTORE"
          );
          return;
        } else if (
          textMsg.toLowerCase() === "rff" ||
          textMsg.toLowerCase() === `${prefix}rff`
        ) {
          reply(
            `Mau top up berapa ? dan mana ID nya ?\n\nFormat : RFF [id_player] [jumlah_order]\n\nContoh 1 : RFF 6464331474 140 \nContoh 2 : RFF 6464331474 MM`
          );
        } else {
          const idPlayer = textMsg.split(" ")[1];
          const idProduct = textMsg.split(" ")[2];
          orderFFReseller(idProduct.toUpperCase(), idPlayer, sender, m, sock);
        }
        break;
      case "tes":
        reply("https://www.youtube.com/watch?v=1ZYlaqrtlv0");
        break;

      default:
        break;
    }
  });
  function backupSaldo() {
    sendMedia(
      "database/saldo.json",
      "saldo.json",
      "application/json",
      "Data saldo berhasil dicadangkan!",
      global.fq,
      sock,
      "6285174422041@s.whatsapp.net"
    );
  }

  setInterval(backupSaldo, 3600000);
}

connectToWhatsapp();
