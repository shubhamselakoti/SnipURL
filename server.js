const express = require("express");
const axios = require("axios");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();

app.use(cors()); // Enable CORS for all requests
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { imageUrl: null, link: "" });
});

app.post("/", async (req, res) => {
  try {
    let originAddress = req.body.linkAdd.trim();

    if (!originAddress) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Shorten URL using TinyURL API
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originAddress)}`);

    if (!response.data) {
      throw new Error("Failed to get shortened URL from TinyURL.");
    }

    let shortenedURL = response.data;
    console.log("Shortened URL:", shortenedURL);

    // Generate QR Code
    const imageUrl = await generateQRCode(shortenedURL);

    res.render('index', { imageUrl, link: shortenedURL });
  } catch (error) {
    console.error("Error:", error.message);
    res.render('error', { error: "Internal Server Error" });
  }
});

async function generateQRCode(text) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.9,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 300,
      height: 300,
    });
  } catch (err) {
    console.error("QR Code Generation Error:", err);
    throw err;
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
