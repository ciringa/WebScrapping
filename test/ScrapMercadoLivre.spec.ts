import { expect, it, vi } from "vitest";
import { ScrapMercadoLivreSearchLinksUseCase } from "../src/services/MercadoLivre/SearchMercadoLivreUseCase";


it("Should be able to search for things in mercado livre",async()=>{
    const SUT = new ScrapMercadoLivreSearchLinksUseCase(true);

    const resp = await SUT.execute("Mackbook")
    //console.log(resp)
    expect(resp.length).toBeGreaterThan(0);
},{
    timeout:20000
})