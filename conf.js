global.date = new Date();
global.calender = date.toLocaleDateString("id");

global.prefix = [".", "!", "$", ""];

global.apikey = "jtBDt7yxvFVpyrXAsj4NLXU7YrvJ";
global.velixs = "d020fa154891945652bce72992bde099adbd83f9bead534152";

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
