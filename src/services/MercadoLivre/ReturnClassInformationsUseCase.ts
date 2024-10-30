import { title } from "process";
import puppeteer, { Puppeteer } from "puppeteer";

interface ClassReturn{
    Link:string,
    Title:string,
    Description:string,
    Image:string
}

interface MercadoLivreScrapClassInfoReturn{
    DOMCLassList:ClassReturn[]
}

export class MercadoLivreScrapClassInfo{
    constructor(){}
    async execute(QueryParam:string):Promise<MercadoLivreScrapClassInfoReturn>{
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage()

        await page.goto("https://www.mercadolivre.com.br/");

        await page.type("#cb1-edit",QueryParam);

        await Promise.all([
            page.waitForNavigation(),
            page.click(".nav-search-btn")
        ])


        const ps =  await page.evaluate(()=>{
            const DOMList = document.getElementsByClassName("ui-search-result") as HTMLCollectionOf<HTMLDivElement>
            var classContentList:ClassReturn[] = []
            for(let i=0;i<DOMList.length;i++){
                let IeId = DOMList[i].id;
                const AnchorElement = DOMList[i].querySelector(`.ui-search-link__title-card`) as HTMLAnchorElement;
                const SpanForTitle = DOMList[i].querySelector(`.ui-search-item__brand-discoverability`) as HTMLSpanElement 
                const ImageForLink = DOMList[i].querySelector(".ui-search-result-image__element") as HTMLImageElement
                if(AnchorElement&&SpanForTitle){
                    var prepItem:ClassReturn = {
                        Link:AnchorElement.href,
                        Description:AnchorElement.title,
                        Title:SpanForTitle.innerHTML,
                        Image:ImageForLink.src
                    }
                    classContentList.push(prepItem)
                }
            }
            return classContentList
        })

        await browser.close()
        return {
            DOMCLassList:ps
        }
    }
}