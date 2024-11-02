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
    Title:string | null,
    Description:string,
    Image:string
    Price:number
}

interface MercadoLivreScrapClassInfoReturn{
    DOMCLassList:ClassReturn[],
    ProductList:Product[]
}

export class MercadoLivreScrapClassInfo{
    constructor(private productRepository:ProductRepository,private Headless:boolean){}
    async execute(QueryParam:string):Promise<MercadoLivreScrapClassInfoReturn>{
        const browser = await puppeteer.launch({headless:this.Headless});
        const page = await browser.newPage()

        await page.goto(pup_config.MercadoLivre,{waitUntil: "networkidle2", timeout: 60000 });

        await page.type("#cb1-edit",QueryParam);

        await Promise.all([
            page.click(".nav-search-btn"),
            page.waitForNavigation({
                waitUntil:"networkidle2"
            })
        ])

        //Espera até que todos Um elemento especifico da pagina esteja carregado 
        const ps = await page.evaluate(()=>{
                //.ui-search-result
                const DOMList = Array.from(document.querySelectorAll(".ui-search-result__wrapper"));
                let classContentList = [];
            
                for (let i = 0; i < DOMList.length; i++) {
                    const AnchorElement = DOMList[i].querySelector(`.ui-search-link__title-card`) as HTMLAnchorElement;
                    const SpanForTitle = DOMList[i].querySelector(`.ui-search-item__brand-discoverability`) as HTMLSpanElement;
                    const ImageForLink = DOMList[i].querySelector(".ui-search-result-image__element") as HTMLImageElement; 
                    const SpanForPrice = DOMList[i].querySelector(".andes-money-amount__fraction") as HTMLSpanElement;
                    
                    if (AnchorElement && SpanForTitle && ImageForLink && SpanForPrice) {
                        classContentList.push({
                            Link: AnchorElement.href,
                            Description: AnchorElement.title.replace("*", ""),
                            Title: SpanForTitle.textContent,
                            Image: ImageForLink.src,
                            Price: Number(String(SpanForPrice.textContent).replace(/[^\d.-]/g, ""))
                        });
                    }else{
                        return null
                    }
                }
                return classContentList;
            }
        )

        // Fechar o navegador logo após o retorno
        await browser.close()
        if(ps){
            await Promise.all(ps.map(async Element=>{
                //Para cada item da lista de produtos gera um slug(código único que pode ser utilizado para localizar esse elemento)
                const slug = sluggen(String(Element.Title)+Element.Price+Element.Description)
               
                //checa se ja existe algum elemento com o slug especificado 
                const findIfThereIsAnyThingWithThisSlug = await this.productRepository.findBySlug(slug)
    
                if(!findIfThereIsAnyThingWithThisSlug){
                   await this.productRepository.create({
                       Description:Element.Description,
                       Image:Element.Image,
                       Link:Element.Link,
                       Name:String(Element.Title),
                       Slug:slug
                   })
                }
           }))
   
 
        }else{
            throw new Error("Ps is empty. Cant Arquire information from DOM")
        }

        const [ProductList] = await Promise.all([
            this.productRepository.findMany()
        ])

        return {
            DOMCLassList:ps,
            ProductList
        }
    }
}