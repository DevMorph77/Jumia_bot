import { chromium } from "playwright";


async function Ebay(){

    //config
    const browser  = await chromium.launch({headless:false})
    const page = await browser.newPage()

    await page.goto('https://www.ebay.com/')

   //li data-marko-key="5[0] s0-1-0-53-1-2-2" class="vl-flyout-nav__js-tab"


    console.log('navigating to the electronics section')
   
    await page.click('li.vl-flyout-nav__js-tab a:has-text("Electronics")' );

    

    const products = await page.evaluate(()=>{
        const items = Array.from(document.querySelectorAll('div.brwrvr__item-card__body'))
        

        return items.map(iter=>{
            //h3 class="textual-display bsig__title__text">
            const name = iter.querySelector('h3.textual-display.bsig__title__text')?.textContent.trim()||""

            return{name}
        })
    })

    console.log(products)




}


export default Ebay