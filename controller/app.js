const puppeteer = require("puppeteer");
require("dotenv").config
module.exports.generatepdf = async (req, res) => {
  try {
    const formate = req.body.pageSize;
    const orientation = req.body.orientation;
    const url = req.body.url;
    const browser = await puppeteer.launch({
      timeout: 60000,
      headless: "new",
      args:[
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),

    });
    const page = await browser.newPage();
    await page.goto(url, {timeout: 60000, waitUntil: "networkidle2" });
    const fullscroll = await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        const distance = 100;
        const maxScrolls = 300;
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
    const pdfgenerate = await page.pdf({
      timeout: 60000,
      printBackground: true,
      format: `${formate}`,
      landscape: orientation === "landscape" ? true : false,
    });
    await browser.close();
    res.send(pdfgenerate);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating PDF");
  }
};
