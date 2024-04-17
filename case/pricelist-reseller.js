const fs = require("fs");

const readFilePricelist = () => {
  const data = fs.readFileSync("./database/pricelist.json", "utf-8");
  return JSON.parse(data);
};

module.exports = pricelistReseller = () => {
  const jsonData = readFilePricelist();
  const formattedPricelist = Object.entries(
    jsonData.pricelist.free_fire_reseller
  ).map(([item, price]) => {
    if (item === "_rate" || item === "") {
      return null;
    }

    const formattedItem =
      item === "MM" || item === "MB" || item === "LUP" || item === "BPC"
        ? `💳 ${item}`
        : `${item} 💎`;

    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return `${formattedItem} : ${formattedPrice}`;
  });

  const filteredPricelist = formattedPricelist.filter((item) => item !== null);

  const msg = `
PRICELIST KHUSUS RESELLER YOGSSTORE

${filteredPricelist.join("\n")}

Ket:
MM = Member Mingguan
MB = Member Bulanan
LUP = Level Up Pass
BPC = BP Card

YOGSSTORE BOT`;

  return msg;
};
