const express = require("express");
const axios = require("axios");
const QRCode = require("qrcode");
const cors = require('cors')


const app = express();
app.use(cors());


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
    
    // Fetch shortened URL from ulvis.net API
    const response = await axios.get(`https://ulvis.net/API/write/get?url=${originAddress}`);
    

    let shortenedURL = response.data.data.url;
    console.log("Shortened URL:", shortenedURL);

    // Generate QR Code
    const imageUrl = await generateQRCode(shortenedURL);
    
    res.render("index", { imageUrl, link: shortenedURL });
  } catch (error) {
    console.error("Error:", error.message);
    res.render("error");
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
