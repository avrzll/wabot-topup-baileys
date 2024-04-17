module.exports = dateTime = () => {
  const moment = require("moment-timezone");
  require("moment/locale/id");
  const timezone = moment.tz("Asia/Jakarta");

  const formatTanggal = "dddd, DD MMMM YYYY";
  const formatJam = "HH:mm:ss";

  const tanggal = timezone.format(formatTanggal);
  const jam = timezone.format(formatJam);

  const text = `${tanggal} | ${jam} WIB`;

  return text;
};
