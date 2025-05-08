
import { chromium } from "playwright";
import fs from "fs"

(async () => {
    const browser = await chromium.launch({ headless:true});
    const page = await browser.newPage();

    const baseURL = "https://www.jumia.com.gh/home-audio-electronics/";
    const totalPages = 2;

    
    let allProducts = [];

    // Loop through each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const url = `${baseURL}?page=${pageNum}#catalog-listing`;
        console.log(`\nScraping page ${pageNum}...`);
        
        await page.goto(url);
        await page.waitForTimeout(3000);  // Waiting for page content to load

        // Close the popup if it appears
        try {
            await page.click('button.cls[aria-label="newsletter_popup_close-cta"]', { timeout: 2000 });
        } catch (e) {
            console.log("Popup not found or already closed.");
        }

        await page.waitForTimeout(3000);// Waiting for page content to settle
    
        await page.waitForSelector('article.prd._fb.col.c-prd',{timeout:10000})

        const product_electronics = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('article.prd._fb.col.c-prd'));
            return items.map(iter => {
                const title = iter.querySelector('div.info > h3.name')?.textContent.trim() || "";
                let rawPrice = iter.querySelector('div.prc')?.textContent.trim() || "";
                let price = rawPrice.replace(/GH₵\s?/g, '').trim();  // Remove 'GH₵' but keep commas and dashes
                return { title, price };
            });
        });

        // Accumulate the products from this page
        allProducts.push(...product_electronics);
        console.log(allProducts)
    }


    console.log(allProducts)

    // Prepare the CSV content
    const csvHeader = 'Title, Price(GHS)\n';
    const csvRows = allProducts.map(p => `"${p.title}","${p.price}"`).join('\n');

    // Save the scraped data to a CSV file
    fs.writeFileSync('jumia_electronics.csv', csvHeader + csvRows, "utf8");
    console.log('File saved as jumia_electronics.csv');

    await browser.close();  // Close the browser after scraping
})();
