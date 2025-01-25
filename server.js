const express = require("express");
const { google } = require("googleapis");
const fs = require("fs/promises");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 2137;

// dane google sheetsa
const SHEET_ID = "19msUF4D4jONcyWhFex3P4WOr4Fuu3I-WGCX9egBFOp8";
const SHEET_NAME = "Sheet1";
const SERVICE_ACCOUNT_KEY_PATH = "./pp5-key.json";

// obsługa cors
app.use(cors());
app.use(bodyParser.json());

app.post("/send-to-sheets", async (req, res) => {
  try {
    const credentials = JSON.parse(await fs.readFile(SERVICE_ACCOUNT_KEY_PATH, "utf-8"));

    // oauth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const { form, color, time, shape, hasEmphasis, comments } = req.body;

    const values = [
      [
        form,
        color,
        time,
        shape || "",
        hasEmphasis ? "Tak" : "Nie",
        comments,
      ],
    ];

    // wysyłanie danych do gsheetsów
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    res.status(200).send("Dane zostały zapisane!");
  } catch (error) {
    console.error("Błąd:", error);
    res.status(500).send("Wystąpił błąd podczas zapisu danych.");
  }
});

// uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});