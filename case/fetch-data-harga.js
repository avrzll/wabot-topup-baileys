require("../conf");
/*


FETCH DATA HARGA BELI
















*/
const apiKey = global.apikey;
const apiUrl = "https://duniatopupgames.com/api/v2/product";

const apiData = new FormData();
apiData.append("api_key", apiKey);

let data;

const getPriceFF = async (kodeProduk) => {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: apiData,
    });
    data = await res.json();

    const filteredData = data.data.filter(
      (items) => items.games === "Free Fire" && items.id === kodeProduk
    );

    const result = parseInt(filteredData[0].price["gold"]);
    return result;
  } catch (err) {
    console.error(`Get price FF error: ${err}`);
  }
};

const getPriceML = async (kodeProduk) => {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: apiData,
    });
    data = await res.json();

    const filteredData = data.data.filter(
      (items) => items.games === "Mobile Legends"
      // && items.id === "178"
    );
    console.log(filteredData);

    // const result = parseInt(filteredData[0].price["gold"]);
    // return result;
  } catch (err) {
    console.log(err);

    console.error(`Get price ML error: ${err}`);
  }
};

module.exports = { getPriceFF, getPriceML };
