const fs = require("fs");

function getJid(m) {
  const remoteJid = m.key.remoteJid;
  return remoteJid;
}

function getName(m) {
  const name = m.pushName;
  return name;
}

function getMsg(m) {
  let msgFrom;
  try {
    if (m.message.conversation) {
      msgFrom = m.message.conversation;
    } else if (m.message.extendedTextMessage.text) {
      msgFrom = m.message.extendedTextMessage.text;
    }
    return msgFrom;
  } catch (error) {
    console.log("Error getMsg: " + error);
  }
}

function sendMedia(filePath, fileName, mimeType, caption, m, sock, Jid) {
  const docBuffer = fs.readFileSync(filePath);
  // console.log(docBuffer);
  sock.sendMessage(
    Jid,
    {
      document: docBuffer,
      fileName: fileName,
      mimetype: mimeType,
      caption: caption,
    },
    { quoted: m }
  );
}

module.exports = { getJid, getName, getMsg, sendMedia };
