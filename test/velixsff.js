const axios = require("axios");

async function checkGameID() {
  const url = "https://api.velixs.com/idgames-checker";
  const body = {
    game: "freefire",
    id: "2074865933",
    apikey: "d020fa154891945652bce72992bde099adbd83f9bead534152",
  };

  try {
    const response = await axios.post(url, body);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
}

checkGameID();
