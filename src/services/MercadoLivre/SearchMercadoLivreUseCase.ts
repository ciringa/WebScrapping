import puppeteer from "puppeteer";
import {pup_config } from "../../lib/pup/pupeteer";

export class ScrapMercadoLivreSearchLinksUseCase{
    constructor(private Headless:boolean=true){}
    async execute(TermoDeBusca:string){
        //setup browser enviroment
        const browser = await puppeteer.launch({
            headless: this.Headless, //true=will hide everything
        });
  
        //open a new page
        const P = await browser.newPage();
  
        //redirectionando para o site
        await P.goto(pup_config.MercadoLivre);
  
        //preenchendo o input
        await P.type("#cb1-edit",TermoDeBusca);
        
        //clicando no botão de enviar o input
        await Promise.all([
            P.waitForNavigation(),
            P.click(".nav-icon-search")
        ])
  
        //recebendo todos os resultados dos links
        const result = await P.$$eval(".ui-search-item__title > a",el => el.map((link) => link.href))
        await browser.close()
        return result
    }
}