const axios = require("axios");

const requestData = {
  game: "freefire",
  id: "1685084111",
  apikey: "d020fa154891945652bce72992bde099adbd83f9bead534152",
};

axios
  .post("https://api.velixs.com/idgames-checker", requestData)
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
