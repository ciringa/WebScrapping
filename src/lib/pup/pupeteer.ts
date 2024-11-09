import puppeteer, { Page } from "puppeteer";

export const pup_config = {
  MercadoLivre: "https://www.mercadolivre.com.br",
  SearchQuery: "macbook",
};

//https://youtu.be/SkvTMxP5WUQ?si=XjHSnM8TQQ_CwT7W

/* Standard routine:

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

advanced routine
  console.log("setup");
  //navigate page to an url
  await page.goto(pup_config.link);
  console.log("goed to url");

  //espera por um seletor no id especificado
  await page.waitForSelector("#cb1-edit");
  //vai digitar o texto que desejarmos no id especificado
  await page.type("#cb1-edit", pup_config.SearchQuery);

  await Promise.all([
    //espera que a pagina seja recarregada para um novo url
    page.waitForNavigation(),
    //clica em um botao especificado
    await page.click(".nav-icon-search"),
  ]);

  //seleciona todos os elementos com um seletor especificado (no exemplo abaixo busca o link de alguns )
  const linkList = await page.$$eval(".poly-component__title > a", (el) =>
    el.map((link) => link.href)
  );

  console.log(linkList);

  //close the browser
  //await browser.close()
*/
