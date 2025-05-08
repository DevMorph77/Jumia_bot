import { chromium } from "playwright";

(async()=>{
    const browser = await chromium.launch({headless:false})
    const page = await browser.newPage()


    await page.goto('https://www.sportybet.com/gh/sport/football')

    await page.waitForTimeout(3000)

    const matchtable = await page.evaluate(()=>{
        const matches = Array.from(document.querySelectorAll('div.m-table.match-table'))
        return matches.map(Iter=>{
            const homeTeams = Iter.querySelector('div.home-team')?.textContent.trim()||"";
            const awayTeams = Iter.querySelector('div.away-team')?.textContent.trim()||"";


            return`${homeTeams} vrs ${awayTeams}`

        })
    })
    console.log(matchtable)

    await browser.close()
})()