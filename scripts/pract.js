import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  // make configuration
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // scrape jumia products
  await page.goto("https://www.jumia.com.gh/");

  // close the newsletter popup
  await page.waitForSelector('button.cls');
  await page.click('button.cls');

  // scrape some products
  const products = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('article.prd._box._hvr'));
    return items.map(iter => {
      const name = iter.querySelector('div.name')?.textContent.trim() || "";
      const price = iter.querySelector('div.prc')?.textContent.trim() || "";
      return { name, price };
    });
  });

  console.log(products);
  console.log('Scrape successful');

  // convert data to csv format
  const csvHeader = 'Name, Price\n';
  const csvRows = products.map(p =>
    `"${p.name}","${p.price}"`
  ).join('\n');

  fs.writeFileSync('products.csv', csvHeader + csvRows, 'utf8');
  console.log('The information has been successfully saved');

  await browser.close();
})();
