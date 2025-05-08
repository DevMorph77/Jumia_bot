import puppeteer from "puppeteer";
import fs from "fs"

async function Jumia(){
    //configuration
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()


    //scripts
    await page.goto('https://www.jumia.com.gh/')

    //await page.waitForNetworkIdle()
    await page.waitForSelector('button.cls[aria-label="newsletter_popup_close-cta"]')

    //button class="cls" aria-label="newsletter_popup_close-cta">
    await page.click('button.cls[aria-label="newsletter_popup_close-cta"]')
    
    //article class="prd _box _hvr">
    //await page.waitForSelector('article.prd._box._hvr')

    const products = await page.evaluate(()=>{
        const items = Array.from(document.querySelectorAll('article.prd._box._hvr'))

        return items.map(iter=>{
            const name = iter.querySelector("div.name")?.textContent.trim()||"" ;
            const price = iter.querySelector("div.prc")?.textContent.trim()||"";

            return {name , price};
        })

        
    })

    console.log(products)

  
    await browser.close()
    







}

export default Jumia 




