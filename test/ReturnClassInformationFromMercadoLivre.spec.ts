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
    
    it("Should be able to create a product list with information from the DOM",async()=>{
        SUT =  new MercadoLivreScrapClassInfo(prodRepository,false)
        const res = await SUT.execute("Thinkpad");
        expect(res.ProductList.length).toBeGreaterThan(0)
    },{
        timeout:20000
    })

})
