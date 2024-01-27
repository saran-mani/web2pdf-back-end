const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.post("/generatepdf", async (req, res) => {
  try {
    const url = req.body.url;
    console.log(url);
    const browser = await puppeteer.launch({ headless: 'new' });
    console.log("browser opend");
    const page = await browser.newPage();
    console.log("new page opend");
    await page.goto(url, { waitUntil: "networkidle2"});
    console.log("page loaded");
    const pdfgenerate = await page.pdf({ format: "A4" });
    console.log("pdf generated");
    await browser.close();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
    res.send(pdfgenerate);
    console.log("pdf sended");
  } catch (error) {
    console.log(error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});