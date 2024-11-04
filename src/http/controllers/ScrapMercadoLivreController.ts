import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MercadoLivreScrapClassInfo } from "../../services/MercadoLivre/ReturnClassInformationsUseCase";
import { PrismaProductRepository } from "../../repositorie/Prisma/PrismaProduct.Repository";
import { PrismaPriceRefRepository } from "../../repositorie/Prisma/PrismaPriceReference.Repository";

export async function ScrapMercadoLivreController(req:FastifyRequest, res:FastifyReply) {
    const {Query} = z.object({
        Query:z.string(),
    }).parse(req.params)
    
    const MService = new MercadoLivreScrapClassInfo(new PrismaProductRepository,true);

    try{
        const call  = await MService.execute(Query)
        res.status(200).send({
            DOM:{
                ItemsList:call.DOMCLassList,
                TotalPages:call.DOMCLassList.length
            },
            DB:{
                Products:call.ProductList,
            }

        })
    }catch(err){
        if(err){
            res.status(500).send(err)
        }
    }
}