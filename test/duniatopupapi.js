const axios = require("axios");

const requestData = {
  user_id: "1685084111",
  zone_id: "zone_id",
  method: "POST",
  wa: "085174418180",
  voucher: "",
};

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

axios
  .post(
    "https://duniatopupgames.com/games/order/get-detail/" + requestData,
    config
  )
  .then((response) => {
    if (response.data.status === true) {
      console.log(response.data.msg);
    } else {
      console.error("Gagal:", response.data.msg);
    }
  })
  .catch((error) => {
    console.error("Kesalahan:", error);
  });
