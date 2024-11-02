import { beforeEach, describe, expect, it } from "vitest";
import { MercadoLivreScrapClassInfo } from "../src/services/MercadoLivre/ReturnClassInformationsUseCase";
import { PriceReferenceRepository } from "../src/repositorie/PriceRefRepositorie";
import { ProductRepository } from "../src/repositorie/ProductsRepositorie";
import { MemoryPriceReferenceRepository } from "../src/repositorie/Memory/InMemoryPriceReference.Repository";
import { MemoryProductRepository } from "../src/repositorie/Memory/InMemoryProduct.Repository";

var priceRefRepository:PriceReferenceRepository
var prodRepository:ProductRepository
var SUT:MercadoLivreScrapClassInfo
describe("good use case",()=>{
    beforeEach(()=>{
        priceRefRepository = new MemoryPriceReferenceRepository()
        prodRepository = new MemoryProductRepository()
    })
    
    // it("Should be able to create a product list with information from the DOM",async()=>{
    //     SUT =  new MercadoLivreScrapClassInfo(prodRepository,priceRefRepository,true)
    //     const res = await SUT.execute("Thinkpad");
    //     if(res){
    //         expect(res.ProductList.length).toBeGreaterThan(0)
    //     }else{
    //         console.error("Got null")
    //     }
    // },{
    //     timeout:20000
    // })

    it("Should be able to create a priceReference list with the information from the DOM", async()=>{
        SUT =  new MercadoLivreScrapClassInfo(prodRepository,priceRefRepository,false)
        console.warn("to ger products")
        await SUT.execute("Thinkpad")
        console.warn("to get PriceReference")
        const secRes = await SUT.execute("Thinkpad");

        expect(secRes.PriceList.length).toBeGreaterThan(0)
    },{
        timeout:20000
    })
})
