import { title } from "process";
import puppeteer, { Puppeteer } from "puppeteer";
import { pup_config } from "../../lib/pup/pupeteer";
import { PriceReference, Prisma, Product } from "@prisma/client";
import { prisma } from "../../lib/db/prisma";
import { sluggen } from "../../utils/sluggen";
import { randomUUID } from "crypto";
import { ProductRepository } from "../../repositorie/ProductsRepositorie";
import { PriceReferenceRepository } from "../../repositorie/PriceRefRepositorie";
import { promise } from "zod";

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
                const AnchorElement= DOMList[i].querySelector(`.ui-search-link__title-card`) as HTMLAnchorElement;
                const SpanForTitle = DOMList[i].querySelector(`.ui-search-item__brand-discoverability`) as HTMLSpanElement 
                const ImageForLink = DOMList[i].querySelector(".ui-search-result-image__element") as HTMLImageElement
                const SpanForPrice = DOMList[i].querySelector(".andes-money-amount__fraction") as HTMLSpanElement
                if(AnchorElement&&SpanForTitle){
                    var prepItem:ClassReturn = {
                        Link:AnchorElement.href,
                        Description:AnchorElement.title,
                        Title:String(SpanForTitle.textContent),
                        Image:ImageForLink.src,
                        Price:Number(String(SpanForPrice.textContent))
                    }
                    classContentList.push(prepItem)
                }
            }
            return classContentList
        })
        // Fechar o navegador logo após o retorno
        await browser.close()

        ps.forEach(async Element=>{
            //Para cada item da lista de produtos gera um slug(código único que pode ser utilizado para localizar esse elemento)
            const slug = sluggen(Element.Title+Element.Price+Element.Description)
            
            //checa se ja existe algum elemento com o slug especificado 
            const findIfThereIsAnyThingWithThisSlug = await this.productRepository.findBySlug(slug)

            if(findIfThereIsAnyThingWithThisSlug){
                console.log(`priceReference with:${slug}`)
                // Se ja existir algum produto com o slug especificado ele irá criar uma referencia de preço para esse produto
                await this.prodRefrepository.create({Prod_id:findIfThereIsAnyThingWithThisSlug.Id, PriceRef:Element.Price,})
            }else{
                console.log(`Product with:${slug}`)
                // Se nao existir nenhum produto com o slug especificado ele irá criar uma novo produto a partir das informações coletadas 
                await this.productRepository.create({
                        Description:Element.Description,
                        Image:Element.Image,
                        Link:Element.Link,
                        Name:Element.Title,
                        Slug:slug
                    })
            }
        })
        const [ProductList,PriceList] = await Promise.all([
            this.productRepository.findMany(),
            this.prodRefrepository.findMany()
        ])
        return {
            DOMCLassList:ps,
            ProductList,
            PriceList
        }
    }
}