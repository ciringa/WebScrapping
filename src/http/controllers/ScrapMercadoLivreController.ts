import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MercadoLivreScrapClassInfo } from "../../services/MercadoLivre/ReturnClassInformationsUseCase";
import { PrismaProductRepository } from "../../repositorie/Prisma/PrismaProduct.Repository";
import { PrismaPriceRefRepository } from "../../repositorie/Prisma/PrismaPriceReference.Repository";
/**
 * Handles the scraping of Mercado Livre data based on the provided query.
 * It retrieves product information and DOM elements, returning them in the response.
 * 
 * @param req - The FastifyRequest object containing the query parameters.
 * @param res - The FastifyReply object used to send the response.
 * 
 * @returns Promise<void> - Sends a response with scraped data or an error.
 * 
 * @throws Error - If the scraping process fails, a 500 status error is returned.
 */
export async function ScrapMercadoLivreController(req:FastifyRequest, res:FastifyReply) {
    const {Query} = z.object({
        Query:z.string(),
    }).parse(req.params)
    
    const MService = new MercadoLivreScrapClassInfo(new PrismaProductRepository,true,new PrismaPriceRefRepository);

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