import { it } from "vitest";
import { MercadoLivreScrapClassInfo } from "../src/services/MercadoLivre/ReturnClassInformationsUseCase";


it("Should be able to return class information from the DOM",async()=>{
    const SUT =  new MercadoLivreScrapClassInfo()

    const res = await SUT.execute("Thinkpad");
    console.log(res)
},{
    timeout:15000
})