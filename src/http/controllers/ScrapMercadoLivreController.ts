import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MercadoLivreScrapClassInfo } from "../../services/MercadoLivre/ReturnClassInformationsUseCase";

export async function ScrapMercadoLivreController(req:FastifyRequest, res:FastifyReply) {
    const {Page,Query} = z.object({
        Query:z.string(),
        Page:z.string() //Paginated content
    }).parse(req.params)
    const p = Number(Page)
    const MService = new MercadoLivreScrapClassInfo(true);

    try{
        const call  = await MService.execute(Query)
        res.status(200).send({
            ItemsList:call.DOMCLassList.slice((p-1)*20,p*20),
            TotalPages:call.DOMCLassList.length
        })
    }catch(err){
        if(err){
            res.status(500).send(err)
        }
    }
}