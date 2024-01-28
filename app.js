const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.post("/generatepdf", async (req, res) => {
  try {
    const formate = req.body.PageSize;
    const orientation= req.body.orientation;
    const url = req.body.url;
    console.log(url);
    const browser = await puppeteer.launch({ headless: "new" });
    console.log("browser opend");
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const fullscroll = await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        const distance = 100;
        const maxScrolls = 1000;
        let scrolls = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolls++;
          if (
            scrolls >= maxScrolls ||
            window.innerHeight + window.scrollY >= document.body.offsetHeight
          ) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    if (orientation==="landscape") {
      return landtrue=true;
    }
    const pdfgenerate = await page.pdf({
      printBackground: true,
      landscape: landtrue,
      format:`${formate}`
      
    });
    await browser.close();
    res.send(pdfgenerate);
    console.log("pdf generated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating PDF");
  }
});

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});
