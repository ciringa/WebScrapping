import { title } from "process";
import puppeteer, { Puppeteer } from "puppeteer";
import { pup_config } from "../../lib/pup/pupeteer";
import { PriceReference, Prisma, Product } from "@prisma/client";
import { prisma } from "../../lib/db/prisma";
import { sluggen } from "../../utils/sluggen";
import { randomUUID } from "crypto";
import { ProductRepository } from "../../repositorie/ProductsRepositorie";
import { PriceReferenceRepository } from "../../repositorie/PriceRefRepositorie";

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
    constructor(private productRepository:ProductRepository,private prodRefrepository:PriceReferenceRepository,private Headless:boolean){}
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
            //Para cada item da lista de produtos gera um slug(código único que pode ser utilizado para localizar esse elemento)
            const slug = sluggen(Element.Title+Element.Price+Element.Description)
            
            //checa se ja existe algum elemento com o Link (futuramente o slug) especificado 
            const findIfThereIsAnyThingWithThisLink = await this.productRepository.findByLink(Element.Link)
            console.log(findIfThereIsAnyThingWithThisLink)
            
            if(findIfThereIsAnyThingWithThisLink){
                // Se ja existir algum produto com o link especificado ele irá criar uma referencia de preço para esse produto
                await this.prodRefrepository.create({Prod_id:findIfThereIsAnyThingWithThisLink.Id, PriceRef:Element.Price,})
            }else{
                // Se nao existir nenhum produto com o link especificado ele irá criar uma novo produto a partir das informações coletadas 
                await prisma.product.create({
                    data:{
                        Description:Element.Description,
                        Image:Element.Image,
                        Link:Element.Link,
                        Name:Element.Title,
                        Slug:slug
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