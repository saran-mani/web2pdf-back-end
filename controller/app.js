const puppeteer = require("puppeteer");

module.exports.generatepdf = async (req, res) => {
  try {
    const formate = req.body.pageSize;
    const orientation = req.body.orientation;
    const url = req.body.url;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
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
