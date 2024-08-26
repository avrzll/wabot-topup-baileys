global.date = new Date();
global.calender = date.toLocaleDateString("id");

global.prefix = [".", "!", "$", ""];

global.apikey = "tTohYaM7QODbCnZ2y9jniJboR1iV"; // https://duniatopupgames.com/
global.velixs = "47ae29d2ec7db8a2a6b3b7ca3bf4a385a5c6df8884cd7c4968"; // https://velixs.com/

global.own = ["6285174422041", "6285174418180", "6285648329043"];
global.reseller = ["6285604642287"];

global.fq = {
  key: {
    remoteJid: "status@broadcast",
    participant: "0@s.whatsapp.net",
  },
  message: {
    extendedTextMessage: {
      text: "𝙔𝙊𝙂𝙎𝙎𝙏𝙊𝙍𝙀 𝘽𝙤𝙩 𝙏𝙚𝙧𝙫𝙚𝙧𝙞𝙛𝙞𝙠𝙖𝙨𝙞",
    },
  },
};

global.dateTime = function () {
  const moment = require("moment-timezone");
  require("moment/locale/id");
  const timezone = moment.tz("Asia/Jakarta");
  const formatTanggal = "dddd, DD MMMM YYYY";
  const formatJam = "HH:mm:ss";

  const tanggal = timezone.format(formatTanggal);
  const jam = timezone.format(formatJam);

  const text = `❍ 📆 ${tanggal}
❍ ⏰ ${jam} WIB`;

  return text;
};
