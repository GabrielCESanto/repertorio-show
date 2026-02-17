require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 3001;

app.post("/pedido", async (req, res) => {
  const { pedido, mensagem } = req.body;

  console.log("Recebido:", req.body);

  const texto = `
🎵 NOVO PEDIDO

${pedido || "Pedido não informado"}

Mensagem:
${mensagem && mensagem.trim() ? mensagem : "—"}
`.trim();

  try {
    await axios.post(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: texto,
      }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar ao Telegram");
  }
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
