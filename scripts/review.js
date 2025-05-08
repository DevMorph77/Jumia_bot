import { chromium } from "playwright";
import fs from "fs"

(async()=>{
    //configurations
    const browser = await chromium.launch({headless:false})
    const page = await browser.newPage()



    await page.goto('https://www.food.com/activity')

    await page.waitForTimeout(3000)

    const reviews = await page.evaluate(()=>{
        const items = Array.from(document.querySelectorAll('div.gk-aa-item-info'))
        return items.map(iter=>{
            //<ul class="gk-aa-item-heading-info"> <li><a href="https://www.food.com/user/2003174523">panngirl</a> asked a question about <a
            const user = iter.querySelector('ul.gk-aa-item-heading-info > li > a')?.textContent.trim()||"";
            const food = iter.querySelector('ul.gk-aa-item-heading-info > li a:nth-of-type(2)')?.textContent.trim()||"";
            const comment = iter.querySelector('li.gk-aa-item-text')?.textContent.trim()||"";

           return {user,food,comment}
        })
    })

    console.log(reviews)

    //saving the file in a csv

    const csvHeader = "user , food , comment\n";
    const csvRows = reviews.map(p=>
        `"${p.user}","${p.food}","${p.comment}"`
    ).join('\n')

    //generating the csv file
    fs.writeFileSync('Food reviews',csvHeader + csvRows , "utf8");
    console.log('File has been successfully saved')
    

    await browser.close()

})()