import { chromium } from 'playwright';
import fs from 'fs'

(async()=>{
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ storageState: "cookies.json" });
    const page = await context.newPage();

    await page.goto('https://www.amazon.com/');

    await page.waitForTimeout(3000)

    //await page.getByRole('link', { name: 'Computer mice' }).click();

    await page.click('a[aria-label="Computer mice"]')
    await page.waitForTimeout(3000)


    //<h2 aria-label="Sponsored Ad - UtechSmart Venus Pro RGB Wireless MMO Gaming Mouse, 16,000 DPI Optical Sensor, 2.4 GHz Transmission Technology, Ergonomic Design, 16M Chroma RGB Lighting, 16 programmable Buttons, Up to 70 Hours" class="a-size-medium a-spacing-none a-color-base a-text-normal">


    //<div class="a-section a-spacing-small a-spacing-top-small">
    const products = await page.evaluate(()=>{
        const items = Array.from(document.querySelectorAll('div.a-section.a-spacing-small.a-spacing-top-small'))
        return items.map(iter=>{
            const title = iter.querySelector('div.a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style   h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal span')?.textContent.trim()||"";
            const price = iter.querySelector('span.a-price span.a-offscreen')?.textContent.trim()||""
            return {title,price}
        })


    })



    

    console.log(products);

    //saving the outcome in a csv file
    const csvHeader = 'Title , Price\n';
    const csvRows = products.map(p=>
        `"${p.title}","${p.price}"`
    ).join('\n')

    //write it to the csv file
    fs.writeFileSync('amazon products.csv',csvHeader + csvRows , 'utf8')
    console.log('Information has been saved successfully')




   




    await browser.close();
})()
