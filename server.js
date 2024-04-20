

const express= require("express");
const bodyParser =require("body-parser");

const app=express();
var QRCode = require('qrcode')

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());

const qs = require('querystring');
const http = require('https');

const axios = require('axios');
const encodedParams = new URLSearchParams();


const options = {
  method: 'POST',
  url: 'https://url-shortener-service.p.rapidapi.com/shorten',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '7427880405msh1523b91d7d1eceep1f2f92jsn3ca832305ffc',
    'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
  },
  data: encodedParams,
};


app.get("/", function(req, res) {
  res.render("index", { imageUrl: null, link: "" });
});

// app.get("/error", function(req, res) {
//   res.render("error");
// });

app.post("/", async function(reqs, resp) {
  try {
    const originAddress = reqs.body.linkAdd;

    encodedParams.set('url', originAddress)
    const body = await axios.request(options)
    let theURL = body.data.result_url

    const imageUrl = await generateQRCode(originAddress);
    resp.render("index", { imageUrl, link: theURL });
  } catch (error) {
    console.log(error);
    resp.render("error");
  }
});

function generateQRCode(originAddress) {
  return new Promise((resolve, reject) => {
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.9,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#0000'
      },
      width: 300,
      height: 300
    };

    QRCode.toDataURL(originAddress, opts, function (err, url) {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}




let port = process.env.PORT || 3000;
if(port==null || port=="")
{
    port=3000;
}

app.listen(port, function() {
    console.log("Server started on port");
});