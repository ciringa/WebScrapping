import { title } from "process";
import puppeteer, { Puppeteer } from "puppeteer";
import { pup_config } from "../../lib/pup/pupeteer";
import { PriceReference, Prisma, Product } from "@prisma/client";
import { prisma } from "../../lib/db/prisma";
import { sluggen } from "../../utils/sluggen";
import { randomUUID } from "crypto";

interface ClassReturn{
    Link:string,
    Title:string,
    Description:string,
    Image:string
    Price:number
}

interface MercadoLivreScrapClassInfoReturn{
    DOMCLassList:ClassReturn[],
    ProductList:Product[],
    PriceList:PriceReference[]
}

export class MercadoLivreScrapClassInfo{
    constructor(private Headless:boolean){}
    async execute(QueryParam:string):Promise<MercadoLivreScrapClassInfoReturn>{
        const browser = await puppeteer.launch({headless:this.Headless});
        const page = await browser.newPage()

        await page.goto(pup_config.MercadoLivre);

        await page.type("#cb1-edit",QueryParam);

        await Promise.all([
            page.waitForNavigation(),
            page.click(".nav-search-btn")
        ])
        
        const ps =  await page.evaluate(()=>{
            const DOMList = document.getElementsByClassName("ui-search-result") as HTMLCollectionOf<HTMLDivElement>
            var classContentList:ClassReturn[] = []
            for(let i=0;i<DOMList.length;i++){
                const AnchorElement = DOMList[i].querySelector(`.ui-search-link__title-card`) as HTMLAnchorElement;
                const SpanForTitle = DOMList[i].querySelector(`.ui-search-item__brand-discoverability`) as HTMLSpanElement 
                const ImageForLink = DOMList[i].querySelector(".ui-search-result-image__element") as HTMLImageElement
                const SpanForPrice = DOMList[i].querySelector(".andes-money-amount__fraction") as HTMLSpanElement
                if(AnchorElement&&SpanForTitle){
                    var prepItem:ClassReturn = {
                        Link:AnchorElement.href,
                        Description:AnchorElement.title,
                        Title:SpanForTitle.innerHTML,
                        Image:ImageForLink.src,
                        Price:Number(SpanForPrice.innerHTML)
                    }
                    classContentList.push(prepItem)
                }
            }
            return classContentList
        })
        ps.forEach(async Element=>{
            const findIfThereIsAnyThingWithThisSlug = await prisma.product.findUnique({
                where:{
                    Link:Element.Link
                }
            })
            console.log(findIfThereIsAnyThingWithThisSlug)
            if(findIfThereIsAnyThingWithThisSlug){
                await prisma.priceReference.create({
                    data:{
                        Prod_id:findIfThereIsAnyThingWithThisSlug.Id,
                        PriceRef:Element.Price,
                    }
                })
            }else{
                await prisma.product.create({
                    data:{
                        Description:Element.Description,
                        Image:Element.Image,
                        Link:Element.Link,
                        Name:Element.Title,
                        Slug:sluggen(Element.Title+Element.Price+Element.Description+randomUUID())
                    }
                })
            }
        })
        await browser.close()
        return {
            DOMCLassList:ps,
            ProductList:await prisma.product.findMany(),
            PriceList:await prisma.priceReference.findMany()
        }
    }
}