module.exports = daftar = (msg, sock) => {
  const fs = require("fs");

  const noHp = msg.key.remoteJid.split("@")[0];
  const namaUser = msg.pushName;

  const reply = async (text) => {
    await sock.sendMessage(msg.key.remoteJid, { text: text }, { quoted: msg });
  };

  // read file saldo.json
  const readFile = () => {
    try {
      const data = fs.readFileSync("database/saldo.json", "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return { users: [] };
    }
  };

  // writefile saldo.json
  const writeFile = (data) => {
    fs.writeFileSync(
      "database/saldo.json",
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  };

  // add user
  const addUsr = (noHp, namaUser) => {
    const data = readFile();

    // cek user existing
    const userIndex = data.users.findIndex((u) => u.id === noHp);
    console.log(userIndex);

    if (userIndex >= 0) {
      reply("Lu udah terdaftar bjir 🗿🗿");
    } else {
      const newUser = {
        id: noHp,
        nama: namaUser,
        noHp: noHp,
        saldo: 0,
        level: "member",
      };

      // add new usr
      data.users.push(newUser);
      writeFile(data);

      reply(`User ${namaUser} dengan nomor HP ${noHp} berhasil didaftarkan.`);
    }
  };

  addUsr(noHp, namaUser);
};
