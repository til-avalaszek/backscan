// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

app.post("/send-location", async (req, res) => {
  const { latitude, longitude } = req.body;

  const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}`;

  try {
    // Envia a localização para o Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'User-Agent': 'Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        disable_notification: false,
        reply_to_message_id: null
      })
    };
    
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, options)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.error(err));

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(8088, () => {
    console.log("Servidor rodando na porta 8088");
  });
}

module.exports = app;
