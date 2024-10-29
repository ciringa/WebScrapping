import puppeteer from "puppeteer"

export const pup_config = {
    link:"https://www.mercadolivre.com.br",
    SearchQuery:"macbook",
};

(async ()=>{
    //setup browser enviroment
    const browser = await puppeteer.launch({
        headless:false//true=will hide everything
    });
    //open a new page
    const page = await browser.newPage()

    console.log("setup")
    //navigate page to an url
    await page.goto(pup_config.link)
    console.log("goed to url")

    //close the browser
    await browser.close()

})();

